# Casas para show — João Bosco & Gabriel

Aplicação estática, sem instalação ou etapa de compilação. Abra `index.html` ou sirva esta pasta. Na Vercel, use a raiz do repositório com preset **Other**, sem Build Command. Não foi feito deploy, commit ou push nesta revisão.

## Organização

- `index.html`: estrutura da interface definitiva de operação.
- `casas.js`: 12 casas permanentes, pessoas, funções, números, evidências, mensagens e notas de confiança.
- `consultas.js`: 16 registros complementares (5 secretarias + 11 produtoras/eventos) recuperados do acervo, além do enriquecimento das casas com Instagram e histórico de artistas.
- `app.js`: buscas e filtros independentes por coleção, agrupamento por pessoa, cópia, status e exportação das 28 fichas.
- `site.css`: visual e adaptação para celular e computador.
- `ampliacao.css`: capa, marca Mapa de Palcos, redes sociais visíveis, históricos e coleções complementares.
- `assets/mapa-palcos.svg`: marca editorial do material, criada para a pesquisa; não é logotipo oficial da dupla.
- `assets/casas`: três fotos de referência extraídas dos sites oficiais, com fonte em cada ficha e URL original em `casas.js`.
- `assets/artists`: imagens do projeto anterior, preservadas. A foto da dupla é identificada como artista em prospecção, não como foto do contato.
- `acervo-anterior.html`: cópia integral do index recebido. Preserva todas as 25 operações, imagens e conteúdo anterior, incluindo 16 eventos/circuitos que ficaram fora da fila principal.
- `relatorios/fontes-http.json`: checagem HTTP de fontes e perfis das duas coleções, separada da verificação factual. Bloqueios automatizados não significam link inexistente; HTTP 200 não valida titularidade de um Instagram.

## Revisão de 27/10/2026

Nove casas permanentes da base recebida foram reorganizadas. Três foram adicionadas: Espaço Unimed, CTN e Tokio Marine Hall. A página agora tem **28 oportunidades: 12 casas permanentes, 5 secretarias e 11 produtoras/eventos**. São 28 registros comerciais, não 28 casas ou 28 contatos diretos pessoais. As casas continuam principais; as demais operações ficam em coleção consultável própria, sem misturar suas capacidades com as de uma casa.

Todas as 12 casas têm atalho visível de Instagram. UZNA e Folk Valley também têm o perfil público da pessoa identificado no acervo. Nas demais operações, não foram inventados perfis pessoais. Selma Macchi Santana tem celular funcional nominal publicado na Secretaria de Nova Independência; não foi inferido que seja WhatsApp.

As casas têm nomes de artistas com link e contexto: anúncio de programação, histórico divulgado pela operação ou cobertura de apresentação. Data e natureza da evidência ficam visíveis. O programa de um show não foi convertido em prova de execução. As capacidades e a adequação comercial continuam sujeitas a confirmação.

O selo “Já contratou a dupla” só aparece em Nova Independência (contrato 15/2024 para 19/05/2024) e Itatiba (contrato 065/2025 e programa de 18/07/2025). Não há selo nas casas sem comprovação. Os documentos não são atestados de execução e não definem o cachê atual.

Os 16 canais recuperados têm ressalvas de atualização. Não representam 16 números pessoais novos. Mensagens antigas que divergiam do nome documentado foram corrigidas (por exemplo, HR Estruturas).

A nova foto de capa é a imagem pública do perfil da dupla no Spotify: https://open.spotify.com/intl-pt/artist/21WAvVROZ83oUvJwFTG2dH — imagem original https://i.scdn.co/image/ab6761610000e5ebf3d9243b0437c17f528dd615, salva localmente em `assets/artists/joao-bosco-gabriel-capa.jpg`. Não é fotografia de responsável por casa nem imagem gerada.

Cada ficha distingue pessoa documentada, função, canal nominal ou da equipe, origem do contato e o que precisa ser confirmado. Os botões não enviam mensagens automaticamente: abrem a conversa preenchida para revisão do vendedor. Não houve contato com terceiros.

Tomas (Palácio Sunset) e Zacarias (Coração Sertanejo) têm celulares publicados nominalmente nas fontes consultadas. Isso não comprova que sejam compradores artísticos ou que respondam no WhatsApp. Yhosefe tem e-mail nominal cadastral; o WhatsApp do Terra SP e o da Arena+ são da equipe. Gui Moron e Fauze têm perfis públicos pessoais; não foram inventados WhatsApps pessoais. Os demais caminhos são institucionais ou exigem confirmação. Nomes divergentes nos scripts antigos foram corrigidos na página principal.

O número do CTN está na configuração `joinchat` da página oficial, como `telephone: 551134889420`. O telefone de reserva para PCD do Tokio Marine Hall não foi usado como canal comercial. O telefone da empresa de Elvis é cadastral, sem comprovação de WhatsApp.

Ingressos antigos estão identificados como referência anterior. Valores atuais não consolidados permanecem “a confirmar”. O custo de R$ 30 mil vem da equipe do artista, não de aceite da casa.

## Retornos do vendedor

Status, data e anotações usam localStorage, por navegador/dispositivo. Não há servidor nem sincronização. O botão de exportação baixa JSON com as 28 fichas e os retornos. Anotações são escapadas na renderização. Não há autenticação ou OAuth implementado neste repositório estático; eventuais controles da Vercel são externos ao código.

## Verificação

- `node --check app.js`, `node --check casas.js` e `node --check consultas.js`.
- `scripts/verify-ui.cjs`: navegador real em modo de teste; 28 fichas, 26 grupos, 14 atalhos Instagram nas casas, históricos, selos documentais, filtros independentes, busca sem acento, persistência em ambas as listas, exportação de 28, links locais, WhatsApp sem envio, fotos e larguras de 360, 390, 768 e 1440 px.
- `scripts/review-sources.cjs`: checa HTTP de fontes, com falhas e bloqueios explícitos. Um HTTP 200 não prova atendimento nem autenticidade do conteúdo.

Os scripts de verificação requerem Node e Playwright disponíveis no ambiente. Não são dependências do site publicado. As capturas ficam em `relatorios/` e não são necessárias no pacote de publicação.
