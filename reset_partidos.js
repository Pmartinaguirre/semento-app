const { createClient } = require('@supabase/supabase-js')
const url = 'https://yjcjaysxznmjuvjyhslt.supabase.co'
const key = 'sb_publishable_ZcMDCIAzcgzuh-0D7iEPiQ_aGOSvn4G'
const supabase = createClient(url, key)

const matches = [
  { equipo_local: 'México', equipo_visita: 'Arabia Saudita', grupo: 'A', fecha_partido: '2026-06-11T18:00:00+00:00', estado: 'pendiente' },
  { equipo_local: 'USA', equipo_visita: 'Gales', grupo: 'A', fecha_partido: '2026-06-12T21:00:00+00:00', estado: 'pendiente' },
  { equipo_local: 'Canadá', equipo_visita: 'Togo', grupo: 'B', fecha_partido: '2026-06-12T18:00:00+00:00', estado: 'pendiente' },
  { equipo_local: 'Italia', equipo_visita: 'Corea del Sur', grupo: 'B', fecha_partido: '2026-06-13T21:00:00+00:00', estado: 'pendiente' },
  { equipo_local: 'España', equipo_visita: 'Camerún', grupo: 'C', fecha_partido: '2026-06-13T18:00:00+00:00', estado: 'pendiente' },
  { equipo_local: 'Argentina', equipo_visita: 'Suecia', grupo: 'C', fecha_partido: '2026-06-14T21:00:00+00:00', estado: 'pendiente' },
  { equipo_local: 'Brasil', equipo_visita: 'Irán', grupo: 'D', fecha_partido: '2026-06-14T18:00:00+00:00', estado: 'pendiente' },
  { equipo_local: 'Francia', equipo_visita: 'Australia', grupo: 'D', fecha_partido: '2026-06-15T21:00:00+00:00', estado: 'pendiente' },
]

async function run() {
  console.log('Deleting existing partidos...')
  const deleteResult = await supabase.from('partidos').delete().neq('id', 0)
  console.log('delete error', deleteResult.error)
  console.log('delete count', deleteResult.data ? deleteResult.data.length : 0)

  if (deleteResult.error) {
    console.error('Unable to delete existing partidos. Aborting.')
    process.exit(1)
  }

  console.log('Inserting new fixture...')
  const insertResult = await supabase.from('partidos').insert(matches)
  console.log('insert error', insertResult.error)
  console.log('insert data count', insertResult.data ? insertResult.data.length : 0)

  if (insertResult.error) {
    console.error('Unable to insert fixture. Aborting.')
    process.exit(1)
  }

  console.log('Fixture replacement completed successfully.')
}

run()
