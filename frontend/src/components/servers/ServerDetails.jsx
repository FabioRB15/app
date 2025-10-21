import React, { useState, useEffect } from 'react';
import { Play, Square, RotateCw, Terminal, Activity, HardDrive, Cpu, Users } from 'lucide-react';
import ServerConsole from './ServerConsole';

const ServerDetails = ({ server, onAction, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [serverStatus, setServerStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServerStatus();
  }, [server]);

  const fetchServerStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
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

  const getStatusBadge = () => {
    if (server.Running) {
      return (
        <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-medium">
          Online
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-sm font-medium">
        Offline
      </span>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Activity },
    { id: 'console', label: 'Console', icon: Terminal },
  ];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {server.FriendlyName || server.InstanceName}
            </h2>
            <p className="text-gray-400">{server.Module}</p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onAction('start', server.InstanceID)}
            disabled={server.Running}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Play className="h-4 w-4" />
            Iniciar
          </button>
          <button
            onClick={() => onAction('stop', server.InstanceID)}
            disabled={!server.Running}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Square className="h-4 w-4" />
            Parar
          </button>
          <button
            onClick={() => onAction('restart', server.InstanceID)}
            disabled={!server.Running}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RotateCw className="h-4 w-4" />
            Reiniciar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-500'
                    : 'border-transparent text-gray-400 hover:text-white'
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
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Cpu className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-400 text-sm">CPU</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {serverStatus?.Metrics?.['CPU Usage']?.Percent || 'N/A'}%
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <HardDrive className="h-5 w-5 text-green-500" />
                  <span className="text-gray-400 text-sm">Memória</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {serverStatus?.Metrics?.['Memory Usage']?.Percent || 'N/A'}%
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-400 text-sm">Players</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {serverStatus?.Metrics?.['Active Users']?.RawValue || '0'}
                </p>
              </div>
            </div>

            {/* Server Info */}
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-semibold mb-4">Informações do Servidor</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">ID da Instância:</span>
                  <span className="text-white font-mono text-sm">{server.InstanceID}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Módulo:</span>
                  <span className="text-white">{server.Module}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-white">{server.Running ? 'Rodando' : 'Parado'}</span>
                </div>
                {serverStatus?.State && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estado:</span>
                    <span className="text-white">{serverStatus.State}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'console' && (
          <ServerConsole serverId={server.InstanceID} />
        )}
      </div>
    </div>
  );
};

export default ServerDetails;