import { useState, useEffect } from 'react';
import Loading from './Loading';
import { supabase } from '../services/supabaseClient';

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

        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error('Erro ao buscar notícias');
        }

        console.log('Notícias recebidas do Supabase:', data);
        const noticiasTratadas = (data || []).map((noticia: any) => ({
          ...noticia,
          source: noticia.source || { name: 'Fonte desconhecida' }
        }));
        setNoticias(noticiasTratadas);
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
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Notícias sobre Criptomoedas</h2>
        <div className="text-sm text-gray-300">
          Última atualização: {formatarData(ultimaAtualizacao.toISOString())}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {noticias.map((noticia, index) => (
          <div
            key={index}
            className="bg-[#181818] rounded-2xl shadow-lg border border-[#232323] overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
            onClick={() => window.open(noticia.url, '_blank')}
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
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{noticia.title}</h3>
              <p className="text-sm text-gray-300 mb-4 flex-1 line-clamp-3">{noticia.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-gray-400">{noticia.source?.name || 'Fonte desconhecida'}</span>
                <span className="text-xs text-gray-400">{formatarData(noticia.publishedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticiasCripto; 