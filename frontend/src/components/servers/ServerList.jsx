import React from 'react';
import { RefreshCw, Circle } from 'lucide-react';

const ServerList = ({ servers, selectedServer, onSelectServer, onRefresh }) => {
  const getStatusColor = (running) => {
    return running ? 'text-green-400' : 'text-gray-500';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-800 flex items-center justify-between bg-[#13161c]">
        <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Instâncias</h3>
        <button
          onClick={onRefresh}
          className="p-1.5 hover:bg-gray-800 rounded transition-colors"
          title="Atualizar"
        >
          <RefreshCw className="h-3.5 w-3.5 text-gray-400" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {servers.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 text-sm">Nenhuma instância encontrada</p>
          </div>
        ) : (
          servers.map((server) => (
            <button
              key={server.InstanceID}
              onClick={() => onSelectServer(server)}
              className={`w-full p-3 text-left hover:bg-gray-800/50 transition-colors border-l-2 ${
                selectedServer?.InstanceID === server.InstanceID
                  ? 'bg-gray-800/70 border-blue-500'
                  : 'border-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Circle
                      className={`h-2 w-2 fill-current ${
                        getStatusColor(server.Running)
                      }`}
                    />
                    <h4 className="text-sm font-medium text-white truncate">
                      {server.FriendlyName || server.InstanceName}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500">{server.Module}</p>
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