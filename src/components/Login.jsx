import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {
  const [nombre, setNombre] = useState('');
  const [pin, setPin] = useState('');
  const [esRegistro, setEsRegistro] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleAccion = async (e) => {
    e.preventDefault();
    const nombreTrim = nombre.trim();
    
    if (nombreTrim === '' || pin.length !== 4) {
      setMensaje("Ingresa un nombre y un PIN de 4 dígitos.");
      return;
    }

    if (esRegistro) {
      // REGISTRO: Buscamos en tabla 'usuarios'
      const { data: existe } = await supabase.from('usuarios').select('nombre').eq('nombre', nombreTrim).maybeSingle();
      
      if (existe) {
        setMensaje("Ese nombre ya está registrado.");
      } else {
        const { error } = await supabase.from('usuarios').insert([{ 
          nombre: nombreTrim, 
          pin: pin, 
          approved: false // Usamos la columna real 'approved'
        }]);
        
        if (error) setMensaje("Error: " + error.message);
        else setMensaje("¡Registro exitoso! Avisa al admin para tu activación.");
      }
    } else {
      // LOGIN: Validamos contra tabla 'usuarios'
      const { data, error } = await supabase
        .from('usuarios')
        .select('*') // Usamos * para evitar problemas de caché con columnas
        .eq('nombre', nombreTrim)
        .maybeSingle();

      if (error || !data) {
        setMensaje("Usuario no encontrado.");
      } else if (data.pin !== pin) {
        setMensaje("PIN incorrecto.");
      } else if (!data.approved) { // Validamos la columna real 'approved'
        setMensaje("Cuenta pendiente de activación por el admin.");
      } else {
        localStorage.setItem('mi_usuario_id', nombreTrim);
        navigate('/');
      }
    }
  };

  return (
    <div className="bg-[#0b1120] min-h-screen flex items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl w-full max-w-sm text-center">
        <h1 className="text-2xl font-black text-emerald-400 mb-6 uppercase tracking-widest">
          {esRegistro ? 'Crear Cuenta' : 'Acceso Polla 2026'}
        </h1>
        
        <form onSubmit={handleAccion} className="space-y-4">
          <input 
            type="text" 
            placeholder="Nombre" 
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-center"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input 
            type="password" 
            maxLength="4"
            placeholder="PIN (4 dígitos)" 
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-center tracking-[0.5em]"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          />
          <button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl uppercase tracking-widest"
          >
            {esRegistro ? 'Enviar Registro' : 'Ingresar'}
          </button>
        </form>

        {mensaje && <p className="text-amber-400 text-xs mt-4 font-bold">{mensaje}</p>}

        <button 
          onClick={() => setEsRegistro(!esRegistro)}
          className="mt-6 text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-emerald-400"
        >
          {esRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
        </button>
      </div>
    </div>
  );
}