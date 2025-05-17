import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import places from '../crypto_places.json';

const CryptoMap = () => {
  useEffect(() => {
    const map = L.map('crypto-map').setView([-14.235, -51.9253], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    places.forEach(place => {
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