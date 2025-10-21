import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ServerList from '../components/servers/ServerList';
import ServerDetails from '../components/servers/ServerDetails';
import CreateServerModal from '../components/servers/CreateServerModal';
import { Loader2, Plus, Server } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const ServerManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch servers
  useEffect(() => {
    const fetchServers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/amp/instances`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch servers');
        }

        const data = await response.json();
        setServers(data.instances || []);
      } catch (error) {
        console.error('Error fetching servers:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os servidores',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchServers();
    }
  }, [isAuthenticated, refreshTrigger]);

  const handleServerSelect = (server) => {
    setSelectedServer(server);
  };

  const handleServerAction = async (action, serverId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/amp/instances/${serverId}/${action}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} server`);
      }

      toast({
        title: 'Sucesso',
        description: `Servidor ${action === 'start' ? 'iniciado' : action === 'stop' ? 'parado' : 'reiniciado'} com sucesso!`
      });

      // Refresh servers list
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(`Error ${action} server:`, error);
      toast({
        title: 'Erro',
        description: `Não foi possível ${action} o servidor`,
        variant: 'destructive'
      });
    }
  };

  const handleCreateServer = () => {
    setShowCreateModal(true);
  };

  const handleServerCreated = () => {
    setShowCreateModal(false);
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: 'Sucesso',
      description: 'Servidor criado com sucesso!'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Carregando servidores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Server className="h-8 w-8 text-purple-500" />
                Gerenciamento de Servidores
              </h1>
              <p className="text-gray-400 mt-2">
                Gerencie seus servidores de jogos
              </p>
            </div>
            <button
              onClick={handleCreateServer}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              Criar Servidor
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Server List */}
          <div className="lg:col-span-1">
            <ServerList
              servers={servers}
              selectedServer={selectedServer}
              onSelectServer={handleServerSelect}
              onRefresh={() => setRefreshTrigger(prev => prev + 1)}
            />
          </div>

          {/* Server Details */}
          <div className="lg:col-span-2">
            {selectedServer ? (
              <ServerDetails
                server={selectedServer}
                onAction={handleServerAction}
                onRefresh={() => setRefreshTrigger(prev => prev + 1)}
              />
            ) : (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
                <Server className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  Selecione um servidor para ver os detalhes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Server Modal */}
      {showCreateModal && (
        <CreateServerModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleServerCreated}
        />
      )}
    </div>
  );
};

export default ServerManagement;
