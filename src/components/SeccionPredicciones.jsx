import React, { useState } from 'react';

const SeccionPredicciones = () => {
  // Estado inicial simulando los datos de la API para los Octavos de Final
  const [partidos, setPartidos] = useState([
    {
      id: 1,
      estadio: 'AT&T Stadium, Arlington',
      fecha: '06 jul, 15:00',
      equipo1: { nombre: 'España', bandera: '🇪🇸' },
      equipo2: { nombre: 'Portugal', bandera: '🇵🇹' },
      seleccion: 'equipo1' // Simula que ya se seleccionó España
    },
    {
      id: 2,
      estadio: 'Lumen Field, Seattle',
      fecha: '06 jul, 20:00',
      equipo1: { nombre: 'Estados Unidos', bandera: '🇺🇸' },
      equipo2: { nombre: 'Bélgica', bandera: '🇧🇪' },
      seleccion: 'equipo2' // Simula que ya se seleccionó Bélgica
    },
    {
      id: 3,
      estadio: 'Mercedes-Benz Stadium, Atlanta',
      fecha: '07 jul, 12:00',
      equipo1: { nombre: 'Argentina', bandera: '🇦🇷' },
      equipo2: { nombre: 'Egipto', bandera: '🇪🇬' },
      seleccion: 'equipo1' // Simula que ya se seleccionó Argentina
    }
  ]);

  // Función para actualizar el ganador seleccionado
  const manejarSeleccion = (idPartido, equipoSeleccionado) => {
    setPartidos(partidos.map(partido => 
      partido.id === idPartido ? { ...partido, seleccion: equipoSeleccionado } : partido
    ));
  };

  // Cálculos para la barra de progreso
  const prediccionesCompletadas = partidos.filter(p => p.seleccion !== null).length;
  const totalPartidos = partidos.length;
  const porcentajeProgreso = (prediccionesCompletadas / totalPartidos) * 100;

  return (
    <div className="min-h-screen bg-blue-50 font-sans pb-24">
      {/* HEADER SUPERIOR */}
      <div className="bg-[#0b3b84] text-white rounded-b-3xl pb-6">
        <div className="flex items-center justify-between p-4 pt-8">
          <button className="text-xl font-bold">&lt; Predecir</button>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#1e4b96] px-3 py-1 rounded-full text-sm">
              <span className="mr-1">🏆</span> Revelación
            </div>
            <div className="flex items-center bg-[#1e4b96] px-3 py-1 rounded-full text-sm font-bold text-yellow-400">
              <span className="mr-1">🪙</span> 1.378
            </div>
            <button className="bg-[#1e4b96] p-2 rounded-full">
              🔔
            </button>
          </div>
        </div>

        {/* SECCIÓN TORNEO Y PROGRESO */}
        <div className="px-6 mt-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-light">Camino a la</p>
              <h1 className="text-2xl font-bold">Copa 2026</h1>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">⚽</span>
            </div>
          </div>

          <div className="bg-[#1e4b96] rounded-xl p-3 flex justify-between items-center mb-4 cursor-pointer">
            <span className="font-semibold">Octavos de Final</span>
            <span>▼</span>
          </div>

          {/* BARRA DE PROGRESO */}
          <div className="relative w-full h-2 bg-[#1e4b96] rounded-full mt-6 mb-2">
            <div 
              className="absolute top-0 left-0 h-2 bg-white rounded-full transition-all duration-500"
              style={{ width: `${porcentajeProgreso}%` }}
            ></div>
            <div className="absolute right-0 -top-3 text-white font-bold flex items-center">
              ⚽ {prediccionesCompletadas}/{totalPartidos}
            </div>
          </div>
          <p className="text-sm text-blue-200">
            {prediccionesCompletadas === totalPartidos 
              ? 'Has predicho todos los partidos de Octavos de Final' 
              : 'Aún tienes predicciones pendientes'}
          </p>
        </div>
      </div>

      {/* LISTA DE PARTIDOS */}
      <div className="px-4 mt-6 flex flex-col gap-4">
        {partidos.map((partido) => (
          <div key={partido.id} className="bg-white rounded-2xl p-4 shadow-sm">
            {/* Estadio y Fecha */}
            <div className="flex justify-between text-xs text-gray-400 mb-4">
              <span>{partido.estadio}</span>
              <span>{partido.fecha}</span>
            </div>

            {/* Equipos */}
            <div className="flex justify-between items-center mb-6 px-4">
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">{partido.equipo1.bandera}</span>
                <span className="font-bold text-sm text-gray-800">{partido.equipo1.nombre}</span>
              </div>
              <div className="text-gray-300 font-bold text-sm">VS</div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">{partido.equipo2.bandera}</span>
                <span className="font-bold text-sm text-gray-800">{partido.equipo2.nombre}</span>
              </div>
            </div>

            {/* Botones de Selección */}
            <div className="flex gap-3">
              <button
                onClick={() => manejarSeleccion(partido.id, 'equipo1')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${
                  partido.seleccion === 'equipo1'
                    ? 'bg-[#0b3b84] text-white'
                    : 'bg-white text-[#0b3b84] border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Ganador
              </button>
              <button
                onClick={() => manejarSeleccion(partido.id, 'equipo2')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${
                  partido.seleccion === 'equipo2'
                    ? 'bg-[#0b3b84] text-white'
                    : 'bg-white text-[#0b3b84] border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Ganador
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeccionPredicciones;