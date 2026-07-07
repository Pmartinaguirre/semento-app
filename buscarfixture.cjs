// Este script sirve solo para listar los partidos y sus IDs
const apiKey = '85bb624fed1d2b70d65b6d6a5a5dc28c'; // Pon tu llave real aquí
const url = 'https://v3.football.api-sports.io/fixtures?date=2026-06-19'; // Cambia la fecha según necesites

fetch(url, {
  headers: { 'x-rapidapi-key': '85bb624fed1d2b70d65b6d6a5a5dc28c', 'x-rapidapi-host': 'v3.football.api-sports.io' }
})
.then(res => res.json())
.then(data => {
  data.response.forEach(m => {
    console.log(`ID: ${m.fixture.id} | ${m.teams.home.name} vs ${m.teams.away.name}`);
  });
});