import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ServerList from '../components/servers/ServerList';
import ServerDetails from '../components/servers/ServerDetails';
import CreateServerModal from '../components/servers/CreateServerModal';
import { Loader2, Plus, Server, LayoutDashboard } from 'lucide-react';
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
        const token = localStorage.getItem('mystic_token');
        
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
        
        // Auto-select first server
        if (data.instances && data.instances.length > 0 && !selectedServer) {
          setSelectedServer(data.instances[0]);
        }
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
      const token = localStorage.getItem('mystic_token');
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
        title: 'Comando enviado',
        description: `Servidor ${action === 'start' ? 'iniciando' : action === 'stop' ? 'parando' : 'reiniciando'}...`
      });

      // Refresh servers list after 2 seconds
      setTimeout(() => setRefreshTrigger(prev => prev + 1), 2000);
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
      <div className="min-h-screen bg-[#1a1d24] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Carregando servidores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d24] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#13161c] border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <LayoutDashboard className="h-5 w-5 text-blue-400" />
            <h1 className="text-white font-semibold">AMP Manager</h1>
          </div>
          <button
            onClick={handleCreateServer}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            Criar Servidor
          </button>
        </div>

        {/* Server List */}
        <div className="flex-1 overflow-y-auto">
          <ServerList
            servers={servers}
            selectedServer={selectedServer}
            onSelectServer={handleServerSelect}
            onRefresh={() => setRefreshTrigger(prev => prev + 1)}
          />
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-gray-300 text-sm">{user?.name?.charAt(0)}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-[#13161c] border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {selectedServer ? selectedServer.FriendlyName || selectedServer.InstanceName : 'Nenhum servidor selecionado'}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {selectedServer ? `${selectedServer.Module} • ${selectedServer.InstanceID}` : 'Selecione um servidor na lista'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded text-xs font-medium ${
                selectedServer?.Running 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-gray-700/50 text-gray-400 border border-gray-600'
              }`}>
                {selectedServer?.Running ? 'ONLINE' : 'OFFLINE'}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedServer ? (
            <ServerDetails
              server={selectedServer}
              onAction={handleServerAction}
              onRefresh={() => setRefreshTrigger(prev => prev + 1)}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Server className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">Nenhum servidor selecionado</p>
                <p className="text-gray-500 text-sm">Selecione um servidor na barra lateral</p>
              </div>
            </div>
          )}
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
