import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';
import LoadingSpinner from '../LoadingSpinner';
import { Mail, CheckCircle, XCircle } from 'lucide-react';
import { apiService } from '../../services/api';

const VerifyEmail = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [verificationState, setVerificationState] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmailToken();
    } else {
      setVerificationState('error');
      setMessage('Token de verificação não encontrado na URL');
    }
  }, [token]);

  const verifyEmailToken = async () => {
    try {
      setVerificationState('loading');
      const response = await apiService.verifyEmail(token);
      
      setVerificationState('success');
      setMessage(response.message || 'Email verificado com sucesso!');
      
      toast({
        title: "Email verificado!",
        description: "Sua conta foi verificada com sucesso.",
      });
    } catch (error) {
      setVerificationState('error');
      setMessage(error.response?.data?.detail || 'Token inválido ou expirado');
      
      toast({
        title: "Erro na verificação",
        description: "Não foi possível verificar seu email.",
        variant: "destructive"
      });
    }
  };

  const handleResendVerification = async () => {
    // This would need user email - for now just show a message
    toast({
      title: "Reenviar verificação",
      description: "Funcionalidade disponível na área do usuário após login.",
    });
  };

  const renderContent = () => {
    switch (verificationState) {
      case 'loading':
        return (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                Verificando Email
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Aguarde enquanto verificamos seu email...
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 text-center">
              <LoadingSpinner size="large" />
              <p className="text-gray-600 dark:text-gray-400">
                Processando verificação...
              </p>
            </CardContent>
          </>
        );

      case 'success':
        return (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                Email Verificado!
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Sua conta foi ativada com sucesso
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              
              <p className="text-gray-600 dark:text-gray-400">
                {message}
              </p>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Agora você pode fazer login e acessar todos os recursos da plataforma.
              </p>

              <Link to="/login">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  Fazer Login
                </Button>
              </Link>
            </CardContent>
          </>
        );

      case 'error':
        return (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                Erro na Verificação
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Não foi possível verificar seu email
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              
              <p className="text-gray-600 dark:text-gray-400">
                {message}
              </p>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                O link pode ter expirado ou já ter sido usado. Você pode solicitar um novo email de verificação.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={handleResendVerification}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Reenviar Verificação
                </Button>
                
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    Fazer Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 px-4">
      {/* Mystical background elements */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-600/5 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_mystic-host/artifacts/dapkmkez_ChatGPT%20Image%203%20de%20set.%20de%202025%2C%2008_32_26.png" 
              alt="Mystic Host" 
              className="w-12 h-12"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Mystic Host
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Verificação de email
          </p>
        </div>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          {renderContent()}
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;