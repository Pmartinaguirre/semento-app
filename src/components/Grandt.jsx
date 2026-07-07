import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 

// --- Configuración de la Tabla de Puntajes ---
const TABLA_PUNTAJES = [
  { accion: 'Capitán', puntos: 'Duplica puntaje', color: 'text-blue-400' },
  { accion: 'Figura de la cancha', puntos: '+4', color: 'text-emerald-400' },
  { accion: 'Gol de penal', puntos: '+3', color: 'text-emerald-400' },
  { accion: 'Gol convertido por delantero (de jugada)', puntos: '+4', color: 'text-emerald-400' },
  { accion: 'Gol convertido por volante (de jugada)', puntos: '+6', color: 'text-emerald-400' },
  { accion: 'Gol convertido por defensor (de jugada)', puntos: '+9', color: 'text-emerald-400' },
  { accion: 'Gol convertido por arquero (de jugada)', puntos: '+12', color: 'text-emerald-400' },
  { accion: 'Valla invicta de arquero', puntos: '+3', color: 'text-emerald-400' },
  { accion: 'Valla invicta de defensor', puntos: '+2', color: 'text-emerald-400' },
  { accion: 'Gol recibido (de jugada o penal)', puntos: '-1', color: 'text-red-400' },
  { accion: 'Gol en contra', puntos: '-2', color: 'text-red-400' },
  { accion: 'Tarjeta amarilla', puntos: '-2', color: 'text-red-400' },
  { accion: 'Tarjeta roja', puntos: '-4', color: 'text-red-400' },
  { accion: 'Penal errado', puntos: '-4', color: 'text-red-400' },
  { accion: 'Penal atajado', puntos: '+4', color: 'text-emerald-400' },
  { accion: 'Equipo ganó el partido', puntos: '+3', color: 'text-emerald-400' },
  { accion: 'Equipo empató el partido', puntos: '+1', color: 'text-emerald-400' }
];

/**
 * Función de cálculo de puntos Gran DT
 */
export const calcularPuntosGranDT = (jugador, stats, partido, esCapitan = false) => {
  if (!stats) return 0; 
  let pts = 0;
  if (stats.figura_partido) pts += 4;
  const golesPenal = stats.goles_penal || 0;
  pts += (golesPenal * 3);
  const golesJugada = (stats.goles || 0) - golesPenal;
  if (golesJugada > 0) {
    if (jugador.posicion === 'DEL') pts += (golesJugada * 4);
    else if (jugador.posicion === 'MED' || jugador.posicion === 'VOL') pts += (golesJugada * 6);
    else if (jugador.posicion === 'DEF') pts += (golesJugada * 9);
    else if (jugador.posicion === 'ARQ') pts += (golesJugada * 12);
  }
  if (stats.valla_invicta) {
    if (jugador.posicion === 'ARQ') pts += 3;
    else if (jugador.posicion === 'DEF') pts += 2;
  }
  pts += ((stats.goles_recibidos || 0) * -1);
  pts += ((stats.goles_en_contra || 0) * -2);
  pts += ((stats.tarjeta_amarilla || 0) * -2);
  pts += ((stats.tarjeta_roja || 0) * -4);
  pts += ((stats.penales_errados || 0) * -4);
  pts += ((stats.penales_atajados || 0) * 4);
  if (partido && partido.goles_local_real !== null && partido.goles_visita_real !== null) {
    const gl = partido.goles_local_real;
    const gv = partido.goles_visita_real;
    let gano = false;
    let empato = false;
    if (gl === gv) empato = true;
    else if ((jugador.pais === partido.equipo_local && gl > gv) || (jugador.pais === partido.equipo_visita && gv > gl)) gano = true;
    if (gano) pts += 3;
    if (empato) pts += 1;
  }
  return esCapitan ? pts * 2 : pts;
};

