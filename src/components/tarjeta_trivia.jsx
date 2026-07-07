import { useState } from 'react';

export default function TarjetaTrivia({ trivia, onResponder }) {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [yaRespondio, setYaRespondio] = useState(false);

  const manejarRespuesta = (letra) => {
    if (yaRespondio) return; // Evita doble clic
    
    setOpcionSeleccionada(letra);
    setYaRespondio(true);
    
    const esCorrecta = letra === trivia.respuesta_correcta;
    
    // Aquí enviarás la respuesta a Supabase
    onResponder(trivia.id, esCorrecta, trivia.monedas_premio);
  };

  const obtenerClaseBoton = (letra) => {
    // Estado inicial
    if (!yaRespondio) return "bg-slate-800 text-white hover:bg-slate-700 border border-slate-600";
    
    // Si ya respondió, revelamos los colores
    if (letra === trivia.respuesta_correcta) {
      return "bg-emerald-500 text-white border border-emerald-400 font-bold"; // La correcta brilla en verde
    }
    if (letra === opcionSeleccionada && letra !== trivia.respuesta_correcta) {
      return "bg-red-500 text-white border border-red-400"; // Su error se marca en rojo
    }
    
    // Las demás se apagan
    return "bg-slate-800 text-gray-500 opacity-50 border border-slate-700";
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl max-w-md mx-auto">
      {/* Cabecera: Dificultad y Premio */}
      <div className="flex justify-between items-center mb-4 text-xs font-bold uppercase tracking-wider">
        <span className="text-blue-400">Dificultad: {trivia.dificultad}</span>
        <span className="text-yellow-400 flex items-center gap-1">
          🪙 +{trivia.monedas_premio}
        </span>
      </div>

      {/* Pregunta */}
      <h3 className="text-xl text-white font-black mb-6 leading-tight">
        {trivia.pregunta}
      </h3>

      {/* Botones de Opciones */}
      <div className="flex flex-col gap-3">
        {['A', 'B', 'C', 'D'].map((letra) => (
          <button
            key={letra}
            onClick={() => manejarRespuesta(letra)}
            disabled={yaRespondio}
            className={`text-left p-4 rounded-lg transition-all duration-300 ${obtenerClaseBoton(letra)}`}
          >
            <span className="font-bold mr-3">{letra}.</span> 
            {trivia[`opcion_${letra.toLowerCase()}`]}
          </button>
        ))}
      </div>
    </div>
  );
}