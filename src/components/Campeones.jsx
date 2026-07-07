import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const todosLosPaises = ["México", "Sudáfrica", "República de Corea", "República Checa", "Canadá", "Bosnia y Herzegovina", "Catar", "Suiza", "Brasil", "Marruecos", "Haití", "Escocia", "Estados Unidos", "Paraguay", "Australia", "Turquía", "Alemania", "Curazao", "Costa de Marfil", "Ecuador", "Países Bajos", "Japón", "Suecia", "Túnez", "Bélgica", "Egipto", "RI de Irán", "Nueva Zelanda", "España", "Cabo Verde", "Arabia Saudí", "Uruguay", "Francia", "Senegal", "Irak", "Noruega", "Argentina", "Argelia", "Austria", "Jordania", "Portugal", "RD de Congo", "Uzbekistán", "Colombia", "Inglaterra", "Croacia", "Ghana", "Panamá"];

const gruposData = {
  'A': ["México", "Sudáfrica", "República de Corea", "República Checa"],
  'B': ["Canadá", "Bosnia y Herzegovina", "Catar", "Suiza"],
  'C': ["Brasil", "Marruecos", "Haití", "Escocia"],
  'D': ["Estados Unidos", "Paraguay", "Australia", "Turquía"],
  'E': ["Alemania", "Curazao", "Costa de Marfil", "Ecuador"],
  'F': ["Países Bajos", "Japón", "Suecia", "Túnez"],
  'G': ["Bélgica", "Egipto", "RI de Irán", "Nueva Zelanda"],
  'H': ["España", "Cabo Verde", "Arabia Saudí", "Uruguay"],
  'I': ["Francia", "Senegal", "Irak", "Noruega"],
  'J': ["Argentina", "Argelia", "Austria", "Jordania"],
  'K': ["Portugal", "RD de Congo", "Uzbekistán", "Colombia"],
  'L': ["Inglaterra", "Croacia", "Ghana", "Panamá"]
};

