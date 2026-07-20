# Estudoteca

Simulados completos do ENEM e organização de certificados em um só lugar.

[Acessar a Estudoteca](https://estuda-hub.sofia-e-amigos.chatgpt.site)

## Sobre o projeto

A Estudoteca é uma plataforma brasileira de estudos pensada para quem está se preparando para o ENEM e vestibulares. O foco principal são simulados fiéis às provas, com uma experiência confortável no celular e no computador. A biblioteca pessoal de certificados é o diferencial: o estudante pode reunir cursos, arquivos, links de validação e habilidades desenvolvidas sem depender de planilhas ou páginas soltas.

## O que já está disponível

- 180 questões oficiais da aplicação regular do ENEM 2025.
- Primeiro dia com opção de inglês ou espanhol e segundo dia completo.
- Cronômetro, mapa de questões, marcação para revisão e retomada automática no mesmo dispositivo.
- Correção pelo gabarito oficial, incluindo a identificação de itens anulados.
- Plano gratuito com a prova inteira acessível e espaços reservados para publicidade entre blocos.
- Biblioteca pessoal de certificados com PDF, imagem, instituição, carga horária, habilidades e link de validação.
- Autenticação para áreas pessoais, contato e feedback dentro da plataforma.
- Interface responsiva, com modo claro e escuro.
- Páginas de planos, termos de uso e política de privacidade.

> Pagamentos e anúncios reais ainda não estão conectados. As solicitações sobre o Estudoteca Plus são encaminhadas pelo formulário de contato.

## Tecnologias

- React 19, TypeScript e Next.js sobre [Vinext](https://github.com/cloudflare/vinext)
- Cloudflare Workers para a aplicação
- Cloudflare D1 e Drizzle ORM para dados estruturados
- Cloudflare R2 para os arquivos de certificados
- OpenAI Sites para hospedagem da versão atual

## Executando localmente

### Requisitos

- Node.js 22.13 ou superior
- Ambiente Linux com `flock`, `curl` e GNU `timeout`

### Instalação

```bash
npm ci
npm run dev
```

A aplicação de desenvolvimento usa as simulações locais dos bindings declarados em `.openai/hosting.json`. Algumas funções de autenticação dependem dos cabeçalhos fornecidos pelo ambiente hospedado.

## Comandos

```bash
npm run dev               # servidor local
npm run lint              # análise estática
npm run build             # build e validação do artefato
npm test                  # build e testes automatizados
npm run db:generate       # geração de migrações Drizzle
npm run validate:artifact # validação de um build existente
```

## Estrutura principal

```text
app/        páginas, componentes e rotas de API
db/         schema e acesso ao banco D1
drizzle/    migrações do banco de dados
lib/        regras de domínio, armazenamento e dados do ENEM
public/     imagens oficiais usadas nos cadernos
scripts/    instalação, build e validações
tests/      testes automatizados
```

## Fonte das questões

Os enunciados, imagens e gabaritos do ENEM 2025 foram organizados a partir dos cadernos oficiais publicados pelo Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (Inep). As marcas e os materiais oficiais pertencem aos seus respectivos titulares; este projeto não representa nem é afiliado ao Inep.

## Licença

Este repositório ainda não possui uma licença de código aberto. Consulte a autora antes de reutilizar ou distribuir o código.
