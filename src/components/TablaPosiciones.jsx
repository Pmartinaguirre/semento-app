export default function TablaPosiciones({ partidos, pronosticos }) {
  if (!partidos || partidos.length === 0) return null;

  const equipos = Array.from(new Set(partidos.flatMap(p => [p.equipo_local, p.equipo_visita])));
  const tabla = {};

  equipos.forEach(eq => {
    tabla[eq] = { pts: 0, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0 };
  });

  partidos.forEach(p => {
    const pro = pronosticos[p.id];
    if (pro) {
      const gl = parseInt(pro.local) || 0;
      const gv = parseInt(pro.visita) || 0;
      
      tabla[p.equipo_local].pj++; tabla[p.equipo_visita].pj++;
      tabla[p.equipo_local].gf += gl; tabla[p.equipo_local].gc += gv;
      tabla[p.equipo_visita].gf += gv; tabla[p.equipo_visita].gc += gl;

      if (gl > gv) { tabla[p.equipo_local].pts += 3; tabla[p.equipo_local].pg++; tabla[p.equipo_visita].pp++; }
      else if (gl < gv) { tabla[p.equipo_visita].pts += 3; tabla[p.equipo_visita].pg++; tabla[p.equipo_local].pp++; }
      else { tabla[p.equipo_local].pts += 1; tabla[p.equipo_visita].pts += 1; tabla[p.equipo_local].pe++; tabla[p.equipo_visita].pe++; }
      
      tabla[p.equipo_local].dg = tabla[p.equipo_local].gf - tabla[p.equipo_local].gc;
      tabla[p.equipo_visita].dg = tabla[p.equipo_visita].gf - tabla[p.equipo_visita].gc;
    }
  });

  const orden = Object.entries(tabla).sort((a, b) => b[1].pts - a[1].pts || b[1].dg - a[1].dg);

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white">
      <h4 className="font-bold mb-2">Tabla</h4>
      <table className="w-full text-xs">
        <thead><tr><th>Equipo</th><th>PJ</th><th>DG</th><th>PTS</th></tr></thead>
        <tbody>
          {orden.map(([eq, s]) => (
            <tr key={eq} className="border-t border-gray-700">
              <td>{eq}</td><td>{s.pj}</td><td>{s.dg}</td><td>{s.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}