import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const mockPlaces = [
  { name: 'Restaurante Satoshi', lat: -23.55052, lng: -46.633308, cidade: 'São Paulo', descricao: 'Aceita Bitcoin e Ethereum para pagamento.' },
  { name: 'Café Blockchain', lat: -22.906847, lng: -43.172896, cidade: 'Rio de Janeiro', descricao: 'Café temático com pagamentos em cripto.' },
  { name: 'Loja CriptoSul', lat: -30.034647, lng: -51.217658, cidade: 'Porto Alegre', descricao: 'Loja de eletrônicos que aceita várias criptomoedas.' },
  { name: 'Bar CriptoNorte', lat: -3.119027, lng: -60.021731, cidade: 'Manaus', descricao: 'Bar que aceita pagamentos em Bitcoin.' },
  { name: 'Mercado BitFloripa', lat: -27.595377, lng: -48.54805, cidade: 'Florianópolis', descricao: 'Mercado local que aceita cripto.' }
];

const CryptoMap = () => {
  useEffect(() => {
    const map = L.map('crypto-map').setView([-14.235, -51.9253], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    mockPlaces.forEach(place => {
      const marker = L.marker([place.lat, place.lng]).addTo(map);
      marker.bindPopup(
        `<b>${place.name}</b><br/>${place.cidade}<br/>${place.descricao}`
      );
    });

    return () => map.remove();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-white">Mapa de Locais que Aceitam Criptomoedas</h2>
      <div id="crypto-map" className="w-full h-[400px] rounded-xl border border-[#232323] shadow" />
    </div>
  );
};

export default CryptoMap; 