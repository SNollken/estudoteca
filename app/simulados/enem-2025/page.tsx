import { enem2025Sources } from "../../../lib/enem-2025";
import { AppIcon, AppShell } from "../../app-shell";

const sections = [
  { short: "LG", name: "Linguagens", count: "45 questões", day: "1º dia" },
  { short: "CH", name: "Ciências Humanas", count: "45 questões", day: "1º dia" },
  { short: "CN", name: "Ciências da Natureza", count: "45 questões", day: "2º dia" },
  { short: "MT", name: "Matemática", count: "45 questões", day: "2º dia" },
];

const examChoices = [
  {
    kicker: "1º dia · Língua inglesa",
    title: "Linguagens e Humanas",
    description: "Questões 1 a 5 em inglês, seguidas pelo caderno comum de Linguagens e Ciências Humanas.",
    duration: "5h30",
    href: "/simulados/enem-2025/prova?prova=enem-2025-dia-1-ingles",
  },
  {
    kicker: "1º dia · Língua espanhola",
    title: "Linguagens e Humanas",
    description: "Questões 1 a 5 em espanhol, seguidas pelo caderno comum de Linguagens e Ciências Humanas.",
    duration: "5h30",
    href: "/simulados/enem-2025/prova?prova=enem-2025-dia-1-espanhol",
  },
  {
    kicker: "2º dia",
    title: "Natureza e Matemática",
    description: "As 90 questões do segundo dia, incluindo os itens anulados identificados no gabarito oficial.",
    duration: "5h",
    href: "/simulados/enem-2025/prova?prova=enem-2025-dia-2",
  },
];

export default function Enem2025OverviewPage() {
  return (
    <AppShell active="simulados" eyebrow="Prova anterior" title="ENEM 2025">
      <div className="exam-intro-layout">
        <article className="app-card exam-intro-main">
          <div className="exam-intro-cover exam-intro-cover-official">
            <span className="app-kicker">Primeira aplicação · cadernos azuis</span>
            <h2>Faça a prova no seu ritmo.</h2>
            <p>Os dois dias do ENEM 2025 foram organizados para a tela, com cronômetro, marcação para revisão, correção pelo gabarito oficial e retomada automática neste dispositivo.</p>
          </div>
          <div className="exam-intro-stats">
            <div><strong>180</strong><span>questões oficiais</span></div>
            <div><strong>2</strong><span>dias de prova</span></div>
            <div><strong>4</strong><span>áreas</span></div>
            <div><strong>Grátis</strong><span>acesso completo</span></div>
          </div>

          <section className="exam-choice-section">
            <div className="exam-choice-heading"><span className="app-kicker">Escolha o caderno</span><h3>Por onde você quer começar?</h3></div>
            <div className="exam-choice-grid">
              {examChoices.map((choice) => (
                <article className="exam-choice-card" key={choice.kicker}>
                  <span>{choice.kicker}</span>
                  <h4>{choice.title}</h4>
                  <p>{choice.description}</p>
                  <div><small>90 questões · {choice.duration}</small><a href={choice.href} aria-label={`Começar ${choice.kicker}`}><AppIcon name="arrow" /></a></div>
                </article>
              ))}
            </div>
          </section>

          <div className="instruction-block">
            <h3>Durante a prova</h3>
            <ul className="instruction-list">
              <li><i>1</i><span>Você pode fechar a página e continuar depois no mesmo navegador.</span></li>
              <li><i>2</i><span>No acesso gratuito, uma pausa com publicidade aparece entre blocos de 10 questões.</span></li>
              <li><i>3</i><span>Questões anuladas permanecem disponíveis para treino, mas ficam fora do cálculo de acertos.</span></li>
            </ul>
          </div>
        </article>

        <aside>
          <section className="app-card exam-side-card">
            <span className="app-kicker">Cadernos originais</span>
            <h3>Consulte a prova impressa</h3>
            <p>Abra os PDFs do INEP sempre que quiser comparar a versão digital com o material oficial.</p>
            <div className="official-source-links">
              <a href={enem2025Sources.day1Exam} target="_blank" rel="noreferrer">Prova do 1º dia <AppIcon name="arrow" /></a>
              <a href={enem2025Sources.day1Answers} target="_blank" rel="noreferrer">Gabarito do 1º dia</a>
              <a href={enem2025Sources.day2Exam} target="_blank" rel="noreferrer">Prova do 2º dia <AppIcon name="arrow" /></a>
              <a href={enem2025Sources.day2Answers} target="_blank" rel="noreferrer">Gabarito do 2º dia</a>
            </div>
          </section>
          <section className="app-card exam-side-card">
            <h3>Conteúdo da prova</h3>
            <div className="exam-sections">
              {sections.map((section) => (
                <div className="exam-section-row" key={section.short}>
                  <span>{section.short}</span>
                  <div><strong>{section.name}</strong><small>{section.day}</small></div>
                  <span>{section.count}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
