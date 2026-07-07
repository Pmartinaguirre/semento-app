import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// IMPORTACIÓN DEL BANNER DESDE ASSETS
import bannerImg from '../assets/bannermartingames.png';

const mapaISO2 = { "México": "mx", "Sudáfrica": "za", "República de Corea": "kr", "República Checa": "cz", "Canadá": "ca", "Bosnia y Herzegovina": "ba", "Catar": "qa", "Suiza": "ch", "Brasil": "br", "Marruecos": "ma", "Haití": "ht", "Escocia": "gb-sct", "Estados Unidos": "us", "Paraguay": "py", "Australia": "au", "Turquía": "tr", "Alemania": "de", "Curazao": "cw", "Costa de Marfil": "ci", "Ecuador": "ec", "Países Bajos": "nl", "Japón": "jp", "Suecia": "se", "Túnez": "tn", "Bélgica": "be", "Egipto": "eg", "RI de Irán": "ir", "Nueva Zelanda": "nz", "España": "es", "Cabo Verde": "cv", "Arabia Saudí": "sa", "Uruguay": "uy", "Francia": "fr", "Senegal": "sn", "Irak": "iq", "Noruega": "no", "Argentina": "ar", "Argelia": "dz", "Austria": "at", "Jordania": "jo", "Portugal": "pt", "RD de Congo": "cd", "Uzbekistán": "uz", "Colombia": "co", "Inglaterra": "gb-eng", "Croacia": "hr", "Ghana": "gh", "Panamá": "pa" };
const mapaISO3 = { "México": "MEX", "Sudáfrica": "RSA", "República de Corea": "KOR", "República Checa": "CZE", "Canadá": "CAN", "Bosnia y Herzegovina": "BIH", "Catar": "QAT", "Suiza": "SUI", "Brasil": "BRA", "Marruecos": "MAR", "Haití": "HAI", "Escocia": "SCO", "Estados Unidos": "USA", "Paraguay": "PAR", "Australia": "AUS", "Turquía": "TUR", "Alemania": "GER", "Curazao": "CUW", "Costa de Marfil": "CIV", "Ecuador": "ECU", "Países Bajos": "NED", "Japón": "JPN", "Suecia": "SWE", "Túnez": "TUN", "Bélgica": "BEL", "Egipto": "EGY", "RI de Irán": "IRN", "Nueva Zelanda": "NZL", "España": "ESP", "Cabo Verde": "CPV", "Arabia Saudí": "KSA", "Uruguay": "URU", "Francia": "FRA", "Senegal": "SEN", "Irak": "IRQ", "Noruega": "NOR", "Argentina": "ARG", "Argelia": "ALG", "Austria": "AUT", "Jordania": "JOR", "Portugal": "POR", "RD de Congo": "COD", "Uzbekistán": "UZB", "Colombia": "COL", "Inglaterra": "ENG", "Croacia": "CRO", "Ghana": "GHA", "Panamá": "PAN" };

const COLORES_GRAFICO = ['#34d399', '#fb923c', '#38bdf8', '#f43f5e', '#e879f9', '#facc15', '#a7f3d0', '#60a5fa', '#fb7185', '#c084fc', '#f472b6', '#2dd4bf'];

const renderBanderaYAbrev = (pais) => {
  if (!pais || pais === '-' || pais.trim() === '') return <span className="text-slate-600">-</span>;
  const iso2 = mapaISO2[pais] || 'unknown';
  const abrev = mapaISO3[pais] || pais.substring(0, 3).toUpperCase();
  return (
    <span className="inline-flex items-center gap-1.5 align-middle">
      <img src={`https://flagcdn.com/w20/${iso2}.png`} className="w-[14px] h-[10px] rounded-[1px] opacity-90 shadow-sm" alt={pais} />
      <span className="font-black text-slate-300 leading-none">{abrev}</span>
    </span>
  );
};

// --- FUNCIONES PARA CALCULAR INSIGNIAS Y RANGOS ---
const calcularInsigniaLev = (lev) => {
  const rangos = [
    { min: 0, name: 'Principiante', emoji: '🐣' },
    { min: 10, name: 'Novato', emoji: '🌱' },
    { min: 40, name: 'Entusiasta', emoji: '🔥' },
    { min: 45, name: 'Observador', emoji: '👀' },
    { min: 50, name: 'Buen pronosticador', emoji: '👍' },
    { min: 60, name: 'Analista', emoji: '📊' },
    { min: 70, name: 'Estratega', emoji: '🧠' },
    { min: 85, name: 'Táctico', emoji: '♟️' },
    { min: 100, name: 'Maestro', emoji: '👑' }
  ];
  let actual = rangos[0];
  let sig = rangos[1];
  for (let i = 0; i < rangos.length; i++) {
    if (lev >= rangos[i].min) {
      actual = rangos[i];
      sig = rangos[i + 1] || { min: actual.min, name: 'Máximo Alcanzado', emoji: '🌟' };
    }
  }
  return { ...actual, sigMin: sig.min, sigName: sig.name, sigEmoji: sig.emoji };
};

const calcularInsigniaPrecision = (exacto, dif) => {
  const pts = Math.round(exacto + (dif * 0.5));
  const rangos = [
    { min: 0, name: 'Sin Clasificar', emoji: '⚪' },
    { min: 1, name: 'Cazador de marcadores', emoji: '🎯' },
    { min: 10, name: 'Tirador certero', emoji: '🔫' },
    { min: 15, name: 'Maestro de la precisión', emoji: '🏹' },
    { min: 25, name: 'Tirador de élite', emoji: '🦅' },
    { min: 28, name: 'Pronosticador preciso', emoji: '🔍' },
    { min: 32, name: 'Experto en marcadores', emoji: '🏅' },
    { min: 38, name: 'Maestro de resultados', emoji: '🏆' },
    { min: 50, name: 'Leyenda', emoji: '🐐' }
  ];
  let actual = rangos[0];
  let sig = rangos[1];
  for (let i = 0; i < rangos.length; i++) {
    if (pts >= rangos[i].min) {
      actual = rangos[i];
      sig = rangos[i + 1] || { min: actual.min, name: 'Máximo Alcanzado', emoji: '🌟' };
    }
  }
  return { pts, ...actual, sigMin: sig.min, sigName: sig.name, sigEmoji: sig.emoji };
};

