import React from 'react';
import { Github, Twitter, MessageCircle, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16 px-4 sm:px-6 lg:px-8 transition-colors relative overflow-hidden">
      {/* Mystical background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_mystic-host/artifacts/dapkmkez_ChatGPT%20Image%203%20de%20set.%20de%202025%2C%2008_32_26.png" 
                alt="Mystic Host Symbol" 
                className="w-8 h-8 opacity-90"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Mystic Host
              </span>
            </div>
            <p className="text-gray-400 dark:text-gray-500 mb-6 max-w-md transition-colors">
              Desperte o poder místico dos seus jogos com nossa hospedagem premium. 
              Performance excepcional, suporte dedicado e tecnologia de ponta.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-purple-400 dark:hover:text-purple-300 transition-all hover:scale-110">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-purple-400 dark:hover:text-purple-300 transition-all hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-purple-400 dark:hover:text-purple-300 transition-all hover:scale-110">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-purple-400 dark:hover:text-purple-300 transition-all hover:scale-110">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Produtos */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produtos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">Minecraft</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">Counter-Strike</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">Rust</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">ARK Survival</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">Todos os Jogos</a></li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="font-semibold text-white mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">Documentação</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">Status do Serviço</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">Contato</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">Discord</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 dark:border-gray-900 pt-8 transition-colors">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 dark:text-gray-500 text-sm mb-4 md:mb-0 transition-colors">
              © 2025 Mystic Host. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                Termos de Serviço
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;