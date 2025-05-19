import { useState, useEffect } from 'react';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
}

const CryptoTicker = () => {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1'
      );
      if (!response.ok) throw new Error('Erro ao buscar dados');
      const data = await response.json();
      setCryptos(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#1a1a1a] border-t border-b border-[#2a2a2a] h-12 sm:h-8 flex items-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="ml-2 text-white text-sm">Carregando cotações...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] border-t border-b border-[#2a2a2a] h-12 sm:h-8 w-full">
      <div className="ticker-container">
        {/* Versão Mobile - Grid Scrollável */}
        <div className="sm:hidden w-full h-full">
          <div className="animate-scroll-fast inline-flex px-4 py-2 space-x-4 min-w-full">
            {cryptos.map((crypto) => (
              <div key={crypto.id} className="flex items-center space-x-2 whitespace-nowrap">
                <span className="text-white text-xs">{crypto.symbol.toUpperCase()}</span>
                <span className="text-white text-xs">{formatPrice(crypto.current_price)}</span>
                <span
                  className={`text-xs ${
                    crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'}
                  {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Versão Desktop - Animação de Rolagem */}
        <div className="hidden sm:block">
          <div className="animate-scroll-fast whitespace-nowrap py-1">
            <div className="inline-flex">
              {cryptos.map((crypto) => (
                <div key={crypto.id} className="inline-flex items-center px-4">
                  <span className="text-white text-sm">{crypto.name}</span>
                  <span className="text-white text-sm ml-2">{formatPrice(crypto.current_price)}</span>
                  <span
                    className={`text-sm ml-2 ${
                      crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
            <div className="inline-flex">
              {cryptos.map((crypto) => (
                <div key={`${crypto.id}-dup`} className="inline-flex items-center px-4">
                  <span className="text-white text-sm">{crypto.name}</span>
                  <span className="text-white text-sm ml-2">{formatPrice(crypto.current_price)}</span>
                  <span
                    className={`text-sm ml-2 ${
                      crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoTicker; 