/**
 * Games Page - Lista completa de jogos suportados pelo Painel AMP
 */
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Users, Server, Gamepad2, Filter, Star, ExternalLink } from 'lucide-react';
import OptimizedImage from '../components/optimized/OptimizedImage';
import { PricingPageSEO } from '../components/SEO/SEOHead';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Lista completa de jogos suportados pelo AMP
const supportedGames = [
  {
    id: 1,
    name: "Minecraft Java Edition",
    category: "Sandbox", 
    type: "dedicated",
    players: "Ilimitado",
    description: "O clássico jogo de construção em blocos com suporte completo a plugins e mods.",
    image: "https://wallpaperaccess.com/full/1106193.jpg",
    features: ["Plugins", "Mods", "Whitelist", "Backups automáticos"],
    popular: true,
    official: true
  },
  {
    id: 2,
    name: "Rust",
    category: "Survival",
    type: "dedicated", 
    players: "200+",
    description: "Survival multiplayer com foco em PvP e construção de bases.",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/252490/ss_85dcaaee235e53a6030a8c0b14bdbfa1e8fa08e8.1920x1080.jpg",
    features: ["Óxido plugins", "Blueprints", "Kits", "Economia"],
    popular: true,
    official: true
  },
  {
    id: 3,
    name: "Valheim",
    category: "Survival",
    type: "generic",
    players: "10",
    description: "Aventura co-op inspirada na cultura viking e mitologia nórdica.",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/892970/ss_ce5b7825d2de92db076ba74c1430bba4aff96395.1920x1080.jpg",
    features: ["Co-op", "Boss battles", "Construção", "Exploração"],
    popular: true,
    official: true
  },
  {
    id: 4,
    name: "Counter-Strike 2",
    category: "FPS",
    type: "generic",
    players: "64",
    description: "FPS competitivo com modo clássico de bombas e reféns.",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/ss_34309d859166c4b6b22674a8d2b38bb85b3dcdf0.1920x1080.jpg",
    features: ["Mapas customizados", "Mods", "Torneios", "Ranking"],
    popular: true,
    official: true
  },
  {
    id: 5,
    name: "ARK: Survival Evolved",
    category: "Survival",
    type: "generic",
    players: "150+",
    description: "Survival com dinossauros e criaturas em mundo aberto.",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/346110/ss_f2cb1db6edd2171366e6c71698de75d9b49c5f2e.1920x1080.jpg",
    features: ["Dinossauros", "Construção", "Tribes", "Mods"],
    popular: true,
    official: true
  },
  {
    id: 6,
    name: "Terraria",
    category: "Sandbox",
    type: "generic",
    players: "255",
    description: "Aventura 2D com exploração, construção e combate.",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/105600/ss_c4bc6b3414bbfcf039ebe8d308c15a4906e0a7c6.1920x1080.jpg",
    features: ["Mods tModLoader", "Eventos", "Bosses", "Multiplayer"],
    popular: false,
    official: true
  },
  {
    id: 7,
    name: "Garry's Mod",
    category: "Sandbox",
    type: "generic",
    players: "128",
    description: "Sandbox criativo com física e possibilidades infinitas.",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/4000/ss_6e805a0de4c0b15875455c5226d2f508c03b0b0f.1920x1080.jpg",
    features: ["Addons", "Gamemodes", "Workshop", "Lua scripting"],
    popular: false,
    official: true
  },
  {
    id: 8,
    name: "7 Days to Die",
    category: "Survival",
    type: "generic",
    players: "16",
    description: "Survival horror com zumbis em mundo voxel.",
    image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400&h=300&fit=crop",
    features: ["Crafting", "Horde nights", "Mods", "Building"],
    popular: false,
    official: true
  },
  {
    id: 9,
    name: "Project Zomboid",
    category: "Survival",
    type: "generic", 
    players: "32+",
    description: "Survival isométrico em apocalipse zumbi.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    features: ["Survival realista", "Crafting", "Mods", "Multiplayer"],
    popular: false,
    official: true
  },
  {
    id: 10,
    name: "Factorio",
    category: "Strategy",
    type: "generic",
    players: "65000+",
    description: "Construa e automatize fábricas em alien planet.",
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
    features: ["Automação", "Mods", "Multiplayer", "Logística"],
    popular: false,
    official: true
  },
  {
    id: 11,
    name: "Satisfactory",
    category: "Strategy",
    type: "generic",
    players: "4",
    description: "Jogo de construção de fábrica em primeira pessoa 3D.",
    image: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400&h=300&fit=crop",
    features: ["Co-op", "Construção 3D", "Automação", "Exploração"],
    popular: false,
    official: true
  },
  {
    id: 12,
    name: "Space Engineers",
    category: "Sandbox",
    type: "generic",
    players: "16",
    description: "Construção e engenharia no espaço com física realista.",
    image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop",
    features: ["Física real", "Construção", "Mods", "Scripting"],
    popular: false,
    official: true
  }
];

const categories = ["Todos", "Sandbox", "Survival", "FPS", "Strategy"];

const Games = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showOnlyPopular, setShowOnlyPopular] = useState(false);

  const filteredGames = useMemo(() => {
    return supportedGames.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || game.category === selectedCategory;
      const matchesPopular = !showOnlyPopular || game.popular;
      
      return matchesSearch && matchesCategory && matchesPopular;
    });
  }, [searchTerm, selectedCategory, showOnlyPopular]);

  const popularGames = supportedGames.filter(game => game.popular);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <PricingPageSEO />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Gamepad2 className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
              Jogos Suportados
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Descubra todos os jogos que você pode hospedar com o nosso Painel AMP. 
            Mais de 12 jogos populares com configuração automática e suporte completo.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{supportedGames.length}+</div>
              <div className="text-gray-600 dark:text-gray-400">Jogos Suportados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{popularGames.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Mais Populares</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">100%</div>
              <div className="text-gray-600 dark:text-gray-400">Compatível</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar jogos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              
              {/* Popular Filter */}
              <Button
                variant={showOnlyPopular ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOnlyPopular(!showOnlyPopular)}
                className="flex items-center gap-2"
              >
                <Star className="h-4 w-4" />
                Populares
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map(game => (
              <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <OptimizedImage
                    src={game.image}
                    alt={game.name}
                    width="100%"
                    height="200px"
                    className="w-full h-48 object-cover"
                  />
                  {game.popular && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  <Badge 
                    className={`absolute top-2 right-2 ${
                      game.type === 'dedicated' 
                        ? 'bg-green-600' 
                        : 'bg-blue-600'
                    }`}
                  >
                    {game.type === 'dedicated' ? 'Dedicado' : 'Genérico'}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {game.name}
                    <Badge variant="outline">{game.category}</Badge>
                  </CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Players */}
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-2" />
                      Até {game.players} jogadores
                    </div>
                    
                    {/* Features */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recursos:</h4>
                      <div className="flex flex-wrap gap-1">
                        {game.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {game.features.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{game.features.length - 3} mais
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* CTA */}
                    <Button className="w-full" size="sm">
                      <Server className="h-4 w-4 mr-2" />
                      Criar Servidor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredGames.length === 0 && (
            <div className="text-center py-16">
              <Gamepad2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Nenhum jogo encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tente ajustar seus filtros ou termo de busca.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Não encontrou seu jogo favorito?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            O Painel AMP suporta praticamente qualquer jogo através do módulo genérico. 
            Entre em contato conosco para configuração personalizada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <ExternalLink className="h-5 w-5 mr-2" />
              Solicitar Suporte
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              Ver Todos os Planos
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Games;