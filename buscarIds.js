// Filtro específico para encontrar el Suiza vs Argelia
const options = {
  hostname: 'v3.football.api-sports.io',
  path: '/fixtures?league=1&season=2026&status=NS-1H-HT-2H-ET-FT',
  method: 'GET',
  headers: {
    'x-rapidapi-key': '85bb624fed12b70d65b6d6a5a5dc28c',
    'x-rapidapi-host': 'v3.football.api-sports.io'
  }
};
// Al recibir la respuesta, busca el objeto donde team.home sea "Switzerland" y team.away sea "Algeria"