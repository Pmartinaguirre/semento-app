import React, { useState } from 'react';
import { supabase } from './supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [esRegistro, setEsRegistro] = useState(false);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setCargando(true);

    if (esRegistro) {
      // Crear cuenta nueva
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) alert("Error al registrar: " + error.message);
      else {
        alert("¡Cuenta creada! Ya puedes iniciar sesión.");
        setEsRegistro(false);
      }
    } else {
      // Iniciar sesión
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) alert("Error al entrar: " + error.message);
      else {
        // Si entra con éxito, lo mandamos al Dashboard
        navigate('/');
      }
    }
    setCargando(false);
  };

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col justify-center items-center p-4 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-white tracking-wider drop-shadow-md">
          SEMENTO<span className="text-blue-300">-app</span>
        </h1>
        <p className="text-blue-200 mt-2">Inicia sesión para ganar monedas</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">Correo Electrónico</label>
            <input 
              type="email" 
              required
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">Contraseña</label>
            <input 
              type="password" 
              required
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl mt-4 hover:bg-blue-800 transition-colors"
          >
            {cargando ? 'Cargando...' : (esRegistro ? 'Crear Cuenta' : 'Entrar a Jugar')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setEsRegistro(!esRegistro)}
            className="text-sm text-blue-600 font-semibold hover:underline"
          >
            {esRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
          </button>
        </div>
      </div>
      
      <div className="mt-8">
        <Link to="/" className="text-white text-sm opacity-70 hover:opacity-100">Volver al inicio sin entrar</Link>
      </div>
    </div>
  );
}