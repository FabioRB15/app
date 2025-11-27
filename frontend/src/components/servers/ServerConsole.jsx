import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal, RefreshCw } from 'lucide-react';
import { toast } from '../../hooks/use-toast';

const ServerConsole = ({ serverId }) => {
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const consoleEndRef = useRef(null);

  useEffect(() => {
    fetchConsoleOutput();
    const interval = setInterval(fetchConsoleOutput, 3000);
    return () => clearInterval(interval);
  }, [serverId]);

  useEffect(() => {
    scrollToBottom();
  }, [consoleOutput]);

  const scrollToBottom = () => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConsoleOutput = async () => {
    try {
      const token = localStorage.getItem('mystic_token');
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/amp/instances/${serverId}/console`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.entries && Array.isArray(data.entries)) {
          setConsoleOutput(data.entries);
        }
      }
    } catch (error) {
      console.error('Error fetching console output:', error);
    }
  };

  const sendCommand = async (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('mystic_token');
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/amp/instances/${serverId}/console`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ command })
        }
      );

      if (response.ok) {
        toast({
          title: 'Comando enviado',
          description: 'O comando foi enviado ao console'
        });
        setCommand('');
        setTimeout(fetchConsoleOutput, 1000);
      } else {
        throw new Error('Failed to send command');
      }
    } catch (error) {
      console.error('Error sending command:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar o comando',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Console Output */}
      <div className="flex-1 bg-black border border-gray-800 rounded font-mono text-sm overflow-y-auto p-3">
        {consoleOutput.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-600">
            <div className="text-center">
              <Terminal className="h-8 w-8 mx-auto mb-2" />
              <p className="text-xs">Aguardando saída do console...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-0.5">
            {consoleOutput.map((entry, index) => (
              <div key={index} className="text-green-400">
                <span className="text-gray-600 text-xs mr-2">
                  [{formatTimestamp(entry.Timestamp)}]
                </span>
                <span className="text-yellow-500 text-xs">{entry.Source}:</span>
                <span className="ml-2 text-xs">{entry.Contents}</span>
              </div>
            ))}
            <div ref={consoleEndRef} />
          </div>
        )}
      </div>

      {/* Command Input */}
      <form onSubmit={sendCommand} className="flex gap-2 mt-3">
        <div className="flex-1 relative">
          <Terminal className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Digite um comando..."
            className="w-full bg-[#1a1d24] border border-gray-700 rounded px-10 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !command.trim()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm transition-colors"
        >
          <Send className="h-4 w-4" />
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ServerConsole;