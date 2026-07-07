import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { calcularPuntosGranDT } from './Grandt'; // Importamos la función lógica que ya creamos

export default function RankingGranDT() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function calcularRanking() {
      setLoading(true);

      // 1. Traer todos los equipos, todos los partidos y todas las estadísticas
      const { data: equipos } = await supabase.from('equipos_grandt').select('*');
      const { data: partidos } = await supabase.from('partidos').select('*');
      const { data: stats } = await supabase.from('gran_dt_estadisticas').select('*');
      const { data: jugadores } = await supabase.from('jugadores').select('*');

      if (equipos && partidos && stats && jugadores) {
        const listaRanking = equipos.map(eq => {
          const idsTitulares = eq.titulares_ids ? eq.titulares_ids.split(',').map(Number) : [];
          let totalPuntos = 0;

          // Por cada titular, buscamos sus estadísticas en todos los partidos
          idsTitulares.forEach(jId => {
            const jugador = jugadores.find(j => j.id === jId);
            if (!jugador) return;

            // Sumamos puntos de este jugador en todos los partidos que haya jugado
            stats.forEach(st => {
              if (st.jugador_id === jId) {
                const partido = partidos.find(p => p.id === st.partido_id);
                const esCapitan = (eq.capitan_id === jId);
                totalPuntos += calcularPuntosGranDT(jugador, st, partido, esCapitan);
              }
            });
          });

          return { usuario_id: eq.usuario_id, puntos: totalPuntos };
        });

        // Ordenar de mayor a menor
        setRanking(listaRanking.sort((a, b) => b.puntos - a.puntos));
      }
      setLoading(false);
    }
    calcularRanking();
  }, []);

  if (loading) return <div className="text-white text-center p-10">Calculando puntajes...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto text-white">
      <h2 className="text-2xl font-black text-center text-blue-400 mb-6">RANKING GRAN DT</h2>
      <div className="bg-slate-800 rounded-xl p-4">
        {ranking.map((r, i) => (
          <div key={r.usuario_id} className="flex justify-between p-3 border-b border-slate-700 last:border-0">
            <span className="font-bold">{i + 1}º Jugador {r.usuario_id.substring(0, 8)}</span>
            <span className="font-black text-emerald-400">{r.puntos} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}