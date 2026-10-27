# Mapa de Palcos — João Bosco & Gabriel

Aplicação estática em HTML/CSS/JavaScript. Abra index.html ou publique a raiz na Vercel, preset Other, sem etapa de compilação. Esta revisão não fez deploy, commit, push ou contato com terceiros.

## Situação da pesquisa de agenda — 27/10/2026

A base mantém 28 registros: 12 casas permanentes no estado de São Paulo, 5 secretarias e 11 produtoras/eventos. Isso não significa 28 compradores ou contatos pessoais. Casas continuam sendo a prioridade, e as outras frentes permanecem separadas.

A revisão anterior confundia vínculo de propriedade/direção com função de compra de shows. Essa indicação foi retirada. Não foi comprovado contato direto com comprador atual nas 12 casas. A interface informa essa limitação, sem completar lacunas por inferência.

- Duas pontes nominais: Tomas, contato comercial publicado pelo Palácio Sunset, e Zacarias, gerente citado em resposta pública histórica do Coração Sertanejo. Nenhum foi classificado como comprador. No segundo caso, titularidade e vínculo atuais também precisam ser confirmados.
- Duas fichas com destino artístico formal: Villa Country e Espaço Unimed. O formulário oficial do mesmo grupo oferece “Contato Artístico (Empresários e Agências)”, sem publicar o nome do receptor. Não são dois compradores identificados.
- Uma referência histórica de função artística: Elvis Patez, citado como diretor artístico em reportagem de 2025. O cargo atual e o contato direto seguem pendentes. O e-mail exibido é geral da casa, não dele.
- Nos demais casos, há somente atendimento institucional para pedir encaminhamento. Os nomes dos donos e presidentes não foram mantidos como compradores presumidos.

Os filtros distinguem destino artístico, ponte nominal, WhatsApp da equipe e agenda pendente. A titularidade/finalidade do canal aparece junto de cada número, e a sugestão de encaminhamento é orientação, não mensagem pronta.

## Correções dos canais

- Terra SP: o antigo (11) 94597-4353 é descrito no FAQ para camarotes e aniversários. A rota passou para (11) 93224-2747, publicado no contato e em “Faça seu evento”; continua sendo institucional, não contratação artística comprovada.
- UZNA: “Fale com nosso time”, no Linktree oficial, aponta para (15) 3191-2425. Não é telefone de Gui Moron.
- Folk Valley: a página Info publica SAC/formulário e o botão de WhatsApp configurado para (19) 99148-8131. Não é telefone de Fauze.
- Estância: a central (11) 4101-5000 aparece no rodapé e no botão de WhatsApp. Não é contato pessoal de sócio.
- Red: o número da seção Shows não foi transformado em WhatsApp por inferência nem atribuído a sócios. O número de Eventos/locação é diferente.
- Palácio e Coração: celular publicado nominalmente não comprova WhatsApp. Os atalhos de WhatsApp foram retirados; permanece a ligação com ressalvas.
- Espaço Unimed: o celular de comercial/locação deixou de ser a rota principal de contratação. A prioridade é o formulário com opção artística.
- Tokio: telefone cadastral da empresa de Elvis e telefone de reserva PCD foram excluídos da rota comercial.
- CTN: o edital oficial confirma Coordenação de Produção Artística, mas não nomeia comprador. A presidência não foi tratada como agenda. O edital de bandas residentes não foi indicado como formato para vender o show de R$ 30 mil.

As fontes de cargo, canal e estrutura estão em cada ficha. A revisão documental não comprova identidade de quem atenderá, recebimento de mensagem, interesse, orçamento ou poder de contratar.

## Sem textos prontos

Todos os botões de WhatsApp na página atual abrem apenas a conversa, sem parâmetro text. Os links de e-mail também não preenchem assunto ou mensagem. Não há script para copiar mensagem nem afirmação de data de rota, condição promocional, autorização especial ou itens do show. R$ 30 mil é somente a referência informada pela equipe.

O acervo anterior recebeu aviso de uso histórico, retirada de roteiros copiáveis, atalhos de WhatsApp sem texto e desativação visual de ações operacionais antigas. A cópia original recebida, antes dessas salvaguardas, foi preservada fora da pasta de publicação em:
C:/Users/hhigo/Documents/Codex/2026-09-19/ticket-m-dio-pra-acessar-a/outputs/acervo-original-recebido-2026-10-27.html

## Conteúdo e organização

- index.html: interface, limites da pesquisa e coleções.
- casas.js: 12 casas, fontes e distinção entre comprador, referência, canal nominal e equipe.
- consultas.js: 16 operações complementares do acervo e histórico documentado de artistas.
- app.js: busca, filtros, agrupamento de referências/rotas, status, notas e exportação.
- site.css e ampliacao.css: visual adaptado a celular e computador.
- assets/mapa-palcos.svg: marca editorial do material, não logotipo oficial da dupla.
- assets/casas: três fotos de referência dos sites oficiais, com fonte na ficha.
- assets/artists: imagens do acervo e capa da dupla. Retratos adicionais não são usados na página.
- acervo-anterior.html: pesquisa histórica com salvaguardas; não é lista operacional de contatos.
- relatorios/fontes-http.json: checagem HTTP, separada da verificação factual.

Os nomes dos artistas e as fontes do histórico foram mantidos sem fotos, conforme solicitado. Os dois selos de contratação da dupla correspondem a documentos municipais de Nova Independência (2024) e Itatiba (2025). Contrato/programação não é atestado de execução ou proposta atual.

Capacidade, ingresso e estrutura mantêm suas ressalvas. Faixas antigas não são apresentadas como preço médio atual. O encaixe comercial é uma avaliação, não confirmação de compra.

## Retornos do vendedor e privacidade

Status, datas e notas usam localStorage por navegador/dispositivo, sem sincronização. A exportação inclui os 28 registros, pessoa quando identificada, função, finalidade/titularidade do canal e flag de comprador confirmado. As chaves de armazenamento e ids das fichas foram preservados.

Não há autenticação/OAuth implementados neste código estático. Noindex não restringe acesso. A capa é imagem pública do perfil da dupla: https://open.spotify.com/intl-pt/artist/21WAvVROZ83oUvJwFTG2dH

## Verificação

scripts/verify-ui.cjs verifica dados → ficha → botões, ausência de roteiros/preenchimento automático, identificação de pendências, filtros, preservação de retornos, exportação, links locais, quatro larguras e ausência de erros de JavaScript. Os testes usam navegador isolado e não enviam mensagens.

scripts/review-sources.cjs registra respostas HTTP de fontes/perfis. Bloqueio automatizado não significa link inexistente; HTTP 200 não comprova cargo ou titularidade.

Os scripts de fotos são históricos e não se aplicam ao visual atual. Os scripts de teste dependem de Node/Playwright locais, não são dependências do site publicado.
