import { useState, useEffect } from 'react';

interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update: number;
}

const translateClassification = (classification: string): string => {
  switch (classification.toLowerCase()) {
    case 'extreme fear':
      return 'Medo Extremo';
    case 'fear':
      return 'Medo';
    case 'neutral':
      return 'Neutro';
    case 'greed':
      return 'Ganância';
    case 'extreme greed':
      return 'Ganância Extrema';
    default:
      return classification;
  }
};

const GaugeMeter = ({ value }: { value: number }) => {
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  const angle = (normalizedValue * 180) / 100;
  const rotation = angle - 90;
  
  const centerX = 110;
  const centerY = 110;
  const radius = 80;
  
  // Calculando os pontos do arco
  const startX = centerX - radius;
  const endX = centerX + radius;
  const arcPath = `M ${startX} ${centerY} A ${radius} ${radius} 0 0 1 ${endX} ${centerY}`;
  
  return (
    <div className="relative w-[180px] sm:w-[220px] h-[100px] sm:h-[120px] mx-auto">
      <svg
        viewBox="0 0 220 120"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="gauge-gradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#ff4444" />
            <stop offset="33%" stopColor="#ffba00" />
            <stop offset="100%" stopColor="#00b800" />
          </linearGradient>
        </defs>

        {/* Barra do medidor */}
        <path
          d={arcPath}
          fill="none"
          stroke="url(#gauge-gradient)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Ponteiro */}
        <g transform={`rotate(${rotation}, ${centerX}, ${centerY})`}>
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX}
            y2={centerY - 60}
            stroke="#333333"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        {/* Círculo central */}
        <circle
          cx={centerX}
          cy={centerY}
          r="12"
          fill="#f7931a"
        />

        {/* Símbolo do Bitcoin */}
        <text
          x={centerX}
          y={centerY + 4}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="12"
          fontWeight="bold"
        >
          ₿
        </text>

        {/* Marcadores de escala */}
        <g style={{ opacity: 0.3 }}>
          <line x1={startX} y1={centerY + 5} x2={startX} y2={centerY - 5} stroke="#666" strokeWidth="2" />
          <line x1={centerX} y1={centerY + 5} x2={centerX} y2={centerY - 5} stroke="#666" strokeWidth="2" />
          <line x1={endX} y1={centerY + 5} x2={endX} y2={centerY - 5} stroke="#666" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};

const FearGreedIndex = () => {
  const [currentData, setCurrentData] = useState<FearGreedData | null>(null);
  const [historicalData, setHistoricalData] = useState<FearGreedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.alternative.me/fng/?limit=4');
        if (!response.ok) throw new Error('Falha ao buscar dados');
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          setCurrentData(data.data[0]);
          setHistoricalData(data.data.slice(1));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getColorClass = (classification: string): string => {
    switch (classification.toLowerCase()) {
      case 'extreme fear':
        return 'text-red-600';
      case 'fear':
        return 'text-orange-500';
      case 'neutral':
        return 'text-yellow-500';
      case 'greed':
        return 'text-green-500';
      case 'extreme greed':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBgColorClass = (classification: string): string => {
    switch (classification.toLowerCase()) {
      case 'extreme fear':
        return 'bg-red-600';
      case 'fear':
        return 'bg-orange-500';
      case 'neutral':
        return 'bg-yellow-500';
      case 'greed':
        return 'bg-green-500';
      case 'extreme greed':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const formatTimeUntilUpdate = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours}h ${minutes}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 sm:p-6">
        <div className="animate-pulse text-gray-600">
          Carregando índice Medo & Ganância...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 mx-4 sm:mx-0">
        <p>Erro: {error}</p>
        <p className="text-sm mt-2">Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  if (!currentData) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Card Principal */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm sm:text-base">₿</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Índice Medo & Ganância</h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 capitalize">
          análise multifatorial do sentimento do mercado cripto
        </p>

        <div className="space-y-4">
          <GaugeMeter value={parseInt(currentData.value)} />
          
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1">
              {currentData.value}
            </div>
            <div className={`text-lg sm:text-xl font-medium ${getColorClass(currentData.value_classification)}`}>
              {translateClassification(currentData.value_classification)}
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center mt-4">
          <p>Última atualização: {new Date(parseInt(currentData.timestamp) * 1000).toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {/* Card de Valores Históricos */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Valores históricos</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base">Agora</span>
            <div className="flex items-center space-x-2">
              <span className={`${getColorClass(currentData.value_classification)} text-sm sm:text-base`}>
                {translateClassification(currentData.value_classification)}
              </span>
              <span className={`${getBgColorClass(currentData.value_classification)} text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-base`}>
                {currentData.value}
              </span>
            </div>
          </div>
          {historicalData.slice(0, 3).map((data, index) => (
            <div key={data.timestamp} className="flex justify-between items-center">
              <span className="text-sm sm:text-base">
                {index === 0 ? 'Ontem' : index === 1 ? 'Semana passada' : 'Mês passado'}
              </span>
              <div className="flex items-center space-x-2">
                <span className={`${getColorClass(data.value_classification)} text-sm sm:text-base`}>
                  {translateClassification(data.value_classification)}
                </span>
                <span className={`${getBgColorClass(data.value_classification)} text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-base`}>
                  {data.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card de Próxima Atualização */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Próxima atualização</h2>
        <div className="space-y-2">
          <p className="text-base sm:text-lg">
            A próxima atualização acontecerá em:
          </p>
          <p className="text-xl sm:text-2xl font-medium">
            {formatTimeUntilUpdate(currentData.time_until_update)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FearGreedIndex; 