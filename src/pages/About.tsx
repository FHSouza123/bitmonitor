const About = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pt-24">
      <h2 className="text-2xl md:text-3xl font-bold text-white px-4 sm:px-0">Sobre o BitMonitor</h2>
      
      <div className="bg-[#181818] p-4 md:p-6 rounded-2xl shadow-lg space-y-6 mx-4 sm:mx-0 border border-[#232323]">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-[#f7931a] mb-3">Visão Geral</h3>
          <p className="text-sm md:text-base text-gray-200">
            O BitMonitor é uma plataforma completa para acompanhamento do mercado de criptomoedas, 
            fornecendo informações em tempo real, análises avançadas e ferramentas de projeção para 
            investidores e entusiastas do mercado cripto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-[#f7931a] mb-3">Recursos Principais</h3>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-200">
              <li className="flex items-start">
                <span className="font-medium min-w-[140px] md:min-w-[160px] inline-block">Ticker em Tempo Real:</span>
                <span className="flex-1">Acompanhe as 20 principais criptomoedas por capitalização de mercado</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium min-w-[140px] md:min-w-[160px] inline-block">Análise Técnica:</span>
                <span className="flex-1">Gráficos interativos com múltiplos períodos de tempo</span>
              </li>
              <li className="flex flex-col sm:flex-row items-start">
                <span className="font-medium min-w-[140px] md:min-w-[160px] inline-block whitespace-nowrap">Índice Medo & Ganância:</span>
                <span className="flex-1 mt-1 sm:mt-0 sm:ml-2">Análise do sentimento do mercado atualizada diariamente</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium min-w-[140px] md:min-w-[160px] inline-block">Projeções:</span>
                <span className="flex-1">Ferramentas para simulação de cenários e retornos</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium min-w-[140px] md:min-w-[160px] inline-block">Feed de Notícias:</span>
                <span className="flex-1">Últimas notícias do mercado cripto em português</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium min-w-[140px] md:min-w-[160px] inline-block">Análise de ETFs:</span>
                <span className="flex-1">Acompanhamento dos principais ETFs de Bitcoin</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-[#f7931a] mb-3">Fontes de Dados</h3>
              <p className="text-sm md:text-base text-gray-200 mb-2">
                Utilizamos APIs confiáveis e reconhecidas do mercado:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-gray-200">
                <li>CoinGecko - Dados de criptomoedas e rankings</li>
                <li>Binance - Cotações em tempo real</li>
                <li>Alternative.me - Índice Medo & Ganância</li>
                <li>NewsAPI - Feed de notícias</li>
                <li>AwesomeAPI - Cotações do dólar</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg md:text-xl font-semibold text-[#f7931a] mb-3">Tecnologias</h3>
              <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-gray-200">
                <li>React com TypeScript</li>
                <li>TailwindCSS para estilização</li>
                <li>Recharts para gráficos interativos</li>
                <li>APIs RESTful para integração de dados</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[#232323] pt-6">
          <h3 className="text-lg md:text-xl font-semibold text-[#f7931a] mb-3">Atualizações</h3>
          <p className="text-sm md:text-base text-gray-200">
            O BitMonitor está em constante evolução, com atualizações frequentes para trazer novos 
            recursos e melhorias. Fique atento às novidades e atualizações da plataforma.
          </p>
        </div>

        <div className="pt-4 border-t border-[#232323]">
          <p className="text-xs md:text-sm text-gray-400 text-center">
            © 2024 BitMonitor - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
};

export default About; 