/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuizQuestion {
  id: number;
  questionArm: string;
  questionEsp?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface FutureTriviaQuestion {
  id: number;
  context: string;
  questionEsp: string;
  options: string[];
  correctAnswer: string;
  category: 'futuro_simple' | 'futuro_perfecto';
  explanation: string;
}

export interface IrregularVerb {
  infinitivo: string;
  irregularForm: string; // Participio or Futuro stem
  description: string;   // e.g., "abierto", "diré"
}

// 20 Everyday Spanish Quiz Questions for Armenian Speakers
export const DAILY_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionArm: "Լողափում ուզում եք արագ մի բան ուտել 🌊 Որտե՞ղ կգնաք։",
    options: ["Al chiringuito", "Al restaurante", "Al banco"],
    correctAnswer: "Al chiringuito",
    explanation: "«Al chiringuito»-ն լողափնյա բար-սրճարանն է, որտեղ կարելի է արագ ուտել կամ զովացուցիչ խմիչքներ վայելել:"
  },
  {
    id: 2,
    questionArm: "Իսպանացին ասում է՝ “Estoy en camino.” Ի՞նչ է դա նշանակում։",
    options: ["Estoy yendo", "Estoy comiendo", "Estoy durmiendo"],
    correctAnswer: "Estoy yendo",
    explanation: "«Estoy en camino» նշանակում է՝ «Ճանապարհին եմ» (նույնն է, ինչ Estoy yendo` «գնում եմ»):"
  },
  {
    id: 3,
    questionArm: "Իսպանացին ասում է՝ “¡Qué guay!” Ի՞նչ է դա նշանակում։",
    options: ["¡Qué bien! / ¡Qué genial!", "¡Qué caro!", "¡Qué tarde!"],
    correctAnswer: "¡Qué bien! / ¡Qué genial!",
    explanation: "«¡Qué guay!» ժարգոնային արտահայտությունը նշանակում է՝ «Ինչ հիանալի է / Ինչ թույն է»:"
  },
  {
    id: 4,
    questionArm: "Դուք մտնում եք խանութ և ուզում եք ասել՝ «Ես պարզապես նայում եմ»։ Ի՞նչ կասեք։",
    options: ["Solo estoy mirando", "Solo estoy durmiendo", "Solo estoy corriendo"],
    correctAnswer: "Solo estoy mirando",
    explanation: "«Solo estoy mirando» նշանակում է՝ «Պարզապես նայում եմ» (խանութներում խորհրդատուներին պատասխանելու համար):"
  },
  {
    id: 5,
    questionArm: "Իսպանացին ասում է՝ “Estoy liado.” Ի՞նչ է դա նշանակում։",
    options: ["Estoy ocupado", "Estoy en la playa", "Estoy casado"],
    correctAnswer: "Estoy ocupado",
    explanation: "«Estoy liado» նշանակում է՝ «Զբաղված եմ / գործերիս մեջ կորած եմ»:"
  },
  {
    id: 6,
    questionArm: "Դուք ուզում եք ասել՝ «Ես ուշանում եմ»։ Ի՞նչ կասեք։",
    options: ["Llego tarde", "Tengo tarde", "Soy tarde"],
    correctAnswer: "Llego tarde",
    explanation: "Իսպաներենում ուշանալու համար ասում են «Llego tarde» (տառացի՝ ուշ եմ ժամանում)։"
  },
  {
    id: 7,
    questionArm: "Ընկերը ասում է՝ “Tengo prisa.” Ի՞նչ է դա նշանակում։",
    options: ["Ես շտապում եմ", "Ես ծարավ եմ", "Ես ուրախ եմ"],
    correctAnswer: "Ես շտապում եմ",
    explanation: "«Tengo prisa» նշանակում է՝ «Ես շտապում եմ» (Tener + prisa = շտապել)։"
  },
  {
    id: 8,
    questionArm: "Իսպանացին ասում է՝ “Está al lado.” Ի՞նչ է դա նշանակում։",
    options: ["Կողքին է", "Շատ հեռու է", "Փակ է"],
    correctAnswer: "Կողքին է",
    explanation: "«Está al lado» նշանակում է՝ «Անմիջապես կողքին է / հարևանությամբ է»:"
  },
  {
    id: 9,
    questionArm: "Իսպանացին ասում է՝ “No pasa nada.” Ի՞նչ է դա նշանակում։",
    options: ["Ոչինչ / խնդիր չկա", "Ոչ ոք չի գալիս", "Ես ոչինչ չեմ ուտում"],
    correctAnswer: "Ոչինչ / խնդիր չկա",
    explanation: "«No pasa nada» նշանակում է՝ «Ոչինչ, ամեն ինչ կարգին է / խնդիր չկա»:"
  },
  {
    id: 10,
    questionArm: "Դուք ուզում եք ասել՝ «Ես պատրաստվում եմ զանգել»։ Ի՞նչ կասեք։",
    options: ["Voy a llamar", "Voy llamar", "Llamo ayer"],
    correctAnswer: "Voy a llamar",
    explanation: "«Voy a + infinitivo» կառույցը ցույց է տալիս մոտակա ապառնի գործողություն: «Voy a llamar»` «պատրաստվում եմ զանգել / կզանգեմ»:"
  },
  {
    id: 11,
    questionArm: "Իսպանացին ասում է՝ “Me he quedado sin batería.” Ի՞նչ է պատահել։",
    options: ["No tengo batería en el móvil", "Tengo mucha hambre", "He comprado una batería"],
    correctAnswer: "No tengo batería en el móvil",
    explanation: "«Quedarse sin batería» նշանակում է «հեռախոսի լիցքավորումը (կամ մարտկոցը) սպառվել է»:"
  },
  {
    id: 12,
    questionArm: "Դուք ուզում եք ասել՝ «Ես հիմա ճանապարհին եմ»։ Ի՞նչ կասեք։",
    options: ["Estoy en camino", "Estoy en casa", "Estoy en la mesa"],
    correctAnswer: "Estoy en camino",
    explanation: "«Estoy en camino»-ն իսպաներեն թարգմանությունն է «Ես ճանապարհին եմ» արտահայտությանը:"
  },
  {
    id: 13,
    questionArm: "Ընկերը ասում է՝ “No me apetece salir.” Ի՞նչ է դա նշանակում։",
    options: ["No quiero salir ahora", "Quiero salir ahora", "No sé dónde estoy"],
    correctAnswer: "No quiero salir ahora",
    explanation: "«No me apetece» նշանակում է «չեմ ցանկանում / սիրտս չի ուզում / հավես չունեմ»:"
  },
  {
    id: 14,
    questionArm: "Իսպանացին ասում է՝ “Estoy hasta arriba.” Ի՞նչ է դա նշանակում։",
    options: ["Estoy muy ocupado", "Estoy en el tejado", "Estoy muy lejos"],
    correctAnswer: "Estoy muy ocupado",
    explanation: "«Estoy hasta arriba» նշանակում է «մինչև կոկորդս թաղված եմ գործերի մեջ / չափազանց զբաղված եմ»:"
  },
  {
    id: 15,
    questionArm: "Դուք ուզում եք քաղաքավարի խնդրել՝ «Կարո՞ղ եք կրկնել»։ Ի՞նչ կասեք։",
    options: ["¿Puede repetir, por favor?", "¿Puede dormir, por favor?", "¿Puede comer, por favor?"],
    correctAnswer: "¿Puede repetir, por favor?",
    explanation: "«¿Puede repetir, por favor?»-ը քաղաքավարի խնդրանք է՝ «կարո՞ղ եք կրկնել, խնդրեմ»:"
  },
  {
    id: 16,
    questionArm: "Ընկերը ասում է՝ “Me da igual.” Ի՞նչ է դա նշանակում։",
    options: ["No tengo preferencia", "Tengo mucho miedo", "Me duele la cabeza"],
    correctAnswer: "No tengo preferencia",
    explanation: "«Me da igual» նշանակում է՝ «նշանակություն չունի / ինձ համար միևնույնն է» (անգլերեն I don't mind):"
  },
  {
    id: 17,
    questionArm: "Իսպանացին ասում է՝ “Está cerrado por obras.” Ի՞նչ է դա նշանակում։",
    options: ["Está cerrado porque están reparando", "Está abierto toda la noche", "Está lejos del centro"],
    correctAnswer: "Está cerrado because están reparando", // wait, let's fix to match exact text "Está cerrado porque están reparando"
    explanation: "«Cerrado por obras» նշանակում է՝ «փակ է վերանորոգման / շինարարական աշխատանքների պատճառով»:"
  },
  {
    id: 18,
    questionArm: "Իսպանացին ասում է՝ “Ahora mismo vuelvo.” Ի՞նչ է դա նշանակում։",
    options: ["Vuelvo enseguida", "Vuelvo mañana", "Vuelvo después de comer"],
    correctAnswer: "Vuelvo enseguida",
    explanation: "«Ahora mismo vuelvo» — «հենց հիմա հետ կգամ / շուտով կվերադառնամ» (Vuelvo enseguida):"
  },
  {
    id: 19,
    questionArm: "Դուք ուզում եք ասել՝ «Ես արդեն վճարել եմ»։ Ի՞նչ կասեք։",
    options: ["Ya he pagado", "Ya he dormido", "Ya he salido de copas"],
    correctAnswer: "Ya he pagado",
    explanation: "«Ya he pagado» նշանակում է՝ «Ես արդեն վճարել եմ»։ «He pagado»-ն Haber + participio ձևն է:"
  },
  {
    id: 20,
    questionArm: "Դուք ուզում եք ասել՝ «Հաճելի է ծանոթանալ»։ Ի՞նչ կասեք։",
    options: ["Mucho gusto", "Muchas gracias", "Buen provecho"],
    correctAnswer: "Mucho gusto",
    explanation: "«Mucho gusto»-ն իսպաներեն թարգմանությունն է հայերեն «Հաճելի է ծանոթանալ» արտահայտությանը- "
  }
];

