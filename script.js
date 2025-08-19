document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const scoreScreen = document.getElementById('score-screen');
    const startButton = document.getElementById('start-button');
    const nextButton = document.getElementById('next-button');
    const playAgainButton = document.getElementById('play-again-button');
    const feedbackButton = document.getElementById('feedback-button');
    const questionCounter = document.getElementById('question-counter');
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const finalScore = document.getElementById('final-score');
    const feedbackSection = document.getElementById('feedback-section');
    const feedbackText = document.getElementById('feedback-text');
    const totalCounter = document.getElementById('total-counter');
    const totalQuestionsInput = document.getElementById('total-questions');
    const axisInputs = {
        "Números": document.getElementById('numeros'),
        "Álgebra": document.getElementById('algebra'),
        "Geometría": document.getElementById('geometria'),
        "Datos y Azar": document.getElementById('datos')
    };
    const correctBar = document.getElementById('correct-bar');
    const reviewBar = document.getElementById('review-bar');

    // --- Estado del Juego ---
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let needsReviewCount = 0;
    let recentlyUsedIds = [];

    // --- BANCO DE PREGUNTAS (VERSIÓN FINAL, COMPLETA Y AUTOCONTENIDA) ---
    const allQuestions = [
        // Eje Números (15 Preguntas)
        { id: 1, question: "¿Cuál es el resultado de (-5) + (-4)?", answers: [ { text: "-9", correct: true }, { text: "9", correct: false }, { text: "1", correct: false }, { text: "-1", correct: false } ], axis: "Números", feedback: "Al sumar números con el mismo signo negativo, sumas sus valores (5+4=9) y conservas el signo negativo."}, 
        { id: 2, question: "Un pantalón cuesta $12.000. Si compras 2 y pagas $19.200, ¿qué % de descuento recibiste?", answers: [ { text: "20%", correct: true }, { text: "15%", correct: false }, { text: "10%", correct: false }, { text: "25%", correct: false } ], axis: "Números", feedback: "Dos pantalones costarían $24.000. El ahorro fue de $4.800. La proporción es (4800 / 24000) * 100 = 20%."}, 
        { id: 3, question: "Un congelador a 0°C baja 1,4°C cada 5 min. ¿Qué temperatura tendrá en 20 min?", answers: [ { text: "-5,6°C", correct: true }, { text: "5,6°C", correct: false }, { text: "-2,8°C", correct: false }, { text: "-7,0°C", correct: false } ], axis: "Números", feedback: "En 20 minutos hay 4 periodos de 5 minutos. La temperatura bajará 4 * 1,4 = 5,6 grados. Partiendo de 0, será -5,6°C."}, 
        { id: 4, question: "¿Cuál es el resultado de 18 : (-3)?", answers: [ { text: "-6", correct: true }, { text: "6", correct: false }, { text: "-9", correct: false }, { text: "9", correct: false } ], axis: "Números", feedback: "Al dividir un número positivo por uno negativo, el resultado es negativo. 18 dividido en 3 es 6."}, 
        { id: 5, question: "Si el 25% de un número es 80, ¿cuál es el 40% de ese número?", answers: [ { text: "128", correct: true }, { text: "32", correct: false }, { text: "50", correct: false }, { text: "95", correct: false } ], axis: "Números", feedback: "Si el 25% es 80, el número completo (100%) es 320. El 40% de 320 es (320 * 40) / 100 = 128."}, 
        { id: 6, question: "¿Cuál es el resultado de 3/5 * 4/7?", answers: [ { text: "12/35", correct: true }, { text: "7/12", correct: false }, { text: "21/20", correct: false }, { text: "1/2", correct: false } ], axis: "Números", feedback: "La multiplicación de fracciones es directa: numerador por numerador (3*4=12) y denominador por denominador (5*7=35)."},
        { id: 7, question: "Un curso compró 2 cajas de 14 plumones cada una y los repartió en 4 grupos. ¿Cuántos plumones recibió cada grupo?", answers: [ { text: "7", correct: true }, { text: "8", correct: false }, { text: "14", correct: false }, { text: "4", correct: false } ], axis: "Números", feedback: "En total hay 2 * 14 = 28 plumones. Si se reparten entre 4 grupos, cada uno recibe 28 / 4 = 7 plumones."}, 
        { id: 8, question: "¿Cuál es el valor de la potencia 6³?", answers: [ { text: "216", correct: true }, { text: "18", correct: false }, { text: "36", correct: false }, { text: "63", correct: false } ], axis: "Números", feedback: "La potencia 6³ significa multiplicar 6 por sí mismo 3 veces: 6 * 6 * 6 = 216."}, 
        { id: 9, question: "¿Cuál es el valor de √144?", answers: [ { text: "12", correct: true }, { text: "72", correct: false }, { text: "14", correct: false }, { text: "24", correct: false } ], axis: "Números", feedback: "La raíz cuadrada de 144 es el número que, multiplicado por sí mismo, da 144. Ese número es 12, porque 12 * 12 = 144."}, 
        { id: 10, question: "Normalmente, un pasaje cuesta $4.000. Si sube un 15%, ¿cuál es su nuevo valor?", answers: [ { text: "$4.600", correct: true }, { text: "$4.150", correct: false }, { text: "$3.400", correct: false }, { text: "$4.500", correct: false } ], axis: "Números", feedback: "El 15% de 4.000 es 600. El nuevo precio es el precio original más el aumento: 4.000 + 600 = 4.600."},
        { id: 43, question: "¿Entre qué valores se encuentra √21?", answers: [ { text: "Entre 4 y 5", correct: true }, { text: "Entre 5 y 6", correct: false }, { text: "Entre 20 y 22", correct: false }, { text: "Entre 21 y 22", correct: false } ], axis: "Números", feedback: "Sabemos que 4*4=16 y 5*5=25. Como 21 está entre 16 y 25, su raíz cuadrada estará entre 4 y 5."}, 
        { id: 44, question: "¿Cuál es el resultado de (-5) · (-27)?", answers: [ { text: "135", correct: true }, { text: "-135", correct: false }, { text: "105", correct: false }, { text: "-105", correct: false } ], axis: "Números", feedback: "Al multiplicar dos números negativos, el resultado es positivo. 5 * 27 = 135."}, 
        { id: 45, question: "Una cinta de 5/6 m se corta en trozos de 1/6 m. ¿Cuántos trozos se obtienen?", answers: [ { text: "5", correct: true }, { text: "6", correct: false }, { text: "10", correct: false }, { text: "30", correct: false } ], axis: "Números", feedback: "Para saber cuántos trozos caben, divides el largo total por el largo de cada trozo: (5/6) / (1/6) = 5."}, 
        { id: 46, question: "¿Qué porcentaje del círculo está pintado si 1 de 5 partes iguales es gris?", answers: [ { text: "20%", correct: true }, { text: "10%", correct: false }, { text: "25%", correct: false }, { text: "5%", correct: false } ], axis: "Números", feedback: "La fracción es 1/5. Para convertir una fracción a porcentaje, la multiplicas por 100. (1/5) * 100 = 20%."}, 
        { id: 47, question: "Un juego da +10 puntos por acierto y -20 por fallo. Si tienes 2 aciertos y 1 fallo, ¿qué puntaje tienes?", answers: [ { text: "0", correct: true }, { text: "10", correct: false }, { text: "-10", correct: false }, { text: "20", correct: false } ], axis: "Números", feedback: "Calculamos los puntos: (2 aciertos * 10 puntos) + (1 fallo * -20 puntos) = 20 - 20 = 0 puntos."},

        // Eje Álgebra (14 Preguntas)
        { id: 11, question: "Reduce la expresión: -6x + 5z + 5x + 6z", answers: [ { text: "-x + 11z", correct: true }, { text: "x + 11z", correct: false }, { text: "-11x + 11z", correct: false }, { text: "x - z", correct: false } ], axis: "Álgebra", feedback: "Agrupa los términos semejantes: (-6x + 5x) da como resultado -x. Y (5z + 6z) da como resultado 11z."}, 
        { id: 12, question: "¿Qué expresión representa 'el triple de la suma de un número P y un número Q'?", answers: [ { text: "3(P + Q)", correct: true }, { text: "3P + Q", correct: false }, { text: "P + 3Q", correct: false }, { text: "3 + P + Q", correct: false } ], axis: "Álgebra", feedback: "La 'suma de P y Q' es (P+Q). 'El triple' de eso es multiplicar toda la suma por 3."}, 
        { id: 13, question: "¿Cuál es el valor de x en la ecuación 5x = 65?", answers: [ { text: "13", correct: true }, { text: "15", correct: false }, { text: "10", correct: false }, { text: "12", correct: false } ], axis: "Álgebra", feedback: "Para despejar x, divides ambos lados por 5. x = 65 / 5, lo que da 13."}, 
        { id: 14, question: "¿Cuál es la solución de la ecuación 2x – 8 = 20?", answers: [ { text: "14", correct: true }, { text: "10", correct: false }, { text: "6", correct: false }, { text: "28", correct: false } ], axis: "Álgebra", feedback: "Primero, suma 8 a ambos lados (2x = 28). Luego, divide por 2 (x = 14)."}, 
        { id: 15, question: "Si f(x) = 1 + 3x, ¿cuál es el valor de f(-2)?", answers: [ { text: "-5", correct: true }, { text: "-7", correct: false }, { text: "-4", correct: false }, { text: "5", correct: false } ], axis: "Álgebra", feedback: "Reemplaza la x por -2 en la función: f(-2) = 1 + 3*(-2) = 1 - 6 = -5."}, 
        { id: 16, question: "Al factorizar 6x² + 10x, ¿qué expresión se obtiene?", answers: [ { text: "2x(3x + 5)", correct: true }, { text: "2(3x² + 5x)", correct: false }, { text: "x(6x + 10)", correct: false }, { text: "6x(x + 10/6)", correct: false } ], axis: "Álgebra", feedback: "El factor común más grande entre 6x² y 10x es 2x. Al sacarlo, divides cada término por 2x."},
        { id: 17, question: "¿Cuál es la solución de la inecuación 5x + 15 > 45?", answers: [ { text: "x > 6", correct: true }, { text: "x < 6", correct: false }, { text: "x > 12", correct: false }, { text: "x < 12", correct: false } ], axis: "Álgebra", feedback: "Resta 15 de ambos lados (5x > 30). Luego, divide por 5 (x > 6)."}, 
        { id: 18, question: "¿Qué función representa la tabla: x=3,F(x)=5; x=4,F(x)=7; x=5,F(x)=9?", answers: [ { text: "F(x) = 2x - 1", correct: true }, { text: "F(x) = x + 2", correct: false }, { text: "F(x) = 3x - 4", correct: false }, { text: "F(x) = 2x + 1", correct: false } ], axis: "Álgebra", feedback: "Prueba con el primer valor: si x=3, 2*3 - 1 = 5. Funciona. Si x=4, 2*4 - 1 = 7. También funciona. ¡Esa es la función!"},
        { id: 19, question: "¿Cuál es el perímetro de un rectángulo de lados (a+b) y (a)?", answers: [ { text: "4a + 2b", correct: true }, { text: "2a + b", correct: false }, { text: "a² + ab", correct: false }, { text: "2a + 2b", correct: false } ], axis: "Álgebra", feedback: "El perímetro es la suma de los 4 lados: (a+b) + (a+b) + a + a. Agrupando términos, nos da 4a + 2b."}, 
        { id: 20, question: "Una plantación tiene 858 árboles en 26 hileras. ¿Qué ecuación calcula h, el número de árboles por hilera?", answers: [ { text: "26h = 858", correct: true }, { text: "h/26 = 858", correct: false }, { text: "858h = 26", correct: false }, { text: "h - 26 = 858", correct: false } ], axis: "Álgebra", feedback: "El total de árboles (858) es el resultado de multiplicar el número de hileras (26) por el número de árboles en cada una (h)."},
        { id: 48, question: "¿Cuál es la factorización de 36a² - b²?", answers: [ { text: "(6a + b)(6a - b)", correct: true }, { text: "(6a - b)²", correct: false }, { text: "(36a + b)(a - b)", correct: false }, { text: "6(6a² - b²)", correct: false } ], axis: "Álgebra", feedback: "Esto es una 'suma por su diferencia'. Se factoriza como la raíz del primer término más la raíz del segundo, por la raíz del primero menos la del segundo."}, 
        { id: 49, question: "Una empresa cobra $900 fijos más $1300 por metro cúbico (x) de agua. ¿Qué función modela el costo C(x)?", answers: [ { text: "C(x) = 1300x + 900", correct: true }, { text: "C(x) = 2200x", correct: false }, { text: "C(x) = 900x + 1300", correct: false }, { text: "C(x) = 1300x - 900", correct: false } ], axis: "Álgebra", feedback: "El costo total es la suma del cargo fijo ($900) más la parte variable, que es el precio por metro cúbico ($1300) multiplicado por la cantidad de metros (x)."},
        { id: 50, question: "¿Cuál es la pendiente de la recta y = -x + 1?", answers: [ { text: "-1", correct: true }, { text: "1", correct: false }, { text: "0", correct: false }, { text: "-x", correct: false } ], axis: "Álgebra", feedback: "En la forma y = mx + b, la pendiente es el número 'm' que acompaña a la x. En este caso, es -1."}, 
        { id: 51, question: "¿Cuál de estos valores es una solución para 2 - x < 5?", answers: [ { text: "-2", correct: true }, { text: "-3", correct: false }, { text: "-4", correct: false }, { text: "-5", correct: false } ], axis: "Álgebra", feedback: "La inecuación se resuelve a x > -3. De las opciones, el único número que es mayor que -3 es -2."},

        // Eje Geometría (16 Preguntas)
        { id: 21, question: "Un triángulo rectángulo tiene catetos de 6 cm y 8 cm. ¿Cuál es su área?", answers: [ { text: "24 cm²", correct: true }, { text: "48 cm²", correct: false }, { text: "14 cm²", correct: false }, { text: "30 cm²", correct: false } ], axis: "Geometría", feedback: "El área de un triángulo es (base * altura) / 2. En un triángulo rectángulo, los catetos son la base y la altura. (6 * 8) / 2 = 24."}, 
        { id: 22, question: "Usando π = 3, ¿cuál es el perímetro de un círculo de radio 6 cm?", answers: [ { text: "36 cm", correct: true }, { text: "18 cm", correct: false }, { text: "54 cm", correct: false }, { text: "108 cm", correct: false } ], axis: "Geometría", feedback: "El perímetro de un círculo es 2 * π * radio. Con los valores dados: 2 * 3 * 6 = 36 cm."}, 
        { id: 23, question: "En un triángulo rectángulo, los catetos miden 8 cm y 6 cm. ¿Cuánto mide la hipotenusa?", answers: [ { text: "10 cm", correct: true }, { text: "14 cm", correct: false }, { text: "28 cm", correct: false }, { text: "50 cm", correct: false } ], axis: "Geometría", feedback: "Por el Teorema de Pitágoras: a² + b² = c². Entonces, 6² + 8² = 36 + 64 = 100. La raíz cuadrada de 100 es 10."}, 
        { id: 24, question: "¿Cuál es el volumen de un cilindro de diámetro 6 cm y altura 5 cm? (Aprox. π=3)", answers: [ { text: "135 cm³", correct: true }, { text: "45 cm³", correct: false }, { text: "90 cm³", correct: false }, { text: "270 cm³", correct: false } ], axis: "Geometría", feedback: "El volumen es área de la base (π * radio²) por la altura. El radio es 3 (la mitad del diámetro). Volumen = 3 * 3² * 5 = 135."}, 
        { id: 25, question: "Un triángulo isósceles tiene dos ángulos de 80°. ¿Cuánto mide el tercer ángulo?", answers: [ { text: "20°", correct: true }, { text: "100°", correct: false }, { text: "80°", correct: false }, { text: "40°", correct: false } ], axis: "Geometría", feedback: "La suma de los ángulos de un triángulo es 180°. Si dos ángulos suman 80+80=160, el tercero debe medir 180 - 160 = 20°."}, 
        { id: 26, question: "¿Cuál es el área de la superficie de un prisma de 10cm x 3cm x 2cm?", answers: [ { text: "112 cm²", correct: true }, { text: "60 cm²", correct: false }, { text: "52 cm²", correct: false }, { text: "120 cm²", correct: false } ], axis: "Geometría", feedback: "Calcula el área de cada cara y súmalas. Tienes dos caras de (10x3), dos de (10x2) y dos de (3x2). Total: 2*30 + 2*20 + 2*6 = 60+40+12=112."}, 
        { id: 27, question: "¿Cuál es el valor del ángulo interior de un pentágono regular?", answers: [ { text: "108°", correct: true }, { text: "72°", correct: false }, { text: "90°", correct: false }, { text: "120°", correct: false } ], axis: "Geometría", feedback: "La fórmula para el ángulo interior de un polígono regular es (n-2) * 180 / n. Para un pentágono (n=5), es (3 * 180) / 5 = 108°."}, 
        { id: 28, question: "Una rampa mide 13 metros de largo y avanza 12 metros en el suelo. ¿Qué altura tiene?", answers: [ { text: "5 m", correct: true }, { text: "1 m", correct: false }, { text: "10 m", correct: false }, { text: "25 m", correct: false } ], axis: "Geometría", feedback: "Es un triángulo rectángulo. Por Pitágoras, altura² + 12² = 13². Altura² + 144 = 169. Altura² = 25. La altura es 5 metros."}, 
        { id: 29, question: "¿Cuáles son las coordenadas del vector de traslación que mueve el punto A(2,5) al punto B(5,1)?", answers: [ { text: "(3, -4)", correct: true }, { text: "(-3, 4)", correct: false }, { text: "(3, 4)", correct: false }, { text: "(-3, -4)", correct: false } ], axis: "Geometría", feedback: "Para encontrar el vector, resta las coordenadas del punto de origen a las del punto de destino: (5-2, 1-5) = (3, -4)."},
        { id: 30, question: "¿Cuál es el área de un cuadrado cuyo perímetro es 36 cm?", answers: [ { text: "81 cm²", correct: true }, { text: "36 cm²", correct: false }, { text: "144 cm²", correct: false }, { text: "9 cm²", correct: false } ], axis: "Geometría", feedback: "Si el perímetro es 36 cm, cada uno de los 4 lados mide 36/4 = 9 cm. El área de un cuadrado es lado * lado, es decir, 9 * 9 = 81 cm²."}, 
        { id: 31, question: "Si el radio de un círculo es 5 cm, ¿cuál es su área? (Aprox. π=3,14)", answers: [ { text: "78,5 cm²", correct: true }, { text: "15,7 cm²", correct: false }, { text: "31,4 cm²", correct: false }, { text: "25 cm²", correct: false } ], axis: "Geometría", feedback: "El área de un círculo es π * radio². Con los valores dados: 3,14 * 5² = 3,14 * 25 = 78,5 cm²."}, 
        { id: 32, question: "Un ángulo mide 40°. ¿Cuánto mide su ángulo complementario?", answers: [ { text: "50°", correct: true }, { text: "140°", correct: false }, { text: "90°", correct: false }, { text: "320°", correct: false } ], axis: "Geometría", feedback: "Dos ángulos son complementarios si suman 90°. El complemento de 40° es 90° - 40° = 50°."},
        { id: 52, question: "¿Cuál es el volumen de un paralelepípedo de 10cm x 4cm x 3cm?", answers: [ { text: "120 cm³", correct: true }, { text: "30 cm³", correct: false }, { text: "60 cm³", correct: false }, { text: "17 cm³", correct: false } ], axis: "Geometría", feedback: "El volumen de un paralelepípedo (una caja) es simplemente la multiplicación de sus tres dimensiones: largo * ancho * alto. 10 * 4 * 3 = 120."}, 
        { id: 53, question: "¿Cuál es el área de un triángulo de base 10 cm y altura 5 cm?", answers: [ { text: "25 cm²", correct: true }, { text: "50 cm²", correct: false }, { text: "15 cm²", correct: false }, { text: "100 cm²", correct: false } ], axis: "Geometría", feedback: "La fórmula del área de un triángulo es siempre (base * altura) / 2. En este caso, (10 * 5) / 2 = 25 cm²."}, 
        { id: 54, question: "Un círculo tiene un área de 75 cm². Si se usa π=3, ¿cuál es su radio?", answers: [ { text: "5 cm", correct: true }, { text: "10 cm", correct: false }, { text: "15 cm", correct: false }, { text: "25 cm", correct: false } ], axis: "Geometría", feedback: "La fórmula del área es π * radio². Si el área es 75 y π es 3, entonces 75 = 3 * radio². Dividiendo por 3, tenemos 25 = radio². La raíz cuadrada de 25 es 5."}, 
        { id: 55, question: "¿Cómo se llama un polígono de 8 lados?", answers: [ { text: "Octágono", correct: true }, { text: "Hexágono", correct: false }, { text: "Heptágono", correct: false }, { text: "Nonágono", correct: false } ], axis: "Geometría", feedback: "Un polígono de 6 lados es un hexágono, de 7 es un heptágono y de 8 es un octágono."},

        // Eje Datos y Azar (13 Preguntas)
        { id: 33, question: "En una ruleta de 5 números (1-5), ¿cuál es la probabilidad de que salga el 4?", answers: [ { text: "1/5", correct: true }, { text: "4/5", correct: false }, { text: "1/4", correct: false }, { text: "4%", correct: false } ], axis: "Datos y Azar", feedback: "La probabilidad es 'casos favorables' (1, que salga el 4) sobre 'casos posibles' (5 números en total)."}, 
        { id: 34, question: "Para los datos: 4, 3, 9, 6, 3, ¿cuál es la mediana?", answers: [ { text: "4", correct: true }, { text: "3", correct: false }, { text: "5", correct: false }, { text: "6", correct: false } ], axis: "Datos y Azar", feedback: "Primero, ordena los números: 3, 3, 4, 6, 9. La mediana es el valor que queda justo en el medio."}, 
        { id: 35, question: "Una caja tiene 2 blancas, 3 verdes y 5 azules (10 total). ¿Probabilidad de NO sacar una verde?", answers: [ { text: "7/10", correct: true }, { text: "3/10", correct: false }, { text: "1/10", correct: false }, { text: "5/10", correct: false } ], axis: "Datos y Azar", feedback: "Hay 7 bolitas que no son verdes (2 blancas + 5 azules) de un total de 10. La probabilidad es 7 sobre 10."}, 
        { id: 36, question: "Se lanzó una moneda 20 veces, obteniendo 8 sellos. ¿Cuál es la frecuencia relativa de los sellos?", answers: [ { text: "0,40", correct: true }, { text: "0,50", correct: false }, { text: "8", correct: false }, { text: "2,5", correct: false } ], axis: "Datos y Azar", feedback: "La frecuencia relativa es el número de veces que ocurre un evento (8 sellos) dividido por el total de intentos (20 lanzamientos). 8/20 = 0,40."}, 
        { id: 37, question: "¿Cuál es la media (promedio) de los datos: 4, 18, 7, 4, 2?", answers: [ { text: "7", correct: true }, { text: "4", correct: false }, { text: "5", correct: false }, { text: "8.75", correct: false } ], axis: "Datos y Azar", feedback: "La media se calcula sumando todos los datos (4+18+7+4+2 = 35) y dividiendo por la cantidad de datos (5). 35 / 5 = 7."}, 
        { id: 38, question: "¿El segundo cuartil de un conjunto de datos siempre es igual a qué medida?", answers: [ { text: "La mediana", correct: true }, { text: "La moda", correct: false }, { text: "El promedio", correct: false }, { text: "El rango", correct: false } ], axis: "Datos y Azar", feedback: "¡Correcto! El segundo cuartil (Q2) es el valor que divide los datos en dos mitades iguales, que es la definición de la mediana."},
        { id: 39, question: "Al lanzar un dado de 6 caras, ¿cuál es la probabilidad de obtener un número mayor que 4?", answers: [ { text: "1/3", correct: true }, { text: "1/6", correct: false }, { text: "1/2", correct: false }, { text: "2/3", correct: false } ], axis: "Datos y Azar", feedback: "Los números mayores que 4 son el 5 y el 6. Son 2 casos favorables de 6 posibles. La probabilidad es 2/6, que se simplifica a 1/3."}, 
        { id: 40, question: "En una tienda hay 30 poleras verdes y 36 negras. ¿Cuál es la razón de poleras verdes a negras?", answers: [ { text: "5:6", correct: true }, { text: "6:5", correct: false }, { text: "30:36", correct: false }, { text: "1:1.2", correct: false } ], axis: "Datos y Azar", feedback: "La razón es 30 a 36, o 30:36. Para simplificar, divides ambos números por su máximo común divisor, que es 6. 30/6 = 5 y 36/6 = 6. La razón simplificada es 5:6."}, 
        { id: 41, question: "Un grupo de 4 personas demora 10 días en pintar un mural. ¿Cuánto demorarían 8 personas?", answers: [ { text: "5 días", correct: true }, { text: "20 días", correct: false }, { text: "10 días", correct: false }, { text: "8 días", correct: false } ], axis: "Datos y Azar", feedback: "Esta es una proporción inversa. Si duplicas el número de personas, el tiempo se reduce a la mitad. La mitad de 10 días son 5 días."}, 
        { id: 42, question: "¿Cuál es la moda en el siguiente conjunto de datos: 2, 5, 3, 2, 5, 2, 4?", answers: [ { text: "2", correct: true }, { text: "5", correct: false }, { text: "3", correct: false }, { text: "4", correct: false } ], axis: "Datos y Azar", feedback: "La moda es el número que más se repite en un conjunto de datos. En este caso, el número 2 aparece tres veces, más que cualquier otro."},
        { id: 56, question: "¿De cuántas formas se pueden combinar 3 tipos de pan con 4 tipos de agregado?", answers: [ { text: "12", correct: true }, { text: "7", correct: false }, { text: "9", correct: false }, { text: "16", correct: false } ], axis: "Datos y Azar", feedback: "Este es el principio multiplicativo. Simplemente multiplicas el número de opciones de cada tipo: 3 panes * 4 agregados = 12 combinaciones posibles."}, 
        { id: 57, question: "Un gráfico circular muestra que el 50% de los estudiantes prefiere fútbol. Si hay 200 estudiantes, ¿cuántos prefieren fútbol?", answers: [ { text: "100", correct: true }, { text: "50", correct: false }, { text: "150", correct: false }, { text: "25", correct: false } ], axis: "Datos y Azar", feedback: "El 50% representa la mitad de algo. La mitad de 200 estudiantes es 100."}, 
        { id: 58, question: "Una moneda está cargada para que sea 3 veces más probable que salga CARA que SELLO. ¿Cuál es la probabilidad de que salga CARA?", answers: [ { text: "75%", correct: true }, { text: "25%", correct: false }, { text: "50%", correct: false }, { text: "300%", correct: false } ], axis: "Datos y Azar", feedback: "Imagina que hay 4 resultados posibles en total (3 Caras y 1 Sello). La probabilidad de que salga Cara es de 3 sobre 4, lo que equivale a un 75%."} 
    ];

    // --- Lógica de la App ---

    function initializeApp() {
        Object.values(axisInputs).forEach(input => input.addEventListener('input', updateTotalCounter));
        totalQuestionsInput.addEventListener('input', updateTotalCounter);
        startButton.addEventListener('click', startGame);
        playAgainButton.addEventListener('click', () => {
            scoreScreen.style.display = 'none';
            startScreen.style.display = 'block';
        });

        nextButton.addEventListener('click', showNextQuestion);
        feedbackButton.addEventListener('click', () => {
            feedbackText.style.display = 'block';
            feedbackButton.style.display = 'none';
        });

        updateTotalCounter();
    }

    function updateTotalCounter() {
        const targetTotal = parseInt(totalQuestionsInput.value) || 0;
        const currentSum = Object.values(axisInputs).reduce((sum, input) => sum + (parseInt(input.value) || 0), 0);
        totalCounter.innerText = `Total: ${currentSum} / ${targetTotal}`;
        const isCorrectSum = currentSum === targetTotal && targetTotal > 0;
        startButton.disabled = !isCorrectSum;
        totalCounter.classList.toggle('invalid', !isCorrectSum);
    }

    function startGame() {
        const distribution = {};
        for(const axis in axisInputs) {
            distribution[axis] = parseInt(axisInputs[axis].value) || 0;
        }

        questions = selectQuestions(distribution, recentlyUsedIds);
        if (!questions) return;

        score = 0;
        needsReviewCount = 0;
        currentQuestionIndex = 0;
        updateProgressBars();

        startScreen.style.display = 'none';
        quizScreen.style.display = 'block';
        showNextQuestion();
    }

    function selectQuestions(dist, excludedIds) {
        const selected = [];
        for (const axis in dist) {
            const count = dist[axis];
            if (count === 0) continue;
            
            const availableQuestions = allQuestions.filter(q => q.axis === axis && !excludedIds.includes(q.id));

            if (availableQuestions.length < count) {
                alert(`Error: No hay suficientes preguntas NUEVAS en el eje "${axis}".\nDisponibles: ${availableQuestions.length}\nSolicitadas: ${count}\n\nIntenta con una selección diferente o refresca la página para reiniciar el historial.`);
                return null;
            }
            const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
            selected.push(...shuffled.slice(0, count));
        }
        return selected.sort(() => 0.5 - Math.random());
    }

    function showNextQuestion() {
        resetState();
        if (currentQuestionIndex < questions.length) {
            displayQuestion(questions[currentQuestionIndex]);
        } else {
            showScore();
        }
    }
    
    function displayQuestion(question) {
        questionText.innerText = question.question;
        questionCounter.innerText = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;
        feedbackText.innerText = question.feedback;
        answersContainer.innerHTML = '';
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('answer-btn');
            if (answer.correct) button.dataset.correct = true;
            button.addEventListener('click', selectAnswer);
            answersContainer.appendChild(button);
        });
    }

    function selectAnswer(e) {
        const selectedBtn = e.target;
        const correct = selectedBtn.dataset.correct === 'true';
        
        if (correct) {
            score++;
        } else {
            needsReviewCount++;
            feedbackSection.style.display = 'block';
        }

        currentQuestionIndex++;
        updateProgressBars();

        Array.from(answersContainer.children).forEach(button => {
            if (button.dataset.correct) button.classList.add('correct');
            button.disabled = true;
        });

        nextButton.style.display = 'block';
    }

    function updateProgressBars() {
        const answeredQuestions = currentQuestionIndex;
        const totalQuestions = questions.length;
        if (totalQuestions === 0) return;

        const correctPercentage = (score / totalQuestions) * 100;
        const reviewPercentage = (needsReviewCount / totalQuestions) * 100;

        correctBar.style.width = `${correctPercentage}%`;
        reviewBar.style.width = `${reviewPercentage}%`;
    }

    function resetState() {
        nextButton.style.display = 'none';
        feedbackSection.style.display = 'none';
        feedbackText.style.display = 'none';
        feedbackButton.style.display = 'block';
    }

    function showScore() {
        quizScreen.style.display = 'none';
        scoreScreen.style.display = 'block';
        finalScore.innerText = `${score} / ${questions.length}`;
        recentlyUsedIds = questions.map(q => q.id);
    }

    initializeApp();
});