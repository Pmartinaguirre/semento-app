import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Importaciones de tus componentes
import Home from './components/Home';
import Pronosticos from './components/Pronosticos';
import Finales from './components/Finales';
import Campeones from './components/Campeones';
import Reglas from './components/Reglas';
import Ranking from './components/Ranking';
import Login from './components/Login';
import Admin from './components/Admin';
import Grandt from './components/Grandt';
import CargaRendimiento from './components/CargaRendimiento'; 
import AdminGranDT from './components/AdminGranDT'; 
import RankingGranDT from './components/RankingGranDT'; 
import SeccionTrivias from "./components/SeccionTrivias"; 

// ==========================================
// VISTA: ARENA MUNDIALERA (TRIVIAS)
// ==========================================
function TriviasView() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Leemos el usuario que ya inició sesión en tu app
    const user = localStorage.getItem('mi_usuario_id');
    setUsuario(user);
  }, []);

  return (
    <div className="pt-6 pb-24 min-h-screen">
      {usuario ? (
        <SeccionTrivias userId={usuario} />
      ) : (
        <div className="text-center text-slate-400 mt-20 p-4">
          <span className="text-5xl mb-4 block">🔒</span>
          <h2 className="text-2xl font-bold text-white mb-2">Inicia Sesión</h2>
          <p>Debes estar conectado con tu cuenta para jugar en la Arena Mundialera y ganar monedas.</p>
        </div>
      )}
    </div>
  );
}

// ==========================================
// BARRA DE NAVEGACIÓN INFERIOR (CON LOGIN)
// ==========================================
function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('mi_usuario_id');
    setUsuario(user);
  }, [location]);

  // Se oculta la barra en páginas de administración
  if (
    currentPath === '/admin' || 
    currentPath === '/carga-rendimiento' || 
    currentPath === '/admin-grandt'
  ) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
      <div className="flex justify-around items-center h-16 max-w-4xl mx-auto px-1">
        
        <Link to="/" className={`flex flex-col items-center transition-colors ${currentPath === '/' ? 'text-emerald-400' : 'text-slate-500'}`}>
          <span className="text-lg">🏠</span>
          <span className="text-[7px] font-black uppercase tracking-widest mt-1">Inicio</span>
        </Link>
        
        <Link to="/pronosticos" className={`flex flex-col items-center transition-colors ${currentPath === '/pronosticos' ? 'text-emerald-400' : 'text-slate-500'}`}>
          <span className="text-lg">⚽</span>
          <span className="text-[7px] font-black uppercase tracking-widest mt-1">Partidos</span>
        </Link>

        {/* NUEVO BOTÓN DE LA ARENA */}
        <Link to="/trivias" className={`flex flex-col items-center transition-colors ${currentPath === '/trivias' ? 'text-purple-400' : 'text-slate-500'}`}>
          <span className="text-lg">🧠</span>
          <span className="text-[7px] font-black uppercase tracking-widest mt-1">Arena</span>
        </Link>

        <Link to="/ranking" className={`flex flex-col items-center transition-colors ${currentPath === '/ranking' ? 'text-emerald-400' : 'text-slate-500'}`}>
          <span className="text-lg">📊</span>
          <span className="text-[7px] font-black uppercase tracking-widest mt-1">Ranking</span>
        </Link>

        <Link to="/campeones" className={`flex flex-col items-center transition-colors ${currentPath === '/campeones' ? 'text-emerald-400' : 'text-slate-500'}`}>
          <span className="text-lg">🏆</span>
          <span className="text-[7px] font-black uppercase tracking-widest mt-1">Campeones</span>
        </Link>

        <Link to="/finales" className={`flex flex-col items-center transition-colors ${currentPath === '/finales' ? 'text-amber-400' : 'text-slate-500'}`}>
          <span className="text-lg">🔥</span>
          <span className="text-[7px] font-black uppercase tracking-widest mt-1">Finales</span>
        </Link>

        <Link to="/grandt" className={`flex flex-col items-center transition-colors ${currentPath === '/grandt' ? 'text-blue-400' : 'text-slate-500'}`}>
          <span className="text-lg">📋</span>
          <span className="text-[7px] font-black uppercase tracking-widest mt-1">Grandt</span>
        </Link>

        <Link to="/login" className={`flex flex-col items-center transition-colors ${currentPath === '/login' ? 'text-emerald-400' : 'text-slate-500'}`}>
          <span className="text-lg">{usuario ? '👤' : '🔑'}</span>
          <span className="text-[7px] font-black uppercase tracking-widest mt-1">
            {usuario ? 'Cuenta' : 'Entrar'}
          </span>
        </Link>
        
      </div>
    </div>
  );
}

// ==========================================
// CONFIGURACIÓN DE RUTAS
// ==========================================
export default function App() {
  return (
    <Router>
      <div className="bg-[#0b1120] min-h-screen font-sans selection:bg-emerald-500/30">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/pronosticos" element={<Pronosticos />} />
          <Route path="/grandt" element={<Grandt />} />
          <Route path="/finales" element={<Finales />} />
          <Route path="/campeones" element={<Campeones />} />
          <Route path="/reglas" element={<Reglas />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/ranking-grandt" element={<RankingGranDT />} />
          <Route path="/carga-rendimiento" element={<Cargarendimiento />} />
          <Route path="/admin-grandt" element={<AdminGranDT />} /> 
          
          {/* NUEVA RUTA PARA LA ARENA DE TRIVIAS */}
          <Route path="/trivias" element={<TriviasView />} /> 
        </Routes>
        
        <BottomNav />
      </div>
    </Router>
  );
}