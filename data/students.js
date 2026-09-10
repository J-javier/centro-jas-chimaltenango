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
  "Gabriela Orellana": [1, 2, 9, 10, 17, 18, 19, 23, 24, 25, 26, 27, 28],
  "Julia Gomez": [1, 2, 3, 4],
  "Luis Coyoy": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 17, 18, 19, 23, 24, 25],
  "Mia Orellana": [1, 2, 3, 4, 17, 18, 19],
  "Yasmin Lorenzo": [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 15, 16, 17, 18, 19, 23, 24, 25, 26, 27, 28],

  // 26 de junio — lecciones 3 y 4
  "Camila Orellana": [3, 4],
  "Alisson Lorenzo": [3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
  "Saida Monroy": [3, 4, 5, 6, 7, 8, 11, 12, 15, 16, 23, 24, 25],
  "Elder Osorio": [3, 4],
  "Hassen Pinto": [3, 4, 5, 6, 7, 8, 11, 12, 15, 16, 23, 24, 25],
  "Emanuel Ramirez": [3, 4],
  "Axel Lorenzo": [3, 4, 15, 16],
  "Fredy Ramirez": [3, 4, 5, 6, 7, 8, 11, 12, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
  "Rafael Choy": [3, 4],
  "Dayli Rojcho": [3, 4],
  "Telma Choc": [3, 4, 7, 8],
  "Kevin Choc": [3, 4, 7, 8],
  "Jose Ramirez": [3, 4, 5, 6, 7, 8, 11, 12, 23, 24, 25, 26, 27, 28],
  "Miriam Coyoy": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19],

  // 3 de julio — lecciones 5 y 6
  "Melany Jimenez": [5, 6],
  "Alexander Boc": [5, 6, 7, 8, 9, 10, 11, 12, 15, 16],
  "Nefertiti Cua": [5, 6, 7, 8, 26, 27, 28],
  "Harry Cua": [5, 6, 17, 18, 19],

  // 10 de julio — lecciones 7 y 8
  "Alejandro Sanchez": [7, 8],
  "Hector Mejia": [7, 8], // apellido poco legible ("Mejin"/"Mejía"), confirmar
  "Eva Guaran": [7, 8, 11, 12, 17, 18, 19],
  "Jared Cua": [7, 8],
  "Ludwin Cuca": [7, 8, 9, 10, 11, 12, 15, 16],
  "Samuel Alvarez": [7, 8, 9, 10, 15, 16],
  "William Israel": [7, 8],
  "Yuliet Riz": [7, 8],
  "Benjamin Chojcholaj": [7, 8],
  "Carlos Reyes": [7, 8],
  "Leonardo Pineda": [7, 8],

  // 17 de julio — lecciones 9 y 10
  "Fernando Tacam": [9, 10, 17, 18, 19, 23, 24, 25, 26, 27, 28],
  "Edwin Otoniel": [9, 10, 11, 12, 17, 18, 19], // solo un nombre legible en el cuaderno
  "Lilibeth Marroquin": [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],

  // 24 de julio — lecciones 11 y 12
  "Carlos Pelico": [11, 12],

  // 14 de agosto — lecciones 20 a 22 (solo entregaron 3 alumnos)

  // 7 de agosto — lecciones 15 y 16
  "Hania Cacatzi": [15, 16, 23, 24, 25, 26, 27, 28],
  "Marisol Guarcas": [15, 16],
  "Paola Lopez": [15, 16, 17, 18, 19, 23, 24, 25, 26, 27, 28],
  "Hugo Rojche": [15, 16, 23, 24, 25, 26, 27, 28],
  "Jefry Cubur": [15, 16],
  "Josue Perez": [15, 16],
  "Alejandro Mayca": [15, 16],
  "Byron Alarcon": [15, 16],
  "Henry Pich": [15, 16, 23, 24, 25],
  "Londy Cuca": [15, 16],
  "Audri Santizo": [15, 16], // primer nombre poco legible, confirmar
  "Anllelo Lorenzo": [15, 16, 17, 18, 19, 26, 27, 28],
  "Erick Azurdia": [15, 16, 26, 27, 28],
  "Jose Siquinajay": [15, 16, 26, 27, 28],
  "Jose Suy": [15, 16],
  "Yeferson Siquinajay": [15, 16, 26, 27, 28],
  "Lindsey Per": [15, 16, 17, 18, 19],
  "Brayan Esquit": [15, 16, 17, 18, 19],

  // 21 de agosto — lecciones 17, 18 y 19
  "William Chicol": [17, 18, 19],
  "Jaquelinne Tum": [17, 18, 19],
  "Emily Tum": [17, 18, 19],
  "Elaysa Ajpop": [17, 18, 19],
  "Carolyn Ajpop": [17, 18, 19],
  "Sharon Aju": [17, 18, 19],
  "Fernando Tum": [17, 18, 19],
  "Wilmar Juarez": [17, 18, 19],
  "Edwin Sanic": [17, 18, 19],
  "Moroni Ajpop": [17, 18, 19],
  "Jasmin Gisimit": [17, 18, 19], // apellido poco legible, confirmar
  "Marlon Sipac": [17, 18, 19],
  "Erik Chuy": [17, 18, 19],

  // 28 de agosto — lecciones 23, 24 y 25
  "Moroni Salgado": [23, 24, 25, 26, 27, 28],
  "Alvin Alonzo": [23, 24, 25, 26, 27, 28],
  "Anderson Cujcuj": [23, 24, 25],
  "Jordy Cua": [23, 24, 25, 26, 27, 28],
  "Jimmy Rojche": [23, 24, 25, 26, 27, 28],
  "Perla Us": [23, 24, 25, 26, 27, 28],
  "Gadiel Gonzales": [23, 24, 25, 26, 27, 28],
  "Abel de Leon": [23, 24, 25],
  "William Escobar": [23, 24, 25, 26, 27, 28],

  // 4 de septiembre — lecciones 26, 27 y 28
  "Marisol Saloj": [26, 27, 28],
  "Renata Garcia": [26, 27, 28],
  "Aaron Marroquin": [26, 27, 28],
};
