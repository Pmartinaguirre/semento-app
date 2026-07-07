import { createClient } from '@supabase/supabase-js';

// Usa las mismas credenciales que usaste en tus scripts anteriores
const supabaseUrl = 'https://yjcjaysxznmjuvjyhslt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqY2pheXN4em5tanV2anloc2x0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDU2NDI1OCwiZXhwIjoyMDk2MTQwMjU4fQ.kUf5m1cvgEsgcLSHvsULEGnrcavhSHYtJ5sC_h0strc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function enviarPronostico() {
  const miPronostico = {
    usuario_nombre: "Pablo Martin",
    
    // AQUÍ COMPLETAS EL ORDEN DE LOS 12 GRUPOS
    grupos_orden: {
      "Grupo A": { "1ro": "Escribe Aquí", "2do": "Escribe Aquí" },
      "Grupo B": { "1ro": "Escribe Aquí", "2do": "Escribe Aquí" },
      "Grupo C": { "1ro": "Escribe Aquí", "2do": "Escribe Aquí" },
      "Grupo D": { "1ro": "Escribe Aquí", "2do": "Escribe Aquí" },
      "Grupo E": { "1ro": "Escribe Aquí", "2do": "Escribe Aquí" },
      "Grupo F": { "1ro": "Escribe Aquí", "2do": "Escribe Aquí" },
      "Grupo G": { "1ro": "Escribe Aquí", "2do": "Escribe Aquí" },
      "Grupo H": { "1ro": "Escribe Aquí", "2do": "Escribe Aquí" },
      "Grupo I": { "1ro": "Escribe Aquí", "2do": "Escribe Aquí" },
      "Grupo J": { "1ro": "Escribe Aquí", "2do": "Escribe Aquí" },
      "Grupo K": { "1ro": "Escribe Aquí", "2do": "Escribe Aquí" },
      "Grupo L": { "1ro": "Escribe Aquí", "2do": "Escribe Aquí" }
    },
    
    // AQUÍ TUS PREDICCIONES FINALES
    campeon: "Escribe Aquí",
    subcampeon: "Escribe Aquí",
    tercer_lugar: "Escribe Aquí",
    
    // PREMIOS INDIVIDUALES
    goleador: "Escribe Aquí",
    mejor_jugador: "Escribe Aquí",
    mejor_arquero: "Escribe Aquí"
  };

  const { data, error } = await supabase.from('pronosticos').insert([miPronostico]);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('¡Pronóstico guardado exitosamente!');
  }
}

enviarPronostico();


