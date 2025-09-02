import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { mockDashboardStats, mockGameServers } from '../data/mock';
import { TrendingUp, TrendingDown, Play, Settings, Users, HardDrive } from 'lucide-react';

const DashboardPreview = () => {
  return (
    <section id="dashboard" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Controle Total em Suas
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> Mãos</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dashboard intuitivo com métricas em tempo real, gerenciamento simplificado e insights poderosos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mockDashboardStats.map((stat, index) => (
            <Card key={index} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Server Management Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Server List */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Seus Servidores
              </CardTitle>
              <CardDescription>
                Gerencie todos os seus jogos em um só lugar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockGameServers.map((server) => (
                <div key={server.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={server.image} 
                      alt={server.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{server.name}</h4>
                      <p className="text-sm text-gray-600">{server.players} jogadores</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={server.status === 'online' ? 'default' : 'secondary'}
                      className={server.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                    >
                      {server.status === 'online' ? 'Online' : 'Manutenção'}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Ações Rápidas
              </CardTitle>
              <CardDescription>
                Ferramentas essenciais ao seu alcance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Play className="w-4 h-4 mr-3" />
                Criar Novo Servidor
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Jogadores
                </Button>
                <Button variant="outline" className="justify-start">
                  <HardDrive className="w-4 h-4 mr-2" />
                  Backups
                </Button>
              </div>

              {/* Resource Usage */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-900">Uso de Recursos</h5>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">CPU</span>
                    <span className="font-medium">34%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full" style={{width: '34%'}}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">RAM</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '67%'}}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Storage</span>
                    <span className="font-medium">23%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{width: '23%'}}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;