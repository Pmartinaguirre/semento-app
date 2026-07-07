import { useState } from 'react';
import { supabase } from '../supabaseClient';

const TITULARES_MUNDIAL = {
  'México': ['Raúl Rangel', 'Jorge Sánchez', 'César Montes', 'Johan Vásquez', 'Jesús Gallardo', 'Erick Lira', 'Álvaro Fidalgo', 'Brian Gutiérrez', 'Raúl Jiménez', 'Orbelín Pineda', 'Julián Quiñones'],
  'Sudafrica': ['Ronwen Williams', 'Khuliso Mudau', 'Ime Okon', 'Mbekezeli Mbokazi', 'Aubrey Modiba', 'Teboho Mokoena', 'Jayden Adams', 'Tshepang Moremi', 'Relebohile Mofokeng', 'Oswin Appollis', 'Lyle Foster'],
  'Corea del sur': ['Jo Hyeon-Woo', 'Kim Ji-soo', 'Kim Min-jae', 'Kim Ju-sung', 'Seol Young-woo', 'Paik Seung-Ho', 'Castrop Jens', 'Lee Tae-seok', 'Lee Kang-in', 'Son Heung-min', 'Hwang Hee-chan'],
  'República Checa': ['Matej Kovar', 'Stepan Chaloupek', 'Robin Hranac', 'Ladislav Krejci', 'Vladimír Coufal', 'Vladimir Darida', 'Tomas Soucek', 'Jaroslav Zeleny', 'Adam Hlozek', 'Pavel Sulc', 'Patrik Schick'],
  'Canadá': ['Maxime Crépeau', 'Alistair Johnston', 'Moïse Bombito', 'Derek Cornelius', 'Alphonso Davies', 'Stephen Eustáquio', 'Ismaël Koné', 'Tajon Buchanan', 'Jacob Shaffelburg', 'Cyle Larin', 'Jonathan David'],
  'Suiza': ['Gregor Kobel', 'Silvan Widmer', 'Manuel Akanji', 'Nico Elvedi', 'Ricardo Rodríguez', 'Remo Freuler', 'Granit Xhaka', 'Denis Zakaria', 'Dan Ndoye', 'Rubén Vargas', 'Breel Embolo'],
  'Bosnia y Herzegovina': ['Nikola Vasilj', 'Jusuf Gazibegović', 'Nikola Katić', 'Ermin Bičakčić', 'Sead Kolašinac', 'Haris Hajradinović', 'Armin Gigović', 'Benjamin Tahirović', 'Denis Huseinbašić', 'Ermedin Demirović', 'Edin Džeko'],
  'Catar': ['Meshaal Barsham', 'Ro-Ro', 'Tarek Salman', 'Lucas Mendes', 'Boualem Khoukhi', 'Homam Ahmed', 'Jassem Gaber', 'Mohammed Waad', 'Mostafa Meshaal', 'Almoez Ali', 'Akram Afif'],
  'Brasil': ['Alisson', 'Danilo', 'Marquinhos', 'Gabriel Magalhães', 'Guilherme Arana', 'Bruno Guimarães', 'João Gomes', 'Lucas Paquetá', 'Rodrygo', 'Vinícius Júnior', 'Raphinha'],
  'Marruecos': ['Yassine Bounou', 'Achraf Hakimi', 'Nayef Aguerd', 'Romain Saïss', 'Noussair Mazraoui', 'Sofyan Amrabat', 'Azzedine Ounahi', 'Bilal El Khannouss', 'Hakim Ziyech', 'Brahim Díaz', 'Youssef En-Nesyri'],
  'Haití': ['Johny Placide', 'Carlens Arcus', 'Ricardo Adé', 'Jean-Kevin Duverne', 'Alex Christian', 'Carl-Fred Sainte', 'Danley Jean Jacques', 'Duckens Nazon', 'Frantzdy Pierrot', 'Louicius Don Deedson', 'Derrick Etienne'],
  'Escocia': ['Angus Gunn', 'Anthony Ralston', 'Grant Hanley', 'Jack Hendry', 'Andrew Robertson', 'Billy Gilmour', 'Callum McGregor', 'John McGinn', 'Scott McTominay', 'James Forrest', 'Ché Adams'],
  'Estados Unidos': ['Matt Turner', 'Joe Scally', 'Chris Richards', 'Tim Ream', 'Antonee Robinson', 'Weston McKennie', 'Yunus Musah', 'Tyler Adams', 'Christian Pulisic', 'Timothy Weah', 'Folarin Balogun'],
  'Paraguay': ['Gatito Fernández', 'Gustavo Velázquez', 'Fabián Balbuena', 'Omar Alderete', 'Matías Espinoza', 'Andrés Cubas', 'Mathias Villasanti', 'Damian Bobadilla', 'Julio Enciso', 'Miguel Almirón', 'Alex Arce'],
  'Australia': ['Mathew Ryan', 'Gethin Jones', 'Harry Souttar', 'Kye Rowles', 'Aziz Behich', 'Keanu Baccus', 'Jackson Irvine', 'Connor Metcalfe', 'Martin Boyle', 'Craig Goodwin', 'Mitchell Duke'],
  'Turquía': ['Mert Günok', 'Mert Müldür', 'Samet Akaydin', 'Abdulkerim Bardakcı', 'Ferdi Kadıoğlu', 'Salih Özcan', 'Hakan Çalhanoğlu', 'Arda Güler', 'Kenan Yıldız', 'Barış Alper Yılmaz', 'Cenk Tosun'],
  'Alemania': ['Marc-André ter Stegen', 'Joshua Kimmich', 'Jonathan Tah', 'Antonio Rüdiger', 'David Raum', 'Robert Andrich', 'Aleksandar Pavlović', 'Jamal Musiala', 'Florian Wirtz', 'Leroy Sané', 'Kai Havertz'],
  'Ecuador': ['Hernán Galíndez', 'Angelo Preciado', 'Félix Torres', 'Willian Pacho', 'Piero Hincapié', 'Alan Franco', 'Moisés Caicedo', 'John Yeboah', 'Kendry Páez', 'Jeremy Sarmiento', 'Enner Valencia'],
  'Costa de Marfil': ['Yahia Fofana', 'Wilfried Singo', 'Guela Doué', 'Odilon Kossounou', 'Evan Ndicka', 'Jean Michaël Seri', 'Franck Kessié', 'Seko Fofana', 'Nicolas Pépé', 'Amad Diallo', 'Oumar Diakité'],
  'Curazao': ['Eloy Room', 'Jurien Gaari', 'Cuco Martina', 'Roshon van Eijma', 'Sherel Floranus', 'Vurnon Anita', 'Leandro Bacuna', 'Jearl Margaritha', 'Brandley Kuwas', 'Kenji Gorré', 'Juninho Bacuna'],
  'Países Bajos': ['Bart Verbruggen', 'Denzel Dumfries', 'Stefan de Vrij', 'Virgil van Dijk', 'Nathan Aké', 'Jerdy Schouten', 'Tijjani Reijnders', 'Ryan Gravenberch', 'Xavi Simons', 'Cody Gakpo', 'Memphis Depay'],
  'Japón': ['Zion Suzuki', 'Yukinari Sugawara', 'Ko Itakura', 'Shogo Taniguchi', 'Hiroki Ito', 'Wataru Endo', 'Hidemasa Morita', 'Takefusa Kubo', 'Takumi Minamino', 'Kaoru Mitoma', 'Ayase Ueda'],
  'Suecia': ['Robin Olsen', 'Emil Holm', 'Isak Hien', 'Victor Lindelöf', 'Ludwig Augustinsson', 'Anton Salétros', 'Dejan Kulusevski', 'Lucas Bergvall', 'Sebastian Nanasi', 'Alexander Isak', 'Viktor Gyökeres'],
  'Túnez': ['Bechir Ben Saïd', 'Wajdi Kechrida', 'Dylan Bronn', 'Montassar Talbi', 'Ali Abdi', 'Ellyes Skhiri', 'Aïssa Laïdouni', 'Mohamed Ali Ben Romdhane', 'Elias Achouri', 'Hamza Rafia', 'Youssef Msakni'],
  'Bélgica': ['Thibaut Courtois', 'Thomas Meunier', 'Wout Faes', 'Arthur Theate', 'Maxim De Cuyper', 'Amadou Onana', 'Youri Tielemans', 'Leandro Trossard', 'Kevin De Bruyne', 'Jérémy Doku', 'Charles De Ketelaere'],
  'Egipto': ['Mohamed El Shenawy', 'Mohamed Hany', 'Mohamed Abdelmonem', 'Ahmed Hegazi', 'Mohamed Hamdi', 'Marwan Attia', 'Hamdi Fathi', 'Trezeguet', 'Mohamed Salah', 'Omar Marmoush', 'Mostafa Mohamed'],
  'Irán': ['Alireza Beiranvand', 'Ramin Rezaeian', 'Hossein Kanaani', 'Shojae Khalilzadeh', 'Milad Mohammadi', 'Saeid Ezatolahi', 'Saman Ghoddos', 'Ali Gholizadeh', 'Alireza Jahanbakhsh', 'Mehdi Taremi', 'Sardar Azmoun'],
  'Nueva Zelanda': ['Michael Woud', 'Tuiloma Bill', 'Nando Pijnaker', 'Tommy Smith', 'Liberato Cacace', 'Joe Bell', 'Marko Stamenic', 'Sarpreet Singh', 'Matt Garbett', 'Chris Wood', 'Ben Waine'],
  'España': ['Unai Simón', 'Dani Carvajal', 'Robin Le Normand', 'Aymeric Laporte', 'Marc Cucurella', 'Rodri', 'Fabián Ruiz', 'Pedri', 'Lamine Yamal', 'Álvaro Morata', 'Nico Williams'],
  'Cabo Verde': ['Vozinha', 'Steven Moreira', 'Logan Costa', 'Pico', 'Dylan Tavares', 'Kevin Pina', 'Jamiro Monteiro', 'Deroy Duarte', 'Ryan Mendes', 'Jovane Cabral', 'Bebé'],
  'Arabia Saudita': ['Mohammed Al-Owais', 'Saud Abdulhamid', 'Ali Lajami', 'Ali Al-Bulaihi', 'Yasser Al-Shahrani', 'Mohamed Kanno', 'Abdullah Al-Khaibari', 'Faisal Al-Ghamdi', 'Salem Al-Dawsari', 'Firas Al-Buraikan', 'Salem Al-Shehri'],
  'Uruguay': ['Sergio Rochet', 'Nahitan Nández', 'Ronald Araújo', 'José María Giménez', 'Mathías Olivera', 'Manuel Ugarte', 'Federico Valverde', 'Nicolás de la Cruz', 'Facundo Pellistri', 'Maximiliano Araújo', 'Darwin Núñez'],
  'Francia': ['Mike Maignan', 'Jules Koundé', 'William Saliba', 'Dayot Upamecano', 'Theo Hernández', 'Aurélien Tchouaméni', 'Eduardo Camavinga', 'Antoine Griezmann', 'Ousmane Dembélé', 'Kylian Mbappé', 'Bradley Barcola'],
  'Senegal': ['Édouard Mendy', 'Formose Mendy', 'Kalidou Koulibaly', 'Moussa Niakhaté', 'Ismail Jakobs', 'Lamine Camara', 'Pape Matar Sarr', 'Idrissa Gueye', 'Ismaïla Sarr', 'Sadio Mané', 'Nicolas Jackson'],
  'Irak': ['Jalal Hassan', 'Hussein Ali', 'Rebin Sulaka', 'Saad Natiq', 'Merchas Doski', 'Amir Al-Ammari', 'Osama Rashid', 'Ibrahim Bayesh', 'Ali Jasim', 'Youssef Amyn', 'Aymen Hussein'],
  'Noruega': ['Ørjan Nyland', 'Julian Ryerson', 'Andreas Hanche-Olsen', 'Leo Østigård', 'David Møller Wolfe', 'Patrick Berg', 'Martin Ødegaard', 'Sander Berge', 'Oscar Bobb', 'Antonio Nusa', 'Erling Haaland'],
  'Argentina': ['Emiliano Martínez', 'Nahuel Molina', 'Cristian Romero', 'Lisandro Martínez', 'Nicolás Tagliafico', 'Rodrigo de Paul', 'Enzo Fernández', 'Alexis Mac Allister', 'Lionel Messi', 'Julián Álvarez', 'Lautaro Martínez'],
  'Argelia': ['Anthony Mandrea', 'Youcef Atal', 'Aïssa Mandi', 'Mohamed Amine Tougai', 'Rayan Aït-Nouri', 'Nabil Bentaleb', 'Ismaël Bennacer', 'Houssem Aouar', 'Riyad Mahrez', 'Saïd Benrahma', 'Baghdad Bounedjah'],
  'Austria': ['Alexander Schlager', 'Stefan Posch', 'Kevin Danso', 'Philipp Lienhart', 'Phillipp Mwene', 'Nicolas Seiwald', 'Konrad Laimer', 'Marcel Sabitzer', 'Christoph Baumgartner', 'Patrick Wimmer', 'Michael Gregoritsch'],
  'Jordania': ['Yazeed Abulaila', 'Abdallah Nasib', 'Yazan Al-Arab', 'Salem Al-Ajalin', 'Ehsan Haddad', 'Nizar Al-Rashdan', 'Noor Al-Rawabdeh', 'Mahmoud Al-Mardi', 'Mousa Al-Tamari', 'Ali Olwan', 'Yazan Al-Naimat'],
  'Portugal': ['Diogo Costa', 'João Cancelo', 'Rúben Dias', 'Gonçalo Inácio', 'Nuno Mendes', 'João Palhinha', 'Vitinha', 'Bernardo Silva', 'Bruno Fernandes', 'Rafael Leão', 'Cristiano Ronaldo'],
  'Colombia': ['Camilo Vargas', 'Daniel Muñoz', 'Dávinson Sánchez', 'Jhon Lucumí', 'Johan Mojica', 'Richard Ríos', 'Jefferson Lerma', 'Jhon Arias', 'James Rodríguez', 'Luis Díaz', 'Jhon Durán'],
  'RD del Congo': ['Lionel Mpasi', 'Gédéon Kalulu', 'Chancel Mbemba', 'Henoc Inonga', 'Arthur Masuaku', 'Samuel Moutoussamy', 'Charles Pickel', 'Theo Bongonda', 'Gaël Kakuta', 'Yoane Wissa', 'Cédric Bakambu'],
  'Uzbekistán': ['Utkir Yusupov', 'Khusniddin Alikulov', 'Abdukodir Khusanov', 'Rustam Ashurmatov', 'Farrukh Sayfiev', 'Otabek Shukurov', 'Odiljon Hamrobekov', 'Sherzod Nasrullaev', 'Jaloliddin Masharipov', 'Abbosbek Fayzullaev', 'Eldor Shomurodov'],
  'Inglaterra': ['Jordan Pickford', 'Trent Alexander-Arnold', 'John Stones', 'Marc Guéhi', 'Bukayo Saka', 'Declan Rice', 'Jude Bellingham', 'Phil Foden', 'Cole Palmer', 'Anthony Gordon', 'Harry Kane'],
  'Croacia': ['Dominik Livaković', 'Josip Stanišić', 'Josip Šutalo', 'Joško Gvardiol', 'Borna Sosa', 'Luka Modrić', 'Mateo Kovačić', 'Mario Pašalić', 'Lovro Majer', 'Andrej Kramarić', 'Ante Budimir'],
  'Ghana': ['Lawrence Ati-Zigi', 'Alidu Seidu', 'Alexander Djiku', 'Mohammed Salisu', 'Gideon Mensah', 'Salis Abdul Samed', 'Thomas Partey', 'Mohammed Kudus', 'Ernest Nuamah', 'Jordan Ayew', 'Inaki Williams'],
  'Panamá': ['Orlando Mosquera', 'Michael Amir Murillo', 'Edgardo Fariña', 'José Córdoba', 'Roderick Miller', 'Eric Davis', 'Adalberto Carrasquilla', 'Aníbal Godoy', 'Édgar Yoel Bárcenas', 'José Luis Rodríguez', 'José Fajardo']
};

