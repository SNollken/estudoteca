export const enem2025Sources = {
  day1Exam: "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD1.pdf",
  day1Answers: "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD1.pdf",
  day2Exam: "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD7.pdf",
  day2Answers: "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD7.pdf",
} as const;

export type EnemQuestion = {
  number: number;
  area: string;
  topicPath: string[];
  support: string;
  statement: string;
  options: string[];
  correctIndex: number;
};

export type PublicEnemQuestion = Omit<EnemQuestion, "correctIndex">;

// Questões sem dependência de figura do caderno azul do 2º dia, adaptadas para leitura em tela.
export const enem2025NatureStarter: EnemQuestion[] = [
  {
    number: 92,
    area: "Ciências da Natureza · Biologia",
    topicPath: ["Genética", "Engenharia genética", "Transgenia"],
    support: "A maioria dos seres vivos tem um relógio biológico (ciclo circadiano), que regula mudanças metabólicas e comportamentais no ciclo de 24 horas. Em um experimento, genes do relógio circadiano da cianobactéria Synechococcus elongatus foram transferidos para o genoma da bactéria Escherichia coli, um organismo não circadiano.",
    statement: "Estarão presentes no organismo geneticamente modificado os genes do",
    options: [
      "metabolismo de E. coli, apenas.",
      "ciclo circadiano de E. coli, apenas.",
      "metabolismo de S. elongatus e do ciclo circadiano de E. coli.",
      "ciclo circadiano de S. elongatus e do metabolismo de E. coli.",
      "ciclo circadiano de S. elongatus e do ciclo circadiano de E. coli.",
    ],
    correctIndex: 3,
  },
  {
    number: 93,
    area: "Ciências da Natureza · Biologia",
    topicPath: ["Zoologia", "Aves", "Glândula uropigial"],
    support: "Funcionários de um zoológico observaram aumento na mortalidade de aves aquáticas por afogamento. As aves tinham dificuldade de flutuação por causa do encharcamento das penas com água.",
    statement: "O aumento na taxa de mortalidade dessas aves estava associado a uma redução na",
    options: [
      "dilatação do papo.",
      "reposição de penas das asas.",
      "secreção da glândula uropigial.",
      "formação da membrana natatória.",
      "largura das cavidades de ossos pneumáticos.",
    ],
    correctIndex: 2,
  },
  {
    number: 96,
    area: "Ciências da Natureza · Biologia",
    topicPath: ["Ecologia", "Relações tróficas", "Toxinas alimentares"],
    support: "Sapinhos-ponta-de-flecha obtêm seus venenos ao consumir determinadas formigas e cupins. Quando capturados e criados em condições artificiais, ou quando nascidos em cativeiro, não são tóxicos.",
    statement: "A perda da capacidade de se obter a toxina nos nascidos em cativeiro é causada pela",
    options: [
      "diferença de umidade entre os ambientes.",
      "ausência de alimentação natural.",
      "adaptação ao novo ambiente.",
      "mudança de comportamento.",
      "variabilidade genética.",
    ],
    correctIndex: 1,
  },
  {
    number: 98,
    area: "Ciências da Natureza · Biologia",
    topicPath: ["Ecologia", "Espécies exóticas", "Competição biológica"],
    support: "O Cerrado apresenta grande diversidade vegetal. A introdução do capim-gordura, espécie africana usada como pastagem, altera esse cenário porque a planta se espalha por grandes áreas e tem forte poder competitivo.",
    statement: "Em longo prazo, essa ação humana pode gerar qual consequência?",
    options: [
      "Diversificar nichos ecológicos.",
      "Assorear as nascentes do bioma.",
      "Dificultar a infiltração de água na terra.",
      "Diminuir as espécies nativas do bioma.",
      "Contribuir com a redução das queimadas.",
    ],
    correctIndex: 3,
  },
  {
    number: 99,
    area: "Ciências da Natureza · Biologia",
    topicPath: ["Ecologia", "Biomas brasileiros", "Caatinga"],
    support: "O monstro-de-gila, lagarto encontrado em um deserto dos Estados Unidos, apresenta adaptações à falta de alimento nesse ambiente. Animais do mesmo grupo taxonômico podem desenvolver características adaptativas semelhantes em ambientes similares.",
    statement: "Onde seria mais provável encontrar lagartos com essas características no território brasileiro?",
    options: ["Cerrado.", "Pampas.", "Caatinga.", "Restinga.", "Pantanal."],
    correctIndex: 2,
  },
  {
    number: 100,
    area: "Ciências da Natureza · Química",
    topicPath: ["Separação de misturas", "Purificação da água", "Destilação"],
    support: "Existe um processo de purificação em que os sais dissolvidos são removidos da água. O produto é usado em laboratórios, indústrias e baterias, mas não é adequado para ingestão por poder causar carência iônica e diarreia.",
    statement: "Essa água é chamada de",
    options: ["dura.", "pesada.", "sanitária.", "destilada.", "oxigenada."],
    correctIndex: 3,
  },
  {
    number: 101,
    area: "Ciências da Natureza · Biologia",
    topicPath: ["Fisiologia humana", "Visão", "Pupila"],
    support: "Em fotografias com flash, os olhos às vezes aparecem vermelhos porque a luz incide no globo ocular e é refletida por uma região rica em vasos sanguíneos.",
    statement: "Esse efeito é mais comum à noite ou em lugares pouco iluminados porque, com a pupila",
    options: [
      "dilatada, chega mais luz à retina.",
      "retraída, chega mais luz vermelha à retina.",
      "retraída, chega mais luz vermelha aos bastonetes.",
      "retraída, chegam menos luzes azul e verde aos cones.",
      "dilatada, chegam menos luzes azul e verde aos bastonetes.",
    ],
    correctIndex: 0,
  },
  {
    number: 102,
    area: "Ciências da Natureza · Biologia",
    topicPath: ["Zoologia", "Peixes", "Anatomia e toxinas"],
    support: "O baiacu contém tetrodotoxina, uma neurotoxina termoestável produzida e armazenada nas gônadas e vísceras. Sua ingestão pode causar morte por parada respiratória.",
    statement: "Que ação poderia evitar essa intoxicação?",
    options: [
      "Criar os peixes em cativeiro.",
      "Realizar a pesca com redes.",
      "Consumir peixes cozidos ou fritos.",
      "Preparar o peixe em condições adequadas de higiene.",
      "Manusear o peixe sem provocar o rompimento dos órgãos internos.",
    ],
    correctIndex: 4,
  },
  {
    number: 103,
    area: "Ciências da Natureza · Biologia",
    topicPath: ["Citologia", "Organelas", "Lisossomos"],
    support: "A deficiência da enzima lipase ácida causa uma doença em que as células não degradam colesterol esterificado nem triglicerídeos, levando ao depósito desses compostos em vários órgãos.",
    statement: "Essa doença resulta da insuficiência funcional de qual estrutura celular?",
    options: ["Lisossomos.", "Ribossomos.", "Mitocôndrias.", "Peroxissomos.", "Retículo endoplasmático liso."],
    correctIndex: 0,
  },
  {
    number: 104,
    area: "Ciências da Natureza · Biologia",
    topicPath: ["Ecologia", "Ciclo do carbono", "Sequestro de carbono"],
    support: "Para mitigar as mudanças climáticas, é necessário reduzir emissões e também diminuir os níveis de dióxido de carbono já presentes na atmosfera.",
    statement: "Qual ação mitigadora auxilia na remoção desse gás da atmosfera?",
    options: [
      "Plantar mais árvores.",
      "Instalar mais usinas eólicas.",
      "Ampliar o uso de energia solar.",
      "Manter os combustíveis fósseis no solo.",
      "Produzir menos resíduos sólidos urbanos.",
    ],
    correctIndex: 0,
  },
  {
    number: 105,
    area: "Ciências da Natureza · Química",
    topicPath: ["Físico-química", "Soluções", "Solubilidade de gases"],
    support: "Usinas termonucleares usam um sistema de água de refrigeração ligado a uma fonte hídrica. Quando esse sistema funciona de modo ineficiente, pode provocar poluição térmica e comprometer a vida no ecossistema aquático.",
    statement: "Para o ecossistema aquático, a ineficiência do sistema de refrigeração tem como consequência a",
    options: [
      "diminuição do pH.",
      "liberação de gases poluentes.",
      "contaminação por combustíveis.",
      "liberação de elementos radioativos.",
      "diminuição da solubilidade do gás oxigênio.",
    ],
    correctIndex: 4,
  },
];
