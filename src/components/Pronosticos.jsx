import { useState, useEffect, useMemo, useRef } from 'react';

import { supabase } from '../supabaseClient';

import { useNavigate } from 'react-router-dom';



const mapaISO2 = { "México": "mx", "Sudáfrica": "za", "República de Corea": "kr", "República Checa": "cz", "Canadá": "ca", "Bosnia y Herzegovina": "ba", "Catar": "qa", "Suiza": "ch", "Brasil": "br", "Marruecos": "ma", "Haití": "ht", "Escocia": "gb-sct", "Estados Unidos": "us", "Paraguay": "py", "Australia": "au", "Turquía": "tr", "Alemania": "de", "Curazao": "cw", "Costa de Marfil": "ci", "Ecuador": "ec", "Países Bajos": "nl", "Japón": "jp", "Suecia": "se", "Túnez": "tn", "Bélgica": "be", "Egipto": "eg", "RI de Irán": "ir", "Nueva Zelanda": "nz", "España": "es", "Cabo Verde": "cv", "Arabia Saudí": "sa", "Uruguay": "uy", "Francia": "fr", "Senegal": "sn", "Irak": "iq", "Noruega": "no", "Argentina": "ar", "Argelia": "dz", "Austria": "at", "Jordania": "jo", "Portugal": "pt", "RD de Congo": "cd", "Uzbekistán": "uz", "Colombia": "co", "Inglaterra": "gb-eng", "Croacia": "hr", "Ghana": "gh", "Panamá": "pa" };

const mapaISO3 = { "México": "MEX", "Sudáfrica": "RSA", "República de Corea": "KOR", "República Checa": "CZE", "Canadá": "CAN", "Bosnia y Herzegovina": "BIH", "Catar": "QAT", "Suiza": "SUI", "Brasil": "BRA", "Marruecos": "MAR", "Haití": "HAI", "Escocia": "SCO", "Estados Unidos": "USA", "Paraguay": "PAR", "Australia": "AUS", "Turquía": "TUR", "Alemania": "GER", "Curazao": "CUW", "Costa de Marfil": "CIV", "Ecuador": "ECU", "Países Bajos": "NED", "Japón": "JPN", "Suecia": "SWE", "Túnez": "TUN", "Bélgica": "BEL", "Egipto": "EGY", "RI de Irán": "IRN", "Nueva Zelanda": "NZL", "España": "ESP", "Cabo Verde": "CPV", "Arabia Saudí": "KSA", "Uruguay": "URU", "Francia": "FRA", "Senegal": "SEN", "Irak": "IRQ", "Noruega": "NOR", "Argentina": "ARG", "Argelia": "ALG", "Austria": "AUT", "Jordania": "JOR", "Portugal": "POR", "RD de Congo": "COD", "Uzbekistán": "UZB", "Colombia": "COL", "Inglaterra": "ENG", "Croacia": "CRO", "Ghana": "GHA", "Panamá": "PAN" };