// Correct the correctAnswer for item 17 to match the option literal: "Está cerrado porque están reparando"
DAILY_QUIZ_QUESTIONS[16].correctAnswer = "Está cerrado porque están reparando";


// Irregular Participles (Pretérito Perfecto Exceptions)
export const PP_IRREGULARS: IrregularVerb[] = [
  { infinitivo: "abrir", irregularForm: "abierto", description: "բացել -> բացած" },
  { infinitivo: "cubrir", irregularForm: "cubierto", description: "ծածկել -> ծածկած" },
  { infinitivo: "decir", irregularForm: "dicho", description: "ասել -> ասած" },
  { infinitivo: "escribir", irregularForm: "escrito", description: "գրել -> գրած" },
  { infinitivo: "hacer", irregularForm: "hecho", description: "անել -> արած" },
  { infinitivo: "poner", irregularForm: "puesto", description: "դնել -> դրած" },
  { infinitivo: "ver", irregularForm: "visto", description: "տեսնել -> տեսած" },
  { infinitivo: "volver", irregularForm: "vuelto", description: "վերադառնալ -> վերադարձած" },
  { infinitivo: "romper", irregularForm: "roto", description: "կոտրել -> կոտրած" },
  { infinitivo: "resolver", irregularForm: "resuelto", description: "լուծել -> լուծած" },
  { infinitivo: "devolver", irregularForm: "devuelto", description: "վերադարձնել -> վերադարձրած" },
  { infinitivo: "descubrir", irregularForm: "descubierto", description: "բացահայտել -> բացահայտած" },
  { infinitivo: "freír", irregularForm: "frito", description: "տապակել -> տապակած" }
];

