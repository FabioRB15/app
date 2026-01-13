import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors overflow-hidden">
      {/* Mystical Background Elements */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-600/5 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100/80 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-8 transition-colors backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50">
            <Sparkles className="w-4 h-4 mr-2" />
            Hospedagem de jogos reimaginada
          </div>

          {/* Mystic Symbol - Enhanced */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
            <div className="relative">
              <img
                src="/logo-dark-mode.png"
                alt="Mystic Host Symbol"
                className="w-36 h-36 sm:w-44 sm:h-44 mx-auto opacity-95 hover:opacity-100 transition-all duration-500 hover:scale-105 drop-shadow-2xl hidden dark:block"
              />
              <img
                src="/logo-light-mode.png"
                alt="Mystic Host Symbol"
                className="w-36 h-36 sm:w-44 sm:h-44 mx-auto opacity-95 hover:opacity-100 transition-all duration-500 hover:scale-105 drop-shadow-2xl block dark:hidden"
              />
              {/* Subtle glow effect */}
              <div className="absolute inset-0 w-36 h-36 sm:w-44 sm:h-44 mx-auto bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-full blur-xl -z-10"></div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
            Desperte o poder
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              místico dos seus jogos
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed transition-colors">
            Hospedagem premium para gamers que buscam performance excepcional,
            estabilidade mística e uma experiência que transcende o comum.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all px-8 py-3 text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105">
              Começar Aventura
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-8 py-3 text-lg transition-all hover:scale-105 backdrop-blur-sm">
              Ver Demo
            </Button>
          </div>

          {/* Features Grid - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-100/50 dark:border-gray-700/50 hover:shadow-xl transition-all hover:scale-105 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                Performance Mística
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors">
                Servidores otimizados com tecnologia de ponta para zero lag
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-100/50 dark:border-gray-700/50 hover:shadow-xl transition-all hover:scale-105 group">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                Proteção Arcana
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors">
                DDoS protection e backups automáticos para total tranquilidade
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-100/50 dark:border-gray-700/50 hover:shadow-xl transition-all hover:scale-105 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                Suporte Encantado
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors">
                Equipe especializada disponível 24/7 para auxiliar sua jornada
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;