export default function Pronosticos() {

  const [partidos, setPartidos] = useState({});

  const [grupoActivo, setGrupoActivo] = useState('');

  const [diaActivo, setDiaActivo] = useState('');

  const [modo, setModo] = useState('grupo'); 

  const [misPronosticos, setMisPronosticos] = useState({});

  const [todosLosPronosticos, setTodosLosPronosticos] = useState([]);

  const [expandidos, setExpandidos] = useState({});

  const [expandidosAdmin, setExpandidosAdmin] = useState({}); 

  const [loading, setLoading] = useState(true);

  const [usuario, setUsuario] = useState('');

  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();



  const [campeonesData, setCampeonesData] = useState([]);

  const [expandirClasificados, setExpandirClasificados] = useState(false);

  const [pcdData, setPcdData] = useState({});



  const dateScrollRef = useRef(null);

  const activeDateRef = useRef(null);



  const ajustarHora = (h) => { if (!h) return ""; return h.substring(0, 5); };

  

  const formatearDiaSemana = (f) => { 

    if (!f) return ""; 

    const date = new Date(f + 'T00:00:00');

    const dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

    return dias[date.getDay()]; 

  };



  const formatearFechaSelector = (f) => { 

    if (!f) return ""; 

    const date = new Date(f + 'T00:00:00');

    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

    return `${date.getDate()} ${meses[date.getMonth()]}`; 

  };



  const formatearFechaTarjeta = (f) => { 

    if (!f) return ""; 

    const date = new Date(f + 'T00:00:00');

    const dias = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];

    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

    return `${dias[date.getDay()]} ${date.getDate()} ${meses[date.getMonth()]}`; 

  };



  const toggleExpandido = (id) => setExpandidos(prev => ({ ...prev, [id]: !prev[id] }));

  const toggleExpandidoAdmin = (id) => setExpandidosAdmin(prev => ({ ...prev, [id]: !prev[id] }));



  async function actualizarDatoAdmin(id, campo, valor) {

    let valorFinal = valor;

    if (campo.includes('goles')) {

      valorFinal = valor === '' ? null : parseInt(valor);

    }

    

    const { error } = await supabase.from('partidos').update({ [campo]: valorFinal }).eq('id', id);

    if (error) {

        alert("Error al actualizar: " + error.message);

    } else {

        setPartidos(prev => {

            const nuevoEstado = { ...prev };

            Object.keys(nuevoEstado).forEach(grupo => {

                nuevoEstado[grupo] = nuevoEstado[grupo].map(p => 

                    p.id === id ? { ...p, [campo]: valorFinal } : p

                );

            });

            return nuevoEstado;

        });

    }

  }



  async function actualizarPCD(equipo, valor) {

    const val = valor === '' ? 0 : parseInt(valor);

    setPcdData(prev => ({ ...prev, [equipo]: val }));

    await supabase.from('equipos_pcd').upsert({ equipo, pcd: val });

  }



  const calcularPuntos = (pL, pV, rL, rV, fase) => {

    if (rL === null || rV === null) return 0;

    const reglas = { "grupos": { lev: 2, dif: 1, exacto: 1 }, "16avos": { lev: 3, dif: 2, exacto: 2 }, "Octavos": { lev: 3, dif: 2, exacto: 2 }, "Cuartos": { lev: 3, dif: 2, exacto: 2 }, "Semifinal": { lev: 4, dif: 2, exacto: 2 }, "3er Lugar": { lev: 3, dif: 2, exacto: 2 }, "Final": { lev: 5, dif: 3, exacto: 3 } };

    const r = reglas[fase] || reglas["grupos"];

    let pts = 0;

    const pL_int = parseInt(pL); const pV_int = parseInt(pV); const rL_int = parseInt(rL); const rV_int = parseInt(rV);

    const pRes = pL_int > pV_int ? 'L' : (pL_int < pV_int ? 'V' : 'E');

    const rRes = rL_int > rV_int ? 'L' : (rL_int < rV_int ? 'V' : 'E');

    if (pRes === rRes) {

        pts += r.lev;

        if ((pL_int - pV_int) === (rL_int - rV_int)) {

            pts += r.dif;

            if (pL_int === rL_int && pV_int === rV_int) pts += r.exacto;

        }

    }

    return pts;

  };



  useEffect(() => {

    async function cargar() {

      const uId = localStorage.getItem('mi_usuario_id');

      const uRole = localStorage.getItem('usuario_role');

      if (!uId) { navigate('/login'); return; }

      

      setUsuario(uId);

      setIsAdmin(uRole === 'admin' || uId.toLowerCase() === 'pablo martin'); 

      

      const { data: p } = await supabase.from('partidos').select('*').order('id');

      if (p) {

        const partidosGrupos = p.filter(m => !m.fase || m.fase === 'grupos');

        const ag = partidosGrupos.reduce((acc, m) => { 

          const g = m.grupo || 'General'; 

          if(!acc[g]) acc[g]=[]; 

          acc[g].push(m); 

          return acc; 

        }, {});

        setPartidos(ag);



        const d = new Date();

        const hoyString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

        const fechasDisponibles = Array.from(new Set(partidosGrupos.map(m => m.fecha_solo)));



        if (fechasDisponibles.includes(hoyString)) {

          setModo('dia');

          setDiaActivo(hoyString);

          if (Object.keys(ag).length > 0) setGrupoActivo(Object.keys(ag).sort()[0]);

        } else {

          setModo('grupo');

          if (Object.keys(ag).length > 0) setGrupoActivo(Object.keys(ag).sort()[0]);

        }

      }

      

      const { data: pcd } = await supabase.from('equipos_pcd').select('*');

      if (pcd) {

        const pcdMap = {};

        pcd.forEach(item => pcdMap[item.equipo] = item.pcd);

        setPcdData(pcdMap);

      }

      const { data: c } = await supabase.from('campeones').select('*');

      if (c) setCampeonesData(c);



      const { data: pr } = await supabase.from('pronosticos').select('partidos_marcadores').eq('usuario_nombre', uId).maybeSingle();

      if(pr) setMisPronosticos(pr.partidos_marcadores || {});

      

      const { data: tod } = await supabase.from('pronosticos').select('usuario_nombre, partidos_marcadores');

      if(tod) setTodosLosPronosticos(tod);

      

      setLoading(false);

    }

    cargar();

  }, [navigate]);



  useEffect(() => {

    if (!loading && modo === 'dia' && activeDateRef.current && dateScrollRef.current) {

        setTimeout(() => {

            if (dateScrollRef.current && activeDateRef.current) {

                const container = dateScrollRef.current;

                const element = activeDateRef.current;

                container.scrollTo({

                    left: element.offsetLeft - 16,

                    behavior: 'smooth'

                });

            }

        }, 300);

    }

  }, [loading, modo, diaActivo]);



  const todasLasFechas = useMemo(() => {

    const d = new Set();

    Object.values(partidos || {}).flat().forEach(p => d.add(p.fecha_solo));

    return Array.from(d).sort();

  }, [partidos]);



  const partidosMostrados = useMemo(() => {

    let lista = [];

    if (modo === 'grupo') {

      lista = partidos[grupoActivo] || [];

    } else {

      lista = Object.values(partidos || {}).flat().filter(p => p.fecha_solo === diaActivo);

    }

    return [...lista].sort((a, b) => parseInt(a.id) - parseInt(b.id));

  }, [modo, grupoActivo, diaActivo, partidos]);



  const equiposDelGrupo = useMemo(() => {

    if (modo !== 'grupo' || !partidos[grupoActivo]) return [];

    const equipos = new Set();

    partidos[grupoActivo].forEach(p => {

      if (p.equipo_local) equipos.add(p.equipo_local);

      if (p.equipo_visita) equipos.add(p.equipo_visita);

    });

    return Array.from(equipos).sort();

  }, [modo, grupoActivo, partidos]);



  const misClasificados = useMemo(() => {

    const data = campeonesData.find(c => c.usuario_nombre === usuario);

    return data?.datos_premios || {};

  }, [campeonesData, usuario]);



  const tablaPosicionesGrupo = useMemo(() => {

    if (modo !== 'grupo' || !partidos[grupoActivo]) return [];

    const stats = {};

    equiposDelGrupo.forEach(eq => {

      stats[eq] = { nombre: eq, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pcd: pcdData[eq] || 0, pts: 0, resultados: [] };

    });

    partidos[grupoActivo].forEach(m => {

      if (m.goles_local_real !== null && m.goles_visita_real !== null) {

        const gl = parseInt(m.goles_local_real), gv = parseInt(m.goles_visita_real);

        const l = stats[m.equipo_local], v = stats[m.equipo_visita];

        if (l && v) {

          l.pj++; v.pj++; l.gf += gl; l.gc += gv; v.gf += gv; v.gc += gl;

          if (gl > gv) { l.g++; l.pts += 3; l.resultados.push('G'); v.p++; v.resultados.push('P'); }

          else if (gl < gv) { v.g++; v.pts += 3; v.resultados.push('G'); l.p++; l.resultados.push('P'); }

          else { l.e++; l.pts++; l.resultados.push('E'); v.e++; v.pts++; v.resultados.push('E'); }

          l.dg = l.gf - l.gc; v.dg = v.gf - v.gc;

        }

      }

    });

    return Object.values(stats).sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf || b.pcd - a.pcd);

  }, [modo, grupoActivo, partidos, equiposDelGrupo, pcdData]);



  async function guardarPronosticos() {

    const { error } = await supabase.from('pronosticos').upsert({ usuario_nombre: usuario, partidos_marcadores: misPronosticos });

    if(error) alert("Error: " + error.message); else alert("¡Guardado!");

  }



  const handleKeyDown = (e) => {

    if (['-', '+', 'e', 'E', '.', ','].includes(e.key)) {

      e.preventDefault();

    }

  };



  if (loading) return <div className="text-white p-20 text-center">Cargando...</div>;



  return (

    <div className="bg-[#0b1120] min-h-screen text-white pb-24">

      <div className="sticky top-0 z-50 bg-[#0b1120]/95 backdrop-blur-md border-b border-emerald-500/30 p-4 shadow-lg flex justify-between items-center">

        <h1 className="text-base font-black text-emerald-400 uppercase tracking-widest">Pronósticos</h1>

        <button onClick={guardarPronosticos} className="bg-emerald-600 px-4 py-2 rounded-lg font-black text-xs uppercase">Guardar</button>

      </div>



      <div className="sticky top-[64px] z-40 bg-[#0b1120] border-b border-slate-800 p-4 space-y-3">

        <div className="flex gap-2 overflow-x-auto scrollbar-hide">

          {Object.keys(partidos).sort().map(g => (

            <button key={g} onClick={() => { setModo('grupo'); setGrupoActivo(g); }} className={`px-4 py-1.5 rounded-lg text-xs font-black shrink-0 ${modo === 'grupo' && grupoActivo === g ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'}`}>

              {g}

            </button>

          ))}

        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide" ref={dateScrollRef}>

          {todasLasFechas.map(d => {

            const isActive = modo === 'dia' && diaActivo === d;

            return (

              <div key={d} ref={isActive ? activeDateRef : null} className="flex flex-col items-center shrink-0">

                <span className={`text-[8px] font-black uppercase mb-1 ${isActive ? 'text-amber-500' : 'text-slate-500'}`}>

                  {formatearDiaSemana(d)}

                </span>

                <button 

                  onClick={() => { setModo('dia'); setDiaActivo(d); }} 

                  className={`px-4 py-1.5 rounded-lg text-xs font-black ${isActive ? 'bg-amber-500 text-black' : 'bg-slate-900 text-slate-400 border border-slate-700'}`}

                >

                  {formatearFechaSelector(d)}

                </button>

              </div>

            )

          })}

        </div>

      </div>



      <div className="space-y-4 max-w-xl mx-auto px-4 mt-4">

        {modo === 'grupo' && equiposDelGrupo.length > 0 && (

          <div className="bg-[#1e293b] p-3 rounded-xl border border-slate-700 shadow-xl mb-6">

            <h2 className="text-[10px] font-black text-emerald-400 uppercase text-center mb-3">Integrantes del Grupo {grupoActivo}</h2>

            

            <div className="grid grid-cols-4 gap-2 mb-4">

              {equiposDelGrupo.map(eq => (

                <div key={eq} className="flex flex-col items-center justify-start text-center">

                  <img src={`https://flagcdn.com/w80/${mapaISO2[eq] || 'unknown'}.png`} className="w-10 h-7 rounded shadow-md mb-1.5 border border-slate-600" alt={eq} />

                  <span className="text-[10px] font-bold text-slate-300 leading-tight">{eq}</span>

                </div>

              ))}

            </div>



            <div className="overflow-x-auto bg-slate-950/50 rounded-lg border border-slate-800 mt-4">

              <table className="w-full text-[9px] text-center whitespace-nowrap">

                <thead className="bg-slate-900 text-slate-400 font-black uppercase border-b border-slate-700">

                  <tr>

                    <th className="px-2 py-1.5 text-left">Grupo {grupoActivo}</th>

                    <th className="px-1 py-1.5">PJ</th><th className="px-1 py-1.5">G</th><th className="px-1 py-1.5">E</th><th className="px-1 py-1.5">P</th>

                    <th className="px-1 py-1.5">GF</th><th className="px-1 py-1.5">GC</th><th className="px-1 py-1.5">DG</th>

                    <th className="px-1 py-1.5 text-slate-600">PCD</th><th className="px-1 py-1.5 text-amber-400">PTS</th>

                    <th className="px-2 py-1.5">RES</th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-800 font-medium">

                  {tablaPosicionesGrupo.map((eq, index) => {

                    const isClasificado = index === 0 || index === 1;

                    return (

                      <tr key={eq.nombre} className={`${isClasificado ? 'bg-emerald-900/10' : ''}`}>

                        <td className="px-2 py-1.5 text-left flex items-center gap-1.5">

                          <span className={`w-3 text-center font-black ${isClasificado ? 'text-emerald-400' : 'text-slate-500'}`}>{index + 1}</span>

                          <img src={`https://flagcdn.com/w20/${mapaISO2[eq.nombre] || 'unknown'}.png`} className="w-4 h-3 rounded-[1px] shadow-sm" alt={eq.nombre} />

                          <span className={`font-bold ${isClasificado ? 'text-emerald-50' : 'text-slate-300'}`}>{mapaISO3[eq.nombre] || eq.nombre}</span>

                        </td>

                        <td className="px-1 py-1.5 text-slate-300">{eq.pj}</td>

                        <td className="px-1 py-1.5 text-slate-400">{eq.g}</td><td className="px-1 py-1.5 text-slate-400">{eq.e}</td><td className="px-1 py-1.5 text-slate-400">{eq.p}</td>

                        <td className="px-1 py-1.5 text-slate-400">{eq.gf}</td><td className="px-1 py-1.5 text-slate-400">{eq.gc}</td>

                        <td className="px-1 py-1.5 text-slate-300 font-bold">{eq.dg > 0 ? `+${eq.dg}` : eq.dg}</td>

                        <td className="px-1 py-1.5 text-slate-600">{eq.pcd}</td>

                        <td className="px-1 py-1.5 text-amber-400 font-black text-[10px]">{eq.pts}</td>

                        <td className="px-2 py-1.5">

                          <div className="flex gap-1 justify-center items-center">

                            {eq.resultados.length === 0 && <span className="text-slate-600">-</span>}

                            {eq.resultados.slice(-5).map((res, i) => (

                              <span key={i} className={`w-3 h-3 text-[7px] flex items-center justify-center rounded-sm font-black text-black shadow-sm ${res === 'G' ? 'bg-emerald-500' : res === 'E' ? 'bg-amber-400' : 'bg-rose-500'}`}>

                                {res}

                              </span>

                            ))}

                          </div>

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>



            {isAdmin && (

              <div className="mt-3 p-3 bg-rose-950/20 rounded-lg border border-rose-900/50">

                <h3 className="text-[8px] text-rose-500 font-black uppercase mb-2 tracking-widest">Admin: Ajustar PCD</h3>

                <div className="grid grid-cols-4 gap-2">

                  {equiposDelGrupo.map(eq => (

                    <div key={eq} className="flex flex-col items-center bg-slate-900/40 p-1.5 rounded border border-slate-800">

                      <span className="text-[8px] text-slate-400 font-bold mb-1 text-center truncate w-full">{mapaISO3[eq]}</span>

                      <input type="number" className="w-full bg-slate-950 text-amber-400 text-center py-1 rounded border border-slate-700 text-xs font-black" value={pcdData[eq] ?? 0} onChange={(e) => actualizarPCD(eq, e.target.value)} />

                    </div>

                  ))}

                </div>

              </div>

            )}



            <div className="mt-4 pt-4 border-t border-slate-700">

                <h3 className="text-[10px] font-black text-slate-400 uppercase text-center mb-2">Tus Clasificados</h3>

                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-[11px]">

                    {misClasificados.grupos?.[grupoActivo] ? (

                        <>

                            <p className="text-center font-bold text-slate-300">

                                1º: {misClasificados.grupos[grupoActivo].primero} | 2º: {misClasificados.grupos[grupoActivo].segundo}

                            </p>

                            <p className="text-center font-bold text-slate-300 mt-1">

                                <span className="text-emerald-400">M3º:</span> {(misClasificados.mejoresTerceros || []).join(', ') || '-'}

                            </p>

                        </>

                    ) : <p className="text-center text-slate-600">No has guardado pronóstico para este grupo.</p>}

                </div>



                <button onClick={() => setExpandirClasificados(!expandirClasificados)} className="w-full mt-3 py-2 bg-slate-800 rounded text-[10px] font-black text-slate-400 uppercase hover:text-emerald-400 transition-colors">

                    {expandirClasificados ? '▲ Ocultar Clasificados Amigos' : '▼ Ver Clasificados Amigos'}

                </button>



                {expandirClasificados && (

                    <div className="mt-2 space-y-1">

                        {campeonesData.map(c => {

                            const clasif = c.datos_premios?.grupos?.[grupoActivo];

                            const mejoresTerceros = c.datos_premios?.mejoresTerceros || [];

                            if (!clasif) return null;

                            return (

                                <div key={c.usuario_nombre} className="bg-slate-950 p-2 rounded text-[10px]">

                                    <div className="flex justify-between items-center">

                                        <span className="font-bold text-slate-500">{c.usuario_nombre}</span>

                                        <span className="text-emerald-400 font-black">1º {clasif.primero} / 2º {clasif.segundo}</span>

                                    </div>

                                    <div className="text-[8px] text-slate-600 mt-1 italic">

                                        M3º: {mejoresTerceros.join(', ') || '-'}

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

          </div>

        )}



        {partidosMostrados.map(m => {

          // Normalizamos el texto para atajar cualquier formato que envíe la API o el Cron
          const estadoDB = m.estado ? m.estado.toLowerCase().trim() : '';
          
          const esPendiente = estadoDB === 'pendiente' || estadoDB === 'ns' || estadoDB === 'not started';
          const esBloqueado = estadoDB === 'bloqueado'; 
          const esEnJuego = estadoDB === 'en_juego' || estadoDB === 'en vivo' || estadoDB === 'live' || estadoDB === 'in_play' || estadoDB === '1h' || estadoDB === '2h' || estadoDB === 'ht';
          const esFinalizado = estadoDB === 'finalizado' || estadoDB === 'finished' || estadoDB === 'ft';

          

          const misPts = esFinalizado ? calcularPuntos(misPronosticos[m.id]?.local, misPronosticos[m.id]?.visita, m.goles_local_real, m.goles_visita_real, m.fase) : 0;



          // LOGICA DINÁMICA DE CANALES DE TV

          const canalesTV = m.tv ? m.tv.toLowerCase().split(',').map(c => c.trim()) : [];



          return (

            <div key={m.id} className="bg-[#1e293b] p-4 rounded-xl border border-slate-700 shadow-xl">

              <div className="relative flex justify-center items-center text-[11px] text-slate-400 mb-3 font-black uppercase w-full">

                <span className="absolute left-0 bg-slate-800 px-2 py-0.5 rounded text-emerald-400">ID: {m.id}</span>

                <span className="text-slate-300">{formatearFechaTarjeta(m.fecha_solo)} | {ajustarHora(m.hora_partido)}</span>

                <span className="absolute right-0 bg-slate-800 px-2 py-0.5 rounded text-amber-400">Grupo {m.grupo}</span>

              </div>



              {esFinalizado && (

                <div className="text-center mb-4 bg-slate-950/40 py-2 rounded-lg border border-slate-800/80">

                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-0.5">Resultado Real</span>

                  <span className="text-2xl font-black text-amber-400 tracking-widest">{m.goles_local_real} - {m.goles_visita_real}</span>

                </div>

              )}



              <div className="flex items-center justify-between gap-4">

                <div className="w-20 flex flex-col items-center">

                   <img src={`https://flagcdn.com/w80/${mapaISO2[m.equipo_local] || 'unknown'}.png`} className="w-8 h-5 rounded mb-1" alt={m.equipo_local} />

                   <p className="text-[12px] font-bold text-center">{mapaISO3[m.equipo_local]}</p>

                </div>

                

                <div className="flex flex-col items-center">

                  <div className="flex gap-2 items-center">

                    <input 

                      type="number" 

                      min="0"

                      onKeyDown={handleKeyDown}

                      disabled={!esPendiente} 

                      className={`w-12 h-12 text-center rounded-lg border text-xl font-black ${

                        esPendiente ? 'bg-slate-900 text-emerald-400 border-slate-600' : 'bg-slate-800 text-slate-500 border-slate-700'

                      }`} 

                      value={misPronosticos[m.id]?.local ?? ''} 

                      onChange={e => {

                        let val = e.target.value;

                        if (val !== '' && parseInt(val) < 0) return;

                        setMisPronosticos({...misPronosticos, [m.id]: {...(misPronosticos[m.id] || {}), local: val}});

                      }}

                    />

                    <span className="text-slate-600 font-black">vs</span>

                    <input 

                      type="number" 

                      min="0"

                      onKeyDown={handleKeyDown}

                      disabled={!esPendiente} 

                      className={`w-12 h-12 text-center rounded-lg border text-xl font-black ${

                        esPendiente ? 'bg-slate-900 text-emerald-400 border-slate-600' : 'bg-slate-800 text-slate-500 border-slate-700'

                      }`} 

                      value={misPronosticos[m.id]?.visita ?? ''} 

                      onChange={e => {

                        let val = e.target.value;

                        if (val !== '' && parseInt(val) < 0) return;

                        setMisPronosticos({...misPronosticos, [m.id]: {...(misPronosticos[m.id] || {}), visita: val}});

                      }}

                    />

                  </div>

                  

{esEnJuego && (
  <div className="text-[10px] text-rose-500 font-black mt-2 bg-rose-950/40 px-3 py-1 rounded border border-rose-900/50 tracking-widest animate-pulse">
    EN VIVO 🔴
  </div>
)}
                  {esBloqueado && <div className="text-[9px] text-rose-400 font-black mt-2 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900/50">BLOQUEADO</div>}

                  

                  {esFinalizado && (

                    <div className="mt-2.5 text-center">

                      <div className="text-[12px] text-emerald-400 font-black bg-emerald-950/40 px-3 py-0.5 rounded border border-emerald-900/20 tracking-wider">

                        +{misPts} PUNTOS

                      </div>

                    </div>

                  )}

                </div>

                

                <div className="w-20 flex flex-col items-center">

                   <img src={`https://flagcdn.com/w80/${mapaISO2[m.equipo_visita] || 'unknown'}.png`} className="w-8 h-5 rounded mb-1" alt={m.equipo_visita} />

                   <p className="text-[12px] font-bold text-center">{mapaISO3[m.equipo_visita]}</p>

                </div>

              </div>

              

              <p className="text-[10px] text-center text-slate-500 mt-3 uppercase font-bold">{m.estadio}</p>

              

              {/* RENDERIZADO DINÁMICO DE LOGOS EN CALUGA BLANCA AJUSTADA */}

              {canalesTV.length > 0 && (

                <div className="flex justify-center mt-2">

                  <div className="bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2.5 shadow-sm border border-slate-300">

                    {canalesTV.map((canal, index, arr) => {

                      const c = canal.replace(/\s+/g, ''); // Limpiar espacios extras

                      return (

                        <div key={index} className="flex items-center gap-2.5">

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

                          {index < arr.length - 1 && <span className="text-slate-300 text-[11px] mb-0.5">|</span>}

                        </div>

                      );

                    })}

                  </div>

                </div>

              )}

              

              {(esEnJuego || esFinalizado) && (

                <div className="mt-4 pt-4 border-t border-slate-700">

                  <button 

                    onClick={() => toggleExpandido(m.id)} 

                    className="w-full flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase mb-1 hover:text-emerald-400 transition-colors cursor-pointer"

                  >

                    <span>Pronósticos amigos</span>

                    <span className="bg-slate-800 px-2 py-0.5 rounded">{expandidos[m.id] ? '▲ Ocultar' : '▼ Ver'}</span>

                  </button>

                  

                  {expandidos[m.id] && (

                    <div className="grid grid-cols-1 gap-2 mt-3">

                      {todosLosPronosticos.map(p => {

                        const pron = p.partidos_marcadores[m.id];

                        if(!pron || (!pron.local && !pron.visita)) return null;

                        const isMe = p.usuario_nombre === usuario;

                        const pts = esFinalizado ? calcularPuntos(pron.local, pron.visita, m.goles_local_real, m.goles_visita_real, m.fase) : null;

                        return (

                          <div key={p.usuario_nombre} className={`flex justify-between items-center p-2 rounded ${isMe ? 'bg-emerald-900/30 border border-emerald-500/50' : 'bg-slate-800'}`}>

                            <span className={`text-[12px] font-bold ${isMe ? 'text-emerald-400' : 'text-slate-300'}`}>{p.usuario_nombre}</span>

                            <div className="flex gap-4 items-center">

                              <span className="font-mono text-[12px] text-slate-400">{pron.local}-{pron.visita}</span>

                              {esFinalizado && <span className="text-[12px] font-black text-amber-400">{pts} pts</span>}

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

                    <button 

                        onClick={() => toggleExpandidoAdmin(m.id)} 

                        className="w-full flex justify-between items-center text-[10px] text-rose-500 font-bold uppercase mb-1 hover:text-rose-400 transition-colors cursor-pointer"

                    >

                        <span>Panel de Administración</span>

                        <span className="bg-slate-900 border border-rose-900/30 px-2 py-0.5 rounded text-rose-400">{expandidosAdmin[m.id] ? '▲ Ocultar' : '▼ Abrir'}</span>

                    </button>

                    

                    {expandidosAdmin[m.id] && (

                        <div className="grid grid-cols-3 gap-2 mt-3">

                            <select 

                                className="col-span-3 bg-slate-950 text-rose-400 text-center py-1.5 rounded-lg border border-slate-700 text-xs font-bold"

                                value={m.estado}

                                onChange={(e) => actualizarDatoAdmin(m.id, 'estado', e.target.value)}

                            >

                                <option value="pendiente">Pendiente</option>

                                <option value="bloqueado">Bloqueado</option>

                                <option value="en_juego">En Juego</option>

                                <option value="finalizado">Finalizado</option>

                            </select>



                            <div className="col-span-1.5 flex flex-col">

                                <span className="text-[8px] text-slate-500 text-center mb-1">REAL LOCAL</span>

                                <input 

                                    type="number" 

                                    min="0"

                                    onKeyDown={handleKeyDown}

                                    className="w-full bg-slate-950 text-emerald-400 text-center py-1.5 rounded-lg border border-slate-700 font-black" 

                                    placeholder={m.goles_local_real !== null ? m.goles_local_real : "-"} 

                                    onChange={(e) => actualizarDatoAdmin(m.id, 'goles_local_real', e.target.value)} 

                                />

                            </div>



                            <div className="col-span-1.5 flex flex-col">

                                <span className="text-[8px] text-slate-500 text-center mb-1">REAL VISITA</span>

                                <input 

                                    type="number" 

                                    min="0"

                                    onKeyDown={handleKeyDown}

                                    className="w-full bg-slate-950 text-emerald-400 text-center py-1.5 rounded-lg border border-slate-700 font-black" 

                                    placeholder={m.goles_visita_real !== null ? m.goles_visita_real : "-"} 

                                    onChange={(e) => actualizarDatoAdmin(m.id, 'goles_visita_real', e.target.value)} 

                                />

                            </div>

                        </div>

                    )}

                </div>

              )}



            </div>

          );

        })}

      </div>

    </div>

  );

}  