export default function GranDT() {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroPosicion, setFiltroPosicion] = useState('');
  const [filtroValorMax, setFiltroValorMax] = useState('');
  const [resultados, setResultados] = useState([]);
  const [titulares, setTitulares] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [presupuesto, setPresupuesto] = useState(300);
  const [cargando, setCargando] = useState(false);
  const [capitanId, setCapitanId] = useState(null);

  const LIMITES_TITULARES = { ARQ: 1, DEF: 4, MED: 3, DEL: 3 };
  const LIMITES_RESERVAS  = { ARQ: 1, DEF: 2, MED: 2, DEL: 2 };
  
  const POSICIONES_CONFIG = [
    { key: 'ARQ', label: 'ARQUERO' },
    { key: 'DEF', label: 'DEFENSA' },
    { key: 'MED', label: 'MEDIOCAMPISTA' },
    { key: 'DEL', label: 'DELANTERO' }
  ];

  useEffect(() => {
    async function cargarEquipoGuardado() {
      const usuarioId = localStorage.getItem('mi_usuario_id');
      if (!usuarioId) return;
      setCargando(true);
      const { data: equipoGuardado } = await supabase.from('equipos_grandt').select('*').eq('usuario_id', usuarioId).maybeSingle();
      if (equipoGuardado) {
        const idsTitulares = equipoGuardado.titulares_ids ? equipoGuardado.titulares_ids.split(',').map(Number) : [];
        const idsReservas = equipoGuardado.reservas_ids ? equipoGuardado.reservas_ids.split(',').map(Number) : [];
        const todosLosIds = [...idsTitulares, ...idsReservas];
        if (todosLosIds.length > 0) {
          const { data: infoJugadores } = await supabase.from('jugadores').select('*').in('id', todosLosIds);
          if (infoJugadores) {
            setTitulares(idsTitulares.map(id => infoJugadores.find(j => j.id === id)).filter(Boolean));
            setReservas(idsReservas.map(id => infoJugadores.find(j => j.id === id)).filter(Boolean));
            setPresupuesto(Number(equipoGuardado.presupuesto_restante));
            if (equipoGuardado.capitan_id) setCapitanId(Number(equipoGuardado.capitan_id));
          }
        }
      }
      setCargando(false);
    }
    cargarEquipoGuardado();
  }, []);

  const ejecutarBusqueda = async () => {
    let consulta = supabase.from('jugadores').select('*');
    if (terminoBusqueda.trim()) consulta = consulta.or(`nombrecompleto.ilike.%${terminoBusqueda.trim()}%,pais.ilike.%${terminoBusqueda.trim()}%`);
    if (filtroPosicion) consulta = consulta.eq('posicion', filtroPosicion);
    if (filtroValorMax) consulta = consulta.lte('valor', Number(filtroValorMax));
    const { data } = await consulta.limit(40);
    setResultados(data || []);
  };

  const guardarEquipoEnBD = async () => {
    const usuarioId = localStorage.getItem('mi_usuario_id');
    if (!usuarioId) return alert("⚠️ Inicia sesión.");
    const titularesIdsStr = titulares.map(j => j.id).join(',');
    const reservasIdsStr = reservas.map(j => j.id).join(',');
    setCargando(true);
    const { error } = await supabase.from('equipos_grandt').upsert({ usuario_id: usuarioId, titulares_ids: titularesIdsStr, reservas_ids: reservasIdsStr, presupuesto_restante: presupuesto, capitan_id: capitanId }, { onConflict: 'usuario_id' });
    setCargando(false);
    if (error) alert("❌ Error: " + error.message); else alert("💾 ¡Guardado!");
  };

  const agregarJugador = (jugador, esTitular) => {
    if (titulares.some(j => j.id === jugador.id) || reservas.some(j => j.id === jugador.id)) return alert("¡Ya seleccionado!");
    if (presupuesto - Number(jugador.valor) < 0) return alert("¡Sin presupuesto!");
    const limite = esTitular ? LIMITES_TITULARES[jugador.posicion] : LIMITES_RESERVAS[jugador.posicion];
    const actual = esTitular ? titulares : reservas;
    if (actual.filter(j => j.posicion === jugador.posicion).length >= limite) return alert("¡Límite de posición!");
    if (esTitular) setTitulares([...titulares, jugador]); else setReservas([...reservas, jugador]);
    setPresupuesto(prev => prev - Number(jugador.valor));
  };

  const quitarJugador = (id, esTitular, valor) => {
    if (esTitular) { setTitulares(titulares.filter(j => j.id !== id)); if (capitanId === id) setCapitanId(null); }
    else { setReservas(reservas.filter(j => j.id !== id)); }
    setPresupuesto(prev => prev + Number(valor));
  };

  const RenderGrupo = ({ lista, esTitular }) => (
    <div className="space-y-4">
      {POSICIONES_CONFIG.map(({ key, label }) => {
        const jugadoresPos = lista.filter(j => j.posicion === key);
        const limite = esTitular ? LIMITES_TITULARES[key] : LIMITES_RESERVAS[key];
        return (
          <div key={key} className="bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
            <div className="flex justify-between items-center mb-2 px-1">
              <h3 className="font-black text-xs text-slate-400 tracking-wider">{label}</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${jugadoresPos.length === limite ? 'bg-emerald-900 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{jugadoresPos.length} / {limite}</span>
            </div>
            {jugadoresPos.map(j => {
              const esCapitan = capitanId === j.id;
              return (
                <div key={j.id} className={`flex justify-between items-center bg-slate-800 p-2 rounded mb-1 border ${esCapitan ? 'border-amber-400' : 'border-slate-700'}`}>
                  <div>
                    <span className="font-bold text-sm block">{j.nombrecompleto} {esCapitan && <span className="bg-amber-400 text-black text-[10px] px-1 font-black rounded">© CAP</span>}</span>
                    <span className="text-[11px] text-slate-400">{j.pais} • Nº {j.camiseta || '?'} • <span className="text-emerald-400">${j.valor}M</span></span>
                  </div>
                  <div className="flex gap-2">
                    {esTitular && <button onClick={() => setCapitanId(j.id)} className={`text-xs font-bold px-2 py-1 rounded ${esCapitan ? 'bg-amber-500 text-slate-900' : 'bg-slate-700'}`}>©</button>}
                    <button onClick={() => quitarJugador(j.id, esTitular, j.valor)} className="text-red-400 font-bold px-2">X</button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-4 text-white max-w-4xl mx-auto mb-20">
      <h1 className="text-3xl font-black text-center mb-6 text-emerald-400 uppercase">Arma tu Plantel</h1>
      <button onClick={guardarEquipoEnBD} className="w-full mb-6 bg-emerald-600 font-black text-lg py-3 rounded-xl uppercase">💾 GUARDAR EQUIPO</button>
      <div className="bg-slate-900 border border-emerald-500 rounded-xl p-4 text-center mb-6">
        <p className="text-slate-400 text-sm font-bold uppercase">Presupuesto Restante</p>
        <p className="text-4xl font-black text-emerald-400">${presupuesto}M</p>
      </div>

      <div className="bg-slate-800 p-4 rounded-xl mb-6">
        <div className="flex gap-3 mb-4">
          <input type="text" placeholder="Buscar..." className="flex-grow p-2 rounded bg-slate-900 border border-slate-700" value={terminoBusqueda} onChange={(e) => setTerminoBusqueda(e.target.value)} />
          <button onClick={ejecutarBusqueda} className="bg-emerald-600 px-4 py-2 rounded font-bold">BUSCAR</button>
        </div>
        {resultados.map((j) => (
          <div key={j.id} className="flex justify-between items-center bg-slate-900 p-2 rounded mb-2">
            <span>{j.nombrecompleto} (${j.valor}M)</span>
            <div className="flex gap-2">
              <button onClick={() => agregarJugador(j, true)} className="bg-blue-600 px-3 py-1 rounded">+</button>
              <button onClick={() => agregarJugador(j, false)} className="bg-amber-600 px-3 py-1 rounded">R</button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-xl font-bold mb-4 text-blue-400">Titulares</h2>
          <RenderGrupo lista={titulares} esTitular={true} />
        </div>
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-xl font-bold mb-4 text-amber-400">Reservas</h2>
          <RenderGrupo lista={reservas} esTitular={false} />
        </div>
      </div>
    </div>
  );
}