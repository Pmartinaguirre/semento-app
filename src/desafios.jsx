import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';

export default function Desafios() {
  const [cargando, setCargando] = useState(true);
  const [usuarioSession, setUsuarioSession] = useState(null);
  const [perfil, setPerfil] = useState({ puntos: 0, monedas: 0, ranking: null });
  
  const [listaDesafios, setListaDesafios] = useState([]);
  const [desafioExpandido, setDesafioExpandido] = useState(null);
  const [votos, setVotos] = useState({}); 
  const [pasoEncuesta, setPasoEncuesta] = useState({});
  const [toast, setToast] = useState({ mostrar: false, mensaje: '' });
  
  // NUEVO: Estado para almacenar las estadísticas de porcentajes de la comunidad
  const [estadisticas, setEstadisticas] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const inicializarPantalla = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUsuarioSession(session);

      // 1. Cargar Desafíos
      const { data: dataDesafios } = await supabase
        .from('desafios')
        .select('*')
        .order('id', { ascending: false });

      if (dataDesafios) setListaDesafios(dataDesafios);

      // 2. Cargar TODOS los votos para calcular porcentajes del mercado
      const { data: todosLosVotos } = await supabase
        .from('votos_desafios')
        .select('desafio_id, opcion_elegida, respuesta_extra');

      if (todosLosVotos) {
        const stats = {};
        todosLosVotos.forEach(v => {
          if (!stats[v.desafio_id]) {
            stats[v.desafio_id] = { totalMain: 0, opcionesMain: {}, totalExtra: 0, opcionesExtra: {} };
          }
          // Sumar votos principales
          stats[v.desafio_id].totalMain += 1;
          stats[v.desafio_id].opcionesMain[v.opcion_elegida] = (stats[v.desafio_id].opcionesMain[v.opcion_elegida] || 0) + 1;
          
          // Sumar votos extra (si existen)
          if (v.respuesta_extra) {
            stats[v.desafio_id].totalExtra += 1;
            stats[v.desafio_id].opcionesExtra[v.respuesta_extra] = (stats[v.desafio_id].opcionesExtra[v.respuesta_extra] || 0) + 1;
          }
        });
        setEstadisticas(stats);
      }

      if (session) {
        // 3. Cargar Perfil
        const { data: dataPerfil } = await supabase.from('perfiles').select('*').eq('id', session.user.id).single();
        if (dataPerfil) setPerfil(dataPerfil);
        
        // 4. Cargar mis votos personales para saber qué bloquear
        const { data: misVotos } = await supabase.from('votos_desafios').select('*').eq('user_id', session.user.id);
        if (misVotos) {
          const mapaVotos = {};
          misVotos.forEach(voto => {
            mapaVotos[voto.desafio_id] = voto.opcion_elegida;
            if (voto.respuesta_extra) mapaVotos[`${voto.desafio_id}_extra`] = voto.respuesta_extra;
          });
          setVotos(mapaVotos);
        }
      }
      setCargando(false);
    };

    inicializarPantalla();
  }, []);

  const mostrarToast = (mensaje) => {
    setToast({ mostrar: true, mensaje });
    setTimeout(() => { setToast({ mostrar: false, mensaje: '' }); }, 3000);
  };

  // Función auxiliar para actualizar estadísticas localmente y ver el cambio al instante
  const actualizarStatsLocal = (desafioId, opcionMain, opcionExtra = null) => {
    setEstadisticas(prev => {
      const newStats = { ...prev };
      if (!newStats[desafioId]) newStats[desafioId] = { totalMain: 0, opcionesMain: {}, totalExtra: 0, opcionesExtra: {} };
      
      newStats[desafioId].totalMain += 1;
      newStats[desafioId].opcionesMain[opcionMain] = (newStats[desafioId].opcionesMain[opcionMain] || 0) + 1;
      
      if (opcionExtra) {
        newStats[desafioId].totalExtra += 1;
        newStats[desafioId].opcionesExtra[opcionExtra] = (newStats[desafioId].opcionesExtra[opcionExtra] || 0) + 1;
      }
      return newStats;
    });
  };

  const handleVotar = async (desafioId, opcion, tipo) => {
    if (!usuarioSession) {
      alert("Debes iniciar sesión para participar.");
      navigate('/login');
      return;
    }

    if (tipo === "doble") {
      setVotos(prev => ({ ...prev, [`${desafioId}_main`]: opcion }));
      setPasoEncuesta(prev => ({ ...prev, [desafioId]: 2 }));
    } else {
      const { error } = await supabase.from('votos_desafios').insert([{ user_id: usuarioSession.user.id, desafio_id: desafioId, opcion_elegida: opcion }]);
      if (error) {
        mostrarToast("❌ Hubo un error al guardar tu voto.");
      } else {
        setVotos(prev => ({ ...prev, [desafioId]: opcion }));
        actualizarStatsLocal(desafioId, opcion);
        mostrarToast(`🔒 Voto guardado. ¡Éxito!`);
      }
    }
  };

  const handleVotarExtra = async (desafioId, opcionExtra) => {
    const opcionPrincipal = votos[`${desafioId}_main`];

    const { error } = await supabase.from('votos_desafios').insert([{ user_id: usuarioSession.user.id, desafio_id: desafioId, opcion_elegida: opcionPrincipal, respuesta_extra: opcionExtra }]);
    if (error) {
      mostrarToast("❌ Hubo un error al guardar tus respuestas.");
    } else {
      setVotos(prev => ({ ...prev, [desafioId]: opcionPrincipal, [`${desafioId}_extra`]: opcionExtra }));
      actualizarStatsLocal(desafioId, opcionPrincipal, opcionExtra);
      mostrarToast(`🔒 Respuestas guardadas. ¡Gracias por participar!`);
    }
  };

  const toggleExpandir = (id) => {
    if (desafioExpandido === id) setDesafioExpandido(null);
    else setDesafioExpandido(id);
  };

  const calcularNivelInfo = (puntos) => {
    const niveles = [
      { nombre: 'Novato', min: 0, max: 999 },
      { nombre: 'Revelación', min: 1000, max: 2999 },
      { nombre: 'Crack', min: 3000, max: 3999 }
    ];
    return niveles.find(n => puntos >= n.min && puntos <= n.max) || niveles[1];
  };

  const infoNivel = calcularNivelInfo(perfil.puntos);

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-24">
      
      {/* CABECERA AZUL */}
      <div className="bg-[#0b438e] w-full pt-6 pb-20 px-4 relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-white p-1 hover:bg-white/10 rounded-full transition">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
            </Link>
            <h1 className="text-white font-bold text-lg tracking-wide">Desafíos</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#255ba0] rounded-full pl-1 pr-3 py-1 shadow-inner border border-blue-400/30">
              <span className="text-lg mr-1 drop-shadow-md">🏆</span>
              <span className="text-white text-[10px] font-bold">{infoNivel.nombre}</span>
            </div>
            <div className="flex items-center bg-[#255ba0] rounded-full pl-1 pr-3 py-1 shadow-inner border border-blue-400/30">
              <span className="text-yellow-400 text-lg mr-1 drop-shadow-md">🪙</span>
              <span className="text-white text-xs font-bold">{perfil.monedas > 0 ? perfil.monedas.toLocaleString('es-CL') : '...'}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-start">
          <h2 className="text-white text-xl font-bold w-3/4 leading-snug">¡Completa los desafíos para ganar más puntos!</h2>
          <span className="text-4xl drop-shadow-lg">🚩</span>
        </div>
      </div>

      {/* LISTA DE TARJETAS */}
      <div className="px-4 -mt-12 relative z-10 flex flex-col gap-4">
        {cargando ? (
           <p className="text-center text-white font-bold mt-10">Cargando mercado...</p>
        ) : listaDesafios.length === 0 ? (
           <p className="text-center text-white font-bold mt-10">No hay encuestas abiertas.</p>
        ) : (
          listaDesafios.map((desafio) => {
            const estaCompletado = !!votos[desafio.id];
            const estaExpandido = desafioExpandido === desafio.id;
            const pasoActual = pasoEncuesta[desafio.id] || 1;
            
            const opciones = Array.isArray(desafio.opciones) ? desafio.opciones : [];
            const opcionesExtra = Array.isArray(desafio.opciones_extra) ? desafio.opciones_extra : [];

            // Datos de estadísticas para este desafío
            const stats = estadisticas[desafio.id] || { totalMain: 0, opcionesMain: {}, totalExtra: 0, opcionesExtra: {} };
            
            // Ordenar opciones de mayor a menor porcentaje (como Polymarket)
            const opcionesOrdenadas = [...opciones].sort((a, b) => (stats.opcionesMain[b] || 0) - (stats.opcionesMain[a] || 0));
            const opcionesExtraOrdenadas = [...opcionesExtra].sort((a, b) => (stats.opcionesExtra[b] || 0) - (stats.opcionesExtra[a] || 0));

            return (
              <div key={desafio.id} className={`bg-white rounded-xl shadow-sm border ${estaCompletado ? 'border-green-200' : 'border-gray-200'} overflow-hidden transition-all duration-300`}>
                
                {/* Cabecera de Tarjeta */}
                <div className={`p-4 ${!estaCompletado ? 'cursor-pointer hover:bg-slate-50' : ''}`} onClick={() => toggleExpandir(desafio.id)}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2.5 py-1 rounded-full">{desafio.tiempo}</span>
                    {!estaCompletado ? (
                      <span className="text-3xl drop-shadow-sm">🏆</span>
                    ) : (
                      <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-md uppercase">Completado</span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-800 text-[15px] mb-1.5 pr-8 leading-tight">{desafio.titulo}</h3>
                  {!estaExpandido && <p className="text-gray-500 text-xs line-clamp-2">{desafio.subtitulo}</p>}
                  {!estaExpandido && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="w-full bg-gray-200 h-1.5 rounded-full mr-3 relative">
                        <div className={`h-full rounded-full ${estaCompletado ? 'bg-green-500 w-full' : 'bg-blue-500 w-0'}`}></div>
                      </div>
                      <span className={`text-[10px] font-bold mr-2 ${estaCompletado ? 'text-green-600' : 'text-gray-400'}`}>{estaCompletado ? '1/1' : '0/1'}</span>
                      <span className="bg-[#0b438e] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">{desafio.recompensa} pts.</span>
                    </div>
                  )}
                </div>

                {/* VISTA VOTACIÓN ACTIVA */}
                {estaExpandido && !estaCompletado && (
                  <div className="p-4 pt-0 border-t border-gray-100 bg-slate-50/50">
                    {pasoActual === 1 && (
                      <div className="animate-fade-in">
                        <p className="text-gray-600 text-[13px] mb-4">{desafio.subtitulo}</p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {opciones.map(opcion => (
                            <button key={opcion} onClick={() => handleVotar(desafio.id, opcion, desafio.tipo)} className="bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 font-semibold text-xs py-3 rounded-lg shadow-sm transition active:scale-95">
                              {opcion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {pasoActual === 2 && (
                      <div className="animate-fade-in">
                        <div className="bg-blue-900 text-white p-4 rounded-xl shadow-inner mb-4">
                          <p className="text-sm font-bold leading-relaxed">{desafio.pregunta_extra}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {opcionesExtra.map(opcion => (
                            <button key={opcion} onClick={() => handleVotarExtra(desafio.id, opcion)} className="bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-800 font-black text-sm py-3 rounded-xl shadow-sm transition active:scale-95">
                              {opcion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* VISTA RESULTADOS (MERCADO EN TIEMPO REAL) */}
                {estaExpandido && estaCompletado && (
                  <div className="p-4 pt-0 border-t border-gray-100 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-gray-800 font-black text-sm">Pronóstico de la Comunidad</p>
                      <p className="text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded">{stats.totalMain} votos</p>
                    </div>

                    {/* Barras de porcentaje para la pregunta principal */}
                    <div className="flex flex-col gap-2 mb-4">
                      {opcionesOrdenadas.map(op => {
                        const count = stats.opcionesMain[op] || 0;
                        const percent = stats.totalMain > 0 ? Math.round((count / stats.totalMain) * 100) : 0;
                        const esMiVoto = votos[desafio.id] === op;

                        return (
                          <div key={op} className={`relative h-10 rounded-lg border ${esMiVoto ? 'border-blue-400' : 'border-gray-200'} overflow-hidden bg-slate-50 flex items-center px-3`}>
                            {/* Relleno de la barra Polymarket */}
                            <div className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${esMiVoto ? 'bg-blue-100' : 'bg-gray-200/50'}`} style={{ width: `${percent}%` }}></div>
                            
                            <div className="relative z-10 w-full flex justify-between items-center">
                              <span className={`text-xs font-bold ${esMiVoto ? 'text-blue-900' : 'text-gray-700'}`}>
                                {op} {esMiVoto && <span className="ml-1 text-blue-600">✓ Tu voto</span>}
                              </span>
                              <span className={`text-xs font-black ${esMiVoto ? 'text-blue-700' : 'text-gray-500'}`}>{percent}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Barras de porcentaje para la pregunta extra (si aplica) */}
                    {votos[`${desafio.id}_extra`] && (
                      <div className="mt-6 border-t border-gray-100 pt-4">
                        <p className="text-gray-800 font-black text-xs mb-3 text-center">{desafio.pregunta_extra}</p>
                        <div className="flex flex-col gap-2">
                          {opcionesExtraOrdenadas.map(op => {
                            const count = stats.opcionesExtra[op] || 0;
                            const percent = stats.totalExtra > 0 ? Math.round((count / stats.totalExtra) * 100) : 0;
                            const esMiVotoExtra = votos[`${desafio.id}_extra`] === op;

                            return (
                              <div key={op} className={`relative h-9 rounded-md border ${esMiVotoExtra ? 'border-amber-400' : 'border-gray-200'} overflow-hidden bg-slate-50 flex items-center px-3`}>
                                <div className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${esMiVotoExtra ? 'bg-amber-100/50' : 'bg-gray-200/40'}`} style={{ width: `${percent}%` }}></div>
                                <div className="relative z-10 w-full flex justify-between items-center">
                                  <span className={`text-[11px] font-bold ${esMiVotoExtra ? 'text-amber-900' : 'text-gray-700'}`}>{op} {esMiVotoExtra && '✓'}</span>
                                  <span className={`text-[11px] font-black ${esMiVotoExtra ? 'text-amber-700' : 'text-gray-500'}`}>{percent}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {toast.mostrar && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-max max-w-[90%] bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl z-50 text-sm font-semibold flex items-center gap-2 animate-bounce">
          {toast.mensaje}
        </div>
      )}

      <style jsx>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}