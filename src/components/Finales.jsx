import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

// IMPORTACIÓN DE BANNERS
import banner1 from '../assets/bannerjugabet1.png';
import banner2 from '../assets/bannerjugabet2.png';
import banner3 from '../assets/bannerjugabet3.png';

const arrayBanners = [banner1, banner2, banner3];

const mapaISO2 = { "México": "mx", "Sudáfrica": "za", "República de Corea": "kr", "República Checa": "cz", "Canadá": "ca", "Bosnia y Herzegovina": "ba", "Catar": "qa", "Suiza": "ch", "Brasil": "br", "Marruecos": "ma", "Haití": "ht", "Escocia": "gb-sct", "Estados Unidos": "us", "Paraguay": "py", "Australia": "au", "Turquía": "tr", "Alemania": "de", "Curazao": "cw", "Costa de Marfil": "ci", "Ecuador": "ec", "Países Bajos": "nl", "Japón": "jp", "Suecia": "se", "Túnez": "tn", "Bélgica": "be", "Egipto": "eg", "RI de Irán": "ir", "Nueva Zelanda": "nz", "España": "es", "Cabo Verde": "cv", "Arabia Saudí": "sa", "Uruguay": "uy", "Francia": "fr", "Senegal": "sn", "Irak": "iq", "Noruega": "no", "Argentina": "ar", "Argelia": "dz", "Austria": "at", "Jordania": "jo", "Portugal": "pt", "RD de Congo": "cd", "Uzbekistán": "uz", "Colombia": "co", "Inglaterra": "gb-eng", "Croacia": "hr", "Ghana": "gh", "Panamá": "pa" };
const mapaISO3 = { "México": "MEX", "Sudáfrica": "RSA", "República de Corea": "KOR", "República Checa": "CZE", "Canadá": "CAN", "Bosnia y Herzegovina": "BIH", "Catar": "QAT", "Suiza": "SUI", "Brasil": "BRA", "Marruecos": "MAR", "Haití": "HAI", "Escocia": "SCO", "Estados Unidos": "USA", "Paraguay": "PAR", "Australia": "AUS", "Turquía": "TUR", "Alemania": "GER", "Curazao": "CUW", "Costa de Marfil": "CIV", "Ecuador": "ECU", "Países Bajos": "NED", "Japón": "JPN", "Suecia": "SWE", "Túnez": "TUN", "Bélgica": "BEL", "Egipto": "EGY", "RI de Irán": "IRN", "Nueva Zelanda": "NZL", "España": "ESP", "Cabo Verde": "CPV", "Arabia Saudí": "KSA", "Uruguay": "URU", "Francia": "FRA", "Senegal": "SEN", "Irak": "IRQ", "Noruega": "NOR", "Argentina": "ARG", "Argelia": "ALG", "Austria": "AUT", "Jordania": "JOR", "Portugal": "POR", "RD de Congo": "COD", "Uzbekistán": "UZB", "Colombia": "COL", "Inglaterra": "ENG", "Croacia": "CRO", "Ghana": "GHA", "Panamá": "PAN" };

// Componente para pintar cada partido en las llaves
const MatchNode = ({ partido }) => {
  const renderTeam = (eq, goles, avanzaReal) => {
    const ab = eq ? (mapaISO3[eq] || eq.substring(0,3).toUpperCase()) : 'TBD';
    const f = eq ? mapaISO2[eq] : null;
    const isWinner = avanzaReal && avanzaReal === eq;

    return (
      <div className={`flex justify-between items-center px-2 py-1.5 ${isWinner ? 'bg-emerald-900/30' : ''}`}>
        <div className="flex items-center gap-2">
          {f ? <img src={`https://flagcdn.com/w20/${f}.png`} className="w-4 h-3 rounded-sm opacity-90 shadow-sm" alt={eq}/> : <div className="w-4 h-3 bg-slate-800 rounded-sm"></div>}
          <span className={`font-black text-[10px] tracking-wider ${isWinner ? 'text-emerald-400' : 'text-slate-300'}`}>{ab}</span>
        </div>
        <span className={`font-mono text-[11px] font-bold ${goles !== null ? 'text-white' : 'text-slate-600'}`}>{goles ?? '-'}</span>
      </div>
    );
  };

  return (
    <div className="w-[110px] bg-[#1e293b] border border-slate-700 rounded shadow-lg overflow-hidden flex flex-col">
      {partido ? (
        <>
          {renderTeam(partido.equipo_local, partido.goles_local_real, partido.equipo_avanza_real_id)}
          <div className="border-t border-slate-700/50"></div>
          {renderTeam(partido.equipo_visita, partido.goles_visita_real, partido.equipo_avanza_real_id)}
        </>
      ) : (
        <div className="flex flex-col justify-center items-center h-[52px] opacity-30">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Por definir</span>
        </div>
      )}
    </div>
  );
};

