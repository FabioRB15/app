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
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchConsoleOutput, 5000);
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
      const token = localStorage.getItem('token');
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
      const token = localStorage.getItem('token');
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
        // Refresh console output after sending command
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
    return date.toLocaleTimeString('pt-BR');
  };

  return (
    <div className="space-y-4">
      {/* Console Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-green-500" />
          <h3 className="text-white font-semibold">Console do Servidor</h3>
        </div>
        <button
          onClick={fetchConsoleOutput}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          title="Atualizar"
        >
          <RefreshCw className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Console Output */}
      <div className="bg-black/50 rounded-lg border border-gray-700 p-4 h-96 overflow-y-auto font-mono text-sm">
        {consoleOutput.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Nenhuma saída do console disponível
          </div>
        ) : (
          <div className="space-y-1">
            {consoleOutput.map((entry, index) => (
              <div key={index} className="text-gray-300">
                <span className="text-gray-500 mr-2">
                  [{formatTimestamp(entry.Timestamp)}]
                </span>
                <span className="text-green-400">{entry.Source}:</span>
                <span className="ml-2">{entry.Contents}</span>
              </div>
            ))}
            <div ref={consoleEndRef} />
          </div>
        )}
      </div>

      {/* Command Input */}
      <form onSubmit={sendCommand} className="flex gap-2">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Digite um comando..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !command.trim()}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Send className="h-4 w-4" />
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ServerConsole;