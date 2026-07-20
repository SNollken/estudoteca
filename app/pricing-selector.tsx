"use client";

import { useState } from "react";

const durations = [
  {
    days: 14,
    label: "14 dias",
    price: "R$ 7,99",
    equivalent: "R$ 0,57/dia",
    storage: "150 MB",
    note: "Para uma reta final",
  },
  {
    days: 30,
    label: "30 dias",
    price: "R$ 14,90",
    equivalent: "R$ 0,50/dia",
    storage: "250 MB",
    note: "Mais escolhido",
  },
  {
    days: 90,
    label: "90 dias",
    price: "R$ 30",
    equivalent: "R$ 0,33/dia",
    storage: "500 MB",
    note: "Um trimestre",
  },
  {
    days: 180,
    label: "180 dias",
    price: "R$ 45",
    equivalent: "R$ 0,25/dia",
    storage: "750 MB",
    note: "Um semestre",
  },
  {
    days: 365,
    label: "1 ano",
    price: "R$ 70",
    equivalent: "R$ 0,19/dia",
    storage: "1 GB",
    note: "Maior economia",
  },
] as const;

const storageMilestones = [
  { label: "Grátis", value: "50 MB" },
  { label: "14 dias", value: "150 MB" },
  { label: "30 dias", value: "250 MB" },
  { label: "90 dias", value: "500 MB" },
  { label: "180 dias", value: "750 MB" },
  { label: "365 dias", value: "1 GB" },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m4 10 4 4 8-9" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" />
    </svg>
  );
}

export function PricingSelector() {
  const [selectedDays, setSelectedDays] = useState<number>(14);
  const selected = durations.find((duration) => duration.days === selectedDays) ?? durations[0];

  return (
    <div className="pricing-experience">
      <div className="pricing-comparison">
        <article className="product-plan free-product">
          <div className="plan-identity">
            <span className="plan-label">Estudoteca Grátis</span>
            <span className="plan-note">Para estudar sem pagar</span>
          </div>

          <div className="free-price">
            <strong>R$ 0</strong>
            <span>sempre</span>
          </div>

          <p className="plan-summary">
            O conteúdo não fica atrás de um pagamento. Você faz a prova inteira,
            com uma breve pausa entre os blocos.
          </p>

          <ul className="plan-benefits">
            <li><CheckIcon /><span>Cadernos completos do ENEM 2025</span></li>
            <li><CheckIcon /><span>Resultado geral ao finalizar</span></li>
            <li><CheckIcon /><span>Progresso salvo neste dispositivo</span></li>
            <li><CheckIcon /><span>50 MB para seus certificados</span></li>
          </ul>

          <div className="free-pause-note">
            <span>Como se mantém gratuito</span>
            <p>Uma pausa com anúncio depois de cada 10 questões.</p>
          </div>

          <a className="button button-ghost product-plan-button" href="/simulados">
            Começar grátis <ArrowIcon />
          </a>
        </article>

        <article className="product-plan plus-product">
          <div className="plus-heading-row">
            <div className="plan-identity">
              <span className="plan-label">Estudoteca Plus</span>
              <span className="plan-note">A mesma experiência em qualquer período</span>
            </div>
            <span className="plus-seal">Sem anúncios</span>
          </div>

          <p className="plan-summary">
            Para estudar sem pausas de publicidade, guardar mais conquistas e ter
            um canal prioritário de atendimento.
          </p>

          <ul className="plan-benefits plus-benefits">
            <li><CheckIcon /><span>Simulados sem interrupções</span></li>
            <li><CheckIcon /><span>Correção completa ao finalizar a prova</span></li>
            <li><CheckIcon /><span>Mais espaço para certificados</span></li>
            <li><CheckIcon /><span>Atendimento prioritário com a Sofia</span></li>
          </ul>

          <fieldset className="duration-fieldset">
            <legend>Por quanto tempo você quer acessar?</legend>
            <div className="duration-grid">
              {durations.map((duration) => (
                <label className="duration-option" key={duration.days}>
                  <input
                    type="radio"
                    name="plus-duration"
                    value={duration.days}
                    checked={selectedDays === duration.days}
                    onChange={() => setSelectedDays(duration.days)}
                  />
                  <span className="duration-radio" aria-hidden="true" />
                  <span className="duration-copy">
                    <strong>{duration.label}</strong>
                    <small>{duration.note}</small>
                  </span>
                  <span className="duration-price"><strong>{duration.price}</strong><small> · {duration.equivalent}</small></span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="selected-plan" aria-live="polite">
            <div className="selected-price">
              <span>Quanto custa por dia</span>
              <strong>{selected.equivalent}</strong>
              <small>{selected.price} no total por {selected.label}</small>
            </div>
            <div className="selected-storage">
              <span>Espaço da estante</span>
              <strong>{selected.storage}</strong>
              <small>durante o acesso Plus</small>
            </div>
          </div>

          <a className="button button-primary product-plan-button" href={`/contato?categoria=plano&assunto=${encodeURIComponent(`Estudoteca Plus · ${selected.label}`)}`}>
            Escolher {selected.label} <ArrowIcon />
          </a>
          <p className="checkout-note">
            O pedido começa pelo atendimento. Antes de pagar, você recebe o valor total, o período de acesso e as condições aplicáveis. Consulte os <a href="/termos">Termos de Uso</a> e a <a href="/privacidade">Política de Privacidade</a>.
          </p>
        </article>
      </div>

      <section className="loyalty-rail" aria-labelledby="loyalty-title">
        <div className="loyalty-copy">
          <span className="loyalty-eyebrow">Sua estante cresce com você</span>
          <h3 id="loyalty-title">Mais dias Plus, mais espaço guardado.</h3>
          <p>Renove ou escolha períodos maiores para ampliar a estante durante o acesso Plus, até 1 GB.</p>
        </div>
        <ol className="loyalty-track">
          {storageMilestones.map((milestone, index) => (
            <li key={milestone.label} className={index === 0 ? "milestone-free" : ""}>
              <span className="milestone-dot" aria-hidden="true" />
              <strong>{milestone.value}</strong>
              <small>{milestone.label}</small>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
