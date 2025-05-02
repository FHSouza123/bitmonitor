import { useState, useEffect } from 'react';
import Loading from './Loading';

interface Noticia {
  title: string;
  url: string;
  source: {
    name: string;
  };
  publishedAt: string;
  description: string;
  urlToImage?: string;
}

const NoticiasCripto = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date>(new Date());

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          'https://newsapi.org/v2/everything?q=bitcoin OR criptomoeda OR blockchain&language=pt&sortBy=publishedAt&apiKey=00fba51f0e8243c8a483189b1e575212'
        );

        if (!response.ok) {
          throw new Error('Erro ao buscar notícias');
        }

        const data = await response.json();
        setNoticias(data.articles);
        setUltimaAtualizacao(new Date());
      } catch (err) {
        setError('Não foi possível carregar as notícias. Por favor, tente novamente mais tarde.');
        console.error('Erro ao buscar notícias:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Notícias sobre Criptomoedas</h2>
        <div className="text-sm text-gray-500">
          Última atualização: {formatarData(ultimaAtualizacao.toISOString())}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {noticias.map((noticia, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            {noticia.urlToImage && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={noticia.urlToImage}
                  alt={noticia.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}
            
            <div className="p-4 sm:p-6 flex flex-col flex-grow">
              <a
                href={noticia.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg sm:text-xl font-semibold text-blue-600 hover:text-blue-800 mb-2 line-clamp-2 hover:underline"
              >
                {noticia.title}
              </a>
              
              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3">
                <span className="font-medium">{noticia.source.name}</span>
                <span className="mx-2">•</span>
                <span>{formatarData(noticia.publishedAt)}</span>
              </div>
              
              <p className="text-sm sm:text-base text-gray-600 line-clamp-3 mb-4 flex-grow">
                {noticia.description}
              </p>

              <a
                href={noticia.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mt-auto"
              >
                Ler mais
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticiasCripto; 