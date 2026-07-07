// diagnostico.mjs
console.log("🔍 Iniciando diagnóstico profundo de tu API Key...");

const API_FOOTBALL_KEY = "85bb624fed12b70d65b6d6a5a5dc28c";
const API_FIXTURE_ID = 1196147; // Suiza vs Argelia

async function probarDirecto() {
  console.log("\n--- 1. PROBANDO ACCESO DIRECTO (API-SPORTS) ---");
  try {
    const res = await fetch(`https://v3.football.api-sports.io/fixtures?id=${API_FIXTURE_ID}`, {
      method: 'GET',
      headers: { 'x-apisports-key': API_FOOTBALL_KEY }
    });
    const text = await res.text();
    console.log("Status Code:", res.status);
    console.log("Respuesta del Servidor:", text);
  } catch (e) {
    console.error("Error de conexión directa:", e.message);
  }
}

async function probarRapidAPI() {
  console.log("\n--- 2. PROBANDO ACCESO POR INTERMEDIARIO (RAPIDAPI) ---");
  try {
    const res = await fetch(`https://api-football-v1.p.rapidapi.com/v3/fixtures?id=${API_FIXTURE_ID}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_FOOTBALL_KEY,
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
      }
    });
    const text = await res.text();
    console.log("Status Code:", res.status);
    console.log("Respuesta del Servidor:", text);
  } catch (e) {
    console.error("Error de conexión RapidAPI:", e.message);
  }
}

async function ejecutar() {
  await probarDirecto();
  await probarRapidAPI();
}

ejecutar();