import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = {
  title: "Política de Privacidade — Estudoteca",
  description: "Como a Estudoteca coleta, usa, protege e exclui dados pessoais.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Seus dados"
      title="Política de Privacidade"
      intro="Aqui você encontra, em linguagem direta, quais dados usamos e quais escolhas estão sob seu controle."
      updated="13 de julho de 2026"
      sections={[
        {
          id: "dados",
          title: "Dados que tratamos",
          content: <><p>Podemos tratar dados de cadastro e contato e as informações necessárias para suporte e segurança. As respostas em andamento ficam no armazenamento local do seu navegador e são enviadas ao servidor quando você solicita a correção.</p><p>Na área de certificados, tratamos os dados informados por você e os arquivos enviados. Em pagamentos, podemos receber o status, o valor e a identificação da transação; dados financeiros completos ficam sob responsabilidade do provedor de pagamento.</p></>,
        },
        {
          id: "finalidades",
          title: "Para que usamos os dados",
          content: <p>Usamos os dados para criar e proteger sua conta, corrigir simulados, organizar certificados, administrar planos, prestar suporte, prevenir fraude e cumprir obrigações legais.</p>,
        },
        {
          id: "bases-legais",
          title: "Bases legais",
          content: <p>O tratamento pode ocorrer para executar o serviço contratado, cumprir obrigações legais, proteger direitos, prevenir fraude, atender interesses legítimos compatíveis com suas expectativas ou, quando necessário, com seu consentimento.</p>,
        },
        {
          id: "compartilhamento",
          title: "Com quem compartilhamos",
          content: <><p>Compartilhamos somente o necessário com fornecedores de hospedagem, armazenamento, segurança, atendimento e processamento de pagamentos. Quando houver publicidade de terceiros no Plano Grátis, os parceiros poderão tratar dados técnicos de acordo com as preferências de privacidade aplicáveis.</p><p>Também podemos compartilhar informações quando houver obrigação legal ou ordem válida de autoridade competente.</p></>,
        },
        {
          id: "retencao",
          title: "Por quanto tempo guardamos",
          content: <><p>Os dados são mantidos enquanto a conta estiver ativa e pelo período necessário para prestar o serviço, resolver disputas, prevenir fraude e cumprir obrigações legais.</p><p>Se o acesso Plus terminar e os certificados ultrapassarem o limite gratuito, o excedente poderá ser arquivado por até 30 dias. Nesse período, você poderá exportar os arquivos ou reativar o Plus. Enviaremos um aviso antes da exclusão definitiva.</p></>,
        },
        {
          id: "direitos",
          title: "Seus direitos",
          content: <p>Você pode solicitar confirmação do tratamento, acesso, correção, informação sobre compartilhamentos, portabilidade quando aplicável, anonimização, bloqueio ou exclusão de dados desnecessários e revisão de consentimentos. Algumas informações podem ser mantidas quando a lei permitir ou exigir.</p>,
        },
        {
          id: "cookies",
          title: "Cookies e armazenamento local",
          content: <p>Usamos recursos essenciais para manter a sessão, salvar o tema claro ou escuro e guardar, neste navegador, as respostas de simulados ainda não entregues. Recursos de medição ou publicidade que não sejam essenciais devem respeitar as escolhas apresentadas a você.</p>,
        },
        {
          id: "menores",
          title: "Crianças e adolescentes",
          content: <p>Dados de crianças e adolescentes devem ser tratados em seu melhor interesse. Quando a legislação exigir, solicitaremos a participação ou autorização do responsável legal e limitaremos a coleta ao necessário para o serviço.</p>,
        },
        {
          id: "seguranca",
          title: "Segurança e contato",
          content: <p>Adotamos controles técnicos e organizacionais proporcionais aos dados tratados, embora nenhum serviço conectado à internet elimine todos os riscos. Para exercer direitos ou tirar dúvidas, use o canal de privacidade disponível na área da conta.</p>,
        },
      ]}
    />
  );
}
