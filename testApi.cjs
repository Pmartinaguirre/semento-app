// testAPI.cjs
const https = require('https');

const options = {
  hostname: 'v3.football.api-sports.io',
  path: '/fixtures?league=1&season=2026',
  method: 'GET',
  headers: {
    'x-rapidapi-key': '85bb624fed12b70d65b6d6a5a5dc28c', // CAMBIA EL HEADER AQUÍ
    'x-rapidapi-host': 'v3.football.api-sports.io'
  }
};
const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    console.log("Respuesta:");
    console.log(data);
  });
});

req.on('error', (e) => console.error("Error:", e));
req.end();
// ... resto igual