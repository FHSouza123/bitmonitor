import { useState, useEffect } from 'react';

interface BitcoinProjectionProps {
  bitcoinUsd: number;
  dolarReal: number;
  onFieldsComplete: (allFieldsFilled: boolean) => void;
}

const BitcoinProjection = ({ bitcoinUsd, dolarReal, onFieldsComplete }: BitcoinProjectionProps) => {
  const [bitcoinAmount, setBitcoinAmount] = useState('');
  const [futurePriceUsd, setFuturePriceUsd] = useState('');
  const [currentPriceBrl, setCurrentPriceBrl] = useState('');
  const [projections, setProjections] = useState<{
    futureValueBrl: number;
    absoluteAppreciation: number;
    percentAppreciation: number;
  } | null>(null);

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  useEffect(() => {
    const allFieldsFilled = bitcoinAmount !== '' && futurePriceUsd !== '' && currentPriceBrl !== '';
    onFieldsComplete(allFieldsFilled);

    if (allFieldsFilled) {
      const btcAmount = parseFloat(bitcoinAmount);
      const futureUsd = parseFloat(futurePriceUsd);
      const currentBrl = parseFloat(currentPriceBrl);

      const futureValueBrl = btcAmount * futureUsd * dolarReal;
      const absoluteAppreciation = futureValueBrl - currentBrl;
      const percentAppreciation = ((futureValueBrl - currentBrl) / currentBrl) * 100;

      setProjections({
        futureValueBrl,
        absoluteAppreciation,
        percentAppreciation
      });
    } else {
      setProjections(null);
    }
  }, [bitcoinAmount, futurePriceUsd, currentPriceBrl, dolarReal, onFieldsComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-8">
      <div className="bg-[#181818] rounded-2xl shadow-lg border border-[#232323] p-6 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Projeção de Valores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Input Bitcoin */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              Quantidade de Bitcoin
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">₿</span>
              <input
                type="number"
                value={bitcoinAmount}
                onChange={(e) => setBitcoinAmount(e.target.value)}
                placeholder="Ex: 0.5"
                className="w-full pl-8 pr-4 py-2 border border-[#232323] rounded-lg bg-[#232323] text-white focus:ring-2 focus:ring-[#f7931a] focus:border-transparent text-sm sm:text-base"
                step="0.00000001"
                min="0"
              />
            </div>
            <p className="text-xs text-gray-400">
              Valor atual: {formatCurrency(bitcoinUsd, 'USD')}
            </p>
          </div>

          {/* Input Valor Futuro */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              Valor Futuro (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={futurePriceUsd}
                onChange={(e) => setFuturePriceUsd(e.target.value)}
                placeholder="Ex: 100000"
                className="w-full pl-8 pr-4 py-2 border border-[#232323] rounded-lg bg-[#232323] text-white focus:ring-2 focus:ring-[#f7931a] focus:border-transparent text-sm sm:text-base"
                min="0"
              />
            </div>
            <p className="text-xs text-gray-400">
              Dólar atual: {formatCurrency(dolarReal, 'BRL')}
            </p>
          </div>

          {/* Input Valor Atual em Reais */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              Valor Atual (BRL)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">R$</span>
              <input
                type="number"
                value={currentPriceBrl}
                onChange={(e) => setCurrentPriceBrl(e.target.value)}
                placeholder="Ex: 500000"
                className="w-full pl-8 pr-4 py-2 border border-[#232323] rounded-lg bg-[#232323] text-white focus:ring-2 focus:ring-[#f7931a] focus:border-transparent text-sm sm:text-base"
                min="0"
              />
            </div>
            <p className="text-xs text-gray-400">
              Valor em reais do seu investimento
            </p>
          </div>
        </div>

        {/* Resultados */}
        {projections && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6">
            {/* Valor Futuro */}
            <div className="bg-black/60 backdrop-blur-sm p-4 rounded-2xl border border-[#232323]">
              <div className="flex flex-col">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                  Valor Futuro
                </h3>
                <p className="text-xl sm:text-2xl font-bold text-[#f7931a]">
                  {formatCurrency(projections.futureValueBrl, 'BRL')}
                </p>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  Projeção em reais
                </p>
              </div>
            </div>

            {/* Valorização Absoluta */}
            <div className="bg-black/60 backdrop-blur-sm p-4 rounded-2xl border border-[#232323]">
              <div className="flex flex-col">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                  Valorização Absoluta
                </h3>
                <p className={`text-xl sm:text-2xl font-bold ${projections.absoluteAppreciation >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(projections.absoluteAppreciation, 'BRL')}
                </p>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  Diferença entre futuro e atual
                </p>
              </div>
            </div>

            {/* Percentual de Valorização */}
            <div className="bg-black/60 backdrop-blur-sm p-4 rounded-2xl border border-[#232323]">
              <div className="flex flex-col">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                  Percentual de Valorização
                </h3>
                <p className={`text-xl sm:text-2xl font-bold ${projections.percentAppreciation >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercent(projections.percentAppreciation)}
                </p>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  Em relação ao valor atual
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BitcoinProjection; 