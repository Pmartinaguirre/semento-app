// forzar_update.mjs
console.log("Iniciando actualización forzada...");

// 1. CONFIGURACIÓN DE TU SUPABASE
const SUPABASE_URL = "https://yjcjaysxznmjuvjyhslt.supabase.co";
// !!! REEMPLAZA ESTO CON TU SERVICE_ROLE_KEY O ANON_KEY DE SUPABASE !!!
const SUPABASE_KEY = "sb_publishable_ZcMDCIAzcgzuh-0D7iEPiQ_aGOSvn4G"; 

// 2. DATOS DEL PARTIDO (Suiza vs Argelia)
const API_FIXTURE_ID = 1196147; 
const DATOS_A_ACTUALIZAR = {
  goles_local_real: 2,       // Cambia estos números para probar
  goles_visita_real: 1,      // Cambia estos números para probar
  estado: "finalizado",      // o "envivo" según lo que necesites
  tiempo_juego: "FT"
};

async function actualizarBaseDeDatos() {
  try {
    const url = `${SUPABASE_URL}/rest/v1/partidos?api_fixture_id=eq.${API_FIXTURE_ID}`;
    
    const response = await fetch(url, {
      method: "PATCH", // PATCH sirve para actualizar filas existentes
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation" // Nos devuelve la fila cambiada
      },
      body: JSON.stringify(DATOS_A_ACTUALIZAR)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error de Supabase: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("¡ÉXITO TOTAL! La tabla se actualizó correctamente:");
    console.log(data);

  } catch (error) {
    console.error("❌ Error al actualizar:", error.message);
  }
}

actualizarBaseDeDatos();