// Regular dummy participles as baits for Pretérito Perfecto Game
export const PP_REGULARS = [
  { infinitivo: "hablar", regularForm: "hablado" },
  { infinitivo: "comer", regularForm: "comido" },
  { infinitivo: "vivir", regularForm: "vivido" },
  { infinitivo: "cantar", regularForm: "cantado" },
  { infinitivo: "beber", regularForm: "bebido" },
  { infinitivo: "subir", regularForm: "subido" },
  { infinitivo: "aprender", regularForm: "aprendido" },
  { infinitivo: "viajar", regularForm: "viajado" },
  { infinitivo: "estudiar", regularForm: "estudiado" },
  { infinitivo: "correr", regularForm: "corrido" },
  { infinitivo: "trabajar", regularForm: "trabajado" },
  { infinitivo: "escuchar", regularForm: "escuchado" },
  { infinitivo: "comprender", regularForm: "comprendido" }
];

// Future Simple Exceptions (Stems & forms)
export const FUT_IRREGULARS: IrregularVerb[] = [
  { infinitivo: "decir", irregularForm: "dir-", description: "diré (կասեմ)" },
  { infinitivo: "hacer", irregularForm: "har-", description: "haré (կանեմ)" },
  { infinitivo: "poder", irregularForm: "podr-", description: "podré (կկարողանամ)" },
  { infinitivo: "poner", irregularForm: "pondr-", description: "pondré (կդնեմ)" },
  { infinitivo: "querer", irregularForm: "querr-", description: "querré (կցանկանամ)" },
  { infinitivo: "saber", irregularForm: "sabr-", description: "sabré (կիմանամ)" },
  { infinitivo: "salir", irregularForm: "saldr-", description: "saldré (դուրս կգամ)" },
  { infinitivo: "tener", irregularForm: "tendr-", description: "tendré (կունենամ)" },
  { infinitivo: "valer", irregularForm: "valdr-", description: "valdré (կարժենամ)" },
  { infinitivo: "venir", irregularForm: "vendr-", description: "vendré (կգամ)" },
  { infinitivo: "caber", irregularForm: "cabr-", description: "cabré (կտեղավորվեմ)" },
  { infinitivo: "haber", irregularForm: "habr-", description: "habré (կլինի/կարձանագրվի)" }
];

