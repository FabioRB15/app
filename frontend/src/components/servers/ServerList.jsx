import React from 'react';
import { Server, RefreshCw, Circle } from 'lucide-react';

const ServerList = ({ servers, selectedServer, onSelectServer, onRefresh }) => {
  const getStatusColor = (running) => {
    return running ? 'text-green-500' : 'text-red-500';
  };

  const getStatusText = (running) => {
    return running ? 'Online' : 'Offline';
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Meus Servidores</h2>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          title="Atualizar"
        >
          <RefreshCw className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      
      <div className="divide-y divide-gray-700">
        {servers.length === 0 ? (
          <div className="p-8 text-center">
            <Server className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Nenhum servidor encontrado</p>
            <p className="text-gray-500 text-sm mt-1">Crie seu primeiro servidor</p>
          </div>
        ) : (
          servers.map((server) => (
            <button
              key={server.InstanceID}
              onClick={() => onSelectServer(server)}
              className={`w-full p-4 text-left hover:bg-gray-700/50 transition-colors ${
                selectedServer?.InstanceID === server.InstanceID
                  ? 'bg-gray-700/70 border-l-4 border-purple-500'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">
                    {server.FriendlyName || server.InstanceName}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{server.Module}</p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <Circle
                    className={`h-3 w-3 fill-current ${
                      getStatusColor(server.Running)
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      getStatusColor(server.Running)
                    }`}
                  >
                    {getStatusText(server.Running)}
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ServerList;