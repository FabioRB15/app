import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { apiService } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { Check, Star } from 'lucide-react';

const Pricing = () => {
  const [pricingPlans, setPricingPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPricingPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const plans = await apiService.getPricingPlans();
      setPricingPlans(plans);
    } catch (err) {
      console.error('Error fetching pricing plans:', err);
      setError('Não foi possível carregar os planos de preços. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  if (isLoading) {
    return (
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
              Planos que se Adaptam à
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> Sua Magia</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              Escolha o plano perfeito para sua comunidade e desbloqueie todo o potencial dos seus jogos
            </p>
          </div>
          <LoadingSpinner size="large" className="py-20" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
              Planos que se Adaptam à
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> Sua Magia</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              Escolha o plano perfeito para sua comunidade e desbloqueie todo o potencial dos seus jogos
            </p>
          </div>
          <ErrorMessage message={error} onRetry={fetchPricingPlans} />
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            Planos que se Adaptam à
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> Sua Magia</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
            Escolha o plano perfeito para sua comunidade e desbloqueie todo o potencial dos seus jogos
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative bg-white dark:bg-gray-800 border-2 transition-all hover:shadow-lg ${
                plan.popular 
                  ? 'border-purple-200 dark:border-purple-700 shadow-md' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 mb-4 transition-colors">
                  {plan.description}
                </CardDescription>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white transition-colors">{plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400 text-lg transition-colors">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700 dark:text-gray-300 transition-colors">
                      <Check className="w-5 h-5 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  className={`w-full py-3 text-lg font-medium transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 text-white'
                  }`}
                >
                  {plan.popular ? 'Começar Agora' : 'Selecionar Plano'}
                </Button>

                {/* Money back guarantee */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 transition-colors">
                  Garantia de 7 dias ou seu dinheiro de volta
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors">
            Todos os planos incluem migração gratuita e configuração personalizada
          </p>
          <Button variant="ghost" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
            Precisa de mais recursos? Fale conosco
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;