// Regular dummy future stems as baits
export const FUT_REGULARS = [
  { infinitivo: "hablar", regularForm: "hablar-" },
  { infinitivo: "comer", regularForm: "comer-" },
  { infinitivo: "vivir", regularForm: "vivir-" },
  { infinitivo: "amar", regularForm: "amar-" },
  { infinitivo: "cantar", regularForm: "cantar-" },
  { infinitivo: "beber", regularForm: "beber-" },
  { infinitivo: "correr", regularForm: "correr-" },
  { infinitivo: "escribir", regularForm: "escribir-" },
  { infinitivo: "abrir", regularForm: "abrir-" },
  { infinitivo: "escuchar", regularForm: "escuchar-" },
  { infinitivo: "aprender", regularForm: "aprender-" },
  { infinitivo: "subir", regularForm: "subir-" },
  { infinitivo: "viajar", regularForm: "viajar-" }
];

// Questions for Future Simple and Future Perfecto Trivia duel (2 Player)
export const FUTURE_TRIVIA_QUESTIONS: FutureTriviaQuestion[] = [
  {
    id: 1,
    context: "Futuro Simple (Կանոնավոր): «Ես կերգեմ վաղը»",
    questionEsp: "Yo (cantar) en el concierto mañana.",
    options: ["cantaré", "cantaría", "he cantado"],
    correctAnswer: "cantaré",
    category: "futuro_simple",
    explanation: "Yo ձևը կանոնավոր cantar բայի համար ապառնի ժամանակաձևում (Futuro Simple) ստանում է -é վերջավորություն:"
  },
  {
    id: 2,
    context: "Futuro Perfecto (Կանոնավոր): «Մինչև վաղը դու ավարտած կլինես տնայինը»",
    questionEsp: "Para mañana, tú (terminar) la tarea.",
    options: ["habrás terminado", "habrías terminado", "habré terminado"],
    correctAnswer: "habrás terminado",
    category: "futuro_perfecto",
    explanation: "Futuro Perfecto կազմվում է Haber բայի Futuro Simple ձևով (tú -> habrás) + հիմնական բայի participio (-terminado):"
  },
  {
    id: 3,
    context: "Futuro Simple (Անկանոն): «Ես կանեմ իմ տնային աշխատանքը»",
    questionEsp: "Yo (hacer) mis deberes esta tarde.",
    options: ["haceré", "haré", "hago"],
    correctAnswer: "haré",
    category: "futuro_simple",
    explanation: "Hacer-ը Futuro Simple-ում անկանոն է, արմատը դառնում է har-, ուստի «yo haré»:"
  },
  {
    id: 4,
    context: "Futuro Perfecto (Անկանոն բայով): «Մինչև երեկո նրանք արած կլինեն տնայինը»",
    questionEsp: "Para la noche, ellos (hacer) todo el trabajo.",
    options: ["habrán hacer", "habrían hecho", "habrán hecho"],
    correctAnswer: "habrán hecho",
    category: "futuro_perfecto",
    explanation: "Hacer բայի participio-ն անկանոն է (hecho), ուստի Futuro Perfecto-ն կլինի «habrán hecho»:"
  },
  {
    id: 5,
    context: "Futuro Simple (Անկանոն): «Դուք կունենաք հաջողություն»",
    questionEsp: "Tú (tener) mucho éxito en el examen.",
    options: ["tenerás", "tendrás", "tendrías"],
    correctAnswer: "tendrás",
    category: "futuro_simple",
    explanation: "Tener բայի ապառնի արմատն է tendr-, ուստի tú դեմքով կլինի «tendrás»:"
  },
  {
    id: 6,
    context: "Futuro Perfecto (Անկանոն բայով): «Մինչև երկուշաբթի մենք գրած կլինենք նամակը»",
    questionEsp: "Para el lunes, nosotros (escribir) la carta.",
    options: ["habremos escrito", "habremos escribido", "habríamos escrito"],
    correctAnswer: "habremos escrito",
    category: "futuro_perfecto",
    explanation: "Escribir բայի participio-ն անկանոն է (escrito), ուստի Futuro Perfecto-ն կլինի «habremos escrito»:"
  },
  {
    id: 7,
    context: "Futuro Simple (Անկանոն): «Նրանք կգան մեր տուն»",
    questionEsp: "Ellos (venir) a nuestra casa el sábado.",
    options: ["vendrán", "venirán", "vendrían"],
    correctAnswer: "vendrán",
    category: "futuro_simple",
    explanation: "Venir բայի ապառնի արմատն է vendr-, ուստի ellos դեմքով կլինի «vendrán»:"
  },
  {
    id: 8,
    context: "Futuro Perfecto: «Մինչև հաջորդ շաբաթ նա կարդացած կլինի գիրքը»",
    questionEsp: "Para la próxima semana, ella (leer) el libro.",
    options: ["habrá leído", "habría leído", "leerá"],
    correctAnswer: "habrá leído",
    category: "futuro_perfecto",
    explanation: "Ella դեմքով Haber բայի ապառնի ձևն է habrá + leer բայի participio-ն՝ leído -> «habrá leído»:"
  },
  {
    id: 9,
    context: "Futuro Simple (Անկանոն): «Մենք կիմանանք ողջ ճշմարտությունը»",
    questionEsp: "Nosotros (saber) la respuesta mañana.",
    options: ["saberemos", "sabremos", "sabríamos"],
    correctAnswer: "sabremos",
    category: "futuro_simple",
    explanation: "Saber բայի ապառնի արմատն է sabr-, ուստի nosotros դեմքով կլինի «sabremos»:"
  },
  {
    id: 10,
    context: "Futuro Perfecto (Անկանոն բայով): «Մինչև հունիս դուք վերադարձած կլինեք»",
    questionEsp: "Para junio, vosotros (volver) de vuestro viaje.",
    options: ["habréis vuelto", "habréis volvidode", "habríais vuelto"],
    correctAnswer: "habréis vuelto",
    category: "futuro_perfecto",
    explanation: "Volver բայի participio-ն անկանոն է (vuelto), իսկ vosotros դեմքով Haber-ը Futuro-ում դառնում է habréis:"
  },
  {
    id: 11,
    context: "Futuro Simple (Անկանոն): «Արկղում ոչինչ չի տեղավորվի»",
    questionEsp: "Nada (caber) en esta caja pequeña.",
    options: ["caberá", "cabrá", "cabría"],
    correctAnswer: "cabrá",
    category: "futuro_simple",
    explanation: "Caber բայի ապառնի արմատն է cabr-, ուստի 3rd person singular (nada) ձևն է «cabrá»:"
  },
  {
    id: 12,
    context: "Futuro Perfecto: «Մինչև ժամը 8-ը նա արդեն արթնացած կլինի»",
    questionEsp: "Para las 8:00, él ya se (despertar).",
    options: ["habrá despertado", "habría despertado", "se habrá despertado"],
    correctAnswer: "se habrá despertado",
    category: "futuro_perfecto",
    explanation: "Անդրադարձ despertar (despertarse) բայի համար դերանունը դրվում է Haber-ից առաջ՝ «se habrá despertado»:"
  },
  {
    id: 13,
    context: "Futuro Simple (Անկանոն): «Ես դուրս կգամ աշխատանքից ժամը 6-ին»",
    questionEsp: "Yo (salir) de la oficina a las 6.",
    options: ["saliré", "saldré", "saldría"],
    correctAnswer: "saldré",
    category: "futuro_simple",
    explanation: "Salir բայի ապառնի արմատն է saldr-, ուստի yo դեմքով կլինի «saldré»:"
  },
  {
    id: 14,
    context: "Futuro Perfecto (Անկանոն բայով): «Մինչև ժամանելդ նրանք արդեն տեսած կլինեն ֆիլմը»",
    questionEsp: "Para cuando llegues, ellos ya (ver) la película.",
    options: ["habrán visto", "habrán vido", "habrían visto"],
    correctAnswer: "habrán visto",
    category: "futuro_perfecto",
    explanation: "Ver բայի participio-ն անկանոն է (visto), ուստի ellos դեմքով կլինի «habrán visto»:"
  },
  {
    id: 15,
    context: "Futuro Simple (Անկանոն): «Դուք կկարողանաք խոսել իսպաներեն»",
    questionEsp: "Tú (poder) hablar español fluido.",
    options: ["poderás", "podrás", "podrías"],
    correctAnswer: "podrás",
    category: "futuro_simple",
    explanation: "Poder բայի ապառնի արմատն է podr-, ուստի tú դեմքով կլինի «podrás»:"
  }
];
