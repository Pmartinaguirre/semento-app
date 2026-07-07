import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import AdminRendimiento from './AdminRendimiento'; 

export default function Admin() {
  const [tabActiva, setTabActiva] = useState('usuarios');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { 
    async function checkAuth() {
      const user = localStorage.getItem('mi_usuario_id');
      if (!user) { navigate('/login'); return; }
      const { data } = await supabase.from('usuarios').select('es_admin').eq('nombre', user).maybeSingle();
      if (!data?.es_admin) { navigate('/'); return; }
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) return <div className="text-white p-20 text-center">Cargando...</div>;

  return (
    <div className="bg-[#0b1120] min-h-screen text-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-black text-center text-amber-500 uppercase py-4">Panel Administración</h1>

        {/* MENÚ - REVISAR QUE ESTO SE ESTÉ RENDERIZANDO */}
        <div className="flex bg-slate-900 p-2 rounded-xl border border-slate-800 gap-2">
          <button onClick={() => setTabActiva('usuarios')} className={`flex-1 py-3 text-sm font-bold uppercase rounded ${tabActiva === 'usuarios' ? 'bg-emerald-600' : 'bg-slate-800'}`}>Usuarios</button>
          <button onClick={() => setTabActiva('partidos')} className={`flex-1 py-3 text-sm font-bold uppercase rounded ${tabActiva === 'partidos' ? 'bg-emerald-600' : 'bg-slate-800'}`}>Partidos</button>
          <button onClick={() => setTabActiva('rendimiento')} className={`flex-1 py-3 text-sm font-bold uppercase rounded ${tabActiva === 'rendimiento' ? 'bg-amber-600' : 'bg-slate-800'}`}>Rendimiento</button>
        </div>

        {/* CONTENIDO */}
        <div className="mt-4">
          {tabActiva === 'usuarios' && <div className="p-4 bg-slate-900 rounded">Tabla Usuarios</div>}
          {tabActiva === 'partidos' && <div className="p-4 bg-slate-900 rounded">Tabla Partidos</div>}
          {tabActiva === 'rendimiento' && <AdminRendimiento />}
        </div>
      </div>
    </div>
  );
}