export default function Campeones() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [esBloqueado, setEsBloqueado] = useState(false);
  const [premios, setPremios] = useState({
    campeon: '', segundo: '', tercero: '',
    mejorJugador: '', goleador: '', mejorArquero: '',
    grupos: {}, mejoresTerceros: Array(8).fill('')
  });

  useEffect(() => {
    async function cargar() {
      const usuario = localStorage.getItem('mi_usuario_id');
      if (!usuario) { navigate('/login'); return; }

      try {
        // 1. Cargar datos del usuario
        const { data: userData } = await supabase
          .from('campeones')
          .select('datos_premios')
          .eq('usuario_nombre', usuario)
          .maybeSingle();

        // 2. Cargar estado global de bloqueo
        const { data: configData } = await supabase
          .from('configuracion')
          .select('estado')
          .eq('nombre', 'bloqueo_campeones')
          .maybeSingle();

        if (userData) setPremios(userData.datos_premios);
        
        // Bloqueamos si el estado es 'bloqueado'
        if (configData?.estado === 'bloqueado') {
          setEsBloqueado(true);
        }
      } catch (err) {
        console.error("Error al cargar:", err);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [navigate]);

  const Selector = ({ value, onChange, lista, excluidos }) => (
    <select 
      className="w-full p-2 bg-slate-900 border border-slate-600 rounded text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed" 
      value={value} 
      onChange={onChange}
      disabled={esBloqueado}
    >
      <option value="">Seleccionar...</option>
      {lista.filter(p => !excluidos.includes(p) || p === value).map(p => (
        <option key={p} value={p}>{p}</option>
      ))}
    </select>
  );

  const guardar = async () => {
    if (esBloqueado) return alert("❌ Apuestas cerradas.");
    
    const usuario = localStorage.getItem('mi_usuario_id');
    const { error } = await supabase.from('campeones').upsert({ 
      usuario_nombre: usuario, 
      datos_premios: premios 
    });
    
    if (error) alert("Error: " + error.message);
    else alert("💾 ¡Predicciones guardadas!");
  };

  if (loading) return <div className="text-white p-20 text-center">Cargando...</div>;

  const clasificadosEnGrupos = Object.values(premios.grupos || {}).flatMap(g => [g.primero, g.segundo]).filter(Boolean);

  return (
    <div className="bg-[#0b1120] min-h-screen text-white p-4 pb-20">
      <h1 className="text-2xl font-black text-emerald-400 mb-6 text-center">PRONÓSTICOS MUNDIALEROS</h1>
      
      {esBloqueado && (
        <div className="bg-red-900/50 border border-red-500 text-white p-4 rounded-xl mb-6 text-center font-bold">
          🔒 APUESTAS CERRADAS: Los pronósticos no se pueden modificar.
        </div>
      )}
      
      <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 mb-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4 text-amber-400">Podio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Campeón</label>
              <Selector lista={todosLosPaises} value={premios.campeon} onChange={e => setPremios({...premios, campeon: e.target.value})} excluidos={[premios.segundo, premios.tercero]} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">2do Lugar</label>
              <Selector lista={todosLosPaises} value={premios.segundo} onChange={e => setPremios({...premios, segundo: e.target.value})} excluidos={[premios.campeon, premios.tercero]} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">3er Lugar</label>
              <Selector lista={todosLosPaises} value={premios.tercero} onChange={e => setPremios({...premios, tercero: e.target.value})} excluidos={[premios.campeon, premios.segundo]} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-blue-400">Premios individuales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Mejor Jugador</label>
              <input disabled={esBloqueado} className="w-full p-2 bg-slate-900 border border-slate-600 rounded text-sm font-bold disabled:opacity-50" value={premios.mejorJugador} onChange={e => setPremios({...premios, mejorJugador: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Goleador</label>
              <input disabled={esBloqueado} className="w-full p-2 bg-slate-900 border border-slate-600 rounded text-sm font-bold disabled:opacity-50" value={premios.goleador} onChange={e => setPremios({...premios, goleador: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Mejor Arquero</label>
              <input disabled={esBloqueado} className="w-full p-2 bg-slate-900 border border-slate-600 rounded text-sm font-bold disabled:opacity-50" value={premios.mejorArquero} onChange={e => setPremios({...premios, mejorArquero: e.target.value})} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(gruposData).map(([letra, paises]) => (
          <div key={letra} className="bg-slate-800 p-3 rounded border border-slate-700">
            <h3 className="font-bold text-emerald-400 mb-2">GRUPO {letra}</h3>
            <Selector lista={paises} value={premios.grupos[letra]?.primero || ''} onChange={e => setPremios(p => ({...p, grupos: {...p.grupos, [letra]: {...p.grupos[letra], primero: e.target.value}}}))} excluidos={[premios.grupos[letra]?.segundo || '', ...premios.mejoresTerceros]} />
            <Selector lista={paises} value={premios.grupos[letra]?.segundo || ''} onChange={e => setPremios(p => ({...p, grupos: {...p.grupos, [letra]: {...p.grupos[letra], segundo: e.target.value}}}))} excluidos={[premios.grupos[letra]?.primero || '', ...premios.mejoresTerceros]} />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4 text-purple-400">8 Mejores Terceros</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {premios.mejoresTerceros.map((_, i) => (
          <Selector key={i} lista={todosLosPaises} value={premios.mejoresTerceros[i]} onChange={e => { const n = [...premios.mejoresTerceros]; n[i] = e.target.value; setPremios({...premios, mejoresTerceros: n});}} excluidos={[...clasificadosEnGrupos, ...premios.mejoresTerceros]} />
        ))}
      </div>

      <button 
        onClick={guardar} 
        disabled={esBloqueado}
        className={`w-full p-4 rounded-xl font-black text-lg ${esBloqueado ? 'bg-slate-600 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'}`}
      >
        {esBloqueado ? 'APUESTAS CERRADAS' : 'GUARDAR TODO'}
      </button>
    </div>
  );
}	
