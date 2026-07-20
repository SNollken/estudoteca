export type KnowledgeArea = {
  slug: string;
  name: string;
  shortName: string;
  subjects: Array<{
    slug: string;
    name: string;
    paths: string[][];
  }>;
};

/**
 * Editorial taxonomy used by imports and the simulator filters.
 * Each path goes from a broad subject to the most specific skill we can review.
 * Keeping the labels here makes the core portable; D1 only stores stable slugs.
 */
export const knowledgeAreas: KnowledgeArea[] = [
  {
    slug: "linguagens",
    name: "Linguagens, Códigos e suas Tecnologias",
    shortName: "Linguagens",
    subjects: [
      {
        slug: "lingua-portuguesa",
        name: "Língua Portuguesa",
        paths: [
          ["Leitura e interpretação", "Inferência e pressupostos"],
          ["Leitura e interpretação", "Gêneros textuais"],
          ["Variação linguística", "Registros e adequação"],
          ["Recursos expressivos", "Figuras de linguagem"],
          ["Coesão e coerência", "Conectivos e referenciação"],
        ],
      },
      {
        slug: "literatura",
        name: "Literatura",
        paths: [
          ["Movimentos literários", "Modernismo brasileiro"],
          ["Texto literário", "Intertextualidade"],
          ["Texto literário", "Foco narrativo"],
        ],
      },
      {
        slug: "lingua-estrangeira",
        name: "Inglês e Espanhol",
        paths: [
          ["Compreensão textual", "Vocabulário em contexto"],
          ["Compreensão textual", "Finalidade comunicativa"],
        ],
      },
      {
        slug: "artes",
        name: "Artes",
        paths: [["Linguagens artísticas", "Artes visuais"], ["Patrimônio cultural", "Cultura brasileira"]],
      },
    ],
  },
  {
    slug: "humanas",
    name: "Ciências Humanas e suas Tecnologias",
    shortName: "Humanas",
    subjects: [
      {
        slug: "historia",
        name: "História",
        paths: [
          ["Brasil Colônia", "Escravidão e resistências"],
          ["Brasil República", "Era Vargas"],
          ["Brasil República", "Ditadura civil-militar"],
          ["História Geral", "Revoluções industriais"],
          ["História Geral", "Guerras mundiais"],
        ],
      },
      {
        slug: "geografia",
        name: "Geografia",
        paths: [
          ["Geografia física", "Climatologia"],
          ["Geografia física", "Geomorfologia"],
          ["Geografia humana", "Urbanização"],
          ["Geopolítica", "Globalização"],
          ["Cartografia", "Escala e projeções"],
        ],
      },
      {
        slug: "filosofia",
        name: "Filosofia",
        paths: [["Ética", "Teorias éticas"], ["Filosofia política", "Estado e poder"], ["Epistemologia", "Conhecimento científico"]],
      },
      {
        slug: "sociologia",
        name: "Sociologia",
        paths: [["Cultura e sociedade", "Identidade e diversidade"], ["Trabalho", "Relações de produção"], ["Cidadania", "Movimentos sociais"]],
      },
    ],
  },
  {
    slug: "natureza",
    name: "Ciências da Natureza e suas Tecnologias",
    shortName: "Natureza",
    subjects: [
      {
        slug: "biologia",
        name: "Biologia",
        paths: [
          ["Botânica", "Plantas avasculares", "Briófitas"],
          ["Botânica", "Plantas vasculares", "Pteridófitas"],
          ["Ecologia", "Relações ecológicas"],
          ["Ecologia", "Ciclos biogeoquímicos"],
          ["Genética", "Herança mendeliana"],
          ["Citologia", "Respiração celular"],
          ["Evolução", "Seleção natural"],
        ],
      },
      {
        slug: "fisica",
        name: "Física",
        paths: [
          ["Mecânica", "Cinemática", "Movimento uniforme"],
          ["Mecânica", "Dinâmica", "Leis de Newton"],
          ["Eletricidade", "Circuitos elétricos"],
          ["Ondulatória", "Fenômenos ondulatórios"],
          ["Termologia", "Calorimetria"],
        ],
      },
      {
        slug: "quimica",
        name: "Química",
        paths: [
          ["Físico-química", "Cinética química"],
          ["Físico-química", "Adsorção e área superficial"],
          ["Química orgânica", "Funções orgânicas"],
          ["Química ambiental", "Tratamento de água"],
          ["Estequiometria", "Relações de massa"],
        ],
      },
    ],
  },
  {
    slug: "matematica",
    name: "Matemática e suas Tecnologias",
    shortName: "Matemática",
    subjects: [
      {
        slug: "matematica",
        name: "Matemática",
        paths: [
          ["Geometria espacial", "Corpos redondos", "Cilindros"],
          ["Geometria espacial", "Corpos redondos", "Cones"],
          ["Geometria espacial", "Poliedros", "Prismas"],
          ["Geometria plana", "Semelhança de triângulos"],
          ["Funções", "Função afim"],
          ["Funções", "Função exponencial"],
          ["Estatística", "Medidas de tendência central"],
          ["Probabilidade", "Eventos independentes"],
          ["Matemática financeira", "Juros compostos"],
          ["Razões e proporções", "Escalas"],
        ],
      },
    ],
  },
];

export const areaBySlug = Object.fromEntries(
  knowledgeAreas.map((area) => [area.slug, area]),
) as Record<string, KnowledgeArea>;

export function topicSlug(parts: string[]) {
  return parts
    .join("-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
