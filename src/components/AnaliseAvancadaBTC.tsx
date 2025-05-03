import { useState, useEffect } from 'react';

interface ETFData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  aum: number; // Assets Under Management
}

const AnaliseAvancadaBTC = () => {
  const [loadingStates, setLoadingStates] = useState({
    btcPrice: true,
    btcDominance: true,
    etfTable: true
  });

  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [etfData, setEtfData] = useState<ETFData[]>([
    {
      symbol: 'IBIT',
      name: 'BlackRock Bitcoin ETF',
      price: 0,
      change: 0,
      volume: 0,
      aum: 0
    },
    {
      symbol: 'FBTC',
      name: 'Fidelity Wise Origin Bitcoin Fund',
      price: 0,
      change: 0,
      volume: 0,
      aum: 0
    },
    {
      symbol: 'ARKB',
      name: 'ARK 21Shares Bitcoin ETF',
      price: 0,
      change: 0,
      volume: 0,
      aum: 0
    },
    {
      symbol: 'BITB',
      name: 'Bitwise Bitcoin ETF',
      price: 0,
      change: 0,
      volume: 0,
      aum: 0
    }
  ]);

  useEffect(() => {
    const fetchETFData = async () => {
      try {
        // Aqui você pode implementar a chamada real à API do Yahoo Finance
        // Por enquanto, vamos simular dados aleatórios
        const updatedData = etfData.map(etf => ({
          ...etf,
          price: Math.random() * 50000 + 40000,
          change: (Math.random() * 4) - 2,
          volume: Math.random() * 1000000,
          aum: Math.random() * 2000000000
        }));
        setEtfData(updatedData);
        setLastUpdate(new Date());
        setLoadingStates(prev => ({ ...prev, etfTable: false }));
      } catch (error) {
        console.error('Erro ao buscar dados dos ETFs:', error);
      }
    };

    fetchETFData();
    const interval = setInterval(fetchETFData, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatVolume = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(2)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    return value.toFixed(0);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-6">ETFs de Bitcoin Spot</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#181818] rounded-2xl shadow-lg border border-[#232323] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">ETFs de Bitcoin nos EUA</h3>
          {loadingStates.etfTable ? (
            <div className="flex items-center justify-center h-40">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f7931a]"></div>
                <span className="mt-2 text-gray-600">Carregando dados...</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#232323]">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ETF</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">PREÇO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">VARIAÇÃO 24H</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">VOL</th>
                  </tr>
                </thead>
                <tbody className="bg-[#181818] divide-y divide-[#232323]">
                  {etfData.map((etf) => (
                    <tr key={etf.symbol} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {etf.symbol}
                            </div>
                            <div className="text-sm text-gray-500">
                              {etf.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(etf.price)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${
                        etf.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {etf.change >= 0 ? '+' : ''}{etf.change.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatVolume(etf.volume)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-4 text-center">
            * AUM = Assets Under Management (Ativos sob Gestão)
          </p>
        </div>

        <div className="bg-[#181818] rounded-2xl shadow-lg border border-[#232323] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Dominância do Bitcoin no Mercado</h3>
          <div className="relative w-full" style={{ height: '400px' }}>
            <div className="tradingview-widget-container" style={{ height: '100%', width: '100%' }}>
              <div className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }}>
                <iframe
                  title="Bitcoin Dominance"
                  src="https://www.tradingview.com/widgetembed/?symbol=CRYPTOCAP%3ABTC.D&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=light&style=1&timezone=exchange&withdateranges=1&showpopupbutton=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=br&utm_source=&utm_medium=widget&utm_campaign=chart"
                  style={{ width: '100%', height: '100%', border: '0' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#181818] rounded-2xl shadow-lg border border-[#232323] p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-white mb-4">Preço do Bitcoin vs ETFs</h2>
          <div className="relative w-full" style={{ height: '500px' }}>
            <div className="tradingview-widget-container" style={{ height: '100%', width: '100%' }}>
              <div className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }}>
                <iframe
                  title="Bitcoin vs ETFs Chart"
                  src="https://www.tradingview.com/widgetembed/?symbol=NASDAQ%3AIBIT&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=light&style=1&timezone=exchange&withdateranges=1&showpopupbutton=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=br&utm_source=&utm_medium=widget&utm_campaign=chart"
                  style={{ width: '100%', height: '100%', border: '0' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnaliseAvancadaBTC; 