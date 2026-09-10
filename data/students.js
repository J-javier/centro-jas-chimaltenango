// Datos base de alumnos y lecciones ya cubiertas.
// Se va llenando día por día conforme llegan las fotos de asistencia/listas.
//
// Formato: "Nombre exacto del alumno": [números de lección ya vistos]
// Ejemplo: "Juan Pérez": [1,2,3,4,5]
//
// Esto se combina (no reemplaza) con lo que ya esté marcado en el navegador,
// así que es seguro solo ir agregando o corrigiendo números aquí.

const SEED_STUDENTS = {
  // 19 de junio — lecciones 1 y 2
  "Gabriela Orellana": [1, 2],
  "Julia Gomez": [1, 2, 3, 4],
  "Luis Coyoy": [1, 2, 3, 4, 5, 6],
  "Mia Orellana": [1, 2, 3, 4],
  "Yasmin Lorenzo": [1, 2, 3, 4, 5, 6],

  // 26 de junio — lecciones 3 y 4
  "Camila Orellana": [3, 4],
  "Alisson Lorenzo": [3, 4, 5, 6],
  "Saida Monroy": [3, 4, 5, 6],
  "Elder Osorio": [3, 4],
  "Hassen Pinto": [3, 4, 5, 6],
  "Emanuel Ramirez": [3, 4],
  "Axel Lorenzo": [3, 4],
  "Fredy Ramirez": [3, 4, 5, 6],
  "Rafael Choy": [3, 4],
  "Dayli Rojcho": [3, 4],
  "Telma Choc": [3, 4],
  "Kevin Choc": [3, 4],
  "Jose Ramirez": [3, 4, 5, 6],
  "Miriam Coyoy": [3, 4, 5, 6],

  // 3 de julio — lecciones 5 y 6
  "Melany Jimenez": [5, 6], 
  "Alexander Boc": [5, 6],
  "Nefertiti Cua": [5, 6],
  "Harry Cua": [5, 6],
};
