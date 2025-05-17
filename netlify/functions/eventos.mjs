export async function handler(event, context) {
  // Eventos mockados a partir de maio de 2025
  const events = [
    {
      id: 1,
      name: "Bitcoin Pizza Day 2025",
      description: "Comemoração anual da primeira compra com Bitcoin.",
      date: "2025-05-22",
      url: "https://bitcoinpizzaday.com"
    },
    {
      id: 2,
      name: "Ethereum Devcon 2025",
      description: "Conferência global de desenvolvedores Ethereum.",
      date: "2025-10-15",
      url: "https://devcon.org"
    },
    {
      id: 3,
      name: "Halving do Bitcoin 2028",
      description: "Evento que reduz a recompensa dos mineradores pela metade.",
      date: "2028-04-20",
      url: "https://www.bitcoinblockhalf.com/"
    },
    {
      id: 4,
      name: "Binance Blockchain Week 2025",
      description: "Evento global sobre blockchain promovido pela Binance.",
      date: "2025-06-10",
      url: "https://www.binance.com/en/events/binance-blockchain-week"
    },
    {
      id: 5,
      name: "Cardano Summit 2025",
      description: "Encontro anual da comunidade Cardano.",
      date: "2025-09-20",
      url: "https://summit.cardano.org/"
    },
    {
      id: 6,
      name: "Solana Breakpoint 2025",
      description: "Conferência internacional da comunidade Solana.",
      date: "2025-11-05",
      url: "https://breakpoint.solana.com/"
    },
    {
      id: 7,
      name: "Web3 Brasil Conference 2025",
      description: "Maior evento de Web3 e cripto do Brasil.",
      date: "2025-08-15",
      url: "https://web3brasil.com/"
    },
    {
      id: 8,
      name: "NFT Rio 2025",
      description: "Evento dedicado ao universo dos NFTs no Brasil.",
      date: "2025-07-12",
      url: "https://nftrio.io/"
    },
    {
      id: 9,
      name: "Consensus by CoinDesk 2025",
      description: "Um dos maiores eventos de cripto e blockchain do mundo.",
      date: "2025-05-29",
      url: "https://consensus.coindesk.com/"
    },
    {
      id: 10,
      name: "ETHGlobal Hackathon 2025",
      description: "Maratona de desenvolvimento focada em Ethereum e Web3.",
      date: "2025-09-01",
      url: "https://ethglobal.com/"
    }
  ];

  return {
    statusCode: 200,
    body: JSON.stringify({ events }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  };
} 