import { Link } from 'react-router-dom';
import logoMundial from '../assets/logo.png'; 
import promoBanner from '../assets/Gemini_Generated_Image_ekftbfekftbfekft.png';

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function Home() {
  return (
    <div className="bg-[#0b1120] min-h-screen text-white p-4 sm:p-6 pb-24 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ========================================== */}
        {/* BLOQUE 1: BANNER PRINCIPAL                 */}
        {/* ========================================== */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0b1120] to-emerald-950 border border-emerald-500/20 shadow-2xl text-center p-8 sm:p-12">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <img 
              src={logoMundial} 
              alt="Logo Mundial 2026" 
              className="w-32 sm:w-48 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            />
            <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 italic tracking-tight">
              POLLA MUNDIAL 2026
            </h1>
            <p className="mt-3 text-sm sm:text-base font-bold tracking-[0.3em] text-emerald-500 uppercase">
              Powered by MARTIN GAMES
            </p>
          </div>
        </div>

        {/* ========================================== */}
        {/* INFO DE PAGOS Y EVENTO                     */}
        {/* ========================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col justify-center items-center text-center shadow-lg hover:border-emerald-500/50 transition-colors">
            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Cuota por Jugador</span>
            <span className="text-5xl font-black text-emerald-400">$15.000</span>
            <span className="text-xs text-slate-500 mt-2">Transferencia requerida para alta</span>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col justify-center hover:border-amber-500/50 transition-colors">
            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-3 text-center md:text-left">Premios y Evento</span>
            <ul className="space-y-2 text-sm text-slate-300 font-medium">
              <li className="flex items-center gap-2"><span className="text-amber-400">🏆</span> Premio al 1er, 2do y 3er lugar.</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">🎟️</span> Entrada para evento de premiación.</li>
              <li className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700 text-slate-400">
                <span className="text-blue-400">📅</span> Jueves 23 Julio 2026 - 20:00 hrs.
              </li>
            </ul>
          </div>
        </div>

        {/* ========================================== */}
        {/* BANNER PROMOCIONAL (REEMPLAZA AL PODIO)    */}
        {/* ========================================== */}
        <div className="mt-8 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative group cursor-pointer bg-slate-900">
          <img
            src={promoBanner}
            alt="Promoción Palco VIP Martin Games"
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          {/* Overlay sutil para integrar el banner con el fondo oscuro de la app */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent opacity-80 pointer-events-none"></div>
          
          {/* Botón flotante para invitar al usuario a ver el ranking completo */}
          <div className="absolute bottom-6 w-full text-center z-10">
            <Link to="/ranking" className="inline-block bg-slate-800/90 hover:bg-emerald-900/90 border border-slate-600 hover:border-emerald-500 transition-colors px-6 py-2 rounded-full text-xs font-bold text-white uppercase tracking-widest backdrop-blur-sm shadow-lg">
              Ver Ranking Actual &rarr;
            </Link>
          </div>
        </div>

        {/* ========================================== */}
        {/* REGLAS COMPLETAS DE LA POLLA               */}
        {/* ========================================== */}
        <div className="mt-12 bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-lg mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>

          <div className="text-center mb-8 relative z-10">
            <h2 className="text-3xl font-black text-emerald-400 tracking-wider uppercase mb-2">
              Reglas del Juego
            </h2>
            <p className="text-slate-300 text-lg">
              Demuestra cuánto sabes de fútbol. Puntaje Máximo Posible: <span className="font-black text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded">600 PUNTOS</span>.
            </p>
          </div>

          {/* 1. PUNTOS POR PARTIDOS */}
          <div className="mb-8 relative z-10">
            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
              <span className="text-emerald-400">⚽</span> Puntos por Partidos
            </h3>
            <div className="overflow-x-auto custom-scrollbar rounded-xl border border-slate-700">
              <table className="w-full text-left bg-slate-900/50">
                <thead className="bg-slate-900">
                  <tr className="text-xs uppercase text-slate-400 border-b border-slate-700">
                    <th className="py-4 px-4 font-black rounded-tl-lg">Fase del Torneo</th>
                    <th className="py-4 px-4 font-black text-center">L-E-V (Ganador/Empate)</th>
                    <th className="py-4 px-4 font-black text-center">Diferencia Gol</th>
                    <th className="py-4 px-4 font-black text-center text-emerald-400 rounded-tr-lg">Marcador Exacto</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-300 divide-y divide-slate-700/50">
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 font-bold">Fase de Grupos</td>
                    <td className="py-3 px-4 text-center font-bold text-white">+2 pts</td>
                    <td className="py-3 px-4 text-center font-bold text-white">+1 pt</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400">+1 pt</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 font-bold">Dieciseisavos (16avos)</td>
                    <td className="py-3 px-4 text-center font-bold text-white">+3 pts</td>
                    <td className="py-3 px-4 text-center font-bold text-white">+2 pts</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400">+2 pts</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 font-bold">Octavos y Cuartos</td>
                    <td className="py-3 px-4 text-center font-bold text-white">+3 pts</td>
                    <td className="py-3 px-4 text-center font-bold text-white">+2 pts</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400">+2 pts</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 font-bold">Semifinales y 3er Lugar</td>
                    <td className="py-3 px-4 text-center font-bold text-white">+4 pts / +3 pts</td>
                    <td className="py-3 px-4 text-center font-bold text-white">+2 pts</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400">+2 pts</td>
                  </tr>
                  <tr className="bg-emerald-900/20 hover:bg-emerald-900/40 transition-colors">
                    <td className="py-4 px-4 font-black text-emerald-400">LA GRAN FINAL</td>
                    <td className="py-4 px-4 text-center font-black text-white">+5 pts</td>
                    <td className="py-4 px-4 text-center font-black text-white">+3 pts</td>
                    <td className="py-4 px-4 text-center font-black text-emerald-400">+3 pts</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-2 italic">
              * El puntaje es sumatorio si aciertas todo (Ej: En grupos, un marcador exacto otorga 2+1+1 = 4 pts).
            </p>
          </div>

          {/* 2. GRID DE CLASIFICACIONES Y PODIO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
            
            {/* CLASIFICACIONES */}
            <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700">
              <h3 className="text-lg font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
                <span className="text-blue-400">📈</span> Puntos por Avance
              </h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex flex-col">
                  <span className="font-bold text-emerald-400 text-xs uppercase">Fase de Grupos</span>
                  <div className="flex justify-between border-b border-slate-700/50 py-1"><span>1º y 2º Clasificado Exacto</span> <span className="font-bold">+1 pt c/u</span></div>
                  <div className="flex justify-between border-b border-slate-700/50 py-1"><span>Pasa a 16avos (Cualquier vía)</span> <span className="font-bold">+1 pt</span></div>
                </li>
                <li className="flex flex-col mt-2">
                  <span className="font-bold text-emerald-400 text-xs uppercase">Fases Eliminatorias</span>
                  <div className="flex justify-between border-b border-slate-700/50 py-1"><span>Equipo avanza a Octavos/Cuartos</span> <span className="font-bold">+3 pts</span></div>
                  <div className="flex justify-between border-b border-slate-700/50 py-1"><span>Equipo avanza a Semis</span> <span className="font-bold">+3 pts</span></div>
                  <div className="flex justify-between border-b border-slate-700/50 py-1"><span>Equipo avanza a la Final</span> <span className="font-bold">+4 pts</span></div>
                  <div className="flex justify-between border-b border-slate-700/50 py-1"><span>Equipo gana 3er y 4to</span> <span className="font-bold">+5 pts</span></div>
                  <div className="flex justify-between border-b border-slate-700/50 py-1"><span>Equipo gana la Final</span> <span className="font-bold">+10 pts</span></div>
                </li>
              </ul>
            </div>

            {/* PODIO Y PREMIOS */}
            <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700">
              <h3 className="text-lg font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
                <span className="text-amber-400">🏆</span> Podio y Galardones
              </h3>
              <ul className="space-y-2 text-sm text-slate-300 mb-4">
                <li className="flex justify-between items-center bg-slate-800 p-2 rounded"><span>Campeón Exacto</span> <span className="font-black text-amber-400">+10 pts</span></li>
                <li className="flex justify-between items-center bg-slate-800 p-2 rounded"><span>Subcampeón Exacto</span> <span className="font-black text-slate-300">+5 pts</span></li>
                <li className="flex justify-between items-center bg-slate-800 p-2 rounded"><span>Tercer Lugar Exacto</span> <span className="font-black text-amber-600">+4 pts</span></li>
                <li className="text-[11px] text-emerald-400 italic px-1">* Si el equipo está en el Top 3 pero en posición incorrecta: +3 pts</li>
              </ul>
              
              <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest mb-2 mt-4">Premios Individuales</h4>
              <ul className="space-y-1 text-sm text-slate-300">
                <li className="flex justify-between border-b border-slate-700/50 py-1"><span>Goleador del Torneo</span> <span className="font-bold text-purple-400">+5 pts</span></li>
                <li className="flex justify-between border-b border-slate-700/50 py-1"><span>Mejor Jugador (MVP)</span> <span className="font-bold text-purple-400">+5 pts</span></li>
                <li className="flex justify-between border-b border-slate-700/50 py-1"><span>Mejor Arquero</span> <span className="font-bold text-purple-400">+5 pts</span></li>
              </ul>
            </div>

          </div>

          {/* DETALLES IMPORTANTES */}
          <div className="mt-8 bg-amber-500/10 p-5 rounded-xl border border-amber-500/30 relative z-10">
            <h3 className="text-amber-400 font-bold mb-3 uppercase tracking-wider text-sm flex items-center gap-2">
              📌 Detalles importantes
            </h3>
            <ul className="list-disc list-inside text-sm text-slate-300 space-y-2">
              <li>Para 16avos en adelante si hay empate en los 90 minutos, se considera como resultado final lo que resulte incluyendo el alargue.</li>
              <li>La tabla de posiciones se ordena con los siguientes criterios. En caso de haber igualdad en Puntos se ordena por: 1) Mayor cantidad de LEV. 2) Mayor cantidad de marcadores exactos. 3) Mayor diferencia de gol.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}