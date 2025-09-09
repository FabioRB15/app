// Mock data for Mystic Host
export const mockGameServers = [
  {
    id: 1,
    name: "Minecraft Java",
    players: "2-100",
    price: "R$ 15,90",
    ram: "2GB",
    storage: "10GB SSD",
    status: "online",
    image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Counter-Strike 2",
    players: "2-64",
    price: "R$ 24,90",
    ram: "4GB",
    storage: "15GB SSD",
    status: "online",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Rust",
    players: "2-200",
    price: "R$ 39,90",
    ram: "8GB",
    storage: "25GB SSD",
    status: "online",
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    name: "ARK Survival",
    players: "2-50",
    price: "R$ 29,90",
    ram: "6GB",
    storage: "20GB SSD",
    status: "maintenance",
    image: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400&h=300&fit=crop"
  }
];

export const mockPricingPlans = [
  {
    id: 1,
    name: "Apprentice",
    price: "R$ 19,90",
    period: "/mês",
    description: "Perfeito para começar sua jornada",
    features: [
      "2GB RAM",
      "15GB SSD",
      "Até 20 jogadores",
      "Suporte básico",
      "Backup diário"
    ],
    popular: false
  },
  {
    id: 2,
    name: "Sorcerer",
    price: "R$ 39,90",
    period: "/mês",
    description: "Para comunidades em crescimento",
    features: [
      "4GB RAM",
      "30GB SSD",
      "Até 50 jogadores",
      "Suporte prioritário",
      "Backup a cada 6h",
      "DDoS Protection"
    ],
    popular: true
  },
  {
    id: 3,
    name: "Archmage",
    price: "R$ 79,90",
    period: "/mês",
    description: "Máximo poder para grandes servidores",
    features: [
      "8GB RAM",
      "60GB SSD",
      "Jogadores ilimitados",
      "Suporte dedicado 24/7",
      "Backup em tempo real",
      "DDoS Protection Premium",
      "CPU dedicado"
    ],
    popular: false
  }
];

export const mockDashboardStats = [
  {
    title: "Servidores Ativos",
    value: "147",
    change: "+12%",
    trend: "up"
  },
  {
    title: "Jogadores Online",
    value: "2,847",
    change: "+8%",
    trend: "up"
  },
  {
    title: "Uptime Médio",
    value: "99.9%",
    change: "+0.1%",
    trend: "up"
  },
  {
    title: "Latência Média",
    value: "12ms",
    change: "-3ms",
    trend: "down"
  }
];

export const mockTestimonials = [
  {
    id: 1,
    name: "Pedro Silva",
    role: "Admin do servidor MineCraft Brasil",
    content: "O Mystic Host transformou completamente nossa experiência. Performance impecável e suporte incrível!",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Ana Costa",
    role: "Líder da guild Dragons",
    content: "Melhor investimento que fizemos. Nossos jogadores nunca mais reclamaram de lag ou instabilidade.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5c8?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "João Santos",
    role: "Streamer e Gamer",
    content: "Interface super intuitiva e performance que impressiona. Recomendo para qualquer comunidade séria.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  }
];