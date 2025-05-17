import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area } from 'recharts';
import axios from 'axios';
import Loading from '../components/Loading';
import FearGreedIndex from '../components/FearGreedIndex';

interface Cotacao {
  moeda: string;
  valor: number;
  valorDolar?: number;
  variacao: number;
  data: string;
}

interface DataPoint {
  time: string;
  value: number;
}

type PeriodOption = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1A';

const PERIOD_OPTIONS: PeriodOption[] = ['1D', '5D', '1M', '6M', 'YTD', '1A'];

// Função para formatar números
const formatNumber = (value: number, currency: string = 'BRL') => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
};

// Função para formatar a variação
const formatVariacao = (variacao: number) => {
  return variacao.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'never'
  });
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-white px-3 py-2 shadow-lg border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600">{formatNumber(payload[0].value, payload[0].dataKey === 'valueUSD' ? 'USD' : 'BRL')} {label}</p>
      </div>
    );
  }
  return null;
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const calculateYAxisDomain = (data: DataPoint[], period: PeriodOption): [number, number] => {
  if (!data.length || !['1D', '5D', '1M'].includes(period)) {
    return ['auto' as any, 'auto' as any];
  }

  const values = data.map(point => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.05; // 5% de padding

  return [min - padding, max + padding];
};

const Home = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('1D');
  const [showAverage, setShowAverage] = useState(false);
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([
    {
      moeda: 'Dólar',
      valor: 5.20,
      variacao: 0,
      data: new Date().toLocaleString('pt-BR')
    },
    {
      moeda: 'Bitcoin',
      valor: 538158.26,
      valorDolar: 96700,
      variacao: 2.61,
      data: new Date().toLocaleString('pt-BR')
    }
  ]);

  const [graphDataUSD, setGraphDataUSD] = useState<DataPoint[]>([]);
  const [graphDataBRL, setGraphDataBRL] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getDaysForPeriod = (period: PeriodOption): number => {
    switch (period) {
      case '1D': return 1;
      case '5D': return 5;
      case '1M': return 30;
      case '6M': return 180;
      case 'YTD': {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
      }
      case '1A': return 365;
      default: return 1;
    }
  };

  const fetchWithRetry = async (url: string, retries = MAX_RETRIES): Promise<any> => {
    try {
      const response = await axios.get(url);
      console.log(`Sucesso na requisição para ${url}`, response.data);
      return response;
    } catch (error) {
      console.error(`Erro na requisição para ${url}:`, error);
      if (retries > 0) {
        console.log(`Tentando novamente... ${retries} tentativas restantes`);
        await sleep(RETRY_DELAY);
        return fetchWithRetry(url, retries - 1);
      }
      throw error;
    }
  };

  const fetchHistoricalData = async (period: PeriodOption) => {
    try {
      setIsLoading(true);
      setGraphDataUSD([]);
      setGraphDataBRL([]);
      
      const days = getDaysForPeriod(period);
      console.log(`Iniciando busca de dados históricos - Período: ${period}, Dias: ${days}`);
      
      // Usando a API da Binance para dados históricos
      const interval = period === '1D' ? '1m' : '1d';
      const endTime = Date.now();
      const startTime = endTime - (days * 24 * 60 * 60 * 1000);
      
      const btcUrl = `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${interval}&startTime=${startTime}&endTime=${endTime}`;
      console.log('Buscando dados do Bitcoin:', btcUrl);
      
      const btcResponse = await fetchWithRetry(btcUrl);

      if (!btcResponse.data || !Array.isArray(btcResponse.data)) {
        console.error('Resposta inválida da API da Binance:', btcResponse.data);
        throw new Error('Dados de preços não encontrados ou em formato inválido');
      }

      console.log(`Recebidos ${btcResponse.data.length} pontos de dados do Bitcoin`);

      // Processar dados USD
      const usdData = btcResponse.data.map((candle: any[]) => {
        const timestamp = candle[0];
        const price = parseFloat(candle[4]); // Usando o preço de fechamento
        const time = new Date(timestamp).toLocaleString('pt-BR', {
          hour: period === '1D' ? '2-digit' : undefined,
          minute: period === '1D' ? '2-digit' : undefined,
          day: '2-digit',
          month: '2-digit',
          year: period !== '1D' ? '2-digit' : undefined,
        });
        return {
          time,
          value: Number(price.toFixed(2))
        };
      });

      if (usdData.length === 0) {
        throw new Error('Nenhum dado processado para USD');
      }

      console.log('Dados USD processados:', usdData.length, 'pontos');
      console.log('Primeira entrada USD:', usdData[0]);
      console.log('Última entrada USD:', usdData[usdData.length - 1]);
      
      setGraphDataUSD(usdData);
      
      // Buscar cotação do dólar
      const dolarUrl = 'https://economia.awesomeapi.com.br/json/last/USD-BRL';
      console.log('Buscando cotação do dólar:', dolarUrl);
      
      const dolarResponse = await fetchWithRetry(dolarUrl);

      if (!dolarResponse.data?.USDBRL?.bid) {
        console.error('Resposta inválida da API do dólar:', dolarResponse.data);
        throw new Error('Cotação do dólar não encontrada');
      }

      const dolarValue = parseFloat(dolarResponse.data.USDBRL.bid);
      console.log('Cotação do dólar obtida:', dolarValue);
      
      // Processar dados BRL
      const brlData = usdData.map((point: DataPoint) => ({
        time: point.time,
        value: Number((point.value * dolarValue).toFixed(2))
      }));

      console.log('Dados BRL processados:', brlData.length, 'pontos');
      console.log('Primeira entrada BRL:', brlData[0]);
      console.log('Última entrada BRL:', brlData[brlData.length - 1]);

      setGraphDataBRL(brlData);
    } catch (error) {
      console.error('Erro ao buscar dados históricos:', error);
      setGraphDataUSD([]);
      setGraphDataBRL([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCotacoes = async () => {
    try {
      setIsLoading(true);
      
      // Buscar cotação do Bitcoin da Binance
      const btcResponse = await axios.get('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT');
      const btcUsdPrice = parseFloat(btcResponse.data.lastPrice);
      const btcChange = parseFloat(btcResponse.data.priceChangePercent);
      
      // Buscar cotação do dólar
      const dolarResponse = await axios.get('https://economia.awesomeapi.com.br/json/last/USD-BRL');
      const dolarData = dolarResponse.data.USDBRL;
      const dolarValue = parseFloat(dolarData.bid);

      const now = new Date();
      
      setCotacoes([
        {
          moeda: 'Dólar',
          valor: dolarValue,
          variacao: parseFloat(dolarData.pctChange),
          data: now.toLocaleString('pt-BR')
        },
        {
          moeda: 'Bitcoin',
          valor: btcUsdPrice * dolarValue,
          valorDolar: btcUsdPrice,
          variacao: btcChange,
          data: now.toLocaleString('pt-BR')
        }
      ]);
    } catch (error) {
      console.error('Erro ao buscar cotações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para calcular a média dos preços
  const calculateAverage = (data: DataPoint[]): number => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, point) => acc + point.value, 0);
    return sum / data.length;
  };

  // Modificar o useEffect para garantir que os dados sejam carregados
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('Carregando dados iniciais...');
        await fetchCotacoes();
        await fetchHistoricalData(selectedPeriod);
        console.log('Dados iniciais carregados com sucesso');
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      }
    };

    loadInitialData();

    const interval = setInterval(async () => {
      try {
        await fetchCotacoes();
      } catch (error) {
        console.error('Erro ao atualizar cotações:', error);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Efeito separado para atualizar dados históricos quando o período muda
  useEffect(() => {
    console.log('Período selecionado alterado para:', selectedPeriod);
    fetchHistoricalData(selectedPeriod);
  }, [selectedPeriod]);

  return (
    <div className="space-y-6 pt-8">
      <h2 className="text-3xl font-bold text-white mt-8">Cotações Atuais</h2>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cotacoes.map((cotacao) => (
              <div key={cotacao.moeda} className="bg-black/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg relative overflow-hidden border border-[#232323]">
                {/* Ícone de fundo */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {cotacao.moeda === 'Bitcoin' ? (
                    <svg className="w-32 h-32 text-[#f7931a]" viewBox="0 0 64 64" fill="currentColor">
                      <path d="M63.04 39.741c-4.274 17.143-21.638 27.575-38.783 23.301C7.12 58.768-3.313 41.404.962 24.262 5.234 7.117 22.597-3.317 39.737.957c17.144 4.274 27.576 21.64 23.302 38.784z" />
                      <path fill="#ffffff" d="M46.11 27.441c.636-4.258-2.606-6.547-7.039-8.074l1.438-5.768-3.512-.875-1.4 5.616c-.922-.23-1.87-.447-2.812-.662l1.41-5.653-3.509-.875-1.439 5.766c-.764-.174-1.514-.346-2.242-.527l.004-.018-4.842-1.209-.934 3.75s2.605.597 2.55.634c1.422.355 1.68 1.296 1.636 2.042l-1.638 6.571c.098.025.225.061.365.117l-.37-.092-2.297 9.205c-.174.432-.615 1.08-1.609.834.035.051-2.552-.637-2.552-.637l-1.743 4.02 4.57 1.139c.85.213 1.683.436 2.502.646l-1.453 5.835 3.507.875 1.44-5.772c.957.26 1.887.5 2.797.726L27.504 50.8l3.511.875 1.453-5.823c5.987 1.133 10.49.676 12.383-4.738 1.527-4.36-.075-6.875-3.225-8.516 2.294-.531 4.022-2.04 4.483-5.157zM38.087 38.69c-1.086 4.36-8.426 2.004-10.807 1.412l1.928-7.729c2.38.594 10.011 1.77 8.88 6.317zm1.085-11.312c-.99 3.966-7.1 1.951-9.083 1.457l1.748-7.01c1.983.494 8.367 1.416 7.335 5.553z" />
                    </svg>
                  ) : (
                    <svg className="w-32 h-32 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>

                {/* Conteúdo do cartão */}
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-white">{cotacao.moeda}</h3>
                  <p className="text-3xl font-bold text-[#f7931a] mt-2">
                    {formatNumber(cotacao.valor)}
                  </p>
                  {cotacao.moeda === 'Bitcoin' && cotacao.valorDolar && (
                    <p className="text-xl font-semibold text-gray-200 mt-1">
                      {formatNumber(cotacao.valorDolar, 'USD')}
                    </p>
                  )}
                  <p className={`mt-2 ${cotacao.variacao >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                    {cotacao.variacao >= 0 ? '↑' : '↓'} {formatVariacao(Math.abs(cotacao.variacao))}%
                    <span className="text-sm text-gray-300 ml-2">hoje</span>
                  </p>
                  {showAverage && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-600">Média do período ({selectedPeriod}):</p>
                      <p className="text-lg font-semibold text-[#f7931a]">
                        {cotacao.moeda === 'Bitcoin' 
                          ? formatNumber(calculateAverage(graphDataBRL))
                          : formatNumber(calculateAverage([{time: '', value: cotacao.valor}]))}
                      </p>
                      {cotacao.moeda === 'Bitcoin' && (
                        <p className="text-base font-semibold text-[#f7931a]">
                          {formatNumber(calculateAverage(graphDataUSD), 'USD')}
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-sm text-gray-300 mt-2">
                    Atualizado em: {cotacao.data}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <FearGreedIndex />
          </div>

          <div className="space-y-6">
            <div className="flex justify-start items-center space-x-2 overflow-x-auto pb-2">
              {PERIOD_OPTIONS.map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${selectedPeriod === period
                      ? 'bg-[#f7931a] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {period}
                </button>
              ))}
              <button
                onClick={() => setShowAverage(!showAverage)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${showAverage
                    ? 'bg-[#f7931a] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Média
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/60 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-[#232323]">
                <h3 className="text-lg font-semibold text-white mb-4">Bitcoin (USD)</h3>
                <div className="h-64">
                  {graphDataUSD.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={graphDataUSD}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f3f3" vertical={false} horizontal={false} />
                        <defs>
                          <linearGradient id="orange-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f7931a" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#f7931a" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={undefined}
                          fill="url(#orange-gradient)"
                          fillOpacity={1}
                          isAnimationActive={false}
                        />
                        <XAxis
                          dataKey="time"
                          tick={{ fill: '#666', fontSize: 12 }}
                          tickLine={{ stroke: '#666' }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis
                          domain={calculateYAxisDomain(graphDataUSD, selectedPeriod)}
                          tick={{ fill: '#666', fontSize: 12 }}
                          tickLine={{ stroke: '#666' }}
                          tickFormatter={(value) => formatNumber(value, 'USD')}
                        />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{ stroke: '#666', strokeDasharray: '3 3' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#f7931a"
                          strokeWidth={3}
                          dot={false}
                          activeDot={{ r: 6, fill: '#fff', stroke: '#f7931a', strokeWidth: 3 }}
                          isAnimationActive={false}
                          name="valueUSD"
                        />
                        {showAverage && (
                          <ReferenceLine
                            y={calculateAverage(graphDataUSD)}
                            stroke="#16a34a"
                            strokeDasharray="3 3"
                            label={{
                              value: `Média: ${formatNumber(calculateAverage(graphDataUSD), 'USD')}`,
                              fill: '#16a34a',
                              fontSize: 12,
                              position: 'right'
                            }}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      Sem dados disponíveis
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-black/60 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-[#232323]">
                <h3 className="text-lg font-semibold text-white mb-4">Bitcoin (BRL)</h3>
                <div className="h-64">
                  {graphDataBRL.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={graphDataBRL}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f3f3" vertical={false} horizontal={false} />
                        <defs>
                          <linearGradient id="orange-gradient2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f7931a" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#f7931a" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={undefined}
                          fill="url(#orange-gradient2)"
                          fillOpacity={1}
                          isAnimationActive={false}
                        />
                        <XAxis
                          dataKey="time"
                          tick={{ fill: '#666', fontSize: 12 }}
                          tickLine={{ stroke: '#666' }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis
                          domain={calculateYAxisDomain(graphDataBRL, selectedPeriod)}
                          tick={{ fill: '#666', fontSize: 12 }}
                          tickLine={{ stroke: '#666' }}
                          tickFormatter={(value) => formatNumber(value, 'BRL')}
                        />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{ stroke: '#666', strokeDasharray: '3 3' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#f7931a"
                          strokeWidth={3}
                          dot={false}
                          activeDot={{ r: 6, fill: '#fff', stroke: '#f7931a', strokeWidth: 3 }}
                          isAnimationActive={false}
                          name="valueBRL"
                        />
                        {showAverage && (
                          <ReferenceLine
                            y={calculateAverage(graphDataBRL)}
                            stroke="#16a34a"
                            strokeDasharray="3 3"
                            label={{
                              value: `Média: ${formatNumber(calculateAverage(graphDataBRL), 'BRL')}`,
                              fill: '#16a34a',
                              fontSize: 12,
                              position: 'right'
                            }}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      Sem dados disponíveis
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home; 