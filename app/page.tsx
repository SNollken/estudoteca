import { ThemeToggle } from "./theme-toggle";
import { PricingSelector } from "./pricing-selector";
import { BrandMark } from "./brand-mark";
import Link from "next/link";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m4 10 4 4 8-9" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5.5c3.3-.9 6-.5 8 1.2v12c-2-1.7-4.7-2.1-8-1.2v-12ZM20 5.5c-3.3-.9-6-.5-8 1.2v12c2-1.7 4.7-2.1 8-1.2v-12Z" />
    </svg>
  );
}

function AwardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="9" r="5" />
      <path d="m9 13-2 8 5-3 5 3-2-8" />
      <path d="m10 9 1.3 1.3L14 7.7" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19V9M12 19V5M19 19v-7" />
      <path d="m4 6 6-3 5 4 5-4" />
    </svg>
  );
}

const areas = [
  { name: "Linguagens", short: "LG", value: 74, tone: "terracotta" },
  { name: "Matemática", short: "MT", value: 62, tone: "navy" },
  { name: "Humanas", short: "CH", value: 81, tone: "sage" },
];

export default function Home() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="Estudoteca — página inicial">
            <BrandMark />
            <span>Estudoteca</span>
          </Link>

          <nav className="desktop-nav" aria-label="Navegação principal">
            <a className="nav-active" href="#inicio">Início</a>
            <a href="/simulados">Simulados</a>
            <a href="/certificados">Certificados</a>
            <a href="#planos">Planos</a>
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            <a className="login-link" href="/painel">Entrar</a>
            <a className="button button-small button-primary" href="/simulados">
              Começar grátis
            </a>
            <details className="mobile-menu">
              <summary aria-label="Abrir menu">
                <span />
                <span />
                <span />
              </summary>
              <nav aria-label="Navegação para celular">
                <a href="#inicio">Início</a>
                <a href="/simulados">Simulados</a>
                <a href="/certificados">Certificados</a>
                <a href="#planos">Planos</a>
                <a href="/painel">Entrar</a>
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main id="conteudo">
        <section className="hero" id="inicio">
          <div className="paper-orbit paper-orbit-one" aria-hidden="true" />
          <div className="paper-orbit paper-orbit-two" aria-hidden="true" />
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="eyebrow">
                Simulados para ENEM e vestibulares
              </div>
              <h1>
                Treine como na prova.
                <em> Melhore com clareza.</em>
              </h1>
              <p className="hero-lead">
                Resolva cadernos oficiais do ENEM, acompanhe seus acertos e retome
                de onde parou. Seu estudo — e seus certificados — fica organizado em
                um só lugar.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="/simulados">
                  Fazer simulado grátis <ArrowIcon />
                </a>
                <a className="button button-ghost" href="/simulados">
                  Ver provas disponíveis
                </a>
              </div>
              <ul className="trust-list" aria-label="Recursos disponíveis">
                <li><CheckIcon /> Prova completa no plano grátis</li>
                <li><CheckIcon /> Gabarito ao finalizar</li>
                <li><CheckIcon /> Progresso salvo automaticamente</li>
              </ul>
            </div>

            <div className="hero-visual" aria-label="Prévia da área do estudante">
              <div className="dashboard-card">
                <div className="dashboard-topline">
                  <div>
                    <span className="dashboard-kicker">Meu desempenho</span>
                    <strong>Boa tarde, estudante</strong>
                  </div>
                  <div className="profile-dot">ES</div>
                </div>

                <div className="progress-panel">
                  <div className="progress-ring" style={{ "--progress": "68%" } as React.CSSProperties}>
                    <span>68%</span>
                  </div>
                  <div>
                    <span className="mini-label">Meta da semana</span>
                    <strong>Você está no ritmo</strong>
                    <p>34 de 50 questões concluídas</p>
                  </div>
                </div>

                <div className="area-heading">
                  <strong>Seu desempenho</strong>
                  <span>Últimos 30 dias</span>
                </div>
                <div className="area-list">
                  {areas.map((area) => (
                    <div className="area-row" key={area.name}>
                      <span className={`area-badge area-${area.tone}`}>{area.short}</span>
                      <div className="area-copy">
                        <div><strong>{area.name}</strong><span>{area.value}%</span></div>
                        <div className="bar"><span style={{ width: `${area.value}%` }} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="result-card">
                <div className="result-icon"><CheckIcon /></div>
                <span className="result-label">Último resultado</span>
                <strong>Seleção ENEM 2025</strong>
                <div className="result-meta">
                  <span><b>72%</b> de acertos</span>
                  <span>129 de 180</span>
                </div>
              </div>

              <div className="study-note" aria-hidden="true">
                <span>HOJE</span>
                <strong>+12 questões</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="promise-strip" aria-label="O que você encontra na Estudoteca">
          <div className="promise-intro">
            <span>Treino que vira direção</span>
            <p>Da primeira questão ao próximo foco.</p>
          </div>
          <article>
            <span className="promise-icon"><BookIcon /></span>
            <div><strong>Provas no seu ritmo</strong><p>Cadernos completos do ENEM com retomada automática.</p></div>
          </article>
          <article>
            <span className="promise-icon"><ChartIcon /></span>
            <div><strong>Desempenho que orienta</strong><p>Veja seus acertos e o que precisa revisar.</p></div>
          </article>
          <article>
            <span className="promise-icon"><AwardIcon /></span>
            <div><strong>Conquistas bem guardadas</strong><p>Certificados e habilidades sempre à mão.</p></div>
          </article>
        </section>

        <section className="study-section section-block" id="simulados">
          <div className="catalog-heading">
            <div>
              <p className="section-kicker">Simulados</p>
              <h2>Seu próximo treino começa por aqui.</h2>
              <p>Escolha o primeiro ou o segundo dia do ENEM 2025 e avance no seu tempo.</p>
            </div>
            <div className="catalog-progress" aria-label="Progresso nos simulados">
              <span>Escolha o ritmo</span>
              <strong>90</strong>
              <small>questões por caderno</small>
            </div>
          </div>

          <nav className="catalog-tabs" aria-label="Tipos de simulado">
            <a className="catalog-tab-active" href="#simulados">Todos</a>
            <a href="/simulados?filtro=enem">ENEM</a>
            <a href="/simulados?filtro=anos-anteriores">Anos anteriores</a>
          </nav>

          <div className="simulado-grid">
            <article className="simulado-main-card" id="simulado-completo">
              <div className="simulado-card-top">
                <span className="live-pill"><i /> Em destaque</span>
                <span className="free-pill">Disponível no grátis</span>
              </div>
              <div className="simulado-main-copy">
                <span className="simulado-overline">Simulado completo</span>
                <h3>ENEM 2025</h3>
                <p>Cadernos oficiais do INEP e treino digital com cronômetro, mapa da prova e correção ao finalizar.</p>
              </div>
              <div className="simulado-stats">
                <div><strong>180</strong><span>questões</span></div>
                <div><strong>2</strong><span>cadernos</span></div>
                <div><strong>4</strong><span>áreas</span></div>
              </div>
              <a className="button button-primary" href="/simulados/enem-2025">Ver prova <ArrowIcon /></a>
            </article>

            <div className="simulado-side-cards">
              <article className="simulado-small-card">
                <div className="small-card-number">01</div>
                <div>
                  <span>Primeiro dia</span>
                  <h3>Linguagens e Humanas</h3>
                  <p>90 questões · inglês ou espanhol</p>
                </div>
                <a href="/simulados/enem-2025" aria-label="Escolher caderno do primeiro dia"><ArrowIcon /></a>
              </article>

              <article className="simulado-small-card">
                <div className="area-mini-chart" aria-hidden="true">
                  <i /><i /><i /><i />
                </div>
                <div>
                  <span>Segundo dia</span>
                  <h3>Natureza e Matemática</h3>
                  <p>90 questões · caderno azul</p>
                </div>
                <a href="/simulados/enem-2025/prova?prova=enem-2025-dia-2" aria-label="Começar o segundo dia"><ArrowIcon /></a>
              </article>
            </div>
          </div>

          <div className="previous-exams" id="provas-anteriores">
            <div><span>Prova anterior</span><p>Primeira aplicação organizada por dia, com o gabarito oficial ao finalizar.</p></div>
            <div className="year-list" aria-label="Edição disponível"><a href="/simulados/enem-2025">ENEM 2025</a></div>
            <a className="previous-link" href="/simulados/enem-2025">Abrir prova <ArrowIcon /></a>
          </div>

          <p className="free-access-note"><CheckIcon /><span>No plano grátis você também conclui o simulado inteiro. A cada 10 questões, fazemos apenas uma pausa com anúncio.</span></p>
        </section>

        <section className="archive-section" id="certificados">
          <div className="archive-inner">
            <div className="archive-copy">
              <p className="section-kicker">Além dos simulados</p>
              <h2>Seus certificados também encontram lugar.</h2>
              <p>
                Guarde o arquivo, o link de validação, a carga horária e as habilidades
                aprendidas. Quando precisar apresentar sua trajetória, tudo está organizado.
              </p>
              <ul className="archive-benefits">
                <li><CheckIcon /><span><strong>Organize por tema</strong> com pastas, etiquetas e busca.</span></li>
                <li><CheckIcon /><span><strong>Registre o que aprendeu</strong> além do PDF do certificado.</span></li>
                <li><CheckIcon /><span><strong>Compartilhe com confiança</strong> usando o link de validação.</span></li>
              </ul>
              <a className="text-link" href="/certificados">Conhecer o arquivo de conquistas <ArrowIcon /></a>
            </div>

            <div className="archive-visual" aria-label="Exemplo de biblioteca de certificados">
              <div className="archive-tabs" aria-hidden="true"><span>Todos</span><span>Tecnologia</span><span>Idiomas</span></div>
              <div className="archive-shelf">
                <article className="file-card file-card-main">
                  <span className="file-stamp">CERTIFICADO</span>
                  <div className="file-award"><AwardIcon /></div>
                  <span>Formação</span>
                  <strong>Fundamentos de Inteligência Artificial</strong>
                  <div className="file-meta"><span>40h</span><span>2026</span></div>
                  <div className="file-tags"><span>IA</span><span>Tecnologia</span><span>Ética</span></div>
                </article>
                <article className="file-card file-card-back">
                  <span className="file-stamp">CERTIFICADO</span>
                  <span>Curso livre</span>
                  <strong>Excel para análise de dados</strong>
                  <div className="file-meta"><span>20h</span><span>2025</span></div>
                </article>
                <div className="shelf-label">TECNOLOGIA · 8 ARQUIVOS</div>
              </div>
              <div className="skill-slip">
                <span>Habilidades registradas</span>
                <div><i /> Fundamentos de IA</div>
                <div><i /> Pensamento crítico</div>
                <div><i /> Automação responsável</div>
              </div>
            </div>
          </div>
        </section>

        <section className="pricing-section section-block" id="planos">
          <div className="pricing-heading pricing-heading-compact">
            <p className="section-kicker">Planos</p>
            <div>
              <h2>Dois planos. Você escolhe por quanto tempo.</h2>
              <p>Os simulados continuam completos no grátis. O Plus remove as pausas de publicidade, amplia o espaço para certificados e dá atendimento prioritário.</p>
            </div>
          </div>
          <PricingSelector />
        </section>

        <section className="faq-section section-block" id="duvidas">
          <div className="faq-heading">
            <p className="section-kicker">Dúvidas frequentes</p>
            <h2>Sobre a Estudoteca</h2>
            <p>O essencial para começar a usar a plataforma.</p>
          </div>
          <div className="faq-list">
            <details open>
              <summary>Dá para fazer o simulado completo de graça?</summary>
              <p>Sim. Você pode concluir a prova inteira no plano gratuito. Um anúncio aparece a cada bloco de 10 questões e, em seguida, a prova continua normalmente.</p>
            </details>
            <details>
              <summary>Quais tipos de simulado estão disponíveis?</summary>
              <p>Os dois dias da primeira aplicação do ENEM 2025, com escolha entre inglês e espanhol no primeiro caderno.</p>
            </details>
            <details>
              <summary>O que posso guardar na área de certificados?</summary>
              <p>O arquivo do certificado, link de validação, instituição, carga horária, data, resumo do curso e habilidades aprendidas.</p>
            </details>
            <details>
              <summary>O Plus muda conforme a duração?</summary>
              <p>Os recursos são os mesmos: simulados sem pausas de publicidade, mais espaço para certificados e atendimento prioritário. O que muda é o tempo de acesso, o preço proporcional e o limite de armazenamento correspondente.</p>
            </details>
            <details>
              <summary>Como funciona o espaço para certificados?</summary>
              <p>Todo estudante começa com 50 MB. Conforme acumula dias Plus, a estante aumenta por etapas: 150 MB, 250 MB, 500 MB, 750 MB e até 1 GB.</p>
            </details>
          </div>
        </section>

        <section className="final-cta" id="comecar">
          <div className="final-cta-mark"><BrandMark /></div>
          <p className="section-kicker">Comece agora</p>
          <h2>Faça um simulado e descubra seu próximo foco.</h2>
          <p>Escolha uma prova, responda no seu ritmo e use o resultado para estudar com mais direção.</p>
          <div className="final-actions">
            <a className="button button-primary" href="/simulados">Fazer simulado grátis <ArrowIcon /></a>
            <span>Não precisa de cartão</span>
          </div>
        </section>

        <footer className="site-footer" id="entrar">
          <div className="footer-brand"><BrandMark /><div><strong>Estudoteca</strong><span>Simulados, desempenho e conquistas.</span></div></div>
          <nav aria-label="Links do rodapé"><a href="/simulados">Simulados</a><a href="/certificados">Certificados</a><a href="#planos">Planos</a><a href="/contato">Contato</a><a href="#duvidas">Dúvidas</a><a href="/termos">Termos</a><a href="/privacidade">Privacidade</a></nav>
          <p>© 2026 Estudoteca.</p>
        </footer>
      </main>
    </div>
  );
}
