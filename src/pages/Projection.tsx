import { useState, useEffect } from 'react';
import BitcoinProjection from '../components/BitcoinProjection';
import Loading from '../components/Loading';

const Projection = () => {
  const [bitcoinUsd, setBitcoinUsd] = useState<number>(0);
  const [dolarReal, setDolarReal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Buscar cotação do Bitcoin da Binance
      const btcResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT');
      if (!btcResponse.ok) throw new Error('Erro ao buscar cotação do Bitcoin');
      const btcData = await btcResponse.json();
      const btcUsdPrice = parseFloat(btcData.lastPrice);
      
      // Buscar cotação do dólar
      const dolarResponse = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
      if (!dolarResponse.ok) throw new Error('Erro ao buscar cotação do dólar');
      const dolarData = await dolarResponse.json();
      const dolarValue = parseFloat(dolarData.USDBRL.bid);

      setBitcoinUsd(btcUsdPrice);
      setDolarReal(dolarValue);
      setLastUpdate(new Date().toLocaleString('pt-BR'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega os dados iniciais apenas uma vez
  useEffect(() => {
    fetchData();
  }, []);

  // Atualiza os dados quando todos os campos estiverem preenchidos
  const handleFieldsComplete = (allFieldsFilled: boolean) => {
    setShouldUpdate(allFieldsFilled);
  };

  // Efeito para atualização quando todos os campos estiverem preenchidos
  useEffect(() => {
    let interval: number;

    if (shouldUpdate) {
      interval = window.setInterval(fetchData, 60000); // Atualiza a cada minuto
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [shouldUpdate]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        <p>Erro: {error}</p>
        <p className="text-sm mt-2">Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Projeção de Lucro</h2>
        <p className="text-gray-600 mb-6">
          Calcule o valor futuro do seu investimento em Bitcoin baseado em diferentes cenários de preço.
          Os valores serão atualizados automaticamente após o preenchimento de todos os campos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Valores Atuais</h3>
            <p className="text-gray-700">
              Bitcoin: {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(bitcoinUsd)}
            </p>
            <p className="text-gray-700">
              Dólar: {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(dolarReal)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Última atualização: {lastUpdate}
              {shouldUpdate && <span className="ml-2 text-green-600">(Atualização automática ativada)</span>}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Como usar</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Digite a quantidade de Bitcoin que você possui</li>
              <li>Insira o valor futuro estimado em dólares</li>
              <li>Insira o valor atual em reais</li>
              <li>Os resultados serão calculados automaticamente</li>
            </ul>
          </div>
        </div>

        <BitcoinProjection 
          bitcoinUsd={bitcoinUsd} 
          dolarReal={dolarReal} 
          onFieldsComplete={handleFieldsComplete}
        />
      </div>
    </div>
  );
};

export default Projection; 