// Lógica de renderizado de tiempo corregida
const renderTiempoJuego = (m) => {
  if (m.estado_app === 'FINALIZADO') {
    return <span className="text-gray-400 font-bold text-sm">Partido terminado</span>;
  }

  if (m.estado_app === 'HT') {
    return (
      <div className="flex items-center gap-1">
        <span className="text-emerald-400 font-black text-2xl tracking-tighter animate-pulse">ET</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-white font-black text-2xl tracking-tighter">{m.minuto_juego}'</span>
      {m.minutos_descuento > 0 && (
        <span className="text-emerald-500 font-bold text-lg">+{m.minutos_descuento}</span>
      )}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
    </div>
  );
};

export default function Finales() {
  const [partidosRaw, setPartidosRaw] = useState([]);
  const [etapaActiva, setEtapaActiva] = useState('16avos');
  const [fechaActiva, setFechaActiva] = useState('Todas');
  
  const [misPronosticos, setMisPronosticos] = useState({});
  const [todosLosPronosticos, setTodosLosPronosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState('');
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [expandidos, setExpandidos] = useState({});
  const [expandidosAdmin, setExpandidosAdmin] = useState({});
  
  const navigate = useNavigate();
  
  const etapas = [
    { id: '16avos', label: '16avos', db: '16avos' },
    { id: '8vos', label: '8vos', db: 'Octavos' },
    { id: '4tos', label: '4tos', db: 'Cuartos' },
    { id: 'semis', label: 'Semis', db: 'Semifinal' },
    { id: '3y4', label: '3 y 4', db: '3er Lugar' },
    { id: 'final', label: 'Final', db: 'Final' },
    { id: 'llaves', label: 'LLAVES', db: 'llaves' }
  ];
  
  const ajustarHora = (h) => h?.substring(0, 5) || "";
  const formatearFecha = (f) => f ? new Date(f + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : "";
  
  const obtenerDiaSemana = (f) => {
    if (!f) return "";
    const dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    const d = new Date(f + 'T12:00:00'); 
    return dias[d.getDay()];
  };
  
  const isBloqueadoPorTiempo = (fecha, hora) => {
    if (!fecha || !hora) return false;
    const fechaPartido = new Date(`${fecha}T${hora}`);
    const ahora = new Date();
    return (fechaPartido.getTime() - ahora.getTime()) <= 600000;
  };
  
  const calcularPuntos = (pL, pV, rL, rV, fase) => {
    if (rL === null || rV === null || pL === '' || pV === '' || pL === undefined || pV === undefined) return 0;
    const reglas = { "grupos": { lev: 2, dif: 1, exacto: 1 }, "16avos": { lev: 3, dif: 2, exacto: 2 }, "Octavos": { lev: 3, dif: 2, exacto: 2 }, "Cuartos": { lev: 3, dif: 2, exacto: 2 }, "Semifinal": { lev: 4, dif: 2, exacto: 2 }, "3er Lugar": { lev: 3, dif: 2, exacto: 2 }, "Final": { lev: 5, dif: 3, exacto: 3 } };
    const r = reglas[fase] || reglas["grupos"];
    let pts = 0;
    const pL_int = parseInt(pL); const pV_int = parseInt(pV); const rL_int = parseInt(rL); const rV_int = parseInt(rV);
    const pRes = pL_int > pV_int ? 'L' : (pL_int < pV_int ? 'V' : 'E');
    const rRes = rL_int > rV_int ? 'L' : (rL_int < rV_int ? 'V' : 'E');
    
    if (pRes === rRes) {
      pts += r.lev;
      if (pL_int === rL_int && pV_int === rV_int) {
        pts += r.dif + r.exacto;
      } else if ((pL_int - pV_int) === (rL_int - rV_int)) {
        pts += r.dif;
      }
    }
    return pts;
  };
  
  const toggleExpandido = (id) => setExpandidos(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleExpandidoAdmin = (id) => setExpandidosAdmin(prev => ({ ...prev, [id]: !prev[id] }));
  
  async function actualizarDatoAdmin(id, campo, valor) {
    let valorFinal = valor;
    if (campo.includes('goles') && valor !== '') {
      valorFinal = parseInt(valor, 10);
    } else if (valor === '') {
      valorFinal = null;
    }

    const { error } = await supabase.from('partidos').update({ [campo]: valorFinal }).eq('id', id);
    if (error) {
        alert("🚨 Error en Supabase: " + error.message);
        console.error("Fallo al actualizar:", error);
    } else {
        setPartidosRaw(prev => prev.map(p => p.id === id ? { ...p, [campo]: valorFinal } : p));
    }
  }
  
  useEffect(() => {
    async function cargar() {
      const uId = localStorage.getItem('mi_usuario_id');
      const uRole = localStorage.getItem('usuario_role');
      if (!uId) { navigate('/login'); return; }
      setUsuario(uId);
      setIsAdmin(uRole === 'admin' || uId.toLowerCase() === 'pablo martin');
      
      const { data: p } = await supabase.from('partidos').select('*');
      if (p) setPartidosRaw(p);
      const { data: pr } = await supabase.from('pronosticos').select('partidos_marcadores').eq('usuario_nombre', uId).maybeSingle();
      if(pr) setMisPronosticos(pr.partidos_marcadores || {});
      const { data: tod = [] } = await supabase.from('pronosticos').select('usuario_nombre, partidos_marcadores');
      if(tod) setTodosLosPronosticos(tod);
      
      setLoading(false);
    }
    cargar();

    const canalPartidos = supabase
      .channel('cambios-en-vivo-finales')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'partidos' },
        (payload) => {
          console.log('Cambio detectado de inmediato:', payload.new);
          setPartidosRaw((partidosActuales) =>
            partidosActuales.map((partido) =>
              partido.id === payload.new.id ? payload.new : partido
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canalPartidos);
    };
  }, [navigate]);
  
  useEffect(() => {
    if (partidosRaw.length > 0 && etapaActiva !== 'llaves') {
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, '0');
      const dd = String(hoy.getDate()).padStart(2, '0');
      const hoyStr = `${yyyy}-${mm}-${dd}`;
      
      const partidosHoy = partidosRaw.filter(p => p.fecha_solo === hoyStr);
      if (partidosHoy.length > 0) {
        const etapa = etapas.find(e => e.db === partidosHoy[0].fase);
        if (etapa && etapa.id !== 'llaves') setEtapaActiva(etapa.id);
        setFechaActiva(hoyStr);
      }
    }
  }, [partidosRaw.length]); 
  
  const fechasFase = useMemo(() => {
    if (etapaActiva === 'llaves') return [];
    const dbFase = etapas.find(e => e.id === etapaActiva)?.db;
    const partidosFase = partidosRaw.filter(p => p.fase === dbFase);
    return Array.from(new Set(partidosFase.map(p => p.fecha_solo).filter(Boolean))).sort();
  }, [etapaActiva, partidosRaw]);
  
  useEffect(() => {
    if (etapaActiva === 'llaves') return;
    const selectorId = fechaActiva === 'Todas' ? 'date-btn-Todas' : `date-btn-${fechaActiva}`;
    const activeBtn = document.getElementById(selectorId);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [fechaActiva, fechasFase, etapaActiva]);
  
  const partidosMostrados = useMemo(() => {
    if (etapaActiva === 'llaves') return [];
    const dbFase = etapas.find(e => e.id === etapaActiva)?.db;
    let lista = partidosRaw.filter(p => p.fase === dbFase);
    if (fechaActiva !== 'Todas') {
      lista = lista.filter(p => p.fecha_solo === fechaActiva);
    }
    return lista.sort((a, b) => a.id - b.id);
  }, [etapaActiva, fechaActiva, partidosRaw]);

  // ORDENADOR INTELIGENTE DE LLAVES
  const llavesData = useMemo(() => {
    const todos16 = partidosRaw.filter(p => p.fase === '16avos');
    const todos8 = partidosRaw.filter(p => p.fase === 'Octavos').sort((a,b) => a.id - b.id);
    const todos4 = partidosRaw.filter(p => p.fase === 'Cuartos').sort((a,b) => a.id - b.id);
    const todos2 = partidosRaw.filter(p => p.fase === 'Semifinal').sort((a,b) => a.id - b.id);
    const todos1 = partidosRaw.filter(p => p.fase === 'Final').sort((a,b) => a.id - b.id);

    const ordenDeseado16 = [
      "Alemania", "Francia", "Sudáfrica", "Países Bajos", 
      "Portugal", "España", "Estados Unidos", "Bélgica",  
      "Brasil", "Costa de Marfil", "México", "Inglaterra", 
      "Argentina", "Australia", "Suiza", "Colombia"       
    ];

    const p16 = ordenDeseado16.map(equipo => {
      return todos16.find(p => p.equipo_local === equipo || p.equipo_visita === equipo) || null;
    });
    while (p16.length < 16) p16.push(null);

    const getTeams = (m) => m ? [m.equipo_local, m.equipo_visita].filter(Boolean) : [];

    const armarFaseSiguiente = (fasePrevia, partidosDisponibles, cantidad) => {
      const disponibles = [...partidosDisponibles];
      const resultado = Array(cantidad).fill(null);
      
      for (let i = 0; i < cantidad; i++) {
        const equiposPrevios = [...getTeams(fasePrevia[i * 2]), ...getTeams(fasePrevia[i * 2 + 1])];
        if (equiposPrevios.length > 0) {
          const idx = disponibles.findIndex(m => 
            equiposPrevios.includes(m.equipo_local) || equiposPrevios.includes(m.equipo_visita)
          );
          if (idx !== -1) resultado[i] = disponibles.splice(idx, 1)[0];
        }
      }
      for (let i = 0; i < cantidad; i++) {
        if (!resultado[i] && disponibles.length > 0) resultado[i] = disponibles.shift();
      }
      return resultado;
    };

    const p8 = armarFaseSiguiente(p16, todos8, 8);
    const p4 = armarFaseSiguiente(p8, todos4, 4);
    const p2 = armarFaseSiguiente(p4, todos2, 2);
    const p1 = armarFaseSiguiente(p2, todos1, 1);

    return { p16, p8, p4, p2, p1 };
  }, [partidosRaw]);
  
  useEffect(() => {
    if (!loading && partidosMostrados.length > 0 && etapaActiva !== 'llaves') {
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, '0');
      const dd = String(hoy.getDate()).padStart(2, '0');
      const localHoyStr = `${yyyy}-${mm}-${dd}`;

      const isTodaySelected = fechaActiva === localHoyStr || (fechaActiva === 'Todas' && partidosMostrados.some(p => p.fecha_solo === localHoyStr));

      let targetMatch = partidosMostrados[0]; 

      if (isTodaySelected) {
        const partidosOrdenados = [...partidosMostrados].sort((a, b) => new Date(`${a.fecha_solo}T${a.hora_partido}`) - new Date(`${b.fecha_solo}T${b.hora_partido}`));
        targetMatch = partidosOrdenados[0];
        for (let i = 0; i < partidosOrdenados.length; i++) {
          const matchTime = new Date(`${partidosOrdenados[i].fecha_solo}T${partidosOrdenados[i].hora_partido || '00:00'}`);
          if (hoy >= matchTime) targetMatch = partidosOrdenados[i];
          else break; 
        }
      }

      if (targetMatch) {
        const el = document.getElementById(`partido-${targetMatch.id}`);
        if (el) {
          setTimeout(() => {
            const offset = 210; 
            const y = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }, 500); 
        }
      }
    }
  }, [loading, partidosMostrados, etapaActiva, fechaActiva]);
  
  async function guardarPronosticos() {
    const { error } = await supabase.from('pronosticos').upsert({ usuario_nombre: usuario, partidos_marcadores: misPronosticos });
    if(error) alert("Error: " + error.message); else alert("¡Pronósticos guardados!");
  }
  
  if (loading) return <div className="text-white p-20 text-center font-bold">Cargando Fase Final...</div>;
  
  return (
    <div className="bg-[#0b1120] min-h-screen text-white pb-24">
      <div className="sticky top-0 z-50 bg-[#0b1120]/95 border-b border-emerald-500/30 p-4 shadow-lg flex justify-between items-center">
        <h1 className="text-base font-black text-emerald-400 uppercase tracking-widest">Fase Final</h1>
        {etapaActiva !== 'llaves' && (
          <button onClick={guardarPronosticos} className="bg-emerald-600 px-5 py-2 rounded-lg font-black text-xs uppercase">Guardar</button>
        )}
      </div>
      
      <div className="sticky top-[64px] z-40 bg-[#0b1120] border-b border-slate-800">
        <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide border-b border-slate-800">
          {etapas.map(e => (
            <button 
              key={e.id} 
              onClick={() => { setEtapaActiva(e.id); setFechaActiva('Todas'); }} 
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase whitespace-nowrap transition-colors ${etapaActiva === e.id ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-900/40' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'}`}
            >
              {e.label}
            </button>
          ))}
        </div>
        
        {etapaActiva !== 'llaves' && fechasFase.length > 0 && (
          <div className="flex gap-3 p-3 overflow-x-auto scrollbar-hide bg-slate-950/50 justify-start items-end">
            <div id="date-btn-Todas" className="flex flex-col items-center">
              <span className="text-[9px] font-black uppercase text-transparent mb-1">-</span>
              <button
                onClick={() => setFechaActiva('Todas')}
                className={`px-3 py-1.5 rounded text-[10px] font-black uppercase whitespace-nowrap h-[28px] flex items-center ${fechaActiva === 'Todas' ? 'bg-sky-600 text-white shadow-md shadow-sky-900/50' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                Todas
              </button>
            </div>
            {fechasFase.map(f => (
              <div key={f} id={`date-btn-${f}`} className="flex flex-col items-center">
                <span className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-wider">{obtenerDiaSemana(f)}</span>
                <button
                  onClick={() => setFechaActiva(f)}
                  className={`px-3 py-1.5 rounded text-[10px] font-black uppercase whitespace-nowrap h-[28px] flex items-center ${fechaActiva === f ? 'bg-sky-600 text-white shadow-md shadow-sky-900/50' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                  {formatearFecha(f)}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {etapaActiva === 'llaves' ? (
        <div className="w-full overflow-x-auto p-4 scrollbar-hide">
          <div className="min-w-[1100px] min-h-[650px] bg-slate-900/40 rounded-xl border border-slate-800 p-6 flex justify-between relative shadow-2xl">
            <div className="flex flex-col justify-around gap-2 w-[110px]">{llavesData.p16.slice(0, 8).map((m, i) => <MatchNode key={i} partido={m} />)}</div>
            <div className="flex flex-col justify-around gap-2 w-[110px] py-8">{llavesData.p8.slice(0, 4).map((m, i) => <MatchNode key={i} partido={m} />)}</div>
            <div className="flex flex-col justify-around gap-2 w-[110px] py-24">{llavesData.p4.slice(0, 2).map((m, i) => <MatchNode key={i} partido={m} />)}</div>
            <div className="flex flex-col justify-around gap-2 w-[110px] py-48">{llavesData.p2.slice(0, 1).map((m, i) => <MatchNode key={i} partido={m} />)}</div>
            <div className="flex flex-col justify-start pt-10 items-center w-[160px] gap-8 z-10">
              <div className="text-center w-full">
                <h2 className="text-xl font-black text-amber-400 uppercase tracking-widest drop-shadow-md">Camino a la Final</h2>
                <div className="w-16 h-1 bg-amber-500 mx-auto mt-2 rounded-full"></div>
              </div>
              <div className="text-[80px] drop-shadow-2xl mt-4">🏆</div>
              <div className="flex flex-col items-center mt-12 w-full">
                <span className="text-emerald-400 font-black tracking-widest text-sm mb-3 uppercase">Gran Final</span>
                <MatchNode partido={llavesData.p1[0]} />
              </div>
            </div>
            <div className="flex flex-col justify-around gap-2 w-[110px] py-48">{llavesData.p2.slice(1, 2).map((m, i) => <MatchNode key={i} partido={m} />)}</div>
            <div className="flex flex-col justify-around gap-2 w-[110px] py-24">{llavesData.p4.slice(2, 4).map((m, i) => <MatchNode key={i} partido={m} />)}</div>
            <div className="flex flex-col justify-around gap-2 w-[110px] py-8">{llavesData.p8.slice(4, 8).map((m, i) => <MatchNode key={i} partido={m} />)}</div>
            <div className="flex flex-col justify-around gap-2 w-[110px]">{llavesData.p16.slice(8, 16).map((m, i) => <MatchNode key={i} partido={m} />)}</div>
          </div>
          <p className="text-center text-slate-500 text-[10px] uppercase font-bold mt-4 tracking-widest">
            * Desliza hacia los lados para ver todo el cuadro
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-w-xl mx-auto px-4 mt-4">
          {partidosMostrados.map((m, index) => {
            const esPendiente = m.estado === 'pendiente' || !m.estado;
            const esBloqueado = m.estado === 'bloqueado';
            const esJuegoProximo = m.estado === 'juegoproximo';
            const esEnVivo = m.estado === 'envivo';
            const esFinalizado = m.estado === 'finalizado';
            
            const bloqueadoPorTiempo = isBloqueadoPorTiempo(m.fecha_solo, m.hora_partido);
            const puedeEditar = esPendiente && !bloqueadoPorTiempo;
            const cerradoPorTiempo = esPendiente && bloqueadoPorTiempo;
            const verResultadosAmigos = cerradoPorTiempo || esJuegoProximo || esEnVivo || esFinalizado;
            const canalesTV = m.tv ? m.tv.toLowerCase().split(',').map(c => c.trim()) : [];
            
            const misPts = esFinalizado ? calcularPuntos(misPronosticos[m.id]?.local, misPronosticos[m.id]?.visita, m.goles_local_real, m.goles_visita_real, m.fase) : 0;
            const misPuntosAvanza = (esFinalizado && m.equipo_avanza_real_id && misPronosticos[m.id]?.ganador === m.equipo_avanza_real_id) ? 3 : 0;
            
            return (
              <React.Fragment key={m.id}>
                <div id={`partido-${m.id}`} className="scroll-mt-56 bg-[#1e293b] p-4 rounded-xl border border-slate-700 shadow-xl">
                  <div className="relative flex justify-center items-center text-[11px] text-slate-400 mb-4 font-black uppercase w-full">
                    <span className="absolute left-0 bg-slate-800 px-2 py-0.5 rounded text-emerald-400">ID: {m.id}</span>
                    <span className="text-slate-300">{formatearFecha(m.fecha_solo)} | {ajustarHora(m.hora_partido)}</span>
                    <span className="absolute right-0 bg-slate-800 px-2 py-0.5 rounded text-amber-400">{m.fase}</span>
                  </div>
                  
                  {esFinalizado && (
                    <div className="bg-slate-900 border border-amber-500/30 rounded-lg p-3 mb-4 text-center shadow-lg shadow-amber-900/10">
                      <h3 className="text-amber-500 font-black uppercase tracking-widest text-[10px] mb-2">⚽ Partido Finalizado ({m.tiempo_juego || 'FT'})</h3>
                      
                      <div className="flex justify-center items-center gap-4 mb-2">
                        <div className="text-3xl font-black text-white bg-slate-950 px-4 py-1 rounded border border-slate-700 shadow-inner tracking-widest">
                          {m.goles_local_real ?? '-'} <span className="text-slate-600 text-xl mx-0.5">-</span> {m.goles_visita_real ?? '-'}
                        </div>
                        <div className="flex flex-col items-start justify-center border-l border-slate-700 pl-3">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Pts Marcador</span>
                          <span className={`text-sm font-black ${misPts > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>{misPts} pts</span>
                        </div>
                      </div>

                      {/* GOLEADORES */}
                      {m.eventos_goles && m.eventos_goles.length > 0 && (
                        <div className="mt-3 border-t border-slate-800/80 pt-3 text-[10px] flex justify-between">
                          <div className="flex flex-col text-right w-1/2 pr-3 border-r border-slate-800/80">
                            {m.eventos_goles.filter(e => e.equipo === 'local').map((e, i) => (
                              <span key={`local-${i}`} className="text-slate-300 font-bold">
                                {e.jugador} <span className="text-slate-500">{e.minuto}'</span> ⚽
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-col text-left w-1/2 pl-3">
                            {m.eventos_goles.filter(e => e.equipo === 'visita').map((e, i) => (
                              <span key={`visita-${i}`} className="text-slate-300 font-bold">
                                ⚽ <span className="text-slate-500">{e.minuto}'</span> {e.jugador}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {m.equipo_avanza_real_id && (
                        <div className="flex justify-center items-center gap-4 bg-slate-950/50 py-1.5 px-3 rounded-lg border border-slate-800 inline-flex mt-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-slate-400 font-bold uppercase">Clasificó:</span>
                            <span className="text-[11px] font-black text-emerald-400 uppercase">{m.equipo_avanza_real_id}</span>
                          </div>
                          <div className="h-4 w-px bg-slate-700"></div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-slate-400 font-bold uppercase">Pts Extra:</span>
                            <span className={`text-[11px] font-black ${misPuntosAvanza > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                              {misPuntosAvanza > 0 ? '+3' : '0'} pts
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* BLOQUE EN VIVO */}
                  {esEnVivo && (
                    <div className="bg-slate-900 border border-emerald-500/50 rounded-lg p-3 mb-4 text-center shadow-lg shadow-emerald-900/10">
                      <div className="flex justify-center items-center gap-2 mb-2">
                        <h3 className="text-emerald-400 font-black uppercase tracking-widest text-[10px] animate-pulse m-0">
                          🔴 En Vivo - {m.minuto_juego}'
                          {m.minutos_descuento > 0 && (
                            <span className="text-emerald-300"> +{m.minutos_descuento}</span>
                          )}
                        </h3>
                        {m.estado_app && (
                          <span className="text-[9px] bg-slate-950 text-slate-400 font-extrabold px-1.5 py-0.5 rounded border border-slate-800 uppercase tracking-wider shadow-sm">
                            {m.estado_app}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-center items-center gap-4 mb-2">
                        <div className="text-3xl font-black text-white bg-slate-950 px-4 py-1 rounded border border-slate-700 shadow-inner tracking-widest">
                          {m.goles_local_real ?? 0} <span className="text-slate-600 text-xl mx-0.5">-</span> {m.goles_visita_real ?? 0}
                        </div>
                      </div>

                      {/* GOLEADORES */}
                      {m.eventos_goles && m.eventos_goles.length > 0 && (
                        <div className="mt-3 border-t border-slate-800/80 pt-3 text-[10px] flex justify-between">
                          <div className="flex flex-col text-right w-1/2 pr-3 border-r border-slate-800/80">
                            {m.eventos_goles.filter(e => e.equipo === 'local').map((e, i) => (
                              <span key={`local-${i}`} className="text-slate-300 font-bold">
                                {e.jugador} <span className="text-slate-500">{e.minuto}'</span> ⚽
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-col text-left w-1/2 pl-3">
                            {m.eventos_goles.filter(e => e.equipo === 'visita').map((e, i) => (
                              <span key={`visita-${i}`} className="text-slate-300 font-bold">
                                ⚽ <span className="text-slate-500">{e.minuto}'</span> {e.jugador}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    {/* ESTE ERA EL DIV QUE FALTABA Y ROMPÍA LA PANTALLA */}
                    </div>
                  )}
                  
                  {!esFinalizado && !esEnVivo && (
                    <div className="flex justify-center mb-3">
                      {esBloqueado && <span className="text-[9px] bg-rose-900/50 text-rose-400 px-2 py-0.5 rounded font-black uppercase">Bloqueado</span>}
                      {esJuegoProximo && <span className="text-[9px] bg-amber-900/50 text-amber-400 px-2 py-0.5 rounded font-black uppercase">Jugarán Pronto</span>}
                      {cerradoPorTiempo && <span className="text-[9px] bg-rose-900/50 text-rose-400 px-2 py-0.5 rounded font-black uppercase">Cerrado (Por tiempo)</span>}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between gap-4">
                    <div className="w-20 flex flex-col items-center text-center">
                      <img src={`https://flagcdn.com/w80/${mapaISO2[m.equipo_local] || 'unknown'}.png`} className="w-8 h-5 rounded mb-1 border border-slate-600 shadow-sm" alt={m.equipo_local}/>
                      <p className="text-[10px] font-black leading-tight text-slate-200">{m.equipo_local}</p>
                    </div>
                    
                    <div className="flex flex-col items-center flex-1">
                      <div className="flex gap-2 items-center">
                        <input type="number" min="0" disabled={!puedeEditar} className={`w-12 h-12 text-center rounded-lg border text-xl font-black ${puedeEditar ? 'bg-slate-900 text-emerald-400 border-slate-600 focus:border-emerald-500' : 'bg-slate-800 text-slate-500 border-slate-700 opacity-60'}`} value={misPronosticos[m.id]?.local ?? ''} onChange={e => setMisPronosticos({...misPronosticos, [m.id]: {...(misPronosticos[m.id] || {}), local: e.target.value}})}/>
                        <span className="text-[10px] font-black text-slate-500">VS</span>
                        <input type="number" min="0" disabled={!puedeEditar} className={`w-12 h-12 text-center rounded-lg border text-xl font-black ${puedeEditar ? 'bg-slate-900 text-emerald-400 border-slate-600 focus:border-emerald-500' : 'bg-slate-800 text-slate-500 border-slate-700 opacity-60'}`} value={misPronosticos[m.id]?.visita ?? ''} onChange={e => setMisPronosticos({...misPronosticos, [m.id]: {...(misPronosticos[m.id] || {}), visita: e.target.value}})}/>
                      </div>
                      
                      <select disabled={!puedeEditar} className={`mt-2 w-full max-w-[130px] text-[9px] uppercase font-black text-center rounded border p-1 ${puedeEditar ? 'bg-slate-950 text-emerald-400 border-slate-600' : 'bg-slate-800 text-slate-500 border-slate-700 opacity-60'}`} value={misPronosticos[m.id]?.ganador ?? ''} onChange={e => setMisPronosticos({...misPronosticos, [m.id]: {...(misPronosticos[m.id] || {}), ganador: e.target.value}})}>
                        <option value="">- ¿Quién avanza? -</option>
                        {m.equipo_local && <option value={m.equipo_local}>{m.equipo_local}</option>}
                        {m.equipo_visita && <option value={m.equipo_visita}>{m.equipo_visita}</option>}
                      </select>
                    </div>
                    
                    <div className="w-20 flex flex-col items-center text-center">
                      <img src={`https://flagcdn.com/w80/${mapaISO2[m.equipo_visita] || 'unknown'}.png`} className="w-8 h-5 rounded mb-1 border border-slate-600 shadow-sm" alt={m.equipo_visita}/>
                      <p className="text-[10px] font-black leading-tight text-slate-200">{m.equipo_visita}</p>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-center text-slate-500 mt-4 uppercase font-bold tracking-wider">{m.estadio}</p>
                  
                  {canalesTV.length > 0 && (
                    <div className="flex justify-center mt-2">
                      <div className="bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2.5 shadow-sm border border-slate-300">
                        {canalesTV.map((canal, i, arr) => {
                          const c = canal.replace(/\s+/g, '');
                          return (
                            <div key={i} className="flex items-center gap-2.5">
                              {c === 'dgo' ? (
                                <img src="/dgo.png" className="h-4 object-contain" alt="DGO" />
                              ) : c === 'disney' || c === 'disney+' ? (
                                <img src="/disney.png" className="h-[18px] object-contain" alt="Disney+" />
                              ) : c === 'paramount' || c === 'paramount+' ? (
                                <img src="/paramount.png" className="h-[18px] object-contain" alt="Paramount+" />
                              ) : c === 'dazn' ? (
                                <img src="/dazn.png" className="h-4 object-contain" alt="DAZN" />
                              ) : c === 'primevideo' || c === 'prime' ? (
                                <img src="/primevideo.png" className="h-[18px] object-contain" alt="Prime Video" />
                              ) : c === 'chilevision' || c === 'chv' ? (
                                <img src="/chilevision.png" className="h-[18px] object-contain" alt="Chilevisión" />
                              ) : (
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">{canal}</span>
                              )}
                              {i < arr.length - 1 && <span className="text-slate-300 text-[11px] mb-0.5">|</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {verResultadosAmigos && (
                    <div className="mt-4 pt-4 border-t border-slate-700/60">
                      <button onClick={() => toggleExpandido(m.id)} className="w-full flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase mb-2 hover:text-emerald-400 transition-colors cursor-pointer">
                        <span>Pronósticos amigos</span>
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">{expandidos[m.id] ? '▲ Ocultar' : '▼ Ver'}</span>
                      </button>
                      
                      {expandidos[m.id] && (
                        <div className="grid grid-cols-1 gap-1.5 mt-3">
                          {todosLosPronosticos.map(p => {
                            const pron = p.partidos_marcadores[m.id];
                            if(!pron || (pron.local === '' && pron.visita === '')) return null;
                            const isMe = p.usuario_nombre === usuario;
                            const pts = esFinalizado ? calcularPuntos(pron.local, pron.visita, m.goles_local_real, m.goles_visita_real, m.fase) : null;
                            const pAvanza = (esFinalizado && pron.ganador === m.equipo_avanza_real_id) ? '+3' : '0';
                            
                            return (
                              <div key={p.usuario_nombre} className={`flex justify-between items-center p-2 rounded text-xs ${isMe ? 'bg-emerald-900/20 border border-emerald-500/30' : 'bg-slate-800/50'}`}>
                                <span className={`font-bold ${isMe ? 'text-emerald-400' : 'text-slate-300'}`}>{p.usuario_nombre}</span>
                                <div className="flex gap-4 items-center">
                                  
                                  <div className="flex flex-col items-end text-right">
                                    <span className="font-mono text-slate-400 font-bold">{pron.local} - {pron.visita}</span>
                                    {pron.ganador && (
                                      <span className="text-[8px] font-black uppercase mt-0.5 leading-none flex items-center gap-1">
                                        <span className="text-emerald-500">Pasa: {mapaISO3[pron.ganador] || pron.ganador}</span>
                                        {esFinalizado && (
                                          <span className={pAvanza === '+3' ? 'text-emerald-400' : 'text-slate-500'}>
                                            ({pAvanza} pts)
                                          </span>
                                        )}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {esFinalizado && <span className="font-black text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/30 w-12 text-center">{pts} pts</span>}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {isAdmin && (
                    <div className="mt-4 pt-3 border-t border-slate-700">
                      <button onClick={() => toggleExpandidoAdmin(m.id)} className="w-full text-[9px] text-rose-500 font-bold uppercase flex justify-between items-center">
                        <span>Panel de Administración</span>
                        <span className="bg-slate-900 border border-rose-900/30 px-2 py-0.5 rounded text-rose-400">{expandidosAdmin[m.id] ? '▲ Ocultar' : '▼ Abrir'}</span>
                      </button>
                      
                      {expandidosAdmin[m.id] && (
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <select className="col-span-2 bg-slate-950 text-rose-400 text-center py-1.5 rounded-lg border border-slate-700 text-xs font-bold" value={m.estado || 'pendiente'} onChange={(e) => actualizarDatoAdmin(m.id, 'estado', e.target.value)}>
                            <option value="pendiente">Pendiente</option>
                            <option value="bloqueado">Bloqueado</option>
                            <option value="juegoproximo">Jugarán pronto</option>
                            <option value="envivo">En vivo</option>
                            <option value="finalizado">Finalizado</option>
                          </select>
                          
                          <div className="col-span-1 flex flex-col">
                            <span className="text-[8px] text-slate-500 text-center mb-1">REAL LOCAL</span>
                            <input type="number" className="w-full bg-slate-950 text-emerald-400 text-center py-1.5 rounded-lg border border-slate-700 font-black" placeholder={m.goles_local_real !== null ? m.goles_local_real : "-"} onChange={(e) => actualizarDatoAdmin(m.id, 'goles_local_real', e.target.value)}/>
                          </div>
                          
                          <div className="col-span-1 flex flex-col">
                            <span className="text-[8px] text-slate-500 text-center mb-1">REAL VISITA</span>
                            <input type="number" className="w-full bg-slate-950 text-emerald-400 text-center py-1.5 rounded-lg border border-slate-700 font-black" placeholder={m.goles_visita_real !== null ? m.goles_visita_real : "-"} onChange={(e) => actualizarDatoAdmin(m.id, 'goles_visita_real', e.target.value)}/>
                          </div>
                          
                          <div className="col-span-2 flex flex-col mt-1">
                            <span className="text-[8px] text-slate-500 text-center mb-1">EQUIPO QUE AVANZA (REAL)</span>
                            <select className="w-full bg-slate-950 text-emerald-400 text-center py-1.5 rounded-lg border border-slate-700 text-xs font-bold" value={m.equipo_avanza_real_id || ''} onChange={(e) => actualizarDatoAdmin(m.id, 'equipo_avanza_real_id', e.target.value)}>
                              <option value="">- Seleccionar Clasificado -</option>
                              {m.equipo_local && <option value={m.equipo_local}>{m.equipo_local}</option>}
                              {m.equipo_visita && <option value={m.equipo_visita}>{m.equipo_visita}</option>}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {(index + 1) % 2 === 0 && index !== partidosMostrados.length - 1 && (
                  <div className="flex justify-center my-6">
                    <img 
                      src={arrayBanners[((index + 1) / 2 - 1) % 3]} 
                      alt="Jugabet Publicidad" 
                      className="w-full max-w-xl object-cover rounded-xl shadow-lg border border-slate-700/50 opacity-95" 
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}