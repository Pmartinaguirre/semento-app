import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminGranDT() {
  const [partidos, setPartidos] = useState([]);
  const [selectedPartido, setSelectedPartido] = useState('');
  const [partidoActual, setPartidoActual] = useState(null);
  
  const [jugadoresLocal, setJugadoresLocal] = useState([]);
  const [jugadoresVisita, setJugadoresVisita] = useState([]);
  const [stats, setStats] = useState({});
  const [faseActual, setFaseActual] = useState(1);
  const [loading, setLoading] = useState(false);

  // 1. Cargar Partidos y Fase actual al montar
  useEffect(() => {
    async function init() {
      const { data: p } = await supabase.from('partidos').select('*').order('id');
      if (p) setPartidos(p);

      const { data: config } = await supabase.from('configuracion').select('estado').eq('nombre', 'fase_actual_gran_dt').single();
      if (config) setFaseActual(parseInt(config.estado) || 1);
    }
    init();
  }, []);

  // 2. Cargar jugadores y estadísticas cuando se selecciona un partido
  useEffect(() => {
    async function cargarDatosPartido() {
      if (!selectedPartido) {
        setPartidoActual(null);
        setJugadoresLocal([]);
        setJugadoresVisita([]);
        setStats({});
        return;
      }

      setLoading(true);
      const partido = partidos.find(p => p.id.toString() === selectedPartido);
      setPartidoActual(partido);

      // Traer todos los jugadores de esos dos países
      const { data: jugadoresDb } = await supabase
        .from('jugadores')
        .select('*')
        .in('pais', [partido.equipo_local, partido.equipo_visita])
        .order('posicion'); // Opcional: ordenar por arquero, defensa, etc.

      if (jugadoresDb) {
        setJugadoresLocal(jugadoresDb.filter(j => j.pais === partido.equipo_local));
        setJugadoresVisita(jugadoresDb.filter(j => j.pais === partido.equipo_visita));
      }

      // Traer las estadísticas previas si ya se habían guardado
      const { data: statsDb } = await supabase
        .from('gran_dt_estadisticas')
        .select('*')
        .eq('partido_id', partido.id);

      const statsMap = {};
      if (statsDb) {
        statsDb.forEach(st => {
          statsMap[st.jugador_id] = st;
        });
      }
      setStats(statsMap);
      setLoading(false);
    }

    cargarDatosPartido();
  }, [selectedPartido, partidos]);

  // Manejar el cambio en los inputs
  const handleStatChange = (jugadorId, campo, valor) => {
    setStats(prev => ({
      ...prev,
      [jugadorId]: {
        ...prev[jugadorId],
        [campo]: valor
      }
    }));
  };

  // 3. Guardar las estadísticas en Supabase
  const guardarEstadisticas = async () => {
    if (!selectedPartido) return;
    setLoading(true);

    // Convertir el objeto stats en un array para hacer un upsert masivo
    const payload = Object.keys(stats).map(jugadorId => {
      const s = stats[jugadorId];
      // Solo enviamos si el jugador realmente tiene algún dato (para no llenar la BD de ceros inútiles)
      return {
        partido_id: parseInt(selectedPartido),
        jugador_id: parseInt(jugadorId),
        fase_numero: faseActual,
        minutos_jugados: s.minutos_jugados || 0,
        goles: s.goles || 0,
        asistencias: s.asistencias || 0,
        tarjeta_amarilla: s.tarjeta_amarilla || 0,
        tarjeta_roja: s.tarjeta_roja || 0,
        valla_invicta: s.valla_invicta || false,
        figura_partido: s.figura_partido || false
      };
    }).filter(row => 
      // Filtro: Solo guardamos si jugó al menos 1 minuto o tiene algún otro dato
      row.minutos_jugados > 0 || row.goles > 0 || row.asistencias > 0 || row.tarjeta_amarilla > 0 || row.tarjeta_roja > 0 || row.valla_invicta || row.figura_partido
    );

    if (payload.length === 0) {
      alert("No hay estadísticas con valores mayores a cero para guardar.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('gran_dt_estadisticas')
      .upsert(payload, { onConflict: 'partido_id, jugador_id' });

    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      alert("✅ ¡Estadísticas del Gran DT guardadas con éxito!");
    }
    setLoading(false);
  };

  // Componente de Fila para cada Jugador (Mantiene el código limpio)
  const FilaJugador = ({ jugador }) => {
    const s = stats[jugador.id] || {};
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-800 p-2 rounded border border-slate-700 gap-2 hover:bg-slate-700 transition-colors">
        <div className="w-full sm:w-1/3 flex flex-col">
          <span className="font-bold text-[11px] text-white truncate">{jugador.nombrecompleto}</span>
          <span className="text-[9px] text-slate-400 font-black">{jugador.posicion} | {jugador.pais}</span>
        </div>
        
        <div className="w-full sm:w-2/3 grid grid-cols-7 gap-1 items-center text-center">
          <input title="Minutos Jugados" type="number" min="0" max="120" placeholder="Min" className="w-full h-8 bg-slate-900 border border-slate-600 rounded text-xs font-bold text-center text-white" value={s.minutos_jugados || ''} onChange={e => handleStatChange(jugador.id, 'minutos_jugados', parseInt(e.target.value) || 0)} />
          <input title="Goles" type="number" min="0" placeholder="Gol" className="w-full h-8 bg-slate-900 border border-emerald-600 rounded text-xs font-bold text-center text-emerald-400" value={s.goles || ''} onChange={e => handleStatChange(jugador.id, 'goles', parseInt(e.target.value) || 0)} />
          <input title="Asistencias" type="number" min="0" placeholder="Asi" className="w-full h-8 bg-slate-900 border border-blue-600 rounded text-xs font-bold text-center text-blue-400" value={s.asistencias || ''} onChange={e => handleStatChange(jugador.id, 'asistencias', parseInt(e.target.value) || 0)} />
          <input title="Amarillas" type="number" min="0" max="2" placeholder="TA" className="w-full h-8 bg-slate-900 border border-amber-500 rounded text-xs font-bold text-center text-amber-500" value={s.tarjeta_amarilla || ''} onChange={e => handleStatChange(jugador.id, 'tarjeta_amarilla', parseInt(e.target.value) || 0)} />
          <input title="Rojas" type="number" min="0" max="1" placeholder="TR" className="w-full h-8 bg-slate-900 border border-red-600 rounded text-xs font-bold text-center text-red-500" value={s.tarjeta_roja || ''} onChange={e => handleStatChange(jugador.id, 'tarjeta_roja', parseInt(e.target.value) || 0)} />
          
          <div title="Valla Invicta (Defensas y Arqueros)" className="flex justify-center">
            <input type="checkbox" className="w-4 h-4 accent-slate-400" checked={s.valla_invicta || false} onChange={e => handleStatChange(jugador.id, 'valla_invicta', e.target.checked)} />
          </div>
          <div title="Figura del Partido" className="flex justify-center">
            <input type="checkbox" className="w-4 h-4 accent-amber-400" checked={s.figura_partido || false} onChange={e => handleStatChange(jugador.id, 'figura_partido', e.target.checked)} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0b1120] min-h-screen text-white p-4 pb-24">
      <h1 className="text-2xl font-black text-blue-400 mb-6 text-center uppercase tracking-widest">Panel Admin: Gran DT</h1>

      {/* SELECTOR DE PARTIDO */}
      <div className="max-w-3xl mx-auto bg-[#1e293b] p-4 rounded-xl border border-slate-700 shadow-xl mb-6">
        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Seleccionar Partido a Evaluar</label>
        <select 
          className="w-full p-3 bg-slate-900 border border-slate-600 rounded text-sm font-bold text-white outline-none focus:border-blue-500"
          value={selectedPartido}
          onChange={(e) => setSelectedPartido(e.target.value)}
        >
          <option value="">-- Elige un partido --</option>
          {partidos.map(p => (
            <option key={p.id} value={p.id}>
              ID: {p.id} | {p.equipo_local} vs {p.equipo_visita} ({p.fecha_solo})
            </option>
          ))}
        </select>
        
        <div className="mt-4 flex justify-between items-center bg-slate-900 p-3 rounded border border-slate-700">
          <span className="text-xs font-bold text-slate-400 uppercase">Fase Actual del Torneo:</span>
          <input type="number" className="w-16 h-8 bg-slate-800 text-center font-bold rounded" value={faseActual} onChange={(e) => setFaseActual(parseInt(e.target.value))} />
        </div>
      </div>

      {loading && <div className="text-center font-bold text-slate-400 my-10">Cargando datos...</div>}

      {/* TABLAS DE JUGADORES */}
      {partidoActual && !loading && (
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Cabecera de columnas para orientación */}
          <div className="hidden sm:flex justify-end pr-2 text-[9px] font-black uppercase text-slate-500 gap-1 text-center w-full">
            <div className="w-2/3 grid grid-cols-7">
              <span>MIN</span><span>GOL</span><span>ASI</span><span>TA</span><span>TR</span><span>INV</span><span>FIG</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LOCAL */}
            <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700">
              <h2 className="text-lg font-black text-emerald-400 mb-4 border-b border-slate-700 pb-2 uppercase text-center">{partidoActual.equipo_local}</h2>
              <div className="space-y-1">
                {jugadoresLocal.map(j => <FilaJugador key={j.id} jugador={j} />)}
              </div>
            </div>

            {/* VISITA */}
            <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700">
              <h2 className="text-lg font-black text-blue-400 mb-4 border-b border-slate-700 pb-2 uppercase text-center">{partidoActual.equipo_visita}</h2>
              <div className="space-y-1">
                {jugadoresVisita.map(j => <FilaJugador key={j.id} jugador={j} />)}
              </div>
            </div>
          </div>

          <button 
            onClick={guardarEstadisticas} 
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black text-lg uppercase transition-colors shadow-lg shadow-blue-900/50"
          >
            {loading ? 'Guardando...' : '💾 Guardar Estadísticas Gran DT'}
          </button>
        </div>
      )}
    </div>
  );
}