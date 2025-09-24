import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Server, 
  Users, 
  Activity, 
  Clock, 
  Plus, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Mail,
  Shield
} from 'lucide-react';

const DashboardOverview = ({ user }) => {
  const [stats, setStats] = useState({
    servers: 3,
    totalPlayers: 45,
    uptime: 99.8,
    activeHours: 127
  });

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'server_start',
      message: 'Servidor Minecraft iniciado',
      time: '2 minutos atrás',
      status: 'success'
    },
    {
      id: 2,
      type: 'player_join',
      message: '5 jogadores conectaram',
      time: '15 minutos atrás',
      status: 'info'
    },
    {
      id: 3,
      type: 'backup',
      message: 'Backup automático realizado',
      time: '1 hora atrás',
      status: 'success'
    }
  ]);

  const quickStats = [
    {
      name: 'Servidores Ativos',
      value: stats.servers,
      icon: Server,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      name: 'Jogadores Online',
      value: stats.totalPlayers,
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      name: 'Uptime Médio',
      value: `${stats.uptime}%`,
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      name: 'Horas Ativas',
      value: stats.activeHours,
      icon: Clock,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Bem-vindo de volta, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Aqui está o resumo dos seus servidores e atividades
            </p>
          </div>
          <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Servidor
          </Button>
        </div>

        {/* Verification Alert */}
        {!user?.is_verified && (
          <Card className="mt-6 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Sua conta não está verificada
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Verifique seu email para acessar todos os recursos.
                  </p>
                </div>
                <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                  <Mail className="w-4 h-4 mr-2" />
                  Verificar Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                    activity.status === 'info' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    'bg-yellow-100 dark:bg-yellow-900/30'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-4">
                <Link to="/dashboard/activity">
                  <Button variant="outline" size="sm">
                    Ver Todas as Atividades
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Server Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="w-5 h-5 mr-2" />
                Status dos Servidores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Minecraft Java</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">CS2 Server</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Rust Server</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    Manutenção
                  </Badge>
                </div>
              </div>
              
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <Link to="/dashboard/servers">
                  <Button variant="outline" size="sm" className="w-full">
                    Gerenciar Servidores
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Status da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                {user?.is_verified ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verificado
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Pendente
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Plano</span>
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                  Gratuito
                </Badge>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link to="/dashboard/settings">
                  <Button variant="outline" size="sm" className="w-full">
                    Configurações
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;