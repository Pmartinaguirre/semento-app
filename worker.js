import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const nombreMap = {
  "Argentina": "Argentina",
  "Cape Verde Islands": "Cabo Verde",
  "Australia": "Australia",
  "Egypt": "Egipto",
  "Colombia": "Colombia",
  "Ghana": "Ghana",
  "Canada": "Canadá",
  "Morocco": "Marruecos",
  "Paraguay": "Paraguay",
  "France": "Francia",
  "Brazil": "Brasil",
  "Norway": "Noruega",
  "Mexico": "México",
  "England": "Inglaterra",
  "Portugal": "Portugal",
  "Spain": "España",
  "USA": "Estados Unidos",
  "Belgium": "Bélgica"
};

function determinarEstadoPorTiempo(apiStatus, fechaPartidoISO) {
  const estadosFinalizado = ['FT', 'AET', 'PEN'];
  if (estadosFinalizado.includes(apiStatus)) return 'finalizado';

  const estadosEnJuego = ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'SUSP', 'INT'];
  if (estadosEnJuego.includes(apiStatus)) return 'envivo';

  const ahora = new Date();
  const fechaPartido = new Date(fechaPartidoISO);
  const diffMinutos = (fechaPartido - ahora) / (1000 * 60);

  if (diffMinutos <= 5) {
    return 'bloqueado'; 
  } else {
    return 'pendiente'; 
  }
}

async function consultarYActualizar() {
  console.log('--- [INICIO] Sincronización de Goles y Estado App ---');
  
  try {
    const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
      params: { league: '1', season: '2026' }, 
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': process.env.API_FOOTBALL_KEY
      }
    });

    const partidos = response.data.response;

    for (const partido of partidos) {
      
      const homeNameES = nombreMap[partido.teams.home.name] || partido.teams.home.name;
      const awayNameES = nombreMap[partido.teams.away.name] || partido.teams.away.name;
      const matchId = partido.fixture.id;
      const apiStatus = partido.fixture.status.short;
      const fechaPartido = partido.fixture.date;

      const golesLocal = partido.goals.home;
      const golesVisita = partido.goals.away;

      const { data: partidoExistente, error: errorBusqueda } = await supabase
        .from('partidos')
        .select('id, eventos_goles')
        .eq('equipo_local', homeNameES)
        .eq('equipo_visita', awayNameES)
        .maybeSingle();

      if (errorBusqueda || !partidoExistente) continue;

      const estadoCalculado = determinarEstadoPorTiempo(apiStatus, fechaPartido);

      let listaGolesJSON = Array.isArray(partidoExistente.eventos_goles) ? partidoExistente.eventos_goles : [];
      
      const estaEnVivo = estadoCalculado === 'envivo';
      const estaTerminado = estadoCalculado === 'finalizado';
      const hayGoles = (golesLocal > 0 || golesVisita > 0);
      
      const necesitaEventos = (estaEnVivo && hayGoles) || (estaTerminado && hayGoles && listaGolesJSON.length === 0);

      if (necesitaEventos) {
        try {
           const { data: eventosData } = await axios.get('https://v3.football.api-sports.io/fixtures/events', {
              params: { fixture: matchId, type: 'Goal' },
              headers: { 'x-rapidapi-host': 'v3.football.api-sports.io', 'x-rapidapi-key': process.env.API_FOOTBALL_KEY }
           });
           
           if (eventosData.response && eventosData.response.length > 0) {
               listaGolesJSON = eventosData.response.map(gol => {
                  const nombreEquipoGol = nombreMap[gol.team?.name] || gol.team?.name;
                  const bando = (nombreEquipoGol === homeNameES) ? 'local' : 'visita';

                  return {
                    equipo: bando,
                    jugador_nombre_apellido: gol.player?.name || 'Desconocido',
                    minuto: gol.time?.elapsed || 0
                  };
               });
           }
        } catch (errEventos) {
           console.error(`Error buscando goles ID ${matchId}:`, errEventos.message);
        }
      } else if (!hayGoles) {
        listaGolesJSON = [];
      }

      // --- AQUÍ ESTÁ LA MAGIA AGREGADA ---
      const updateData = {
        estado: estadoCalculado, 
        estado_app: apiStatus, // Guardamos la sigla (1H, HT, PEN, etc.)
        goles_local_real: golesLocal,
        goles_visita_real: golesVisita,
        minuto_juego: partido.fixture.status.elapsed,
        eventos_goles: listaGolesJSON
      };

      await supabase
        .from('partidos')
        .update(updateData)
        .eq('id', partidoExistente.id);
    }
    
    console.log('--- [FIN] Sincronización terminada ---');
  } catch (error) {
    console.error('--- [ERROR CRÍTICO]:', error.message);
  }
}

consultarYActualizar();