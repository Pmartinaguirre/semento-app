// sincronizador.mjs
console.log("⚽ Buscando la transmisión en vivo oficial...");

const SUPABASE_URL = "https://yjcjaysxznmjuvjyhslt.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZcMDCIAzcgzuh-0D7iEPiQ_aGOSvn4G"; // Pon tu clave de Supabase
const API_FOOTBALL_KEY = "85bb624fed1d2b70d65b6d6a5a5dc28c"; // Tu clave premium

async function obtenerDatosEnVivo() {
  try {
    // 1. Consultar TODOS los partidos en vivo en este momento (sin ID fijo)
    const urlApi = `https://v3.football.api-sports.io/fixtures?live=all`;
    
    const apiRes = await fetch(urlApi, {
      method: 'GET',
      headers: { 'x-apisports-key': API_FOOTBALL_KEY }
    });

    const apiData = await apiRes.json();

    if (!apiData.response || apiData.response.length === 0) {
      console.log("La API dice que no hay partidos en vivo ahora mismo.");
      return;
    }

    // 2. Filtrar buscando a Suiza o Argelia
    const partidoReal = apiData.response.find(p => 
      p.teams.home.name === "Switzerland" || p.teams.away.name === "Switzerland" ||
      p.teams.home.name === "Algeria" || p.teams.away.name === "Algeria"
    );

    if (!partidoReal) {
      console.log("No se encontró a Suiza jugando en vivo en los registros actuales de la API.");
      return;
    }

    const idCorrecto = partidoReal.fixture.id;
    const golesLocal = partidoReal.goals.home ?? 0;
    const golesVisita = partidoReal.goals.away ?? 0;
    const minuto = partidoReal.fixture.status.elapsed ?? 0;
    const statusShort = partidoReal.fixture.status.short;

    console.log(`📡 ¡Encontrado! ID Real: ${idCorrecto}`);
    console.log(`⏱️ Minuto ${minuto}' | Suiza ${golesLocal} - ${golesVisita} Argelia | Estado: ${statusShort}`);

    const estadosTerminados = ['FT', 'AET', 'PEN'];
    const esFinalizado = estadosTerminados.includes(statusShort);

    // 3. Disparar a Supabase usando el ID correcto que descubrimos
    // IMPORTANTE: Aquí seguimos usando 1196147 en tu base de datos para no romper tu frontend, 
    // pero lo alimentamos con los datos del ID en vivo.
    const urlSupabase = `${SUPABASE_URL}/rest/v1/partidos?api_fixture_id=eq.1196147`;
    const supaRes = await fetch(urlSupabase, {
      method: "PATCH",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        goles_local_real: golesLocal,
        goles_visita_real: golesVisita,
        minuto_juego: minuto,
        tiempo_juego: esFinalizado ? statusShort : `${minuto}'`,
        estado: esFinalizado ? "finalizado" : "envivo"
      })
    });

    if (supaRes.ok) {
      console.log("✅ Supabase sincronizado con la data en vivo.");
    } else {
      console.error("❌ Error actualizando Supabase.");
    }

  } catch (error) {
    console.error("Error crítico de red:", error.message);
  }
}

obtenerDatosEnVivo();
setInterval(obtenerDatosEnVivo, 60000);