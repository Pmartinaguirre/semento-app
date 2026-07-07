export default function Dashboard() {
  // Simulamos el dato de participantes; cámbialo por tu variable real si viene de una API
  const totalParticipantes = 12; 

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner Mundialero Premium */}
      <div className="relative bg-[#0f172a] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 uppercase tracking-tighter mb-2">
            Mundial 2026
          </h1>
          <p className="text-slate-300 font-medium tracking-widest uppercase text-sm">
            Pronósticos & Ranking Oficial
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-4xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold uppercase">Participantes</p>
              <h3 className="text-3xl font-black text-slate-800">{totalParticipantes}</h3>
            </div>
            <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚽</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ranking Section */}
      <div className="max-w-4xl mx-auto p-4 mt-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 px-2">Tabla de Posiciones</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Aquí mantienes tu tabla de ranking existente */}
          <div className="p-8 text-center text-slate-400">
            Cargando ranking en tiempo real...
          </div>
        </div>
      </div>
    </div>
  );
}