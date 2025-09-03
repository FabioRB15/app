import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-8 transition-colors">
            <Sparkles className="w-4 h-4 mr-2" />
            Hospedagem de jogos reimaginada
          </div>

          {/* Mystic Symbol */}
          <div className="mb-8">
            <img 
              src="https://customer-assets.emergentagent.com/job_mystic-host/artifacts/1tafml4e_6aa10459-5c1f-4ad3-9a31-5979d430bbc7.png" 
              alt="Mystic Host Symbol" 
              className="w-32 h-32 sm:w-40 sm:h-40 mx-auto opacity-90 hover:opacity-100 transition-opacity"
            />
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
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all px-8 py-3 text-lg">
              Começar Aventura
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-8 py-3 text-lg transition-colors">
              Ver Demo
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                Performance Mística
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors">
                Servidores otimizados com tecnologia de ponta para zero lag
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                Proteção Arcana
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors">
                DDoS protection e backups automáticos para total tranquilidade
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
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