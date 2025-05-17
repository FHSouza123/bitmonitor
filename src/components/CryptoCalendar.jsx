import { useEffect, useState } from 'react';

const MOCK_EVENTS = [
  {
    id: 1,
    name: 'Ethereum São Paulo Meetup',
    description: 'Encontro da comunidade Ethereum em SP com palestras e networking.',
    date: '2024-07-20',
    url: 'https://www.meetup.com/ethereum-sao-paulo/'
  },
  {
    id: 2,
    name: 'Bitcoin Pizza Day',
    description: 'Celebração global do Bitcoin Pizza Day com eventos em várias cidades.',
    date: '2024-05-22',
    url: 'https://bitcoinpizzaday.com/'
  },
  {
    id: 3,
    name: 'Web3 Summit Rio',
    description: 'Conferência sobre Web3, DeFi e NFTs no Rio de Janeiro.',
    date: '2024-08-10',
    url: 'https://web3summit.com.br/'
  },
];

const API_URL = '/.netlify/functions/eventos';

const CryptoCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Erro na API');
        const data = await res.json();
        setEvents(data.events);
      } catch (err) {
        setEvents(MOCK_EVENTS);
        setError('Mostrando eventos mockados. Não foi possível buscar eventos reais.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="text-center py-8 text-gray-400">Carregando eventos...</div>;
  if (error) {
    // Mostra aviso, mas exibe eventos mockados
    return (
      <div>
        <div className="text-center py-2 text-yellow-500">{error}</div>
        <EventList events={events} />
      </div>
    );
  }

  return <EventList events={events} />;
};

const EventList = ({ events }) => {
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-white">Calendário de Eventos Cripto</h2>
      <ul className="space-y-4">
        {sortedEvents.map(event => (
          <li key={event.id} className="bg-[#181818] rounded-xl p-4 border border-[#232323] shadow">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-[#f7931a] hover:underline"
                >
                  {event.name}
                </a>
                <p className="text-gray-300 text-sm mb-2">{event.description}</p>
              </div>
              <span className="text-sm text-gray-400 font-medium mt-2 sm:mt-0">
                {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CryptoCalendar; 