import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import LoadingSpinner from '../LoadingSpinner';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import MysticBackground from '../MysticBackground';
import ThemeToggle from '../ThemeToggle';

const Login = () => {
  const navigate = useNavigate();
  const { login, socialLogin, isLoading } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(formData);

      if (result.success) {
        toast({
          title: "Login realizado!",
          description: "Bem-vindo ao Mystic Host!",
        });
        navigate('/');
      } else {
        toast({
          title: "Erro no login",
          description: result.error || "Credenciais inválidas.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Erro interno do servidor.",
        variant: "destructive"
      });
    }

    setIsSubmitting(false);
  };

  const handleSocialLogin = async (provider) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: `Login com ${provider} será implementado em breve.`,
      variant: "default"
    });
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsSubmitting(true);
        console.log("Google response:", tokenResponse);
        toast({
          title: "Google Login",
          description: "Integração iniciada (Token recebido)",
        });
      } catch (error) {
        console.error('Google login error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    onError: () => {
      toast({
        title: "Erro no login",
        description: "Falha ao conectar com Google.",
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-[#050505] transition-colors duration-500">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Background - Adapts to Theme */}
      <div className="absolute inset-0 transition-opacity duration-1000">
        {/* Dark Mode Background Elements */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5980?q=80&w=3269&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black/60 to-black/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        </div>

        {/* Light Mode Background Elements */}
        <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-white to-indigo-100"></div>
          <div className="absolute inset-0 bg-[radial-gradient(at_top_right,_var(--tw-gradient-stops))] from-purple-200/40 via-transparent to-transparent"></div>
        </div>
      </div>

      <MysticBackground className="z-0 opacity-30 dark:opacity-50" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[400px] px-4 animate-in fade-in zoom-in duration-500">

        {/* Glass Card */}
        <div className="backdrop-blur-2xl bg-white/70 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl dark:shadow-2xl relative overflow-hidden ring-1 ring-black/5 dark:ring-white/5 transition-colors duration-300">
          {/* Top Glow */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/20 dark:bg-purple-500/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-500/20 dark:bg-indigo-500/30 rounded-full blur-3xl pointer-events-none"></div>

          {/* Logo Area */}
          <div className="flex flex-col items-center mb-8 relative">
            <div className="w-24 h-24 mb-4 relative group cursor-pointer">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <img
                src="/logo-dark-mode.png"
                alt="Mystic Host"
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] transform group-hover:scale-105 transition-transform duration-500 hidden dark:block"
              />
              <img
                src="/logo-light-mode.png"
                alt="Mystic Host"
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] transform group-hover:scale-105 transition-transform duration-500 block dark:hidden"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:via-purple-100 dark:to-gray-300 dark:bg-clip-text tracking-tight transition-colors duration-300">
              Login
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative flex items-center bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus-within:border-purple-500/50 focus-within:bg-white/80 dark:focus-within:bg-black/40 transition-all duration-300 group-hover:border-purple-400/30 dark:group-hover:border-white/20">
                  <Mail className="w-5 h-5 text-gray-400 dark:text-gray-400 ml-4" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:ring-0 px-4 py-3.5 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative flex items-center bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus-within:border-purple-500/50 focus-within:bg-white/80 dark:focus-within:bg-black/40 transition-all duration-300 group-hover:border-purple-400/30 dark:group-hover:border-white/20">
                  <Lock className="w-5 h-5 text-gray-400 dark:text-gray-400 ml-4" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:ring-0 px-4 py-3.5 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-6 rounded-xl shadow-[0_4px_20px_rgba(124,58,237,0.25)] hover:shadow-[0_4px_25px_rgba(124,58,237,0.4)] border border-transparent dark:border-white/10 transition-all duration-300 transform hover:-translate-y-0.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-8 mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#fcfcfc]/80 dark:bg-[#0f0f13]/50 backdrop-blur px-3 text-gray-500 font-medium rounded-full">
                Ou continue com
              </span>
            </div>
          </div>

          {/* Social Login Buttons - Round & Icon Only */}
          <div className="flex gap-4 justify-center">
            {/* Google Button */}
            <button
              onClick={() => loginWithGoogle()}
              className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/10 hover:border-purple-200 dark:hover:border-white/20 hover:scale-110 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300 group"
              title="Entrar com Google"
            >
              {/* Google Icon... (can reuse checking if svg is same) */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </button>

            {/* Facebook Button */}
            <button
              onClick={() => handleSocialLogin('Facebook')}
              className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/10 hover:border-blue-200 dark:hover:border-white/20 hover:scale-110 hover:shadow-[0_0_15px_rgba(24,119,242,0.2)] dark:hover:shadow-[0_0_15px_rgba(24,119,242,0.4)] transition-all duration-300 group"
              title="Entrar com Facebook"
            >
              <svg className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 dark:text-gray-500">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-600 mt-8 font-medium tracking-wide">
          © 2026 MYSTIC HOST INC.
        </p>
      </div>
    </div>
  );
};

export default Login;