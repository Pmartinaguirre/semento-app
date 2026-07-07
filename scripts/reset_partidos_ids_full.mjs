import { createClient } from '@supabase/supabase-js'

const url = 'https://yjcjaysxznmjuvjyhslt.supabase.co'
const key = 'sb_publishable_ZcMDCIAzcgzuh-0D7iEPiQ_aGOSvn4G'
const supabase = createClient(url, key)

// Parsed 72-match list (Chile local times). fecha_partido stored as ISO with -04:00 offset.
const matches = [
  { equipo_local: 'México', equipo_visita: 'Sudáfrica', fecha_partido: '2026-06-11T15:00:00-04:00' },
  { equipo_local: 'Corea del Sur', equipo_visita: 'Chequia', fecha_partido: '2026-06-11T22:00:00-04:00' },
  { equipo_local: 'Canadá', equipo_visita: 'Bosnia y Herz.', fecha_partido: '2026-06-12T16:00:00-04:00' },
  { equipo_local: 'Estados Unidos', equipo_visita: 'Paraguay', fecha_partido: '2026-06-12T22:00:00-04:00' },
  { equipo_local: 'Catar', equipo_visita: 'Suiza', fecha_partido: '2026-06-13T15:00:00-04:00' },
  { equipo_local: 'Brasil', equipo_visita: 'Marruecos', fecha_partido: '2026-06-13T18:00:00-04:00' },
  { equipo_local: 'Haití', equipo_visita: 'Escocia', fecha_partido: '2026-06-13T21:00:00-04:00' },
  { equipo_local: 'Australia', equipo_visita: 'Turquía', fecha_partido: '2026-06-14T00:00:00-04:00' },
  { equipo_local: 'Alemania', equipo_visita: 'Curazao', fecha_partido: '2026-06-14T13:00:00-04:00' },
  { equipo_local: 'Países Bajos', equipo_visita: 'Japón', fecha_partido: '2026-06-14T16:00:00-04:00' },
  { equipo_local: 'Costa de Marfil', equipo_visita: 'Ecuador', fecha_partido: '2026-06-14T19:00:00-04:00' },
  { equipo_local: 'Suecia', equipo_visita: 'Túnez', fecha_partido: '2026-06-14T22:00:00-04:00' },
  { equipo_local: 'España', equipo_visita: 'Cabo Verde', fecha_partido: '2026-06-15T12:00:00-04:00' },
  { equipo_local: 'Bélgica', equipo_visita: 'Egipto', fecha_partido: '2026-06-15T15:00:00-04:00' },
  { equipo_local: 'Arabia Saudí', equipo_visita: 'Uruguay', fecha_partido: '2026-06-15T18:00:00-04:00' },
  { equipo_local: 'RI de Irán', equipo_visita: 'Nueva Zelanda', fecha_partido: '2026-06-15T21:00:00-04:00' },
  { equipo_local: 'Francia', equipo_visita: 'Senegal', fecha_partido: '2026-06-16T15:00:00-04:00' },
  { equipo_local: 'Irak', equipo_visita: 'Noruega', fecha_partido: '2026-06-16T18:00:00-04:00' },
  { equipo_local: 'Argentina', equipo_visita: 'Argelia', fecha_partido: '2026-06-16T21:00:00-04:00' },
  { equipo_local: 'Austria', equipo_visita: 'Jordania', fecha_partido: '2026-06-17T00:00:00-04:00' },
  { equipo_local: 'Portugal', equipo_visita: 'RD Congo', fecha_partido: '2026-06-17T13:00:00-04:00' },
  { equipo_local: 'Inglaterra', equipo_visita: 'Croacia', fecha_partido: '2026-06-17T16:00:00-04:00' },
  { equipo_local: 'Ghana', equipo_visita: 'Panamá', fecha_partido: '2026-06-17T19:00:00-04:00' },
  { equipo_local: 'Uzbekistán', equipo_visita: 'Colombia', fecha_partido: '2026-06-17T22:00:00-04:00' },
  { equipo_local: 'Chequia', equipo_visita: 'Sudáfrica', fecha_partido: '2026-06-18T12:00:00-04:00' },
  { equipo_local: 'Suiza', equipo_visita: 'Bosnia y Herz.', fecha_partido: '2026-06-18T15:00:00-04:00' },
  { equipo_local: 'Canadá', equipo_visita: 'Catar', fecha_partido: '2026-06-18T18:00:00-04:00' },
  { equipo_local: 'México', equipo_visita: 'Corea del Sur', fecha_partido: '2026-06-18T21:00:00-04:00' },
  { equipo_local: 'Estados Unidos', equipo_visita: 'Australia', fecha_partido: '2026-06-19T15:00:00-04:00' },
  { equipo_local: 'Escocia', equipo_visita: 'Marruecos', fecha_partido: '2026-06-19T18:00:00-04:00' },
  { equipo_local: 'Brasil', equipo_visita: 'Haití', fecha_partido: '2026-06-19T20:30:00-04:00' },
  { equipo_local: 'Turquía', equipo_visita: 'Paraguay', fecha_partido: '2026-06-19T23:00:00-04:00' },
  { equipo_local: 'Países Bajos', equipo_visita: 'Suecia', fecha_partido: '2026-06-20T13:00:00-04:00' },
  { equipo_local: 'Alemania', equipo_visita: 'Costa de Marfil', fecha_partido: '2026-06-20T16:00:00-04:00' },
  { equipo_local: 'Ecuador', equipo_visita: 'Curazao', fecha_partido: '2026-06-20T20:00:00-04:00' },
  { equipo_local: 'Túnez', equipo_visita: 'Japón', fecha_partido: '2026-06-21T00:00:00-04:00' },
  { equipo_local: 'España', equipo_visita: 'Arabia Saudí', fecha_partido: '2026-06-21T12:00:00-04:00' },
  { equipo_local: 'Bélgica', equipo_visita: 'RI de Irán', fecha_partido: '2026-06-21T15:00:00-04:00' },
  { equipo_local: 'Uruguay', equipo_visita: 'Cabo Verde', fecha_partido: '2026-06-21T18:00:00-04:00' },
  { equipo_local: 'Nueva Zelanda', equipo_visita: 'Egipto', fecha_partido: '2026-06-21T21:00:00-04:00' },
  { equipo_local: 'Argentina', equipo_visita: 'Austria', fecha_partido: '2026-06-22T13:00:00-04:00' },
  { equipo_local: 'Francia', equipo_visita: 'Irak', fecha_partido: '2026-06-22T17:00:00-04:00' },
  { equipo_local: 'Noruega', equipo_visita: 'Senegal', fecha_partido: '2026-06-22T20:00:00-04:00' },
  { equipo_local: 'Jordania', equipo_visita: 'Argelia', fecha_partido: '2026-06-22T23:00:00-04:00' },
  { equipo_local: 'Portugal', equipo_visita: 'Uzbekistán', fecha_partido: '2026-06-23T13:00:00-04:00' },
  { equipo_local: 'Inglaterra', equipo_visita: 'Ghana', fecha_partido: '2026-06-23T16:00:00-04:00' },
  { equipo_local: 'Panamá', equipo_visita: 'Croacia', fecha_partido: '2026-06-23T19:00:00-04:00' },
  { equipo_local: 'Colombia', equipo_visita: 'RD Congo', fecha_partido: '2026-06-23T22:00:00-04:00' },
  { equipo_local: 'Suiza', equipo_visita: 'Canadá', fecha_partido: '2026-06-24T15:00:00-04:00' },
  { equipo_local: 'Bosnia y Herz.', equipo_visita: 'Catar', fecha_partido: '2026-06-24T15:00:00-04:00' },
  { equipo_local: 'Escocia', equipo_visita: 'Brasil', fecha_partido: '2026-06-24T18:00:00-04:00' },
  { equipo_local: 'Marruecos', equipo_visita: 'Haití', fecha_partido: '2026-06-24T18:00:00-04:00' },
  { equipo_local: 'Chequia', equipo_visita: 'México', fecha_partido: '2026-06-24T21:00:00-04:00' },
  { equipo_local: 'Sudáfrica', equipo_visita: 'Corea del Sur', fecha_partido: '2026-06-24T21:00:00-04:00' },
  { equipo_local: 'Ecuador', equipo_visita: 'Alemania', fecha_partido: '2026-06-25T16:00:00-04:00' },
  { equipo_local: 'Curazao', equipo_visita: 'Costa de Marfil', fecha_partido: '2026-06-25T16:00:00-04:00' },
  { equipo_local: 'Túnez', equipo_visita: 'Países Bajos', fecha_partido: '2026-06-25T19:00:00-04:00' },
  { equipo_local: 'Japón', equipo_visita: 'Suecia', fecha_partido: '2026-06-25T19:00:00-04:00' },
  { equipo_local: 'Turquía', equipo_visita: 'Estados Unidos', fecha_partido: '2026-06-25T22:00:00-04:00' },
  { equipo_local: 'Paraguay', equipo_visita: 'Australia', fecha_partido: '2026-06-25T22:00:00-04:00' },
  { equipo_local: 'Noruega', equipo_visita: 'Francia', fecha_partido: '2026-06-26T15:00:00-04:00' },
  { equipo_local: 'Senegal', equipo_visita: 'Irak', fecha_partido: '2026-06-26T15:00:00-04:00' },
  { equipo_local: 'Uruguay', equipo_visita: 'España', fecha_partido: '2026-06-26T20:00:00-04:00' },
  { equipo_local: 'Cabo Verde', equipo_visita: 'Arabia Saudí', fecha_partido: '2026-06-26T20:00:00-04:00' },
  { equipo_local: 'Nueva Zelanda', equipo_visita: 'Bélgica', fecha_partido: '2026-06-26T23:00:00-04:00' },
  { equipo_local: 'Egipto', equipo_visita: 'RI de Irán', fecha_partido: '2026-06-26T23:00:00-04:00' },
  { equipo_local: 'Panamá', equipo_visita: 'Inglaterra', fecha_partido: '2026-06-27T17:00:00-04:00' },
  { equipo_local: 'Croacia', equipo_visita: 'Ghana', fecha_partido: '2026-06-27T17:00:00-04:00' },
  { equipo_local: 'Colombia', equipo_visita: 'Portugal', fecha_partido: '2026-06-27T19:30:00-04:00' },
  { equipo_local: 'RD Congo', equipo_visita: 'Uzbekistán', fecha_partido: '2026-06-27T19:30:00-04:00' },
  { equipo_local: 'Jordania', equipo_visita: 'Argentina', fecha_partido: '2026-06-27T22:00:00-04:00' },
  { equipo_local: 'Argelia', equipo_visita: 'Austria', fecha_partido: '2026-06-27T22:00:00-04:00' }
]

const prepared = matches.map((m, i) => ({
  id: i + 1,
  equipo_local: m.equipo_local,
  equipo_visita: m.equipo_visita,
  fecha_partido: m.fecha_partido,
  estado: 'pendiente',
  estadio: ['Estadio Azteca','SoFi Stadium','MetLife Stadium','Hard Rock Stadium','NRG Stadium','Arrowhead Stadium','Levi\'s Stadium','Gillette Stadium','Mercedes-Benz Stadium','Lincoln Financial Field','BC Place','Lumen Field','AT&T Stadium','Estadio BBVA','Estadio Akron'][i % 15]
}))

async function run() {
  console.log('Deleting existing partidos...')
  const del = await supabase.from('partidos').delete().neq('id', 0)
  if (del.error) {
    console.error('Delete error', del.error)
    process.exit(1)
  }
  console.log('Deleted rows count', del.data ? del.data.length : 0)

  console.log('Inserting 72 matches with explicit IDs 1..72...')
  const ins = await supabase.from('partidos').insert(prepared)
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
  console.log(data.map(r => `${r.id}: ${r.equipo_local} vs ${r.equipo_visita}`).join('\n'))

  console.log('Done.')
}

run()
