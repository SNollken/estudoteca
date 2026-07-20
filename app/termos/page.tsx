import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = {
  title: "Termos de Uso — Estudoteca",
  description: "Regras para uso da Estudoteca, dos simulados e do arquivo de certificados.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Transparência"
      title="Termos de Uso"
      intro="Estas regras explicam como funcionam sua conta, os simulados, o Estudoteca Plus e o arquivo de certificados."
      updated="13 de julho de 2026"
      sections={[
        {
          id: "plataforma",
          title: "A plataforma",
          content: <p>A Estudoteca é uma plataforma digital de preparação para o ENEM e vestibulares. Ela reúne simulados, acompanhamento de desempenho e uma área pessoal para organizar certificados de cursos.</p>,
        },
        {
          id: "conta",
          title: "Conta e acesso",
          content: <><p>Você deve fornecer informações corretas, proteger o acesso à conta usada para entrar e utilizar somente a própria conta. Atividades realizadas após a autenticação serão consideradas feitas pelo titular.</p><p>Menores de idade devem usar a plataforma com a ciência e a autorização de seu responsável legal.</p></>,
        },
        {
          id: "planos",
          title: "Plano Grátis e Estudoteca Plus",
          content: <><p>O Plano Grátis permite concluir simulados, com pausas de anúncio entre blocos de questões, além de oferecer o espaço gratuito indicado na página de planos.</p><p>O Estudoteca Plus remove as pausas de publicidade, amplia o espaço para certificados e oferece atendimento prioritário. Os recursos do Plus são os mesmos em todos os períodos; mudam apenas a duração, o preço total e o armazenamento correspondente.</p></>,
        },
        {
          id: "pagamento",
          title: "Pagamento e vigência",
          content: <><p>O preço total, a duração e a forma de pagamento são apresentados antes da confirmação. Os períodos Plus são cobrados uma única vez e não se renovam automaticamente. O acesso começa após a confirmação do pagamento e termina ao fim do período escolhido.</p><p>O processamento pode ser realizado por uma empresa de pagamentos, que aplica também seus próprios termos e controles de segurança.</p></>,
        },
        {
          id: "arrependimento",
          title: "Arrependimento e reembolso",
          content: <p>Nas contratações realizadas pela internet, o pedido de arrependimento pode ser feito dentro do prazo legal de 7 dias contado da contratação, conforme a legislação de defesa do consumidor. A solicitação deve ser enviada pelo canal de suporte disponível na área da conta; quando aplicável, o reembolso será processado pelo mesmo meio de pagamento.</p>,
        },
        {
          id: "certificados",
          title: "Certificados e armazenamento",
          content: <><p>Você continua responsável pelos arquivos enviados e deve ter autorização para armazená-los. Recomendamos manter também uma cópia própria dos documentos importantes.</p><p>Quando o acesso Plus termina, a conta volta ao limite do Plano Grátis. Arquivos acima desse limite podem ficar arquivados por até 30 dias para exportação ou reativação do Plus. Antes de uma exclusão definitiva, enviaremos um aviso ao contato cadastrado, salvo quando a manutenção for exigida por lei.</p></>,
        },
        {
          id: "uso-adequado",
          title: "Uso adequado",
          content: <p>Não é permitido tentar invadir a plataforma, contornar limites técnicos, automatizar a coleta de conteúdo, compartilhar acesso de forma comercial, enviar arquivos maliciosos ou usar o serviço para violar direitos de terceiros.</p>,
        },
        {
          id: "conteudo",
          title: "Conteúdo e resultados",
          content: <><p>A marca, a interface e os materiais próprios da Estudoteca são protegidos. Provas e questões de terceiros permanecem sujeitas aos direitos e às condições de suas fontes.</p><p>Relatórios e estimativas servem como apoio ao estudo e não garantem nota, classificação ou aprovação. Quando uma pontuação não for oficial, isso será indicado na própria análise.</p></>,
        },
        {
          id: "alteracoes",
          title: "Atualizações e suporte",
          content: <p>Estes Termos podem ser atualizados para refletir mudanças legais ou operacionais. Alterações relevantes serão comunicadas pelos canais da conta. Dúvidas e solicitações podem ser enviadas pelo suporte disponível na plataforma.</p>,
        },
      ]}
    />
  );
}
