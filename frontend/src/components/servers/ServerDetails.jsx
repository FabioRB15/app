import React, { useState, useEffect } from 'react';
import { Play, Square, RotateCw, Terminal, Activity, Settings, FileText } from 'lucide-react';
import ServerConsole from './ServerConsole';

const ServerDetails = ({ server, onAction, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('status');
  const [serverStatus, setServerStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, [server]);

  const fetchServerStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('mystic_token');
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/amp/instances/${server.InstanceID}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setServerStatus(data.data);
      }
    } catch (error) {
      console.error('Error fetching server status:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'status', label: 'Status', icon: Activity },
    { id: 'console', label: 'Console', icon: Terminal },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'logs', label: 'Logs', icon: FileText },
  ];

  return (
    <div className="h-full flex flex-col bg-[#13161c]">
      {/* Action Bar */}
      <div className="bg-[#0d0f13] border-b border-gray-800 p-3 flex items-center gap-2">
        <button
          onClick={() => onAction('start', server.InstanceID)}
          disabled={server.Running}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
        >
          <Play className="h-3.5 w-3.5" />
          Iniciar
        </button>
        <button
          onClick={() => onAction('stop', server.InstanceID)}
          disabled={!server.Running}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
        >
          <Square className="h-3.5 w-3.5" />
          Parar
        </button>
        <button
          onClick={() => onAction('restart', server.InstanceID)}
          disabled={!server.Running}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Reiniciar
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-[#0d0f13] border-b border-gray-800">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400 bg-gray-900/50'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-900/30'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'status' && (
          <div className="space-y-4">
            {/* Metrics Table */}
            <div className="bg-[#1a1d24] border border-gray-800 rounded">
              <div className="border-b border-gray-800 p-3">
                <h3 className="text-sm font-medium text-gray-300">Métricas do Sistema</h3>
              </div>
              <div className="divide-y divide-gray-800">
                <div className="p-3 flex justify-between items-center">
                  <span className="text-sm text-gray-400">CPU</span>
                  <span className="text-sm text-white font-mono">
                    {serverStatus?.Metrics?.['CPU Usage']?.Percent || 0}%
                  </span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-sm text-gray-400">Memória</span>
                  <span className="text-sm text-white font-mono">
                    {serverStatus?.Metrics?.['Memory Usage']?.Percent || 0}%
                  </span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-sm text-gray-400">Usuários Ativos</span>
                  <span className="text-sm text-white font-mono">
                    {serverStatus?.Metrics?.['Active Users']?.RawValue || 0}
                  </span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-sm text-gray-400">Uptime</span>
                  <span className="text-sm text-white font-mono">
                    {serverStatus?.Uptime || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Instance Info */}
            <div className="bg-[#1a1d24] border border-gray-800 rounded">
              <div className="border-b border-gray-800 p-3">
                <h3 className="text-sm font-medium text-gray-300">Informações da Instância</h3>
              </div>
              <div className="divide-y divide-gray-800">
                <div className="p-3 flex justify-between items-center">
                  <span className="text-sm text-gray-400">ID</span>
                  <span className="text-xs text-gray-500 font-mono">{server.InstanceID}</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-sm text-gray-400">Módulo</span>
                  <span className="text-sm text-white">{server.Module}</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-sm text-gray-400">Nome</span>
                  <span className="text-sm text-white">{server.InstanceName}</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-sm text-gray-400">Porta</span>
                  <span className="text-sm text-white font-mono">{server.Port || 'N/A'}</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-sm text-gray-400">IP</span>
                  <span className="text-sm text-white font-mono">{server.IP || '0.0.0.0'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'console' && (
          <ServerConsole serverId={server.InstanceID} />
        )}

        {activeTab === 'settings' && (
          <div className="bg-[#1a1d24] border border-gray-800 rounded p-6 text-center">
            <Settings className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Configurações em desenvolvimento</p>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-[#1a1d24] border border-gray-800 rounded p-6 text-center">
            <FileText className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Logs em desenvolvimento</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerDetails;