/**
 * SEO Head component for dynamic meta tags and structured data
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title = 'Mystic Host - Hospedagem de Servidores de Jogos',
  description = 'A melhor hospedagem de servidores de jogos do Brasil. Minecraft, CS2, Rust e muito mais com alta performance e suporte 24/7.',
  keywords = 'hospedagem de jogos, servidor minecraft, servidor cs2, servidor rust, hospedagem brasil, game hosting',
  image = '/assets/og-image.jpg',
  url,
  type = 'website',
  author = 'Mystic Host',
  robots = 'index, follow',
  canonical,
  structuredData,
  children
}) => {
  // Get current URL if not provided
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const canonicalUrl = canonical || currentUrl;

  // Default structured data
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mystic Host",
    "description": description,
    "url": "https://mystichost.com.br",
    "logo": "https://mystichost.com.br/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-11-9999-9999",
      "contactType": "customer service",
      "availableLanguage": ["Portuguese", "English"]
    },
    "sameAs": [
      "https://twitter.com/mystichost",
      "https://facebook.com/mystichost",
      "https://instagram.com/mystichost"
    ],
    "offers": {
      "@type": "Offer",
      "category": "Game Server Hosting",
      "availability": "InStock",
      "priceCurrency": "BRL"
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Mystic Host" />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@mystichost" />

      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="theme-color" content="#3B82F6" />

      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/logo-symbol.png" />
      <link rel="apple-touch-icon" href="/logo-symbol.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Custom children */}
      {children}
    </Helmet>
  );
};

// Pre-defined SEO configurations for different pages
export const HomePageSEO = () => (
  <SEOHead
    title="Mystic Host - Hospedagem de Servidores de Jogos Premium"
    description="Hospedagem premium de servidores de jogos no Brasil. Minecraft, Counter-Strike, Rust, ARK e mais. Performance excepcional, suporte 24/7 e preços acessíveis."
    keywords="hospedagem jogos, servidor minecraft brasil, hosting cs2, servidor rust, hospedagem premium, game server"
    structuredData={{
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Mystic Host",
      "url": "https://mystichost.com.br",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://mystichost.com.br/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }}
  />
);

export const PricingPageSEO = () => (
  <SEOHead
    title="Preços - Planos de Hospedagem de Jogos | Mystic Host"
    description="Confira nossos planos de hospedagem de servidores de jogos com preços transparentes. A partir de R$ 19,90/mês. Minecraft, CS2, Rust e mais."
    keywords="preços hospedagem jogos, planos servidor minecraft, custo hosting cs2, preço servidor rust"
    structuredData={{
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Hospedagem de Servidores de Jogos",
      "description": "Planos de hospedagem para servidores de jogos",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "19.90",
        "highPrice": "99.90",
        "priceCurrency": "BRL"
      }
    }}
  />
);

export const LoginPageSEO = () => (
  <SEOHead
    title="Login - Área do Cliente | Mystic Host"
    description="Acesse sua conta Mystic Host para gerenciar seus servidores de jogos, visualizar estatísticas e controlar suas configurações."
    robots="noindex, nofollow"
  />
);

export const RegisterPageSEO = () => (
  <SEOHead
    title="Criar Conta - Registre-se | Mystic Host"
    description="Crie sua conta na Mystic Host e comece a hospedar seus servidores de jogos hoje mesmo. Processo rápido e seguro."
    robots="index, follow"
  />
);

export const SupportPageSEO = () => (
  <SEOHead
    title="Suporte - Fale Conosco | Mystic Host"
    description="Entre em contato com nosso suporte especializado em hospedagem de jogos. Atendimento 24/7 para resolver suas dúvidas e problemas."
    keywords="suporte mystic host, contato hospedagem jogos, ajuda servidor minecraft, suporte técnico"
    structuredData={{
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Suporte Mystic Host",
      "description": "Página de contato e suporte da Mystic Host"
    }}
  />
);

export default SEOHead;