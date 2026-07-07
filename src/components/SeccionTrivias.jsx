import { useEffect, useState } from 'react';
import { supabase } from "../supabaseClient";
import TarjetaTrivia from './tarjeta_trivia.jsx';

export default function SeccionTrivias({ userId }) {
  const [triviaActiva, setTriviaActiva] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [monedasGanadas, setMonedasGanadas] = useState(0);

  useEffect(() => {
    if (userId) {
      cargarSiguientePregunta();
      cargarBilletera();
    }
  }, [userId]);

  const cargarBilletera = async () => {
    const { data } = await supabase
      .from('billetera_usuarios')
      .select('monedas_totales')
      .eq('user_id', userId)
      .single();
    
    if (data) setMonedasGanadas(data.monedas_totales || 0);
  };

  const cargarSiguientePregunta = async () => {
    setCargando(true);
    
    // 1. Buscamos qué trivias ya respondió este usuario
    const { data: respondidas } = await supabase
      .from('respuestas_trivias')
      .select('trivia_id')
      .eq('user_id', userId);

    const idsRespondidas = respondidas ? respondidas.map(r => r.trivia_id) : [];

    // 2. Traemos una pregunta al azar que no esté en esa lista
    let query = supabase.from('trivias').select('*');
    if (idsRespondidas.length > 0) {
       query = query.not('id', 'in', `(${idsRespondidas.join(',')})`);
    }
    
    // Traemos solo una para el desafío actual
    const { data: triviasDisponibles } = await query.limit(1);

    if (triviasDisponibles && triviasDisponibles.length > 0) {
      setTriviaActiva(triviasDisponibles[0]);
    } else {
      setTriviaActiva(null); // Se quedó sin preguntas
    }
    
    setCargando(false);
  };

  // ESTA ES LA FUNCIÓN QUE SE HABÍA BORRADO POR LA MITAD
  const procesarRespuesta = async (esCorrecta, puntosOtorgados = 10) => {
    // 1. Registramos que el usuario ya respondió esta trivia para no repetirla
    await supabase.from('respuestas_trivias').insert([
      { user_id: userId, trivia_id: triviaActiva.id }
    ]);

    // 2. Si acertó, actualizamos la billetera en la base de datos
    if (esCorrecta) {
      const nuevasMonedas = monedasGanadas + puntosOtorgados;

      const { error: errorBilletera } = await supabase
        .from('billetera_usuarios')
        .update({ monedas_totales: nuevasMonedas })
        .eq('user_id', userId);

      // SOLO si Supabase confirma el guardado, actualizamos la pantalla
      if (!errorBilletera) {
        setMonedasGanadas(nuevasMonedas);
      } else {
        console.error("Error al sumar monedas en BD:", errorBilletera);
      }
    }

    // 3. Pausa de 2 segundos (para ver colores en la tarjeta) y cargamos la siguiente
    setTimeout(() => {
      cargarSiguientePregunta();
    }, 2000); 
  };

  if (cargando) return <div className="text-white text-center p-8 animate-pulse">Preparando desafío...</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Cabecera de la sección */}
      <div className="flex justify-between items-center mb-6 bg-slate-800 p-4 rounded-xl border border-slate-700">
        <h2 className="text-xl text-emerald-400 font-black m-0">Arena Mundialera</h2>
        <div className="text-yellow-400 font-bold flex items-center gap-2">
          <span>🪙</span> {monedasGanadas} pts
        </div>
      </div>

      {/* Renderizado Condicional de la Tarjeta */}
      {triviaActiva ? (
        <TarjetaTrivia 
          trivia={triviaActiva} 
          onResponder={procesarRespuesta} 
        />
      ) : (
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 text-center">
          <h3 className="text-xl font-bold text-white mb-2">¡Eres un Oráculo!</h3>
          <p className="text-slate-400">Has respondido todas las trivias disponibles por hoy. Vuelve pronto para más desafíos.</p>
        </div>
      )}
    </div>
  );
}