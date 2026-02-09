import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Loader2,
    ArrowRight,
    Zap,
    AlertCircle
} from "lucide-react";
import { cn } from "../lib/utils";
import { signIn, signUp, supabase } from "../lib/supabase";



interface LoginProps {
    onLogin?: (user: { email: string; name: string; id: string }) => void;
}

export function Login({ onLogin }: LoginProps) {
    const [activeTab, setActiveTab] = React.useState<'login' | 'register'>('login');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const [authError, setAuthError] = React.useState<string | null>(null);

    // Form states
    const [loginForm, setLoginForm] = React.useState({ email: '', password: '' });
    const [registerForm, setRegisterForm] = React.useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    // Listen for auth state changes (for OAuth redirect)
    React.useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const user = session.user;
                if (onLogin) {
                    onLogin({
                        id: user.id,
                        email: user.email || '',
                        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário'
                    });
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [onLogin]);

    // Validate email
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Handle login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setAuthError(null);

        if (!loginForm.email) {
            setErrors({ email: 'Email é obrigatório' });
            return;
        }
        if (!isValidEmail(loginForm.email)) {
            setErrors({ email: 'Email inválido' });
            return;
        }
        if (!loginForm.password) {
            setErrors({ password: 'Senha é obrigatória' });
            return;
        }

        setIsLoading(true);

        const { data, error } = await signIn(loginForm.email, loginForm.password);

        if (error) {
            setAuthError(error.message === 'Invalid login credentials'
                ? 'Email ou senha incorretos'
                : error.message);
            setIsLoading(false);
            return;
        }

        if (data.user && onLogin) {
            onLogin({
                id: data.user.id,
                email: data.user.email || '',
                name: data.user.user_metadata?.name || 'Usuário'
            });
        }

        setIsLoading(false);
    };

    // Handle register
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setAuthError(null);

        const newErrors: Record<string, string> = {};

        if (!registerForm.name) newErrors.name = 'Nome é obrigatório';
        if (!registerForm.email) newErrors.email = 'Email é obrigatório';
        else if (!isValidEmail(registerForm.email)) newErrors.email = 'Email inválido';
        if (!registerForm.password) newErrors.password = 'Senha é obrigatória';
        else if (registerForm.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
        if (registerForm.password !== registerForm.confirmPassword) {
            newErrors.confirmPassword = 'Senhas não conferem';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        const { data, error } = await signUp(registerForm.email, registerForm.password, registerForm.name);

        if (error) {
            if (error.message.includes('already registered')) {
                setAuthError('Este email já está cadastrado');
            } else {
                setAuthError(error.message);
            }
            setIsLoading(false);
            return;
        }

        // Check if session was created (Auto-login)
        if (data.session && data.user) {
            if (onLogin) {
                onLogin({
                    id: data.user.id,
                    email: data.user.email || '',
                    name: registerForm.name
                });
            }
        } else {
            // No session -> Email verification required
            setAuthError(null);
            // Reset form or switch to login logic could go here
            // But we will show a success message instead of error
            alert("Conta criada com sucesso! Se necessário, verifique seu email para ativar a conta antes de fazer login.");
            setActiveTab('login');
        }

        setIsLoading(false);
    };



    return (
        <div className="min-h-screen bg-cyber-black flex flex-col items-center justify-start p-4 pt-8 relative overflow-y-auto">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-neon-yellow/10 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />
                <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-gradient-radial from-purple-500/5 via-transparent to-transparent" />
            </div>

            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-center relative z-10"
            >
                <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-neon-yellow to-yellow-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(230,255,43,0.4)]">
                        <Zap size={22} className="text-deep-petrol" fill="currentColor" />
                    </div>
                    <h1 className="text-2xl font-display font-black text-white tracking-tight">
                        CYBER<span className="text-neon-yellow">RUN</span>
                    </h1>
                </div>
                <p className="text-tech-grey text-xs">Conquiste territórios. Domine sua cidade.</p>
            </motion.div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-md bg-surface-dark/80 backdrop-blur-xl rounded-3xl border border-border-grey shadow-2xl overflow-hidden relative z-10"
            >
                {/* Tab Switcher */}
                <div className="flex p-1.5 bg-black/30">
                    <button
                        onClick={() => setActiveTab('login')}
                        className={cn(
                            "flex-1 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all",
                            activeTab === 'login'
                                ? "bg-neon-yellow text-deep-petrol shadow-lg"
                                : "text-tech-grey hover:text-white"
                        )}
                    >
                        Entrar
                    </button>
                    <button
                        onClick={() => setActiveTab('register')}
                        className={cn(
                            "flex-1 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all",
                            activeTab === 'register'
                                ? "bg-neon-yellow text-deep-petrol shadow-lg"
                                : "text-tech-grey hover:text-white"
                        )}
                    >
                        Criar Conta
                    </button>
                </div>

                {/* Auth Error Alert */}
                {authError && (
                    <div className="mx-4 mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2">
                        <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                        <p className="text-red-400 text-xs">{authError}</p>
                    </div>
                )}

                {/* Forms */}
                <div className="p-4">
                    <AnimatePresence mode="wait">
                        {activeTab === 'login' ? (
                            <motion.form
                                key="login-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleLogin}
                                className="space-y-3"
                            >
                                {/* Email */}
                                <div>
                                    <label className="block text-tech-grey text-[10px] font-bold uppercase tracking-wider mb-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tech-grey" />
                                        <input
                                            type="email"
                                            value={loginForm.email}
                                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                            placeholder="seu@email.com"
                                            className={cn(
                                                "w-full bg-black/50 border rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-tech-grey/50 focus:outline-none focus:border-neon-yellow transition-colors",
                                                errors.email ? "border-red-500" : "border-border-grey"
                                            )}
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-400 text-[10px] mt-0.5">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-tech-grey text-[10px] font-bold uppercase tracking-wider mb-1">
                                        Senha
                                    </label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tech-grey" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={loginForm.password}
                                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                            placeholder="••••••••"
                                            className={cn(
                                                "w-full bg-black/50 border rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-tech-grey/50 focus:outline-none focus:border-neon-yellow transition-colors",
                                                errors.password ? "border-red-500" : "border-border-grey"
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-tech-grey hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-400 text-[10px] mt-0.5">{errors.password}</p>}
                                </div>

                                {/* Forgot password */}
                                <div className="text-right">
                                    <button type="button" className="text-neon-yellow text-[10px] font-bold hover:underline">
                                        Esqueceu a senha?
                                    </button>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-neon-yellow to-yellow-400 text-deep-petrol font-display font-black text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(230,255,43,0.3)] hover:shadow-[0_0_25px_rgba(230,255,43,0.5)] transition-all disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            ENTRAR
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="register-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleRegister}
                                className="space-y-2.5"
                            >
                                {/* Name */}
                                <div>
                                    <label className="block text-tech-grey text-[10px] font-bold uppercase tracking-wider mb-1">
                                        Nome
                                    </label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tech-grey" />
                                        <input
                                            type="text"
                                            value={registerForm.name}
                                            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                                            placeholder="Seu nome"
                                            className={cn(
                                                "w-full bg-black/50 border rounded-lg pl-10 pr-3 py-2 text-sm text-white placeholder:text-tech-grey/50 focus:outline-none focus:border-neon-yellow transition-colors",
                                                errors.name ? "border-red-500" : "border-border-grey"
                                            )}
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-400 text-[10px] mt-0.5">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-tech-grey text-[10px] font-bold uppercase tracking-wider mb-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tech-grey" />
                                        <input
                                            type="email"
                                            value={registerForm.email}
                                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                                            placeholder="seu@email.com"
                                            className={cn(
                                                "w-full bg-black/50 border rounded-lg pl-10 pr-3 py-2 text-sm text-white placeholder:text-tech-grey/50 focus:outline-none focus:border-neon-yellow transition-colors",
                                                errors.email ? "border-red-500" : "border-border-grey"
                                            )}
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-400 text-[10px] mt-0.5">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-tech-grey text-[10px] font-bold uppercase tracking-wider mb-1">
                                        Senha
                                    </label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tech-grey" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={registerForm.password}
                                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                                            placeholder="Mínimo 6 caracteres"
                                            className={cn(
                                                "w-full bg-black/50 border rounded-lg pl-10 pr-10 py-2 text-sm text-white placeholder:text-tech-grey/50 focus:outline-none focus:border-neon-yellow transition-colors",
                                                errors.password ? "border-red-500" : "border-border-grey"
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-tech-grey hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-400 text-[10px] mt-0.5">{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-tech-grey text-[10px] font-bold uppercase tracking-wider mb-1">
                                        Confirmar Senha
                                    </label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tech-grey" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={registerForm.confirmPassword}
                                            onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                                            placeholder="Repita a senha"
                                            className={cn(
                                                "w-full bg-black/50 border rounded-lg pl-10 pr-10 py-2 text-sm text-white placeholder:text-tech-grey/50 focus:outline-none focus:border-neon-yellow transition-colors",
                                                errors.confirmPassword ? "border-red-500" : "border-border-grey"
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-tech-grey hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-400 text-[10px] mt-0.5">{errors.confirmPassword}</p>}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-neon-yellow to-yellow-400 text-deep-petrol font-display font-black text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(230,255,43,0.3)] hover:shadow-[0_0_25px_rgba(230,255,43,0.5)] transition-all disabled:opacity-70 mt-3"
                                >
                                    {isLoading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            CRIAR CONTA
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>


                </div>
            </motion.div>

            {/* Footer */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-tech-grey text-xs text-center relative z-10"
            >
                Ao continuar, você concorda com nossos{' '}
                <button className="text-neon-yellow hover:underline">Termos de Uso</button>
                {' '}e{' '}
                <button className="text-neon-yellow hover:underline">Política de Privacidade</button>
            </motion.p>
        </div>
    );
}

export default Login;
