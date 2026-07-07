import React from 'react';

export default function Reglas() {
  return (
    <div className="bg-[#0b1120] min-h-screen text-white p-4 sm:p-6 pb-24 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Encabezado */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-emerald-400 uppercase tracking-widest mb-2">
            Reglas del Juego
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Estructura de puntuación oficial. Puntaje Máximo Posible: <span className="font-bold text-emerald-400">600 PUNTOS</span>.
          </p>
        </div>

        {/* 1. PUNTOS POR PARTIDOS */}
        <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
            <span className="text-emerald-400">⚽</span> Puntos por Partidos
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] sm:text-xs uppercase text-slate-400 border-b border-slate-700">
                  <th className="py-3 px-2 font-black">Fase</th>
                  <th className="py-3 px-2 font-black text-center">Acierto L-E-V</th>
                  <th className="py-3 px-2 font-black text-center">Diferencia Gol</th>
                  <th className="py-3 px-2 font-black text-center text-emerald-400">Marcador Exacto</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-slate-300">
                <tr className="border-b border-slate-700/50 hover:bg-slate-800 transition-colors">
                  <td className="py-3 px-2">Fase de Grupos</td>
                  <td className="py-3 px-2 text-center text-white font-bold">2 pts</td>
                  <td className="py-3 px-2 text-center text-white font-bold">1 pt</td>
                  <td className="py-3 px-2 text-center text-emerald-400 font-bold">1 pt</td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800 transition-colors">
                  <td className="py-3 px-2">Dieciseisavos (16avos)</td>
                  <td className="py-3 px-2 text-center text-white font-bold">3 pts</td>
                  <td className="py-3 px-2 text-center text-white font-bold">2 pts</td>
                  <td className="py-3 px-2 text-center text-emerald-400 font-bold">2 pts</td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800 transition-colors">
                  <td className="py-3 px-2">Cuartos y Octavos de Final</td>
                  <td className="py-3 px-2 text-center text-white font-bold">3 pts</td>
                  <td className="py-3 px-2 text-center text-white font-bold">2 pts</td>
                  <td className="py-3 px-2 text-center text-emerald-400 font-bold">2 pts</td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800 transition-colors">
                  <td className="py-3 px-2">Semifinales</td>
                  <td className="py-3 px-2 text-center text-white font-bold">4 pts</td>
                  <td className="py-3 px-2 text-center text-white font-bold">2 pts</td>
                  <td className="py-3 px-2 text-center text-emerald-400 font-bold">2 pts</td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800 transition-colors">
                  <td className="py-3 px-2">3er y 4to Lugar</td>
                  <td className="py-3 px-2 text-center text-white font-bold">3 pts</td>
                  <td className="py-3 px-2 text-center text-white font-bold">2 pts</td>
                  <td className="py-3 px-2 text-center text-emerald-400 font-bold">2 pts</td>
                </tr>
                <tr className="hover:bg-slate-800 transition-colors bg-emerald-900/10">
                  <td className="py-3 px-2 font-black text-emerald-400">FINAL</td>
                  <td className="py-3 px-2 text-center font-black text-white">5 pts</td>
                  <td className="py-3 px-2 text-center font-black text-white">3 pts</td>
                  <td className="py-3 px-2 text-center font-black text-emerald-400">3 pts</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 italic">
            * L-E-V: Acertar si gana el Local, hay Empate o gana la Visita. El puntaje es sumatorio si aciertas todo.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 2. PODIO Y PREMIOS */}
          <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
              <span className="text-amber-400">🏆</span> Podio y Premios
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Posiciones Finales (19 pts)</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex justify-between items-center"><span>Campeón Exacto</span> <span className="font-bold text-amber-400">10 pts</span></li>
                  <li className="flex justify-between items-center"><span>Subcampeón Exacto</span> <span className="font-bold text-slate-300">5 pts</span></li>
                  <li className="flex justify-between items-center"><span>Tercer Lugar Exacto</span> <span className="font-bold text-amber-600">4 pts</span></li>
                  <li className="text-xs text-emerald-400 mt-1">* Equipo dentro de los 3 primeros pero en posición incorrecta: <span className="font-bold">3 pts</span></li>
                </ul>
              </div>
              
              <div className="pt-4 border-t border-slate-700/50">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Galardones (15 pts)</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex justify-between items-center"><span>Goleador del Torneo</span> <span className="font-bold text-purple-400">5 pts</span></li>
                  <li className="flex justify-between items-center"><span>Mejor Jugador (MVP)</span> <span className="font-bold text-purple-400">5 pts</span></li>
                  <li className="flex justify-between items-center"><span>Mejor Arquero</span> <span className="font-bold text-purple-400">5 pts</span></li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. CLASIFICACIONES */}
          <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
              <span className="text-blue-400">📈</span> Clasificaciones
            </h2>
            
            <div className="space-y-3">
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <h3 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-1">Fase de Grupos (56 pts)</h3>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li className="flex justify-between"><span>Acertar el 1º clasificado (Exacto)</span> <span className="font-bold">1 pt</span></li>
                  <li className="flex justify-between"><span>Acertar el 2º clasificado (Exacto)</span> <span className="font-bold">1 pt</span></li>
                  <li className="flex justify-between"><span>Pasa a 16avos (por Grupo/Mejor 3º)</span> <span className="font-bold">1 pt</span></li>
                </ul>
              </div>

              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <h3 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-1">Dieciseisavos (48 pts)</h3>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li className="flex justify-between"><span>Equipo clasificado para Cuartos</span> <span className="font-bold">3 pts</span></li>
                </ul>
              </div>

              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <h3 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-1">Cuartos de Final (12 pts)</h3>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li className="flex justify-between"><span>Equipo clasificado para Semis</span> <span className="font-bold">3 pts</span></li>
                </ul>
              </div>

              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <h3 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-1">Semifinales (8 pts)</h3>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li className="flex justify-between"><span>Equipo clasificado para la Final</span> <span className="font-bold">4 pts</span></li>
                </ul>
              </div>

              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <h3 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-1">Definiciones Finales (8 pts)</h3>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li className="flex justify-between"><span>Equipo que logra el 3er puesto</span> <span className="font-bold">2 pts</span></li>
                  <li className="flex justify-between"><span>Equipo que logra el 1er lugar</span> <span className="font-bold">6 pts</span></li>
                </ul>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}