export default function Ranking() {
  const [usuarios, setUsuarios] = useState([]);
  const [partidosRaw, setPartidosRaw] = useState([]);
  const [todosLosPronosticos, setTodosLosPronosticos] = useState([]);
  const [todosLosFinales, setTodosLosFinales] = useState([]); 
  const [datosCampeones, setDatosCampeones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuarioExpandido, setUsuarioExpandido] = useState(null);

  const [realGrupos, setRealGrupos] = useState({});
  const [realTerceros, setRealTerceros] = useState([]);
  
  const [edicionPartidos, setEdicionPartidos] = useState({});
  const [tipoGrafico, setTipoGrafico] = useState('puntos');
  const [jugadorDestacado, setJugadorDestacado] = useState(null);

  // Estados para el Muro de los Lamentos
  const [miUsuarioNombre, setMiUsuarioNombre] = useState('');
  const [mensajesMuro, setMensajesMuro] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [yaComentoHoy, setYaComentoHoy] = useState(false);
  const [enviandoMensaje, setEnviandoMensaje] = useState(false);

  const isAdmin = useMemo(() => {
    const uId = localStorage.getItem('mi_usuario_id');
    const uRole = localStorage.getItem('usuario_role');
    return uRole === 'admin' || uId?.toLowerCase() === 'pablo martin';
  }, []);

  const obtenerReglas = (fase) => {
    const f = (fase || '').toLowerCase();
    if (f.includes('16')) return { lev: 3, dif: 2, exacto: 2 };
    if (f.includes('oct') || f.includes('8')) return { lev: 3, dif: 2, exacto: 2 };
    if (f.includes('cua') || f.includes('4')) return { lev: 3, dif: 2, exacto: 2 };
    if (f.includes('sem')) return { lev: 4, dif: 2, exacto: 2 };
    if (f.includes('3') || f.includes('ter')) return { lev: 3, dif: 2, exacto: 2 };
    if (f.includes('fin')) return { lev: 5, dif: 3, exacto: 3 };
    return { lev: 2, dif: 1, exacto: 1 };
  };

  const obtenerPuntosPorAvanzar = (fase) => {
    const f = (fase || '').toLowerCase();
    if (f.includes('16')) return 3; 
    if (f.includes('oct') || f.includes('8')) return 3; 
    if (f.includes('cua') || f.includes('4')) return 3; 
    if (f.includes('sem')) return 4; 
    return 0; 
  };

  const calcularPuntosPartido = (pL, pV, rL, rV, fase) => {
    if (rL === null || rV === null || pL === '' || pV === '' || pL === undefined || pV === undefined) return 0;
    const r = obtenerReglas(fase);
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

  const cargarMensajesMuro = async (nombreUser) => {
    const { data } = await supabase.from('muro_mensajes').select('*').order('created_at', { ascending: false }).limit(30);
    if (data) {
      setMensajesMuro(data);
      const hoy = new Date().toLocaleDateString('es-CL', { timeZone: 'America/Santiago' });
      const publicoHoy = data.some(m => 
        m.usuario_nombre === nombreUser && 
        new Date(m.created_at).toLocaleDateString('es-CL', { timeZone: 'America/Santiago' }) === hoy
      );
      setYaComentoHoy(publicoHoy);
    }
  };

  useEffect(() => {
    async function cargarDatos() {
      const uId = localStorage.getItem('mi_usuario_id');
      setMiUsuarioNombre(uId || '');

      const { data: u } = await supabase.from('usuarios').select('*');
      const { data: p } = await supabase.from('partidos').select('*').order('id');
      const { data: pr } = await supabase.from('pronosticos').select('*');
      const { data: fin } = await supabase.from('finales').select('*'); 
      const { data: c } = await supabase.from('campeones').select('*');
      
      if (u) setUsuarios(u.filter(usr => usr.approved));
      if (p) {
        setPartidosRaw(p);
        const inicial = {};
        p.filter(m => m.id >= 73).forEach(m => {
          inicial[m.id] = {
            goles_local_real: m.goles_local_real ?? '',
            goles_visita_real: m.goles_visita_real ?? '',
            equipo_avanza_real_id: m.equipo_avanza_real_id ?? ''
          };
        });
        setEdicionPartidos(inicial);
      }
      if (pr) setTodosLosPronosticos(pr);
      if (fin) setTodosLosFinales(fin);
      if (c) {
        setDatosCampeones(c);
        const realObj = c.find(item => item.usuario_nombre === 'REAL');
        if (realObj?.datos_premios) {
          setRealGrupos(realObj.datos_premios.grupos || {});
          setRealTerceros(realObj.datos_premios.mejoresTerceros || []);
        }
      }
      
      await cargarMensajesMuro(uId);
      setLoading(false);
    }
    cargarDatos();
  }, []);

  async function publicarEnMuro() {
    if (!nuevoMensaje.trim() || yaComentoHoy) return;
    setEnviandoMensaje(true);
    const { error } = await supabase.from('muro_mensajes').insert([
      { usuario_nombre: miUsuarioNombre, mensaje: nuevoMensaje.trim() }
    ]);
    if (!error) {
      setNuevoMensaje('');
      await cargarMensajesMuro(miUsuarioNombre);
    } else {
      alert("Error al publicar: " + error.message);
    }
    setEnviandoMensaje(false);
  }

  async function guardarResultadosReales() {
    const { error } = await supabase.from('campeones').upsert({
      usuario_nombre: 'REAL',
      datos_premios: { grupos: realGrupos, mejoresTerceros: realTerceros }
    });
    if (error) {
      alert("Error al guardar resultados oficiales: " + error.message);
    } else {
      alert("¡Resultados oficiales guardados correctamente!");
      window.location.reload();
    }
  }

  const reales16ClasificadosGlobal = useMemo(() => {
    const lista = [];
    Object.values(realGrupos).forEach(g => {
      if (g.primero) lista.push(g.primero);
      if (g.segundo) lista.push(g.segundo);
    });
    realTerceros.forEach(t => {
      if (t) lista.push(t);
    });
    return lista;
  }, [realGrupos, realTerceros]);

  const tablaPosiciones = useMemo(() => {
    return usuarios.map(usr => {
      let pts = 0; let lev = 0; let exacto = 0; let dif = 0; let pj = 0;
      let partidosPronosticados = 0;

      // APUNTAR RUTA LOCAL A LA CARPETA PUBLIC y crear el plan de respaldo en texto
      const fotoPerfilLocal = `/jugadores/${usr.nombre}.png`;
      const avatarRespaldo = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${usr.nombre}`;

      const prFull = todosLosPronosticos.find(p => p.usuario_nombre === usr.nombre) || {};
      const finFull = todosLosFinales.find(p => p.usuario_nombre === usr.nombre) || {};
      
      const prUser = { ...(prFull.partidos_marcadores || {}), ...(finFull.partidos_marcadores || {}) };
      
      Object.keys(prUser).forEach(id => {
        const p = prUser[id];
        if (p && p.local !== '' && p.visita !== '' && p.local !== undefined && p.visita !== undefined) {
          partidosPronosticados++;
        }
      });

      const campData = datosCampeones.find(c => c.usuario_nombre === usr.nombre);
      const extras = campData?.datos_premios || {};

      let desgloseExtra = { grupos: 0, d16avos: 0, octavos: 0, cuartos: 0, semis: 0, final: 0, predicciones: 0 };
      
      let desgloseFases = {
        grupos: { pj: 0, lev: 0, exacto: 0, dif: 0, pts: 0 },
        d16avos: { pj: 0, lev: 0, exacto: 0, dif: 0, pts: 0 },
        octavos: { pj: 0, lev: 0, exacto: 0, dif: 0, pts: 0 },
        cuartos: { pj: 0, lev: 0, exacto: 0, dif: 0, pts: 0 },
        semis: { pj: 0, lev: 0, exacto: 0, dif: 0, pts: 0 },
        tercerCuarto: { pj: 0, lev: 0, exacto: 0, dif: 0, pts: 0 },
        final: { pj: 0, lev: 0, exacto: 0, dif: 0, pts: 0 }
      };

      partidosRaw.forEach(m => {
        const p = prUser[m.id];
        const tieneGolesReales = m.goles_local_real !== null && m.goles_visita_real !== null;
        const seJugo = m.estado === 'finalizado' || tieneGolesReales;
        
        if (seJugo) {
          pj += 1; 
          const faseStr2 = (m.fase || '').toLowerCase();
          let fKey = 'grupos';
          if (faseStr2.includes('16')) fKey = 'd16avos';
          else if (faseStr2.includes('8') || faseStr2.includes('oct')) fKey = 'octavos';
          else if (faseStr2.includes('4') || faseStr2.includes('cua')) fKey = 'cuartos';
          else if (faseStr2.includes('3') || faseStr2.includes('ter')) fKey = 'tercerCuarto';
          else if (faseStr2.includes('sem')) fKey = 'semis';
          else if (faseStr2.includes('fin')) fKey = 'final';

          desgloseFases[fKey].pj += 1;
          
          if (tieneGolesReales && p && p.local !== '' && p.visita !== '' && p.local !== undefined && p.visita !== undefined) {
            const pL = parseInt(p.local); const pV = parseInt(p.visita);
            const rL = parseInt(m.goles_local_real); const rV = parseInt(m.goles_visita_real);
            const pRes = pL > pV ? 'L' : (pL < pV ? 'V' : 'E');
            const rRes = rL > rV ? 'L' : (rL < rV ? 'V' : 'E');

            if (pRes === rRes) {
              const r = obtenerReglas(m.fase);
              pts += r.lev; lev += 1; 
              desgloseFases[fKey].pts += r.lev; desgloseFases[fKey].lev += 1;
              
              if (pL === rL && pV === rV) { 
                pts += r.dif + r.exacto; exacto += 1; 
                desgloseFases[fKey].pts += (r.dif + r.exacto); desgloseFases[fKey].exacto += 1;
              } else if ((pL - pV) === (rL - rV)) {
                pts += r.dif; dif += 1; 
                desgloseFases[fKey].pts += r.dif; desgloseFases[fKey].dif += 1;
              }
            }
          }
        }

        if (m.id >= 73 && m.equipo_avanza_real_id && p && p.ganador) {
            if (m.equipo_avanza_real_id === p.ganador) {
                const faseStr = (m.fase || '').toLowerCase();
                const ptsAvanzar = obtenerPuntosPorAvanzar(m.fase);

                if (faseStr.includes('16')) desgloseExtra.d16avos += ptsAvanzar;
                else if (faseStr.includes('8') || faseStr.includes('oct')) desgloseExtra.octavos += ptsAvanzar;
                else if (faseStr.includes('4') || faseStr.includes('cua')) desgloseExtra.cuartos += ptsAvanzar;
                else if (faseStr.includes('3') || faseStr.includes('sem')) desgloseExtra.semis += ptsAvanzar;
            }
        }
      });

      let puntosExtraGrupos = 0;
      if (extras.grupos) {
        Object.keys(extras.grupos).forEach(letra => {
          const uProg = extras.grupos[letra] || {};
          const rProg = realGrupos[letra] || {};
          if (uProg.primero && reales16ClasificadosGlobal.includes(uProg.primero)) puntosExtraGrupos += 1;
          if (uProg.segundo && reales16ClasificadosGlobal.includes(uProg.segundo)) puntosExtraGrupos += 1;
          if (uProg.primero && uProg.primero === rProg.primero) puntosExtraGrupos += 1;
          if (uProg.segundo && uProg.segundo === rProg.segundo) puntosExtraGrupos += 1;
        });
      }

      if (extras.mejoresTerceros) {
        extras.mejoresTerceros.forEach(t => {
          if (t && reales16ClasificadosGlobal.includes(t)) puntosExtraGrupos += 1;
        });
      }

      desgloseExtra.grupos = puntosExtraGrupos;

      const totalPuntosExtra = Object.values(desgloseExtra).reduce((a, b) => a + b, 0);
      pts += totalPuntosExtra;
      
      const rendimiento = pj > 0 ? Math.round((lev / pj) * 100) : 0; 

      return {
        nombre: usr.nombre,
        avatar: fotoPerfilLocal,
        fallback: avatarRespaldo,
        puntos: pts, lev: lev, exacto: exacto, dif: dif, pj: pj, rendimiento: rendimiento,
        partidosPronosticados,
        puntosExtra: totalPuntosExtra,
        desgloseExtra: desgloseExtra,
        desgloseFases: desgloseFases,
        pronosticos: prUser, 
        extras: extras
      };
    }).sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos; 
      if (b.lev !== a.lev) return b.lev - a.lev;             
      if (b.exacto !== a.exacto) return b.exacto - a.exacto; 
      return b.dif - a.dif;                                  
    });
  }, [usuarios, partidosRaw, todosLosPronosticos, todosLosFinales, datosCampeones, reales16ClasificadosGlobal, realGrupos]);

  const datosGraficoEvolucion = useMemo(() => {
    const partidosFinalizados = partidosRaw
      .filter(m => m.estado === 'finalizado' || (m.goles_local_real !== null && m.goles_visita_real !== null))
      .sort((a, b) => a.id - b.id);

    const bonosGruposFijos = {};
    usuarios.forEach(usr => {
      let pExt = 0;
      const campData = datosCampeones.find(c => c.usuario_nombre === usr.nombre);
      const extras = campData?.datos_premios || {};
      if (extras.grupos) {
        Object.keys(extras.grupos).forEach(letra => {
          const uProg = extras.grupos[letra] || {};
          const rProg = realGrupos[letra] || {};
          if (uProg.primero && reales16ClasificadosGlobal.includes(uProg.primero)) pExt += 1;
          if (uProg.segundo && reales16ClasificadosGlobal.includes(uProg.segundo)) pExt += 1;
          if (uProg.primero && uProg.primero === rProg.primero) pExt += 1;
          if (uProg.segundo && uProg.segundo === rProg.segundo) pExt += 1;
        });
      }
      if (extras.mejoresTerceros) {
        extras.mejoresTerceros.forEach(t => {
          if (t && reales16ClasificadosGlobal.includes(t)) pExt += 1;
        });
      }
      bonosGruposFijos[usr.nombre] = pExt;
    });

    const puntosAcumulados = {};
    usuarios.forEach(u => { puntosAcumulados[u.nombre] = 0; });

    const historial = [];
    const inicio = { name: '0' };
    usuarios.forEach((u, i) => { inicio[u.nombre] = 0; inicio[`${u.nombre}_puesto`] = i + 1; });
    historial.push(inicio);

    partidosFinalizados.forEach((m, idx) => {
      const paso = { name: `${idx + 1}` };

      usuarios.forEach(usr => {
        const prFull = todosLosPronosticos.find(p => p.usuario_nombre === usr.nombre) || {};
        const finFull = todosLosFinales.find(p => p.usuario_nombre === usr.nombre) || {};
        const prUser = { ...(prFull.partidos_marcadores || {}), ...(finFull.partidos_marcadores || {}) };
        const p = prUser[m.id];
        
        let ptsDelPartido = 0;
        const tieneGolesReales = m.goles_local_real !== null && m.goles_visita_real !== null;
        
        if (tieneGolesReales && p && p.local !== '' && p.visita !== '' && p.local !== undefined && p.visita !== undefined) {
          ptsDelPartido += calcularPuntosPartido(p.local, p.visita, m.goles_local_real, m.goles_visita_real, m.fase);
        }
        
        if (m.id >= 73 && m.equipo_avanza_real_id && p && p.ganador === m.equipo_avanza_real_id) {
          ptsDelPartido += obtenerPuntosPorAvanzar(m.fase);
        }
        
        puntosAcumulados[usr.nombre] += ptsDelPartido;
      });

      const yaTerminoGrupos = partidosFinalizados.slice(0, idx + 1).some(p => p.fase !== 'grupos') || 
                              (m.fase === 'grupos' && (idx === partidosFinalizados.length - 1 || partidosFinalizados[idx + 1]?.fase !== 'grupos'));

      const snapshotPuntos = usuarios.map(usr => {
        let totalHito = puntosAcumulados[usr.nombre];
        if (yaTerminoGrupos) totalHito += bonosGruposFijos[usr.nombre];
        return { nombre: usr.nombre, puntos: totalHito };
      }).sort((a, b) => b.puntos - a.puntos);

      usuarios.forEach(usr => {
        let totalHito = puntosAcumulados[usr.nombre];
        if (yaTerminoGrupos) totalHito += bonosGruposFijos[usr.nombre];
        paso[usr.nombre] = totalHito;
        paso[`${usr.nombre}_puesto`] = snapshotPuntos.findIndex(x => x.nombre === usr.nombre) + 1;
      });

      historial.push(paso);
    });

    return historial;
  }, [usuarios, partidosRaw, todosLosPronosticos, todosLosFinales, datosCampeones, reales16ClasificadosGlobal, realGrupos]);

  const formatearFechaHora = (isoStr) => {
    const d = new Date(isoStr);
    return d.toLocaleTimeString('es-CL', { hour: '2-digit', minute:'2-digit', timeZone: 'America/Santiago' });
  };

  if (loading) return <div className="text-white p-20 text-center font-bold">Calculando posiciones globales...</div>;

  return (
    <div className="bg-[#0b1120] min-h-screen text-white p-4 pb-24 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-black text-center text-emerald-400 uppercase tracking-widest mb-4">Tabla de Posiciones</h1>
        
        {/* === MURO DE LOS LAMENTOS === */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden mb-6">
          <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest">🗣️ El Muro de los Lamentos</h2>
          </div>
          
          <div className="p-4 bg-slate-900/50">
            <div className="max-h-40 overflow-y-auto space-y-3 mb-4 pr-2 custom-scrollbar">
              {mensajesMuro.length === 0 ? (
                <p className="text-xs text-slate-500 text-center italic">Aún no hay lamentos hoy. ¡Sé el primero!</p>
              ) : (
                mensajesMuro.map(msg => {
                  const esMio = msg.usuario_nombre === miUsuarioNombre;
                  const usrObj = tablaPosiciones.find(u => u.nombre === msg.usuario_nombre);
                  
                  // Rutas dinámicas locales para los comentarios
                  const avatarMsg = usrObj?.avatar || `/jugadores/${msg.usuario_nombre}.png`;
                  const fallbackMsg = usrObj?.fallback || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${msg.usuario_nombre}`;
                  
                  return (
                    <div key={msg.id} className={`flex gap-2.5 items-start ${esMio ? 'flex-row-reverse' : ''}`}>
                      <img 
                        src={avatarMsg} 
                        onError={(e) => { e.target.onerror = null; e.target.src = fallbackMsg; }}
                        className="w-6 h-6 rounded-full object-cover bg-slate-800 border border-slate-700 shadow-sm flex-shrink-0" 
                        alt="avatar" 
                      />
                      <div className={`flex flex-col ${esMio ? 'items-end' : 'items-start'} max-w-[80%]`}>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[9px] font-black text-slate-400">{msg.usuario_nombre}</span>
                          <span className="text-[8px] text-slate-600">{formatearFechaHora(msg.created_at)}</span>
                        </div>
                        <div className={`p-2 rounded-xl text-[11px] leading-tight font-medium ${esMio ? 'bg-emerald-900/40 border border-emerald-500/30 text-emerald-100 rounded-tr-sm' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'}`}>
                          {msg.mensaje}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {yaComentoHoy ? (
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center text-[10px] text-slate-500 font-bold">
                Ya publicaste tu mensaje del día. ¡Vuelve mañana para más salseo!
              </div>
            ) : (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  maxLength={150}
                  placeholder="Llora aquí (máx 1 al día)..." 
                  value={nuevoMensaje}
                  onChange={(e) => setNuevoMensaje(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button 
                  onClick={publicarEnMuro}
                  disabled={enviandoMensaje || !nuevoMensaje.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-black px-4 py-2 rounded-lg font-black text-[10px] uppercase transition-colors"
                >
                  Enviar
                </button>
              </div>
            )}
          </div>
        </div>


        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 gap-1 p-2 bg-slate-950 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-800 text-center items-center">
            <div className="col-span-1">Pos</div>
            <div className="col-span-3 text-left px-1">Jugador</div>
            <div className="col-span-1" title="Partidos Jugados">PJ</div>
            <div className="col-span-1" title="Local/Empate/Visita">LEV</div>
            <div className="col-span-1" title="Resultado Exacto">EXC</div>
            <div className="col-span-1" title="Diferencia de Gol (Excluye Exactos)">DIF</div>
            <div className="col-span-1 text-emerald-400" title="Puntos Extra por Clasificados">P.EXT</div>
            <div className="col-span-1" title="Rendimiento">%</div>
            <div className="col-span-2 text-amber-400">PTS</div>
          </div>

          <div className="divide-y divide-slate-800/60">
            {tablaPosiciones.map((jugador, index) => {
              const esExpandido = usuarioExpandido === jugador.nombre;
              
              const getPuntosGrupo = (g) => {
                let pts = 0;
                const uProg = jugador.extras?.grupos?.[g] || {};
                const rProg = realGrupos?.[g] || {};
                if (uProg.primero && reales16ClasificadosGlobal.includes(uProg.primero)) pts += 1;
                if (uProg.segundo && reales16ClasificadosGlobal.includes(uProg.segundo)) pts += 1;
                if (uProg.primero && uProg.primero === rProg.primero) pts += 1;
                if (uProg.segundo && uProg.segundo === rProg.segundo) pts += 1;
                return pts;
              };
              const ptsTerceros = jugador.extras?.mejoresTerceros?.reduce((acc, t) => acc + (t && reales16ClasificadosGlobal.includes(t) ? 1 : 0), 0) || 0;

              const insigLev = calcularInsigniaLev(jugador.lev);
              const insigPrec = calcularInsigniaPrecision(jugador.exacto, jugador.dif);

              const efGanadores = jugador.pj > 0 ? Math.round((jugador.lev / jugador.pj) * 100) : 0;
              const efExacto = jugador.pj > 0 ? Math.round((jugador.exacto / jugador.pj) * 100) : 0;
              const efDifGol = jugador.pj > 0 ? Math.round((jugador.dif / jugador.pj) * 100) : 0;

              return (
                <div key={jugador.nombre} className="transition-all">
                  <div 
                    onClick={() => setUsuarioExpandido(esExpandido ? null : jugador.nombre)}
                    className={`grid grid-cols-12 gap-1 p-2 text-[11px] sm:text-xs font-bold text-center items-center cursor-pointer hover:bg-slate-800/30 transition-colors ${esExpandido ? 'bg-slate-800/60 border-l-4 border-emerald-500' : ''}`}
                  >
                    <div className="col-span-1 font-mono text-slate-500">{index + 1}º</div>
                    
                    {/* AVATAR LOCAL EN LA FILA DE LA TABLA */}
                    <div className="col-span-3 text-left font-black text-slate-200 truncate px-1 flex items-center gap-1.5">
                      <img 
                        src={jugador.avatar} 
                        onError={(e) => { e.target.onerror = null; e.target.src = jugador.fallback; }}
                        alt="Foto" 
                        className="w-5 h-5 rounded-full object-cover bg-slate-800 border border-slate-700 flex-shrink-0" 
                      />
                      <span className="truncate flex-1">{jugador.nombre}</span>
                      <span className="text-[8px] text-slate-500 flex-shrink-0">{esExpandido ? '▲' : '▼'}</span>
                    </div>

                    <div className="col-span-1 text-slate-400">{jugador.pj}</div>
                    <div className="col-span-1 text-slate-400">{jugador.lev}</div>
                    <div className="col-span-1 text-slate-400">{jugador.exacto}</div>
                    <div className="col-span-1 text-slate-400">{jugador.dif}</div>
                    <div className="col-span-1 text-emerald-400 font-mono font-black">{jugador.puntosExtra}</div>
                    <div className="col-span-1 text-slate-400 font-mono text-[10px]">{jugador.rendimiento}%</div>
                    <div className="col-span-2 text-sm font-black text-amber-400">{jugador.puntos}</div>
                  </div>

                  {esExpandido && (
                    <div className="bg-slate-950 p-4 border-t border-b border-slate-800/60 space-y-6 max-h-[85vh] overflow-y-auto shadow-inner">
                      
                      {/* === TARJETA DE JUGADOR CON AVATAR LOCAL === */}
                      <div className="bg-[#1e293b] rounded-2xl p-5 shadow-2xl border border-slate-700 w-full max-w-lg mx-auto">
                        <div className="flex flex-col items-center mb-6">
                          
                          <img 
                            src={jugador.avatar} 
                            onError={(e) => { e.target.onerror = null; e.target.src = jugador.fallback; }}
                            alt="Foto grande" 
                            className="w-20 h-20 rounded-full object-cover bg-slate-800 mb-3 shadow-inner border-[4px] border-slate-700" 
                          />
                          
                          <h3 className="text-xl font-black text-white text-center">{jugador.nombre}</h3>
                          
                          <div className="flex gap-3 mt-3">
                            <span className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                              {insigLev.name} <span className="text-sm">{insigLev.emoji}</span>
                            </span>
                            <span className="bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                              {insigPrec.name} <span className="text-sm">{insigPrec.emoji}</span>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-5 mb-8">
                          <div>
                            <div className="flex justify-between text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">
                              <span className="flex items-center gap-1">{insigLev.name} {insigLev.emoji}</span>
                              <span className="flex items-center gap-1">{insigLev.sigName} {insigLev.sigEmoji}</span>
                            </div>
                            <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
                              <div className="h-full bg-indigo-500 rounded-full shadow-md" style={{ width: `${Math.min(100, Math.max(0, ((jugador.lev - insigLev.min) / (insigLev.sigMin - insigLev.min)) * 100))}%` }}></div>
                            </div>
                            <div className="text-center text-[10px] text-slate-500 font-mono font-bold mt-1.5 tracking-wider">
                              {jugador.lev} / {insigLev.sigMin}
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">
                              <span className="flex items-center gap-1">{insigPrec.name} {insigPrec.emoji}</span>
                              <span className="flex items-center gap-1">{insigPrec.sigName} {insigPrec.sigEmoji}</span>
                            </div>
                            <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
                              <div className="h-full bg-emerald-500 rounded-full shadow-md" style={{ width: `${Math.min(100, Math.max(0, ((insigPrec.pts - insigPrec.min) / (insigPrec.sigMin - insigPrec.min)) * 100))}%` }}></div>
                            </div>
                            <div className="text-center text-[10px] text-slate-500 font-mono font-bold mt-1.5 tracking-wider">
                              {insigPrec.pts} / {insigPrec.sigMin} pts
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="bg-slate-800/80 p-3 rounded-xl border border-indigo-500/20 text-center shadow-sm flex flex-col justify-center">
                            <span className="block text-xl font-black text-indigo-400 mb-1">{jugador.partidosPronosticados}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase leading-tight">Partidos<br/>pronosticados</span>
                          </div>
                          <div className="bg-slate-800/80 p-3 rounded-xl border border-indigo-500/20 text-center shadow-sm flex flex-col justify-center">
                            <span className="block text-xl font-black text-indigo-400 mb-1">{jugador.lev}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase leading-tight">Ganadores<br/>correctos</span>
                          </div>
                          <div className="bg-slate-800/80 p-3 rounded-xl border border-indigo-500/20 text-center shadow-sm flex flex-col justify-center">
                            <span className="block text-xl font-black text-indigo-400 mb-1">{jugador.exacto}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase leading-tight">Resultados<br/>exactos</span>
                          </div>
                          <div className="bg-slate-800/80 p-3 rounded-xl border border-indigo-500/20 text-center shadow-sm flex flex-col justify-center">
                            <span className="block text-xl font-black text-indigo-400 mb-1">{jugador.pj}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase leading-tight">Partidos<br/>contabilizados</span>
                          </div>
                          <div className="bg-slate-800/80 p-3 rounded-xl border border-indigo-500/20 text-center shadow-sm flex flex-col justify-center">
                            <span className="block text-xl font-black text-indigo-400 mb-1">{efGanadores}%</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase leading-tight">Eficiencia de<br/>ganadores</span>
                          </div>
                          <div className="bg-slate-800/80 p-3 rounded-xl border border-indigo-500/20 text-center shadow-sm flex flex-col justify-center">
                            <span className="block text-xl font-black text-indigo-400 mb-1">{efExacto}%</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase leading-tight">Eficiencia m.<br/>exacto</span>
                          </div>
                          <div className="bg-slate-800/80 p-3 rounded-xl border border-indigo-500/20 text-center shadow-sm flex flex-col justify-center col-span-2 md:col-span-3">
                            <span className="block text-xl font-black text-indigo-400 mb-1">{efDifGol}%</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase leading-tight">Eficiencia de marcador dif. gol</span>
                          </div>
                        </div>
                      </div>
                      {/* === FIN TARJETA === */}

                      <div className="bg-slate-900/60 rounded border border-slate-800 p-3">
                        <p className="text-[11px] font-black text-white text-center mb-2 tracking-widest">PUNTOS TOTALES GANADOS: <span className="text-amber-400">{jugador.puntos} PUNTOS</span></p>
                        <p className="text-[9px] font-black text-amber-400 uppercase mb-2 text-center tracking-widest">RESUMEN PUNTOS EXTRA GANADOS: {jugador.puntosExtra} PUNTOS</p>
                        <div className="grid grid-cols-7 gap-1 text-[8px] sm:text-[9px] text-center font-bold">
                          <div className="bg-slate-950 p-1 rounded border border-slate-800"><span className="block text-slate-500 mb-0.5">Grupos</span><span className="text-emerald-400">+{jugador.desgloseExtra.grupos}</span></div>
                          <div className="bg-slate-950 p-1 rounded border border-slate-800"><span className="block text-slate-500 mb-0.5">16avos</span><span className="text-emerald-400">+{jugador.desgloseExtra.d16avos}</span></div>
                          <div className="bg-slate-950 p-1 rounded border border-slate-800"><span className="block text-slate-500 mb-0.5">8avos</span><span className="text-emerald-400">+{jugador.desgloseExtra.octavos}</span></div>
                          <div className="bg-slate-950 p-1 rounded border border-slate-800"><span className="block text-slate-500 mb-0.5">4tos</span><span className="text-emerald-400">+{jugador.desgloseExtra.cuartos}</span></div>
                          <div className="bg-slate-950 p-1 rounded border border-slate-800"><span className="block text-slate-500 mb-0.5">3ºy4º</span><span className="text-emerald-400">+{jugador.desgloseExtra.semis}</span></div>
                          <div className="bg-slate-950 p-1 rounded border border-slate-800"><span className="block text-slate-500 mb-0.5">Final</span><span className="text-emerald-400">+{jugador.desgloseExtra.final}</span></div>
                          <div className="bg-slate-950 p-1 rounded border border-slate-800"><span className="block text-slate-500 mb-0.5">Preds.</span><span className="text-emerald-400">+{jugador.desgloseExtra.predicciones}</span></div>
                        </div>
                      </div>

                      <div className="bg-slate-900/60 rounded border border-slate-800 p-3">
                        <p className="text-[9px] font-black text-emerald-400 uppercase mb-3 text-center tracking-widest leading-relaxed">PUNTOS GANADOS POR PARTIDOS JUGADOS: {jugador.puntos - jugador.puntosExtra} PUNTOS</p>
                        
                        <div className="grid grid-cols-7 gap-1 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-800 text-center pb-1 mb-1">
                           <div className="col-span-1 text-left px-1">Fase</div>
                           <div className="col-span-1">PJ</div>
                           <div className="col-span-1">LEV</div>
                           <div className="col-span-1">EXC</div>
                           <div className="col-span-1">DIF</div>
                           <div className="col-span-1">%</div>
                           <div className="col-span-1 text-amber-400">PTS</div>
                        </div>

                        {[
                          { key: 'grupos', label: 'Grupos' },
                          { key: 'd16avos', label: '16avos' },
                          { key: 'octavos', label: '8vos' },
                          { key: 'cuartos', label: '4tos' },
                          { key: 'semis', label: 'Semifinal' },
                          { key: 'tercerCuarto', label: '3er/4to' },
                          { key: 'final', label: 'FINAL' }
                        ].map(f => {
                           const d = jugador.desgloseFases[f.key];
                           const rend = d.pj > 0 ? Math.round((d.lev / d.pj) * 100) : 0;
                           return (
                              <div key={f.key} className="grid grid-cols-7 gap-1 text-[9px] text-center items-center py-1.5 border-b border-slate-800/40 hover:bg-slate-800/30 transition-colors">
                                 <div className="col-span-1 text-left font-bold text-slate-300 px-1">{f.label}</div>
                                 <div className="col-span-1 text-slate-400">{d.pj}</div>
                                 <div className="col-span-1 text-slate-400">{d.lev}</div>
                                 <div className="col-span-1 text-slate-400">{d.exacto}</div>
                                 <div className="col-span-1 text-slate-400">{d.dif}</div>
                                 <div className="col-span-1 text-slate-500 font-mono">{rend}%</div>
                                 <div className="col-span-1 font-black text-amber-400">{d.pts}</div>
                              </div>
                           );
                        })}
                        
                        <div className="grid grid-cols-7 gap-1 text-[9px] text-center items-center py-1.5 border-t border-slate-600 bg-slate-800/40">
                           <div className="col-span-1 text-left font-black text-amber-400 px-1">TOTAL</div>
                           <div className="col-span-1 font-black text-amber-400">{jugador.pj}</div>
                           <div className="col-span-1 font-black text-amber-400">{jugador.lev}</div>
                           <div className="col-span-1 font-black text-amber-400">{jugador.exacto}</div>
                           <div className="col-span-1 font-black text-amber-400">{jugador.dif}</div>
                           <div className="col-span-1 font-black text-amber-400 font-mono">{jugador.rendimiento}%</div>
                           <div className="col-span-1 font-black text-amber-400">{jugador.puntos - jugador.puntosExtra}</div>
                        </div>
                      </div>

                      <div className="bg-slate-900/60 rounded border border-slate-800 p-2">
                        {partidosRaw
                          .filter(m => ['finalizado', 'envivo', 'juegoproximo'].includes(m.estado))
                          .sort((a, b) => b.id - a.id) 
                          .map(m => {
                            const pron = jugador.pronosticos[m.id];
                            const tieneGolesReales = m.goles_local_real !== null && m.goles_visita_real !== null;
                            const seJugo = m.estado === 'finalizado' || tieneGolesReales;
                            let ptsPartido = tieneGolesReales ? calcularPuntosPartido(pron?.local, pron?.visita, m.goles_local_real, m.goles_visita_real, m.fase) : 0;
                            let ptsExtraAvanza = 0;
                            if (m.id >= 73 && m.equipo_avanza_real_id && pron?.ganador === m.equipo_avanza_real_id) {
                                ptsExtraAvanza = obtenerPuntosPorAvanzar(m.fase);
                            }
                            return (
                              <div key={m.id} className="flex justify-between items-center p-2 rounded bg-slate-950 border border-slate-800 text-[11px] mb-1.5">
                                <div className="flex items-center gap-1.5 w-1/2">
                                  <span className="bg-slate-800 px-1 py-0.5 rounded text-emerald-400 font-mono font-black text-[8px] min-w-[25px] text-center">ID:{m.id}</span>
                                  <div className="flex items-center gap-1 w-full justify-center">
                                    <div className="flex flex-col items-center w-8">
                                      <img src={`https://flagcdn.com/w40/${mapaISO2[m.equipo_local] || 'unknown'}.png`} className="w-5 h-3 rounded shadow-sm mb-0.5 opacity-80" alt={m.equipo_local} />
                                      <span className="text-[8px] font-black text-slate-300">{mapaISO3[m.equipo_local] || m.equipo_local.substring(0,3).toUpperCase()}</span>
                                    </div>
                                    <span className="text-[8px] text-slate-600 font-bold">vs</span>
                                    <div className="flex flex-col items-center w-8">
                                      <img src={`https://flagcdn.com/w40/${mapaISO2[m.equipo_visita] || 'unknown'}.png`} className="w-5 h-3 rounded shadow-sm mb-0.5 opacity-80" alt={m.equipo_visita} />
                                      <span className="text-[8px] font-black text-slate-300">{mapaISO3[m.equipo_visita] || m.equipo_visita.substring(0,3).toUpperCase()}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 w-1/2 justify-end">
                                  <div className="flex flex-col items-end">
                                      <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400 font-bold text-[10px]">
                                          {pron && pron.local !== '' && pron.visita !== '' ? `${pron.local}-${pron.visita}` : '-'}
                                      </span>
                                      {pron?.ganador && (
                                        <span className="text-[7px] text-emerald-500 font-black uppercase mt-0.5 leading-none">
                                          Pasa: {mapaISO3[pron.ganador] || pron.ganador} {ptsExtraAvanza > 0 ? `(+${ptsExtraAvanza} pts)` : ''}
                                        </span>
                                      )}
                                  </div>
                                  {tieneGolesReales ? (
                                    <span className="text-slate-500 font-mono text-[9px] w-10 text-center">R:{m.goles_local_real}-{m.goles_visita_real}</span>
                                  ) : (
                                    <span className="text-slate-600 font-mono text-[9px] w-10 text-center">-</span>
                                  )}
                                  <span className={`font-black text-right w-14 text-[10px] ${ptsPartido > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    {seJugo ? `+${ptsPartido} pts` : (m.estado === 'envivo' ? 'En Vivo' : m.estado === 'juegoproximo' ? 'Pronto' : 'Pend.')}
                                  </span>
                                </div>
                              </div>
                            );
                        })}
                      </div>

                      <div className="bg-slate-900/60 rounded border border-slate-800 p-3">
                        <p className="text-[9px] font-black text-emerald-400 uppercase mb-3 text-center tracking-widest">
                          Equipos Clasificados de Grupos: {jugador.desgloseExtra.grupos} PUNTOS
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px]">
                          {['A','B','C','D','E','F','G','H','I','J','K','L'].map(g => {
                            const ptsGrupo = getPuntosGrupo(g);
                            return (
                              <div key={g} className="bg-slate-950 p-1.5 rounded border border-slate-800">
                                <span className="text-amber-400 font-black block mb-1 text-center">Grupo {g} ({ptsGrupo} pts)</span>
                                <div className="flex justify-between items-center px-1">
                                  <span className="text-slate-500 font-bold">1º</span> 
                                  <span>{jugador.extras?.grupos?.[g]?.primero ? renderBanderaYAbrev(jugador.extras.grupos[g].primero) : <span className="text-slate-600">-</span>}</span>
                                </div>
                                <div className="flex justify-between items-center px-1 mt-0.5">
                                  <span className="text-slate-500 font-bold">2º</span> 
                                  <span>{jugador.extras?.grupos?.[g]?.segundo ? renderBanderaYAbrev(jugador.extras.grupos[g].segundo) : <span className="text-slate-600">-</span>}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-3 bg-slate-950 p-2 rounded border border-slate-800 text-center">
                          <span className="text-amber-400 font-black block mb-2 text-[10px] uppercase">Mejores Terceros ({ptsTerceros} pts)</span>
                          <div className="flex flex-wrap justify-center gap-2 text-[10px] font-bold">
                            {jugador.extras?.mejoresTerceros?.length > 0 
                              ? jugador.extras.mejoresTerceros.map((t, idx) => <span key={idx} className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">{renderBanderaYAbrev(t)}</span>)
                              : <span className="text-slate-600">-</span>
                            }
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-900/60 rounded border border-slate-800 p-3">
                        <p className="text-[9px] font-black text-emerald-400 uppercase mb-3 text-center tracking-widest">Premios Especiales</p>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center"><span className="text-slate-500 font-bold">Campeón</span> <span className="font-black text-amber-400">{renderBanderaYAbrev(jugador.extras?.campeon)}</span></div>
                          <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center"><span className="text-slate-500 font-bold">2º Lugar</span> <span className="font-black">{renderBanderaYAbrev(jugador.extras?.segundo)}</span></div>
                          <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center"><span className="text-slate-500 font-bold">3º Lugar</span> <span className="font-black text-orange-400">{renderBanderaYAbrev(jugador.extras?.tercero)}</span></div>
                          <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center"><span className="text-slate-500 font-bold">Goleador</span> <span className="font-black text-slate-300 truncate w-16 text-right" title={jugador.extras?.goleador}>{jugador.extras?.goleador || '-'}</span></div>
                          <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center"><span className="text-slate-500 font-bold truncate w-16">Mejor Jugador</span> <span className="font-black text-slate-300 truncate w-16 text-right" title={jugador.extras?.mejorJugador}>{jugador.extras?.mejorJugador || '-'}</span></div>
                          <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center"><span className="text-slate-500 font-bold truncate w-16">Mejor Arquero</span> <span className="font-black text-slate-300 truncate w-16 text-right" title={jugador.extras?.mejorArquero}>{jugador.extras?.mejorArquero || '-'}</span></div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BANNER MARTIN GAMES */}
        <div className="flex justify-center mt-6 mb-2">
            <img 
              src={bannerImg} 
              alt="Banner Martin Games" 
              className="w-full max-w-md h-24 object-cover object-center rounded-xl shadow-lg border border-slate-700 opacity-95" 
            />
        </div>

        {/* Gráfico de Evolución */}
        {datosGraficoEvolucion.length > 1 && (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 border-b border-slate-800 pb-3">
              <h2 className="text-sm font-black text-emerald-400 uppercase tracking-widest">📉 Evolución del Torneo</h2>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button onClick={() => setTipoGrafico('puntos')} className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-all ${tipoGrafico === 'puntos' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'}`}>Puntos</button>
                  <button onClick={() => setTipoGrafico('ranking')} className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-all ${tipoGrafico === 'ranking' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'}`}>Puesto</button>
                </div>
                <select className="bg-slate-950 text-slate-300 text-[10px] p-1.5 rounded-lg border border-slate-800 font-black uppercase tracking-wider focus:border-emerald-500 focus:outline-none" value={jugadorDestacado || ''} onChange={(e) => setJugadorDestacado(e.target.value || null)}>
                  <option value="">✨ Mostrar todos</option>
                  {usuarios.map(u => <option key={u.nombre} value={u.nombre}>📍 Destacar: {u.nombre}</option>)}
                </select>
              </div>
            </div>
            <div className="w-full h-[450px] bg-slate-950/40 p-2 rounded-lg border border-slate-950">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={datosGraficoEvolucion} margin={{ top: 15, right: 15, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.4} />
                  <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                  <YAxis stroke="#64748b" reversed={tipoGrafico === 'ranking'} allowDecimals={false} domain={tipoGrafico === 'ranking' ? [1, 'dataMax'] : [0, 'dataMax']} style={{ fontSize: '10px', fontWeight: 'bold' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', color: '#fff' }} itemSorter={(item) => tipoGrafico === 'ranking' ? item.value : -item.value} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', pt: 10, fontWeight: 'bold' }} />
                  {usuarios.map((usr, index) => {
                    const esDestacado = jugadorDestacado === usr.nombre;
                    const ningunSeleccionado = jugadorDestacado === null;
                    return (
                      <Line key={usr.nombre} type="monotone" dataKey={tipoGrafico === 'puntos' ? usr.nombre : `${usr.nombre}_puesto`} name={usr.nombre} stroke={COLORES_GRAFICO[index % COLORES_GRAFICO.length]} strokeWidth={ningunSeleccionado ? 2.5 : (esDestacado ? 4.5 : 1)} strokeOpacity={ningunSeleccionado ? 1 : (esDestacado ? 1 : 0.12)} dot={esDestacado ? { r: 3, strokeWidth: 1 } : false} activeDot={{ r: 6 }} />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[9px] text-center text-slate-500 uppercase font-bold tracking-wider">Eje X: Partidos finalizados disputados en orden secuencial</p>
          </div>
        )}
      </div>
    </div>
  );
}