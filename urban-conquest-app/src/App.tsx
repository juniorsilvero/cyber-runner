import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Feed } from './pages/Feed';
import { MapConquest } from './pages/MapConquest';
import { Rank } from './pages/Rank';

function App() {
  const [activeTab, setActiveTab] = useState('hub');

  // Placeholder views for now
  // Placeholder views for now

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
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
