import { createClient } from '@supabase/supabase-js'

const url = 'https://yjcjaysxznmjuvjyhslt.supabase.co'
const key = 'sb_publishable_ZcMDCIAzcgzuh-0D7iEPiQ_aGOSvn4G'
const supabase = createClient(url, key)

// Official 72-match group-stage schedule from the user-provided mapping, including the two missing Group F matches.
const matches = [
  { equipo_local: 'México', equipo_visita: 'Sudáfrica', grupo: 'A', fecha_partido: '2026-06-11T15:00:00-04:00', estadio: 'Mexico City Stadium, México' },
  { equipo_local: 'República de Corea', equipo_visita: 'República Checa', grupo: 'A', fecha_partido: '2026-06-11T22:00:00-04:00', estadio: 'Guadalajara Stadium, México' },
  { equipo_local: 'Canadá', equipo_visita: 'Bosnia y Herzegovina', grupo: 'B', fecha_partido: '2026-06-12T16:00:00-04:00', estadio: 'Toronto Stadium, Canadá' },
  { equipo_local: 'Estados Unidos', equipo_visita: 'Paraguay', grupo: 'D', fecha_partido: '2026-06-12T22:00:00-04:00', estadio: 'Los Angeles Stadium, Estados Unidos' },
  { equipo_local: 'Australia', equipo_visita: 'Turquía', grupo: 'D', fecha_partido: '2026-06-13T00:00:00-04:00', estadio: 'Vancouver Stadium, Canadá' },
  { equipo_local: 'Catar', equipo_visita: 'Suiza', grupo: 'B', fecha_partido: '2026-06-13T15:00:00-04:00', estadio: 'San Francisco Bay Area Stadium, Estados Unidos' },
  { equipo_local: 'Brasil', equipo_visita: 'Marruecos', grupo: 'C', fecha_partido: '2026-06-13T18:00:00-04:00', estadio: 'New York New Jersey Stadium, Estados Unidos' },
  { equipo_local: 'Haití', equipo_visita: 'Escocia', grupo: 'C', fecha_partido: '2026-06-13T21:00:00-04:00', estadio: 'Boston Stadium, Estados Unidos' },
  { equipo_local: 'Alemania', equipo_visita: 'Curazao', grupo: 'E', fecha_partido: '2026-06-14T13:00:00-04:00', estadio: 'Houston Stadium, Estados Unidos' },
  { equipo_local: 'Países Bajos', equipo_visita: 'Japón', grupo: 'F', fecha_partido: '2026-06-14T16:00:00-04:00', estadio: 'Dallas Stadium, Estados Unidos' },
  { equipo_local: 'Costa de Marfil', equipo_visita: 'Ecuador', grupo: 'E', fecha_partido: '2026-06-14T19:00:00-04:00', estadio: 'Philadelphia Stadium, Estados Unidos' },
  { equipo_local: 'Suecia', equipo_visita: 'Túnez', grupo: 'F', fecha_partido: '2026-06-14T22:00:00-04:00', estadio: 'Monterrey Stadium, México' },
  { equipo_local: 'España', equipo_visita: 'Cabo Verde', grupo: 'H', fecha_partido: '2026-06-15T12:00:00-04:00', estadio: 'Atlanta Stadium, Estados Unidos' },
  { equipo_local: 'Bélgica', equipo_visita: 'Egipto', grupo: 'G', fecha_partido: '2026-06-15T15:00:00-04:00', estadio: 'Seattle Stadium, Estados Unidos' },
  { equipo_local: 'Arabia Saudí', equipo_visita: 'Uruguay', grupo: 'H', fecha_partido: '2026-06-15T18:00:00-04:00', estadio: 'Miami Stadium, Estados Unidos' },
  { equipo_local: 'RI de Irán', equipo_visita: 'Nueva Zelanda', grupo: 'G', fecha_partido: '2026-06-15T21:00:00-04:00', estadio: 'Los Angeles Stadium, Estados Unidos' },
  { equipo_local: 'Francia', equipo_visita: 'Senegal', grupo: 'I', fecha_partido: '2026-06-16T15:00:00-04:00', estadio: 'New York New Jersey Stadium, Estados Unidos' },
  { equipo_local: 'Irak', equipo_visita: 'Noruega', grupo: 'I', fecha_partido: '2026-06-16T18:00:00-04:00', estadio: 'Boston Stadium, Estados Unidos' },
  { equipo_local: 'Argentina', equipo_visita: 'Argelia', grupo: 'J', fecha_partido: '2026-06-16T21:00:00-04:00', estadio: 'Kansas City Stadium, Estados Unidos' },
  { equipo_local: 'Austria', equipo_visita: 'Jordania', grupo: 'J', fecha_partido: '2026-06-17T00:00:00-04:00', estadio: 'San Francisco Bay Area Stadium, Estados Unidos' },
  { equipo_local: 'Portugal', equipo_visita: 'RD de Congo', grupo: 'K', fecha_partido: '2026-06-17T13:00:00-04:00', estadio: 'Houston Stadium, Estados Unidos' },
  { equipo_local: 'Inglaterra', equipo_visita: 'Croacia', grupo: 'L', fecha_partido: '2026-06-17T16:00:00-04:00', estadio: 'Dallas Stadium, Estados Unidos' },
  { equipo_local: 'Ghana', equipo_visita: 'Panamá', grupo: 'L', fecha_partido: '2026-06-17T19:00:00-04:00', estadio: 'Toronto Stadium, Canadá' },
  { equipo_local: 'Uzbekistán', equipo_visita: 'Colombia', grupo: 'K', fecha_partido: '2026-06-17T22:00:00-04:00', estadio: 'Mexico City Stadium, México' },
  { equipo_local: 'República Checa', equipo_visita: 'Sudáfrica', grupo: 'A', fecha_partido: '2026-06-18T12:00:00-04:00', estadio: 'Atlanta Stadium, Estados Unidos' },
  { equipo_local: 'Suiza', equipo_visita: 'Bosnia y Herzegovina', grupo: 'B', fecha_partido: '2026-06-18T15:00:00-04:00', estadio: 'Los Angeles Stadium, Estados Unidos' },
  { equipo_local: 'Canadá', equipo_visita: 'Catar', grupo: 'B', fecha_partido: '2026-06-18T18:00:00-04:00', estadio: 'Vancouver Stadium, Canadá' },
  { equipo_local: 'México', equipo_visita: 'República de Corea', grupo: 'A', fecha_partido: '2026-06-18T21:00:00-04:00', estadio: 'Guadalajara Stadium, México' },
  { equipo_local: 'Estados Unidos', equipo_visita: 'Australia', grupo: 'D', fecha_partido: '2026-06-19T15:00:00-04:00', estadio: 'Seattle Stadium, Estados Unidos' },
  { equipo_local: 'Escocia', equipo_visita: 'Marruecos', grupo: 'C', fecha_partido: '2026-06-19T18:00:00-04:00', estadio: 'Boston Stadium, Estados Unidos' },
  { equipo_local: 'Brasil', equipo_visita: 'Haití', grupo: 'C', fecha_partido: '2026-06-19T21:00:00-04:00', estadio: 'Philadelphia Stadium, Estados Unidos' },
  { equipo_local: 'Turquía', equipo_visita: 'Paraguay', grupo: 'D', fecha_partido: '2026-06-20T00:00:00-04:00', estadio: 'San Francisco Bay Area Stadium, Estados Unidos' },
  { equipo_local: 'Países Bajos', equipo_visita: 'Suecia', grupo: 'F', fecha_partido: '2026-06-20T13:00:00-04:00', estadio: 'Houston Stadium, Estados Unidos' },
  { equipo_local: 'Alemania', equipo_visita: 'Costa de Marfil', grupo: 'E', fecha_partido: '2026-06-20T16:00:00-04:00', estadio: 'Toronto Stadium, Canadá' },
  { equipo_local: 'Ecuador', equipo_visita: 'Curazao', grupo: 'E', fecha_partido: '2026-06-20T20:00:00-04:00', estadio: 'Boston Stadium, Estados Unidos' },
  { equipo_local: 'Túnez', equipo_visita: 'Japón', grupo: 'F', fecha_partido: '2026-06-21T00:00:00-04:00', estadio: 'Atlanta Stadium, Estados Unidos' },
  { equipo_local: 'España', equipo_visita: 'Arabia Saudí', grupo: 'H', fecha_partido: '2026-06-21T12:00:00-04:00', estadio: 'Miami Stadium, Estados Unidos' },
  { equipo_local: 'Bélgica', equipo_visita: 'RI de Irán', grupo: 'G', fecha_partido: '2026-06-21T15:00:00-04:00', estadio: 'New York New Jersey Stadium, Estados Unidos' },
  { equipo_local: 'Uruguay', equipo_visita: 'Cabo Verde', grupo: 'H', fecha_partido: '2026-06-21T18:00:00-04:00', estadio: 'San Francisco Bay Area Stadium, Estados Unidos' },
  { equipo_local: 'Nueva Zelanda', equipo_visita: 'Egipto', grupo: 'G', fecha_partido: '2026-06-21T21:00:00-04:00', estadio: 'Vancouver Stadium, Canadá' },
  { equipo_local: 'Argentina', equipo_visita: 'Austria', grupo: 'J', fecha_partido: '2026-06-22T13:00:00-04:00', estadio: 'Dallas Stadium, Estados Unidos' },
  { equipo_local: 'Francia', equipo_visita: 'Irak', grupo: 'I', fecha_partido: '2026-06-22T17:00:00-04:00', estadio: 'Philadelphia Stadium, Estados Unidos' },
  { equipo_local: 'Noruega', equipo_visita: 'Senegal', grupo: 'I', fecha_partido: '2026-06-22T20:00:00-04:00', estadio: 'New York New Jersey Stadium, Estados Unidos' },
  { equipo_local: 'Jordania', equipo_visita: 'Argelia', grupo: 'J', fecha_partido: '2026-06-22T23:00:00-04:00', estadio: 'San Francisco Bay Area Stadium, Estados Unidos' },
  { equipo_local: 'Portugal', equipo_visita: 'Uzbekistán', grupo: 'K', fecha_partido: '2026-06-23T13:00:00-04:00', estadio: 'Houston Stadium, Estados Unidos' },
  { equipo_local: 'Inglaterra', equipo_visita: 'Ghana', grupo: 'L', fecha_partido: '2026-06-23T16:00:00-04:00', estadio: 'Miami Stadium, Estados Unidos' },
  { equipo_local: 'Panamá', equipo_visita: 'Croacia', grupo: 'L', fecha_partido: '2026-06-23T19:00:00-04:00', estadio: 'Philadelphia Stadium, Estados Unidos' },
  { equipo_local: 'Colombia', equipo_visita: 'RD de Congo', grupo: 'K', fecha_partido: '2026-06-23T22:00:00-04:00', estadio: 'Guadalajara Stadium, México' },
  { equipo_local: 'Suiza', equipo_visita: 'Canadá', grupo: 'B', fecha_partido: '2026-06-24T15:00:00-04:00', estadio: 'Vancouver Stadium, Canadá' },
  { equipo_local: 'Bosnia y Herzegovina', equipo_visita: 'Catar', grupo: 'B', fecha_partido: '2026-06-24T15:00:00-04:00', estadio: 'Seattle Stadium, Estados Unidos' },
  { equipo_local: 'Escocia', equipo_visita: 'Brasil', grupo: 'C', fecha_partido: '2026-06-24T18:00:00-04:00', estadio: 'Miami Stadium, Estados Unidos' },
  { equipo_local: 'Marruecos', equipo_visita: 'Haití', grupo: 'C', fecha_partido: '2026-06-24T18:00:00-04:00', estadio: 'Atlanta Stadium, Estados Unidos' },
  { equipo_local: 'República Checa', equipo_visita: 'México', grupo: 'A', fecha_partido: '2026-06-24T21:00:00-04:00', estadio: 'Mexico City Stadium, México' },
  { equipo_local: 'Sudáfrica', equipo_visita: 'República de Corea', grupo: 'A', fecha_partido: '2026-06-24T21:00:00-04:00', estadio: 'Monterrey Stadium, México' },
  { equipo_local: 'Curazao', equipo_visita: 'Costa de Marfil', grupo: 'E', fecha_partido: '2026-06-25T16:00:00-04:00', estadio: 'Philadelphia Stadium, Estados Unidos' },
  { equipo_local: 'Ecuador', equipo_visita: 'Alemania', grupo: 'E', fecha_partido: '2026-06-25T16:00:00-04:00', estadio: 'New York New Jersey Stadium, Estados Unidos' },
  { equipo_local: 'Túnez', equipo_visita: 'Países Bajos', grupo: 'F', fecha_partido: '2026-06-25T19:30:00-04:00', estadio: 'AT&T Stadium, Estados Unidos' },
  { equipo_local: 'Japón', equipo_visita: 'Suecia', grupo: 'F', fecha_partido: '2026-06-25T19:30:00-04:00', estadio: 'Arrowhead Stadium, Estados Unidos' },
  { equipo_local: 'Turquía', equipo_visita: 'Estados Unidos', grupo: 'D', fecha_partido: '2026-06-25T22:00:00-04:00', estadio: 'Los Angeles Stadium, Estados Unidos' },
  { equipo_local: 'Paraguay', equipo_visita: 'Australia', grupo: 'D', fecha_partido: '2026-06-25T22:00:00-04:00', estadio: 'San Francisco Bay Area Stadium, Estados Unidos' },
  { equipo_local: 'Noruega', equipo_visita: 'Francia', grupo: 'I', fecha_partido: '2026-06-26T15:00:00-04:00', estadio: 'Boston Stadium, Estados Unidos' },
  { equipo_local: 'Senegal', equipo_visita: 'Irak', grupo: 'I', fecha_partido: '2026-06-26T15:00:00-04:00', estadio: 'Toronto Stadium, Canadá' },
  { equipo_local: 'Uruguay', equipo_visita: 'España', grupo: 'H', fecha_partido: '2026-06-26T20:00:00-04:00', estadio: 'Guadalajara Stadium, México' },
  { equipo_local: 'Cabo Verde', equipo_visita: 'Arabia Saudí', grupo: 'H', fecha_partido: '2026-06-26T20:00:00-04:00', estadio: 'Houston Stadium, Estados Unidos' },
  { equipo_local: 'Egipto', equipo_visita: 'RI de Irán', grupo: 'G', fecha_partido: '2026-06-26T23:00:00-04:00', estadio: 'Seattle Stadium, Estados Unidos' },
  { equipo_local: 'Nueva Zelanda', equipo_visita: 'Bélgica', grupo: 'G', fecha_partido: '2026-06-26T23:00:00-04:00', estadio: 'Vancouver Stadium, Canadá' },
  { equipo_local: 'Panamá', equipo_visita: 'Inglaterra', grupo: 'L', fecha_partido: '2026-06-27T17:00:00-04:00', estadio: 'Kansas City Stadium, Estados Unidos' },
  { equipo_local: 'Croacia', equipo_visita: 'Ghana', grupo: 'L', fecha_partido: '2026-06-27T17:00:00-04:00', estadio: 'Atlanta Stadium, Estados Unidos' },
  { equipo_local: 'Colombia', equipo_visita: 'Portugal', grupo: 'K', fecha_partido: '2026-06-27T19:30:00-04:00', estadio: 'Miami Stadium, Estados Unidos' },
  { equipo_local: 'RD de Congo', equipo_visita: 'Uzbekistán', grupo: 'K', fecha_partido: '2026-06-27T19:30:00-04:00', estadio: 'Atlanta Stadium, Estados Unidos' },
  { equipo_local: 'Argelia', equipo_visita: 'Austria', grupo: 'J', fecha_partido: '2026-06-27T22:00:00-04:00', estadio: 'Kansas City Stadium, Estados Unidos' },
  { equipo_local: 'Jordania', equipo_visita: 'Argentina', grupo: 'J', fecha_partido: '2026-06-27T22:00:00-04:00', estadio: 'Dallas Stadium, Estados Unidos' }
]

