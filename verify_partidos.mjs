import { createClient } from '@supabase/supabase-js'
const url = 'https://yjcjaysxznmjuvjyhslt.supabase.co'
const key = 'sb_publishable_ZcMDCIAzcgzuh-0D7iEPiQ_aGOSvn4G'
const supabase = createClient(url, key)

(async () => {
  const { count, error } = await supabase.from('partidos').select('id', { count: 'exact', head: true })
  console.log('count', count)
  console.log('error', error)

  const { data, error: exampleError } = await supabase.from('partidos').select('equipo_local, equipo_visita, grupo, fecha_partido, estado')
  console.log('example rows', data)
  console.log('example error', exampleError)
})()
