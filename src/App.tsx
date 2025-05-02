import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import Projection from './pages/Projection';
import NoticiasCripto from './components/NoticiasCripto';
import SplashScreen from './components/SplashScreen';
import CryptoTicker from './components/CryptoTicker';
import AnaliseAvancadaBTC from './components/AnaliseAvancadaBTC';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <Router>
      {showSplash ? (
        <SplashScreen />
      ) : (
      <div className="min-h-screen bg-gray-100">
          <header className="fixed-header">
            <nav className="bg-[#f7931a] text-white p-4">
              <div className="container mx-auto">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl md:text-2xl font-bold flex items-center">
                    <span className="inline-flex items-center">
                      <svg className="w-6 h-6 md:w-8 md:h-8 mr-1" viewBox="0 0 64 64" fill="currentColor">
                        <path d="M63.04 39.741c-4.274 17.143-21.638 27.575-38.783 23.301C7.12 58.768-3.313 41.404.962 24.262 5.234 7.117 22.597-3.317 39.737.957c17.144 4.274 27.576 21.64 23.302 38.784z" />
                        <path fill="#1a2332" d="M46.11 27.441c.636-4.258-2.606-6.547-7.039-8.074l1.438-5.768-3.512-.875-1.4 5.616c-.922-.23-1.87-.447-2.812-.662l1.41-5.653-3.509-.875-1.439 5.766c-.764-.174-1.514-.346-2.242-.527l.004-.018-4.842-1.209-.934 3.75s2.605.597 2.55.634c1.422.355 1.68 1.296 1.636 2.042l-1.638 6.571c.098.025.225.061.365.117l-.37-.092-2.297 9.205c-.174.432-.615 1.08-1.609.834.035.051-2.552-.637-2.552-.637l-1.743 4.02 4.57 1.139c.85.213 1.683.436 2.502.646l-1.453 5.835 3.507.875 1.44-5.772c.957.26 1.887.5 2.797.726L27.504 50.8l3.511.875 1.453-5.823c5.987 1.133 10.49.676 12.383-4.738 1.527-4.36-.075-6.875-3.225-8.516 2.294-.531 4.022-2.04 4.483-5.157zM38.087 38.69c-1.086 4.36-8.426 2.004-10.807 1.412l1.928-7.729c2.38.594 10.011 1.77 8.88 6.317zm1.085-11.312c-.99 3.966-7.1 1.951-9.083 1.457l1.748-7.01c1.983.494 8.367 1.416 7.335 5.553z" />
                      </svg>
                      <span>it</span>
                    </span>
                    Monitor
                  </h1>

                  {/* Botão do Menu Mobile */}
                  <button
                    className="md:hidden p-2 focus:outline-none"
                    onClick={toggleMenu}
                    aria-label="Menu"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {isMenuOpen ? (
                        <path d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>

                  {/* Menu Desktop */}
                  <ul className="hidden md:flex space-x-6">
                    <li>
                      <Link to="/" className="hover:text-white/80 flex flex-col items-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-sm mt-1">Início</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/projecao" className="hover:text-white/80 flex flex-col items-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                        <span className="text-sm mt-1">Projeção</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/analise" className="hover:text-white/80 flex flex-col items-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-sm mt-1">Análise</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/noticias" className="hover:text-white/80 flex flex-col items-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15M9 11l3 3m0 0l3-3m-3 3V8" />
                        </svg>
                        <span className="text-sm mt-1">Notícias</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/sobre" className="hover:text-white/80 flex flex-col items-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm mt-1">Sobre</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Menu Mobile */}
                <div
                  className={`md:hidden fixed inset-0 z-50 bg-[#f7931a] transform transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                  }`}
                >
                  <div className="flex justify-between items-center p-4">
                    <h1 className="text-xl font-bold">BitMonitor</h1>
                    <button
                      className="p-2 focus:outline-none"
                      onClick={toggleMenu}
                      aria-label="Fechar menu"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <ul className="flex flex-col space-y-4 p-4">
                    <li>
                      <Link
                        to="/"
                        className="flex items-center space-x-4 text-lg"
                        onClick={closeMenu}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Início</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/projecao"
                        className="flex items-center space-x-4 text-lg"
                        onClick={closeMenu}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                        <span>Projeção</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/analise"
                        className="flex items-center space-x-4 text-lg"
                        onClick={closeMenu}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>Análise</span>
                      </Link>
              </li>
              <li>
                      <Link
                        to="/noticias"
                        className="flex items-center space-x-4 text-lg"
                        onClick={closeMenu}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15M9 11l3 3m0 0l3-3m-3 3V8" />
                        </svg>
                        <span>Notícias</span>
                      </Link>
              </li>
              <li>
                      <Link
                        to="/sobre"
                        className="flex items-center space-x-4 text-lg"
                        onClick={closeMenu}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Sobre</span>
                      </Link>
              </li>
            </ul>
                </div>
          </div>
        </nav>
            <CryptoTicker />
          </header>

          <main className="main-content container mx-auto px-4 py-6 max-w-7xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projecao" element={<Projection />} />
              <Route path="/analise" element={<AnaliseAvancadaBTC />} />
              <Route path="/noticias" element={<NoticiasCripto />} />
            <Route path="/sobre" element={<About />} />
          </Routes>
        </main>
      </div>
      )}
    </Router>
  );
}

export default App; 