const prepared = matches.map((m, i) => ({
  id: i + 1,
  equipo_local: m.equipo_local,
  equipo_visita: m.equipo_visita,
  grupo: m.grupo,
  fecha_partido: m.fecha_partido,
  estado: 'pendiente',
  estadio: m.estadio
}))

async function run() {
  console.log('Deleting existing partidos...')
  const del = await supabase.from('partidos').delete({ returning: 'representation' }).neq('id', 0)
  if (del.error) {
    console.error('Delete error', del.error)
    process.exit(1)
  }
  console.log('Deleted rows count', del.data ? del.data.length : 0)

  console.log('Inserting matches with explicit IDs 1..72...')
  const ins = await supabase.from('partidos').insert(prepared, { returning: 'representation' })
  if (ins.error) {
    console.error('Insert error', ins.error)
    process.exit(1)
  }
  console.log('Inserted rows', ins.data ? ins.data.length : 0)

  const { data, error } = await supabase.from('partidos').select('id, equipo_local, equipo_visita').order('id', { ascending: true })
  if (error) {
    console.error('Select error', error)
    process.exit(1)
  }
  console.log('Sample rows:')
  console.log(data.map(r => `${r.id}: ${r.equipo_local} vs ${r.equipo_visita}`).join('
'))

  console.log('Done.')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
