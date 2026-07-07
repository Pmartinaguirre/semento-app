import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminRendimiento() {
  const [jugadorId, setJugadorId] = useState('');
  const [partidoId, setPartidoId] = useState('');
  const [guardando, setGuardando] = useState(false);

  const guardarRendimiento = async (e) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const { error } = await supabase
        .from('rendimiento_partidos') // <-- AQUÍ ESTÁ EL NOMBRE CORRECTO
        .insert({
          jugador_id: Number(jugadorId),
          partido_id: Number(partidoId),
          calificacion_fifa: 0 // Ajusta tus campos aquí
        });

      if (error) throw error;
      alert("¡Guardado correctamente en rendimiento_partidos!");
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-amber-500">
      <h2 className="text-xl font-bold text-amber-500 mb-4">Carga de Rendimiento</h2>
      <form onSubmit={guardarRendimiento} className="space-y-4">
        <input 
          type="number" 
          placeholder="ID Jugador" 
          className="w-full p-2 bg-slate-800 rounded"
          value={jugadorId} 
          onChange={(e) => setJugadorId(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="ID Partido" 
          className="w-full p-2 bg-slate-800 rounded"
          value={partidoId} 
          onChange={(e) => setPartidoId(e.target.value)} 
        />
        <button 
          type="submit" 
          disabled={guardando}
          className="bg-amber-600 w-full py-2 rounded font-bold"
        >
          {guardando ? 'Guardando...' : 'Guardar en Base de Datos'}
        </button>
      </form>
    </div>
  );
}