
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function CargaRendimiento() {
  const navigate = useNavigate();
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  
  // Datos del formulario
  const [partidoId, setPartidoId] = useState('');
  const [stats, setStats] = useState({
    calificacion_fifa: 6,
    figura_cancha: false,
    goles_jugada: 0,
    goles_penal: 0,
    valla_invicta: false,
    goles_recibidos: 0,
    goles_contra: 0,
    tarjetas_amarillas: 0,
    tarjetas_rojas: 0,
    penales_errados: 0,
    penales_atajados: 0
  });

  const ejecutarBusqueda = async () => {
    if (!terminoBusqueda.trim()) return;
    const { data } = await supabase.from('jugadores').select('*').ilike('nombrecompleto', `%${terminoBusqueda}%`).limit(5);
    setResultados(data || []);
  };

  const guardarRendimiento = async (e) => {
    e.preventDefault();
    if (!jugadorSeleccionado) return alert("Selecciona un jugador");

    const { error } = await supabase.from('rendimiento_partidos').insert({
      jugador_id: jugadorSeleccionado.id,
      partido_id: Number(partidoId),
      ...stats
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("¡Guardado exitosamente!");
      setJugadorSeleccionado(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-black text-amber-500 mb-6">Carga de Rendimiento</h1>
      
      {/* Buscador */}
      <div className="flex gap-2 mb-6">
        <input className="p-2 bg-slate-800 rounded flex-grow" onChange={(e) => setTerminoBusqueda(e.target.value)} placeholder="Nombre jugador..." />
        <button className="bg-emerald-600 px-4 rounded" onClick={ejecutarBusqueda}>Buscar</button>
      </div>

      {resultados.map(j => (
        <div key={j.id} className="p-2 bg-slate-800 mb-1 flex justify-between">
          {j.nombrecompleto} <button className="text-blue-400" onClick={() => setJugadorSeleccionado(j)}>Seleccionar</button>
        </div>
      ))}

      {jugadorSeleccionado && (
        <form onSubmit={guardarRendimiento} className="mt-6 p-4 border border-slate-700 rounded bg-slate-900">
          <h2 className="font-bold text-xl mb-4 text-amber-400">Cargando a: {jugadorSeleccionado.nombrecompleto}</h2>
          <input className="w-full p-2 bg-slate-800 mb-2" type="number" placeholder="ID Partido" onChange={e => setPartidoId(e.target.value)} required />
          {/* Aquí puedes desplegar el resto de inputs de stats */}
          <button type="submit" className="w-full bg-amber-600 py-3 mt-4 font-bold">GUARDAR EN BD</button>
        </form>
      )}
    </div>
  );
}