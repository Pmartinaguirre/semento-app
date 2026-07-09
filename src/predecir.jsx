import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';

// 1. TU DICCIONARIO DE ESCUDOS LOCALES
const escudosEquipos = {
  'Colo Colo': '/escudos/colocolo.png',
  'Universidad de Chile': '/escudos/universidaddechile.png',
  'Universidad Católica': '/escudos/universidadcatolica.png',
  'Everton CD': '/escudos/everton.png',
  'Unión La Calera': '/escudos/unionlacalera.png',
  'Deportes Limache': '/escudos/deporteslimache.png',
  'Coquimbo Unido': '/escudos/coquimbounido.png',
  'Universidad de Concepción': '/escudos/universidaddeconcepcion.png',
  'Huachipato': '/escudos/huachipato.png',
  'Cobresal': '/escudos/cobresal.png',
  'La Serena': '/escudos/laserena.png',
  'Ñublense': '/escudos/nublense.png',
  'Palestino': '/escudos/palestino.png',
  'Audax Italiano': '/escudos/audaxitaliano.png',
  'Deportes Concepcion': '/escudos/deportesconcepcion.png',
  'O\'Higgins': '/escudos/ohiggins.png'
};

export default function Predecir() {
  const [partidos, setPartidos] = useState([]);
  const [prediccionesUsuario, setPrediccionesUsuario] = useState({});
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null); // null = todavía no detectada
  const [diaFiltro, setDiaFiltro] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const [usuarioSession, setUsuarioSession] = useState(null);

  // NUEVO: Estado del perfil real para igualar el Dashboard
  const [perfil, setPerfil] = useState({ puntos: 0, monedas: 0, ranking: null });

  const [toast, setToast] = useState({ mostrar: false, mensaje: '' });

  const navigate = useNavigate();
  const listaFechas = Array.from({ length: 15 }, (_, i) => i + 16);

  // Calcular Nivel
  const calcularNivelInfo = (puntos) => {
    const niveles = [
      { nombre: 'Novato', min: 0, max: 999 },
      { nombre: 'Revelación', min: 1000, max: 2999 },
      { nombre: 'Crack', min: 3000, max: 3999 },
      { nombre: 'Estrella', min: 4000, max: 4999 },
      { nombre: 'Experto', min: 5000, max: 5999 },
      { nombre: 'Ídolo', min: 6000, max: 7499 },
      { nombre: 'Leyenda', min: 7500, max: 8999 },
      { nombre: 'Figura Mundial', min: 9000, max: 10999 },
      { nombre: 'Galáctico', min: 11000, max: 14999 },
      { nombre: 'Inmortal', min: 15000, max: Infinity }
    ];
    return niveles.find(n => puntos >= n.min && puntos <= n.max) || niveles[0];
  };

  const mostrarToast = (mensaje) => {
    setToast({ mostrar: true, mensaje });
    setTimeout(() => { setToast({ mostrar: false, mensaje: '' }); }, 2500);
  };

  // NUEVO: Detecta automáticamente la fecha vigente (evita que la página
  // se quede pegada en "Fecha 16" cuando el campeonato ya va en otra).
  useEffect(() => {
    const detectarFechaVigente = async () => {
      const { data, error } = await supabase
        .from('partidos')
        .select('fecha_numero, fecha_inicio')
        .order('fecha_inicio', { ascending: true });

      if (error) {
        console.error('[Predecir] Error detectando fecha vigente:', error);
        mostrarToast('❌ No se pudo conectar con la base de datos.');
        setFechaSeleccionada(16); // fallback para no dejar la UI colgada
        return;
      }

      if (!data || data.length === 0) {
        console.warn('[Predecir] La tabla "partidos" no devolvió filas. ¿Hay datos cargados / RLS habilitado sin política de SELECT?');
        setFechaSeleccionada(16);
        return;
      }

      const ahora = new Date();
      const proximo = data.find(p => new Date(p.fecha_inicio) > ahora);
      const fechaVigente = proximo ? proximo.fecha_numero : data[data.length - 1].fecha_numero;
      setFechaSeleccionada(fechaVigente);
    };

    detectarFechaVigente();
  }, []);

  useEffect(() => {
    if (fechaSeleccionada === null) return; // esperar a que se detecte la fecha vigente

    const inicializarPantalla = async () => {
      setCargando(true);

      const { data: { session } } = await supabase.auth.getSession();
      setUsuarioSession(session);

      if (session) {
        // Traer datos del perfil para los indicadores
        const { data: dataPerfil, error: errorPerfil } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (errorPerfil) console.error('[Predecir] Error cargando perfil:', errorPerfil);
        if (dataPerfil) setPerfil(dataPerfil);

        // Traer predicciones del usuario
        const { data: dataPredicciones, error: errorPredicciones } = await supabase
          .from('predicciones')
          .select('partido_id, eleccion')
          .eq('user_id', session.user.id);

        if (errorPredicciones) console.error('[Predecir] Error cargando predicciones:', errorPredicciones);

        if (dataPredicciones) {
          const mapaPredicciones = {};
          dataPredicciones.forEach(p => { mapaPredicciones[p.partido_id] = p.eleccion; });
          setPrediccionesUsuario(mapaPredicciones);
        }
      }

      // Traer partidos
      const { data: dataPartidos, error: errorPartidos } = await supabase
        .from('partidos')
        .select('*')
        .eq('fecha_numero', fechaSeleccionada)
        .order('fecha_inicio', { ascending: true });

      if (errorPartidos) {
        console.error('[Predecir] Error cargando partidos:', errorPartidos);
        mostrarToast('❌ No se pudieron cargar los partidos. Revisa la consola.');
        setPartidos([]);
      } else {
        setPartidos(dataPartidos || []);
      }

      setCargando(false);
    };

    inicializarPantalla();
  }, [fechaSeleccionada]);

  // Auto-scroll al partido más próximo
  useEffect(() => {
    if (partidos.length > 0 && !cargando) {
      const ahora = new Date();
      const proximoPartido = partidos.find(p => new Date(p.fecha_inicio) > ahora);
      if (proximoPartido) {
        const elemento = document.getElementById(`partido-${proximoPartido.id}`);
        if (elemento) elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [partidos, cargando]);

  const handleApuesta = async (partidoId, fechaInicioPartido, eleccion) => {
    if (!usuarioSession) {
      alert("¡Debes iniciar sesión para guardar tus pronósticos!");
      navigate('/login');
      return;
    }

    const ahora = new Date();
    const limiteApuesta = new Date(new Date(fechaInicioPartido).getTime() - 10 * 60 * 1000);

    if (ahora > limiteApuesta) {
      mostrarToast("⚠️ Las apuestas para este partido ya están cerradas (Cierra 10 min antes).");
      return;
    }

    setPrediccionesUsuario(prev => ({ ...prev, [partidoId]: eleccion }));

    const { data: existente } = await supabase
      .from('predicciones')
      .select('id')
      .eq('user_id', usuarioSession.user.id)
      .eq('partido_id', partidoId)
      .single();

    let error = null;

    if (existente) {
      const { error: errorUpdate } = await supabase
        .from('predicciones')
        .update({ eleccion: eleccion })
        .eq('id', existente.id);
      error = errorUpdate;
    } else {
      const { error: errorInsert } = await supabase
        .from('predicciones')
        .insert([{ user_id: usuarioSession.user.id, partido_id: partidoId, eleccion: eleccion, monedas_apostadas: 100 }]);
      error = errorInsert;
    }

    if (error) {
      console.error('[Predecir] Error guardando predicción:', error);
      mostrarToast("❌ Error al conectar con el servidor.");
    } else {
      mostrarToast("💾 ¡Pronóstico guardado automáticamente!");
    }
  };

  const diasDisponibles = ['todos', ...new Set(partidos.map(p =>
    new Date(p.fecha_inicio).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'short' })
  ))];

  const partidosFiltrados = partidos.filter(partido => {
    if (diaFiltro === 'todos') return true;
    const diaPartido = new Date(partido.fecha_inicio).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'short' });
    return diaPartido === diaFiltro;
  });

  const totalPartidosFecha = partidos.length || 8;
  const pronosticosHechos = partidos.filter(p => prediccionesUsuario[p.id]).length;
  const porcentajeProgreso = (pronosticosHechos / totalPartidosFecha) * 100;

  // Variables para la tarjeta blanca flotante
  const puntosUsuario = perfil.puntos || 0;
  const monedasUsuario = perfil.monedas || 0;
  const rankingUsuario = perfil.ranking ? `#${perfil.ranking}` : '-';
  const infoNivel = calcularNivelInfo(puntosUsuario);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">

      {/* 1. BANNER 100% ANCHO CON BOTÓN DE VOLVER */}
      <div
        className="w-full h-56 bg-[#1a365d] bg-center bg-cover bg-no-repeat relative"
        style={{ backgroundImage: "url('/bannersemento.png')" }}
      >
        <div className="absolute inset-0 bg-blue-900/20"></div>

        {/* Botón flotante para Volver al Inicio */}
        <div className="absolute top-6 left-4 z-20">
          <Link to="/" className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-full hover:bg-white hover:text-blue-900 transition shadow-lg">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
          </Link>
        </div>
      </div>

      {/* 2. TARJETA BLANCA SUPERPUESTA (Nivel, Monedas y Ranking reales) */}
      <div className="mx-4 -mt-16 bg-white rounded-2xl shadow-xl relative z-10 p-5 border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-[#1e3a8a] tracking-tight">Campeonato 2026</h1>
          <span className="bg-blue-50 text-blue-800 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-blue-100">
            Predicciones
          </span>
        </div>

        <div className="grid grid-cols-3 text-center">
          <div>
            <p className="text-[13px] text-gray-500 font-medium mb-1">Mi nivel</p>
            <p className="text-[#1e3a8a] text-lg font-black">{cargando ? '...' : infoNivel.nombre}</p>
          </div>
          <div className="border-x border-gray-100">
            <p className="text-[13px] text-gray-500 font-medium mb-1">Monedas</p>
            <p className="text-yellow-500 text-lg font-black flex items-center justify-center gap-1">
              🪙 {cargando ? '...' : monedasUsuario.toLocaleString('es-CL')}
            </p>
          </div>
          <div>
            <p className="text-[13px] text-gray-500 font-medium mb-1">Ranking</p>
            <p className="text-[#1e3a8a] text-lg font-black">{cargando ? '...' : rankingUsuario}</p>
          </div>
        </div>
      </div>

      {/* 3. SELECTORES DE FECHA Y DÍA */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Torneo / Fecha</label>
          <select
            value={fechaSeleccionada ?? ''}
            onChange={(e) => { setFechaSeleccionada(Number(e.target.value)); setDiaFiltro('todos'); }}
            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 shadow-sm focus:outline-none focus:border-[#1e3a8a]"
          >
            {listaFechas.map(f => (
              <option key={f} value={f}>Fecha {f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Filtrar por Día</label>
          <select
            value={diaFiltro}
            onChange={(e) => setDiaFiltro(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 shadow-sm focus:outline-none focus:border-[#1e3a8a] capitalize"
          >
            {diasDisponibles.map((dia, index) => (
              <option key={index} value={dia}>{dia === 'todos' ? '📅 Todos' : dia}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. PROGRESO DE LA FECHA */}
      <div className="px-4 mt-5">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-600">Progreso de pronósticos:</span>
            <span className="bg-blue-50 text-[#1e3a8a] font-black text-xs px-2.5 py-1 rounded-full border border-blue-100">
              {pronosticosHechos} / {totalPartidosFecha}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-blue-700 to-blue-500 h-full transition-all duration-500"
              style={{ width: `${porcentajeProgreso}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 text-center font-medium">
            {pronosticosHechos === totalPartidosFecha
              ? '✅ ¡Excelente! Completaste todos tus pronósticos de la fecha.'
              : `Falta realizar ${totalPartidosFecha - pronosticosHechos} predicciones.`}
          </p>
        </div>
      </div>

      {/* 5. FIXTURE DE PARTIDOS */}
      <div className="mt-2">
        {cargando ? (
          <div className="text-center mt-12 text-gray-400 font-bold animate-pulse">Cargando partidos...</div>
        ) : partidosFiltrados.length === 0 ? (
          <div className="text-center mt-12 text-gray-400 bg-white mx-4 p-6 rounded-2xl border border-gray-100 shadow-sm">No hay partidos agendados para este día.</div>
        ) : (
          partidosFiltrados.map((partido) => {
            const ahora = new Date();
            const limiteApuesta = new Date(new Date(partido.fecha_inicio).getTime() - 10 * 60 * 1000);
            const apuestasCerradas = ahora > limiteApuesta;
            const eleccionActual = prediccionesUsuario[partido.id];

            const fechaString = new Date(partido.fecha_inicio).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' });
            const horaString = new Date(partido.fecha_inicio).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });

            const logoLocalReal = escudosEquipos[partido.local_nombre];
            const logoVisitaReal = escudosEquipos[partido.visita_nombre];

            return (
              <div key={partido.id} id={`partido-${partido.id}`} className="px-4 mt-4">
                <div className={`bg-white rounded-2xl border transition-all p-4 relative shadow-sm ${apuestasCerradas ? 'opacity-85 border-gray-100' : 'border-gray-200 hover:border-blue-100 hover:shadow-md'}`}>

                  <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                      <span>⏰</span> <span>{fechaString} — {horaString}</span>
                    </div>
                    {apuestasCerradas ? (
                      <span className="bg-red-50 text-red-600 text-[10px] font-black uppercase px-2 py-1 rounded border border-red-100">🔒 Cerrado</span>
                    ) : (
                      <span className="bg-green-50 text-green-600 text-[10px] font-black uppercase px-2 py-1 rounded border border-green-100 animate-pulse">🔓 Abierto</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-5 px-1">
                    <div className="text-center w-1/3 flex flex-col items-center gap-2">
                      <div className="w-14 h-14 bg-white border border-gray-100 rounded-full flex items-center justify-center p-2 shadow-sm">
                        {logoLocalReal ? (
                          <img src={logoLocalReal} alt={partido.local_nombre} className="w-10 h-10 object-contain" />
                        ) : (
                          <span className="text-2xl">🛡️</span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-gray-800 leading-tight uppercase tracking-wide">{partido.local_nombre}</p>
                    </div>

                    <div className="text-[10px] font-black text-gray-300 tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">VS</div>

                    <div className="text-center w-1/3 flex flex-col items-center gap-2">
                      <div className="w-14 h-14 bg-white border border-gray-100 rounded-full flex items-center justify-center p-2 shadow-sm">
                        {logoVisitaReal ? (
                          <img src={logoVisitaReal} alt={partido.visita_nombre} className="w-10 h-10 object-contain" />
                        ) : (
                          <span className="text-2xl">🛡️</span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-gray-800 leading-tight uppercase tracking-wide">{partido.visita_nombre}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      disabled={apuestasCerradas}
                      onClick={() => handleApuesta(partido.id, partido.fecha_inicio, 'local')}
                      className={`font-bold py-3 rounded-xl text-xs transition-all ${
                        eleccionActual === 'local'
                          ? 'bg-[#1e3a8a] text-white ring-4 ring-blue-100 shadow-md transform scale-[1.02]'
                          : apuestasCerradas
                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                            : 'bg-gray-100 hover:bg-blue-50 text-gray-600 active:scale-95'
                      }`}
                    >
                      LOCAL
                    </button>
                    <button
                      disabled={apuestasCerradas}
                      onClick={() => handleApuesta(partido.id, partido.fecha_inicio, 'empate')}
                      className={`font-bold py-3 rounded-xl text-xs transition-all ${
                        eleccionActual === 'empate'
                          ? 'bg-[#d97706] text-white ring-4 ring-amber-50 shadow-md transform scale-[1.02]'
                          : apuestasCerradas
                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 active:scale-95'
                      }`}
                    >
                      EMPATE
                    </button>
                    <button
                      disabled={apuestasCerradas}
                      onClick={() => handleApuesta(partido.id, partido.fecha_inicio, 'visita')}
                      className={`font-bold py-3 rounded-xl text-xs transition-all ${
                        eleccionActual === 'visita'
                          ? 'bg-[#1e3a8a] text-white ring-4 ring-blue-100 shadow-md transform scale-[1.02]'
                          : apuestasCerradas
                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                            : 'bg-gray-100 hover:bg-blue-50 text-gray-600 active:scale-95'
                      }`}
                    >
                      VISITA
                    </button>
                  </div>
                  <p className="text-center text-[10px] text-gray-400 mt-4 font-medium tracking-wide">ESTADIO: {partido.estadio || 'POR DEFINIR'}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 6. TOAST ALERT */}
      {toast.mostrar && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-max max-w-[90%] bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-full shadow-2xl z-50 text-sm font-semibold border border-slate-700 flex items-center gap-2 animate-bounce">
          <span>{toast.mensaje.includes('⚠️') || toast.mensaje.includes('❌') ? '' : '🚀'}</span>
          {toast.mensaje}
        </div>
      )}

    </div>
  );
}
