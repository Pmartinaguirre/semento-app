import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

export default function Dashboard() {
  const [partidos, setPartidos] = useState([]);
  const [predicciones, setPredicciones] = useState({});
  const [cargando, setCargando] = useState(true);
  const [usuarioSession, setUsuarioSession] = useState(null);
  
  const [perfil, setPerfil] = useState({ puntos: 0, monedas: 0, ranking: null, nombre_completo: null });

  // Lógica mejorada para calcular Nivel y Porcentaje de la barra de progreso
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

    const nivelActual = niveles.find(n => puntos >= n.min && puntos <= n.max) || niveles[0];
    const indexActual = niveles.indexOf(nivelActual);
    const proximoNivel = indexActual < niveles.length - 1 ? niveles[indexActual + 1] : null;
    
    const min = nivelActual.min;
    const max = proximoNivel ? proximoNivel.min : nivelActual.max;
    const ptsFaltantes = proximoNivel ? proximoNivel.min - puntos : 0;
    
    // Calcula qué porcentaje del nivel actual ya has completado
    let porcentaje = 100;
    if (proximoNivel && (max - min) > 0) {
      porcentaje = ((puntos - min) / (max - min)) * 100;
    }

    return { 
      nombre: nivelActual.nombre, 
      proximoNivel: proximoNivel?.nombre, 
      ptsFaltantes,
      porcentaje
    };
  };

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      setUsuarioSession(session);

      if (session) {
        const { data: dataPerfil } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (dataPerfil) {
          setPerfil(dataPerfil);
        }

        const { data: dataPredicciones } = await supabase
          .from('predicciones')
          .select('partido_id, eleccion')
          .eq('user_id', session.user.id);

        if (dataPredicciones) {
          const mapa = {};
          dataPredicciones.forEach(p => mapa[p.partido_id] = p.eleccion);
          setPredicciones(mapa);
        }
      }

      const { data: dataPartidos } = await supabase
        .from('partidos')
        .select('*')
        .eq('fecha_numero', 16)
        .order('fecha_inicio', { ascending: true });

      if (dataPartidos) setPartidos(dataPartidos);

      setCargando(false);
    };

    cargarDatos();
  }, []);

  const puntosUsuario = perfil.puntos || 0;
  const rankingUsuario = perfil.ranking ? `#${perfil.ranking}` : '-';
  const infoNivel = calcularNivelInfo(puntosUsuario);
  
  // Nombre por defecto para igualar tu maqueta visual mientras se registran los datos reales
  const nombreMostrar = perfil.nombre_completo || 'Pablo Martin';

  const totalPartidos = partidos.length || 8;
  const pronosticosHechos = partidos.filter(p => predicciones[p.id]).length;
  const porcentajeProgresoFecha = (pronosticosHechos / totalPartidos) * 100;
  const todosPronosticados = pronosticosHechos === totalPartidos;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      
      {/* 1. BANNER 100% ANCHO */}
      {/* Utiliza la imagen que pusiste en la carpeta public */}
      <div 
        className="w-full h-64 bg-[#1a365d] bg-center bg-cover bg-no-repeat relative"
        style={{ backgroundImage: "url('/bannersemento.png')" }}
      >
        {/* Capa sutil de oscurecimiento si la foto es muy brillante */}
        <div className="absolute inset-0 bg-blue-900/20"></div>
        
        {/* Botón de Iniciar Sesión (solo visible si no está logueado) */}
        {!usuarioSession && (
          <div className="absolute top-6 right-4 z-20">
            <Link to="/login" className="bg-white/20 backdrop-blur-md border border-white/40 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-white hover:text-blue-900 transition">
              Iniciar Sesión
            </Link>
          </div>
        )}
      </div>

      {/* 2. TARJETA BLANCA SUPERPUESTA (Diseño idéntico a la maqueta) */}
      <div className="mx-4 -mt-20 bg-white rounded-2xl shadow-xl relative z-10 p-5 border border-gray-100">
        
        {/* Header: Avatar, Nombre y Campana */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(nombreMostrar)}&background=EBF4FF&color=1E3A8A&rounded=true&bold=true`} 
              alt="Avatar" 
              className="w-12 h-12 rounded-full shadow-sm border border-blue-50"
            />
            <h2 className="text-xl font-bold text-[#1e3a8a] tracking-tight">
              Hola, {nombreMostrar}
            </h2>
          </div>
          <button className="bg-[#1e3a8a] p-2.5 rounded-xl text-white shadow-md hover:bg-blue-800 transition active:scale-95">
            {/* Ícono de campana SVG */}
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </button>
        </div>

        {/* Indicadores: Nivel, Puntos, Ranking */}
        <div className="grid grid-cols-3 text-center mb-5">
          <div>
            <p className="text-[13px] text-gray-500 font-medium mb-1">Mi nivel</p>
            <p className="text-[#1e3a8a] text-2xl font-black">{infoNivel.nombre}</p>
          </div>
          <div>
            <p className="text-[13px] text-gray-500 font-medium mb-1">Puntos</p>
            <p className="text-[#1e3a8a] text-2xl font-black">{puntosUsuario.toLocaleString('es-CL')}</p>
          </div>
          <div>
            <p className="text-[13px] text-gray-500 font-medium mb-1">Ranking</p>
            <p className="text-[#1e3a8a] text-2xl font-black">{rankingUsuario}</p>
          </div>
        </div>

        {/* Barra de Progreso del Nivel (Balón y Arco) */}
        {infoNivel.proximoNivel && (
          <>
            <div className="flex items-center w-full mb-4">
              <div className="w-full bg-gray-200 h-2 rounded-full relative flex-1 mr-3">
                <div 
                  className="bg-gradient-to-r from-blue-700 to-blue-500 h-full rounded-full relative transition-all duration-1000 ease-out"
                  style={{ width: `${infoNivel.porcentaje}%` }}
                >
                  {/* El balón ubicado exactamente al final de la barra de progreso */}
                  <div className="absolute -right-3 -top-2.5 text-lg drop-shadow-md bg-white rounded-full leading-none">⚽</div>
                </div>
              </div>
              <span className="text-2xl drop-shadow-sm opacity-80">🥅</span>
            </div>

            <p className="text-[13px] text-gray-800 leading-snug">
              ¡Suma <span className="font-black">{infoNivel.ptsFaltantes} pts</span> más para alcanzar el <span className="font-black">nivel {infoNivel.proximoNivel}</span> y desbloquear nuevos beneficios exclusivos!
            </p>
          </>
        )}
      </div>

      {/* 3. Botonera Principal (Predicciones y Desafíos) */}
      <div className="px-4 mt-6 grid grid-cols-2 gap-4">
        <Link to="/predecir" className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition hover:border-blue-300 active:scale-95">
          <span className="text-4xl">🔮</span>
          <span className="font-bold text-gray-800 text-sm">Predicciones</span>
        </Link>
        {/* Reemplaza el <button> por este <Link> */}
<Link to="/desafios" className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition hover:border-blue-300 active:scale-95">
  <span className="text-4xl">🏆</span>
  <span className="font-bold text-gray-800 text-sm">Desafíos</span>
</Link>
      </div>

      {/* 4. Próximos Partidos y Progreso de Fecha */}
      <div className="px-4 mt-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-black text-gray-800">Próximos Partidos</h2>
          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-md">Fecha 16</span>
        </div>

        {usuarioSession && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-bold text-gray-600">
                {todosPronosticados 
                  ? '✅ Has pronosticado todos los partidos de la fecha'
                  : `⚠️ Te falta completar partidos de la fecha`}
              </p>
              <span className="text-xs font-black text-blue-800">{pronosticosHechos}/{totalPartidos}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden flex">
              <div 
                className={`h-full transition-all duration-500 ${todosPronosticados ? 'bg-green-500' : 'bg-gradient-to-r from-blue-600 to-blue-400'}`}
                style={{ width: `${porcentajeProgresoFecha}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Fixture en miniatura */}
        {cargando ? (
          <p className="text-center text-xs font-bold text-gray-400 mt-6 animate-pulse">Cargando fixture...</p>
        ) : (
          <div className="flex flex-col gap-3">
            {partidos.map(partido => {
              const estaPronosticado = !!predicciones[partido.id];
              const fechaCorta = new Date(partido.fecha_inicio).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric' });
              
              const logoLocalReal = escudosEquipos[partido.local_nombre] || partido.local_logo;
              const logoVisitaReal = escudosEquipos[partido.visita_nombre] || partido.visita_logo;

              return (
                <Link to="/predecir" key={partido.id} className="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between shadow-sm hover:border-blue-200 transition">
                  <div className="flex items-center gap-3 w-3/4">
                    <div className="flex flex-col items-center w-8">
                      {logoLocalReal ? <img src={logoLocalReal} alt="" className="w-6 h-6 object-contain" /> : <span className="text-lg">🛡️</span>}
                    </div>
                    <span className="text-xs font-black text-gray-300">VS</span>
                    <div className="flex flex-col items-center w-8">
                      {logoVisitaReal ? <img src={logoVisitaReal} alt="" className="w-6 h-6 object-contain" /> : <span className="text-lg">🛡️</span>}
                    </div>
                    <div className="ml-2 flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{fechaCorta}</span>
                      <span className="text-xs font-bold text-gray-800 truncate">{partido.local_nombre} v/s {partido.visita_nombre}</span>
                    </div>
                  </div>
                  
                  {usuarioSession && (
                    <div>
                      {estaPronosticado ? (
                        <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-md">Lista</span>
                      ) : (
                        <span className="bg-red-50 text-red-500 border border-red-100 text-[10px] font-black px-2 py-1 rounded-md">Falta</span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}