// Función mágica para quitar tildes, acentos y poner todo en minúscula
const normalizar = (texto) => {
  if (!texto) return '';
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

export default function ActualizadorTitulares() {
  const [log, setLog] = useState([]);
  const [ejecutando, setEjecutando] = useState(false);

  const agregarLog = (msj) => setLog(prev => [...prev, msj]);

  const iniciarActualizacion = async () => {
    setEjecutando(true);
    setLog([]);
    agregarLog('⏳ Iniciando actualización (Modo Sin Tildes)...');

    // 1. Limpiar todos a titular = false
    const { error: resetError } = await supabase.from('jugadores').update({ titular: false }).neq('id', 0);
    if (resetError) {
      agregarLog('❌ Error al resetear titulares');
      setEjecutando(false);
      return;
    }
    agregarLog('✅ Todos los jugadores reseteados a NO titulares.');
    agregarLog('📥 Descargando base de datos a memoria...');

    // 2. Traer TODOS los jugadores de la BD de una vez
    const { data: dbJugadores, error: errorFetch } = await supabase.from('jugadores').select('id, nombrecompleto, pais');
    
    if (errorFetch || !dbJugadores) {
      agregarLog('❌ Error al traer los jugadores de la BD.');
      setEjecutando(false);
      return;
    }

    agregarLog(`✅ ${dbJugadores.length} jugadores cargados en memoria. Iniciando cruce...`);

    let encontrados = 0;
    let noEncontrados = 0;
    const idsParaActualizar = [];

    // 3. Cruzar la información en JavaScript puro (muy rápido y perdona tildes)
    for (const [paisLista, jugadoresLista] of Object.entries(TITULARES_MUNDIAL)) {
      
      // Filtrar jugadores de ese país (ignorando tildes, ej: "México" == "mexico")
      const jugadoresPaisBD = dbJugadores.filter(j => normalizar(j.pais) === normalizar(paisLista));

      for (const jugadorLista of jugadoresLista) {
        const nombreNorm = normalizar(jugadorLista);
        const partes = nombreNorm.split(' ');
        const primeraParte = partes[0];
        const ultimaParte = partes[partes.length - 1];

        // Buscar coincidencia en los jugadores de ese país
        const match = jugadoresPaisBD.find(j => {
          const nombreBDNorm = normalizar(j.nombrecompleto);
          return nombreBDNorm.includes(primeraParte) && nombreBDNorm.includes(ultimaParte);
        });

        if (match) {
          idsParaActualizar.push(match.id);
          encontrados++;
          agregarLog(`🟢 Match: ${jugadorLista} -> BD: ${match.nombrecompleto}`);
        } else {
          agregarLog(`🔴 No encontrado: ${jugadorLista} (${paisLista})`);
          noEncontrados++;
        }
      }
    }

    // 4. Subir las actualizaciones a Supabase
    agregarLog(`⏳ Subiendo ${idsParaActualizar.length} actualizaciones a la base de datos...`);
    
    // Como Supabase no tiene update batch simple por arreglo, iteramos rápido:
    for (const id of idsParaActualizar) {
      await supabase.from('jugadores').update({ titular: true }).eq('id', id);
    }

    agregarLog('-----------------------------------');
    agregarLog('🎉 PROCESO FINALIZADO.');
    agregarLog(`👉 Jugadores actualizados con éxito: ${encontrados}`);
    agregarLog(`👉 Jugadores no encontrados: ${noEncontrados}`);
    setEjecutando(false);
  };

  return (
    <div className="p-6 bg-slate-900 border border-slate-700 rounded-xl my-10 max-w-2xl mx-auto text-white">
      <h2 className="text-xl font-bold text-emerald-400 mb-4">🛠️ Herramienta Correctora de Titulares (V2.0)</h2>
      <p className="text-sm text-slate-400 mb-4">
        Esta versión quita tildes, mayúsculas y trae la BD a memoria para cruzar datos sin importar cómo estén escritos.
      </p>
      
      <button 
        onClick={iniciarActualizacion} 
        disabled={ejecutando}
        className="bg-emerald-600 px-4 py-2 rounded font-bold disabled:opacity-50 w-full mb-4"
      >
        {ejecutando ? 'Buscando y Actualizando...' : 'EJECUTAR ACTUALIZACIÓN AHORA'}
      </button>

      <div className="bg-black p-4 rounded h-64 overflow-y-auto font-mono text-[10px] text-green-400">
        {log.map((l, i) => <div key={i}>{l}</div>)}
        {!ejecutando && log.length === 0 && <div>Esperando ejecución...</div>}
      </div>
    </div>
  );
}