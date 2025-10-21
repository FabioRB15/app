import React, { useState, useEffect } from 'react';
import { X, Loader2, Server } from 'lucide-react';
import { toast } from '../../hooks/use-toast';

const CreateServerModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [formData, setFormData] = useState({
    module: '',
    instance_name: '',
    friendly_name: '',
    port_number: 25565
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/amp/applications`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Aviso',
        description: 'Não foi possível carregar a lista de jogos',
        variant: 'destructive'
      });
    } finally {
      setLoadingApps(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.module || !formData.instance_name || !formData.friendly_name) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/amp/instances`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create server');
      }

      onSuccess();
    } catch (error) {
      console.error('Error creating server:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o servidor',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'port_number' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server className="h-6 w-6 text-purple-500" />
            <h2 className="text-xl font-bold text-white">Criar Novo Servidor</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Game/Module Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Jogo / Aplicação *
            </label>
            {loadingApps ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando jogos...
              </div>
            ) : (
              <select
                name="module"
                value={formData.module}
                onChange={handleChange}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">Selecione um jogo</option>
                {applications.map((app, index) => (
                  <option key={index} value={app.Module || app.Name}>
                    {app.DisplayName || app.Name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Instance Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome da Instância * (sem espaços)
            </label>
            <input
              type="text"
              name="instance_name"
              value={formData.instance_name}
              onChange={handleChange}
              placeholder="ex: minecraft-server-01"
              required
              pattern="[a-zA-Z0-9-_]+"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">Use apenas letras, números, - e _</p>
          </div>

          {/* Friendly Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome de Exibição *
            </label>
            <input
              type="text"
              name="friendly_name"
              value={formData.friendly_name}
              onChange={handleChange}
              placeholder="ex: Meu Servidor de Minecraft"
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Port Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Porta
            </label>
            <input
              type="number"
              name="port_number"
              value={formData.port_number}
              onChange={handleChange}
              min="1"
              max="65535"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Servidor'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServerModal;