import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function Admin() {
  const [desafios, setDesafios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  // Estados del formulario para crear
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [tiempo, setTiempo] = useState('Últimos 3 días');
  const [recompensa, setRecompensa] = useState(50);
  const [fuente, setFuente] = useState('');
  const [tipo, setTipo] = useState('simple');
  const [opcionesStr, setOpcionesStr] = useState('');
  const [preguntaExtra, setPreguntaExtra] = useState('');
  const [opcionesExtraStr, setOpcionesExtraStr] = useState('Sí, No');

  useEffect(() => {
    cargarDesafios();
  }, []);

  const cargarDesafios = async () => {
    setCargando(true);
    const { data } = await supabase.from('desafios').select('*').order('id', { ascending: false });
    if (data) setDesafios(data);
    setCargando(false);
  };

  const handleCrearDesafio = async (e) => {
    e.preventDefault();
    const opcionesArray = opcionesStr.split(',').map(o => o.trim());
    const opcionesExtraArray = tipo === 'doble' ? opcionesExtraStr.split(',').map(o => o.trim()) : null;

    const { error } = await supabase.from('desafios').insert([{
      titulo,
      subtitulo,
      tiempo,
      recompensa: Number(recompensa),
      fuente,
      tipo,
      opciones: opcionesArray,
      pregunta_extra: tipo === 'doble' ? preguntaExtra : null,
      opciones_extra: opcionesExtraArray
    }]);

    if (!error) {
      setMensaje('✅ Desafío creado con éxito');
      cargarDesafios();
      // Limpiar formulario
      setTitulo(''); setSubtitulo(''); setOpcionesStr(''); setFuente('');
    } else {
      setMensaje('❌ Error al crear desafío');
    }
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleResolverDesafio = async (desafioId, opcionGanadora, premio) => {
    if (!window.confirm(`¿Seguro que la opción ganadora es "${opcionGanadora}"? Se repartirán las monedas.`)) return;

    // 1. Cerrar el desafío
    await supabase.from('desafios').update({ estado: 'cerrado', ganador: opcionGanadora }).eq('id', desafioId);

    // 2. Buscar quiénes votaron por esa opción
    const { data: ganadores } = await supabase
      .from('votos_desafios')
      .select('user_id')
      .eq('desafio_id', desafioId)
      .eq('opcion_elegida', opcionGanadora);

    // 3. Pagar a los ganadores (lógica simplificada para MVP)
    if (ganadores && ganadores.length > 0) {
      for (let ganador of ganadores) {
        const { data: perfil } = await supabase.from('perfiles').select('monedas').eq('id', ganador.user_id).single();
        if (perfil) {
          await supabase.from('perfiles').update({ monedas: perfil.monedas + premio }).eq('id', ganador.user_id);
        }
      }
      setMensaje(`🏆 Desafío resuelto. Se pagó a ${ganadores.length} ganador(es).`);
    } else {
      setMensaje(`🏆 Desafío resuelto. Nadie acertó este pronóstico.`);
    }
    
    cargarDesafios();
    setTimeout(() => setMensaje(''), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-blue-900 mb-8">⚙️ Panel de Administración</h1>

        {mensaje && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 font-bold">
            {mensaje}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* COLUMNA 1: CREAR DESAFÍOS */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Desafío</h2>
            <form onSubmit={handleCrearDesafio} className="flex flex-col gap-3">
              <input required placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} className="border p-2 rounded" />
              <textarea required placeholder="Subtítulo / Descripción" value={subtitulo} onChange={e => setSubtitulo(e.target.value)} className="border p-2 rounded" />
              
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Premio (Monedas)" value={recompensa} onChange={e => setRecompensa(e.target.value)} className="border p-2 rounded" />
                <input placeholder="Etiqueta Tiempo (ej: Último 1 día)" value={tiempo} onChange={e => setTiempo(e.target.value)} className="border p-2 rounded" />
              </div>
              
              <input required placeholder="Opciones (separadas por coma)" value={opcionesStr} onChange={e => setOpcionesStr(e.target.value)} className="border p-2 rounded" />
              <input placeholder="Fuente de validación (ej: FIFA oficial)" value={fuente} onChange={e => setFuente(e.target.value)} className="border p-2 rounded" />

              <select value={tipo} onChange={e => setTipo(e.target.value)} className="border p-2 rounded bg-gray-50 font-bold">
                <option value="simple">Simple (1 pregunta)</option>
                <option value="doble">Doble (Con estudio de mercado)</option>
              </select>

              {tipo === 'doble' && (
                <div className="p-3 bg-blue-50 rounded-lg flex flex-col gap-2 mt-2">
                  <p className="text-xs font-bold text-blue-800">Pregunta de Estudio de Mercado (Opcional)</p>
                  <input placeholder="Ej: ¿El mundial sube el delivery?" value={preguntaExtra} onChange={e => setPreguntaExtra(e.target.value)} className="border p-2 rounded text-sm" />
                  <input placeholder="Opciones extra (Sí, No)" value={opcionesExtraStr} onChange={e => setOpcionesExtraStr(e.target.value)} className="border p-2 rounded text-sm" />
                </div>
              )}

              <button type="submit" className="bg-blue-600 text-white font-bold py-3 rounded-lg mt-2 hover:bg-blue-700">
                Publicar Desafío
              </button>
            </form>
          </div>

          {/* COLUMNA 2: RESOLVER DESAFÍOS */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Desafíos Abiertos</h2>
            
            {cargando ? <p>Cargando...</p> : (
              <div className="flex flex-col gap-4">
                {desafios.filter(d => d.estado === 'abierto').map(desafio => (
                  <div key={desafio.id} className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                    <p className="font-bold text-sm mb-1">{desafio.titulo}</p>
                    <p className="text-xs text-gray-600 mb-3">Premio: 🪙 {desafio.recompensa}</p>
                    
                    <div className="flex gap-2">
                      <select id={`ganador-${desafio.id}`} className="border p-1.5 rounded text-sm flex-1">
                        <option value="">-- Seleccionar Ganador --</option>
                        {desafio.opciones.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <button 
                        onClick={() => {
                          const select = document.getElementById(`ganador-${desafio.id}`);
                          if(select.value) handleResolverDesafio(desafio.id, select.value, desafio.recompensa);
                        }}
                        className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-green-700"
                      >
                        Pagar Premio
                      </button>
                    </div>
                  </div>
                ))}
                {desafios.filter(d => d.estado === 'abierto').length === 0 && (
                  <p className="text-gray-500 text-sm">No hay desafíos abiertos pendientes.</p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}