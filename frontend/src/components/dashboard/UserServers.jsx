import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Server, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Users, 
  Activity,
  MoreHorizontal
} from 'lucide-react';

const UserServers = ({ user }) => {
  const [servers] = useState([
    {
      id: 1,
      name: 'Minecraft Creative',
      game: 'Minecraft Java',
      status: 'online',
      players: '12/100',
      uptime: '99.8%',
      ram: '4GB',
      storage: '20GB',
      created: '2024-01-15'
    },
    {
      id: 2,
      name: 'CS2 Competitive',
      game: 'Counter-Strike 2',
      status: 'online',
      players: '8/32',
      uptime: '98.5%',
      ram: '8GB',
      storage: '50GB',
      created: '2024-02-03'
    },
    {
      id: 3,
      name: 'Rust Survival',
      game: 'Rust',
      status: 'maintenance',
      players: '0/200',
      uptime: '95.2%',
      ram: '16GB',
      storage: '100GB',
      created: '2024-02-20'
    }
  ]);

  const getStatusBadge = (status) => {
    const variants = {
      online: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      offline: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    };
    
    return (
      <Badge className={variants[status]}>
        {status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Manutenção'}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Meus Servidores
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie e monitore todos os seus servidores de jogos
          </p>
        </div>
        <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Servidor
        </Button>
      </div>

      {/* Server Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{servers.length}</p>
              </div>
              <Server className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Online</p>
                <p className="text-2xl font-bold text-green-600">{servers.filter(s => s.status === 'online').length}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Jogadores</p>
                <p className="text-2xl font-bold text-blue-600">20</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Servers List */}
      <div className="grid grid-cols-1 gap-6">
        {servers.map((server) => (
          <Card key={server.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {server.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {server.game}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(server.status)}
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {server.players}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Uptime: {server.uptime}
                  </div>
                  
                  <div className="flex space-x-2">
                    {server.status === 'online' ? (
                      <Button size="sm" variant="outline">
                        <Pause className="w-4 h-4 mr-1" />
                        Parar
                      </Button>
                    ) : (
                      <Button size="sm">
                        <Play className="w-4 h-4 mr-1" />
                        Iniciar
                      </Button>
                    )}
                    
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4 mr-1" />
                      Configurar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Server Details */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">RAM:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{server.ram}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Storage:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{server.storage}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Criado:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {new Date(server.created).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (if no servers) */}
      {servers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum servidor encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Crie seu primeiro servidor para começar a hospedar seus jogos
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Servidor
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserServers;