import { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Feed } from './pages/Feed';
import { MapConquest } from './pages/MapConquest';
import { Rank } from './pages/Rank';
import { Login } from './pages/Login';
import { supabase, signOut, getProfile } from './lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('hub');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    let isMounted = true;

    // Helper to set user from session
    const setUserFromSession = async (session: any) => {
      if (!session?.user || !isMounted) return;

      try {
        const { data: profile } = await getProfile(session.user.id);

        if (isMounted) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.display_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário'
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        // Still set basic user even if profile fetch fails
        if (isMounted) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário'
          });
          setIsAuthenticated(true);
        }
      }
    };

    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session check error:', error);
        } else if (session) {
          await setUserFromSession(session);
        }
      } catch (error) {
        console.error('Session check exception:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isMounted) setIsLoading(false);
    }, 5000);

    checkSession().finally(() => {
      clearTimeout(timeoutId);
    });

    // Listen for auth changes (including token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        if (session) {
          await setUserFromSession(session);
        }
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
          setActiveTab('hub');
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Handle login from Login component
  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setIsAuthenticated(false);
    setActiveTab('hub');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-neon-yellow border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Handle tab change with refresh on same tab
  const handleTabChange = (tab: string) => {
    if (tab === activeTab && tab === 'feed') {
      // Force refresh by remounting Feed component
      setActiveTab('');
      setTimeout(() => setActiveTab('feed'), 10);
    } else {
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'hub':
        return <Dashboard />;
      case 'feed':
        return <Feed />;
      case 'map':
        return <MapConquest />;
      case 'rank':
        return <Rank />;
      case 'profile':
        return <Settings onLogout={handleLogout} user={user} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
    </Layout>
  );
}

export default App;
