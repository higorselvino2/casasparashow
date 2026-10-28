(() => {
  'use strict';
  const venues = window.CASAS;
  const consultations = window.CONSULTAS || [];
  const allVenues = [...venues, ...consultations];
  const consultGrid = document.getElementById('consultGrid');
  const consultSearch = document.getElementById('consultSearch');
  let consultFilter = 'all';
  const grid = document.getElementById('venueGrid');
  const search = document.getElementById('search');
  const sort = document.getElementById('sort');
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const key = 'casasparashow-retornos-v1';
  let tracking = {};
  try { const saved = JSON.parse(localStorage.getItem(key) || '{}'); if (saved && typeof saved === 'object' && !Array.isArray(saved)) tracking = saved; } catch (_) { /* Storage unavailable or an invalid saved file. */ }
  let activeFilter = 'target';
  let toastTimer;
  const escape = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const stateFor = (id) => tracking[id] || {status:'novo', date:'', note:''};
  const isPending = (v) => !v.bookingConfirmed;
  const priorityText = ['','Destino artístico publicado','Canal oficial · pedir produção','Qualificar encaminhamento','Consulta secundária'];
  const contactName = v => v.shortPerson || v.person || (v.contactStatus==='rota-artistica'?'Equipe artística · encaminhamento':'Programação · solicitar encaminhamento');
  const statuses = [['novo','Ainda não contatado'],['tentativa','Contato tentado'],['aguardando','Aguardando retorno'],['encaminhado','Pessoa indicada'],['conversa','Em conversa'],['proposta','Proposta enviada'],['semfit','Sem encaixe agora']];

  function toast(message) {
    const el = document.getElementById('toast'); el.textContent = message; el.classList.add('visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 2400);
  }
  function persist() {
    try { localStorage.setItem(key, JSON.stringify(tracking)); }
    catch (_) { toast('Não foi possível salvar neste navegador. Exporte um backup.'); }
  }
  function external(url, label, className = '') {
    return `<a class="${className}" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)}</a>`;
  }
  function badge(v) {
    const label = v.direct ? v.directType : v.contactStatus==='rota-artistica'?'Destino artístico · sem nome':'Canal da equipe';
    return `<span class="channel-badge ${v.direct ? 'nominal' : ''}">${escape(label)}</span>`;
  }
  const instagramIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>';
  function socialLink(url,label,kind) {
    return url ? `<a class="social-quick ${kind==='Pessoa'?'social-person':''}" href="${escape(url)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram ${escape(label)}" title="Instagram ${escape(label)}">${instagramIcon}<span>Instagram <b>${escape(kind)}</b></span><span aria-hidden="true">↗</span></a>` : '';
  }
  function artistHistory(v) {
    if (!v.artists) return `<div class="artist-history no-history"><span class="field-label">HISTÓRICO DE ARTISTAS</span><p>Sem nomes com fonte validada nesta revisão.</p></div>`;
    return `<div class="artist-history"><span class="field-label">ARTISTAS / PROGRAMAÇÃO DOCUMENTADA</span><div class="artist-chips">${v.artists.names.map(name=>`<span>${escape(name)}</span>`).join('')}</div><p>${escape(v.artists.label)}</p>${external(v.artists.source,'Ver fonte do histórico ↗','history-source')}</div>`;
  }
  function actions(v) {
    const buttons = [];
    if (v.routeUrl && v.contactStatus==='rota-artistica') buttons.push(external(v.routeUrl,v.routeLabel+' ↗','artistic-action'));
    if (v.whatsapp) buttons.push(external(`https://wa.me/${v.whatsapp}`,v.type?'WhatsApp da operação ↗':'WhatsApp da equipe ↗','whatsapp'));
    if (v.phone) buttons.push(`<a href="tel:+${v.phone}">Ligar</a>`);
    if (v.phone) buttons.push(`<button type="button" data-copy-number="${v.id}">Copiar número</button>`);
    if (v.email) buttons.push(`<a href="mailto:${escape(v.email)}">${v.id==='jaguariuna'?'E-mail nominal do acervo':'E-mail institucional'} ↗</a>`);
    if (v.routeUrl && v.contactStatus!=='rota-artistica') buttons.push(external(v.routeUrl,v.routeLabel+' ↗'));
    return buttons.join('');
  }
  function qualification(v) {
    if (v.type) return '';
    const labels={potential:'Priorizar a qualificação · R$ 30 mil',conditional:'Condicional · formato / produtor pendente',hold:'Fora da abordagem imediata'};
    return `<div class="qualification ${escape(v.screening)}"><span>${escape(labels[v.screening]||'Em qualificação')}</span><small>Orçamento não confirmado</small></div>${v.restriction?`<p class="availability-alert">${escape(v.restriction)}</p>`:''}`;
  }
  function secondaryChannel(v) {
    const c=v.secondaryContact;if(!c)return '';
    return `<details class="card-details secondary-contact"><summary>Outra ponte nominal · não é booking</summary><div class="detail-content"><h4>${escape(c.person)}</h4><p>${escape(c.role)}. O número é publicado para esta finalidade, não como comprador artístico.</p><strong>${escape(c.display)}</strong><div class="action-row">${external('https://wa.me/'+c.whatsapp,'WhatsApp de reservas · pedir encaminhamento ↗')}<a href="tel:+${escape(c.phone)}">Ligar para reservas</a>${external(c.source,'Fonte da função ↗')}</div></div></details>`;
  }
  function renderCard(v, index) {
    const saved = stateFor(v.id);
    const bookingState=v.type?'':`<div class="agenda-state"><span class="field-label">QUEM CONTRATA OS SHOWS?</span><strong>${v.contactStatus==='referencia-artistica'?'Referência artística de 2025 · atualização pendente':'Comprador atual ainda não identificado'}</strong><p>${v.contactStatus==='rota-artistica'?'Há destino artístico publicado, mas a pessoa receptora não é nomeada.':v.contactKind==='person'?'Contato nominal abaixo é uma ponte, não comprovação de compra de cachê.':'O canal abaixo pertence à equipe. Não foi atribuído ao dono ou a um comprador.'}</p></div>`;
    const photo=v.photo?`<figure class="house-figure"><a href="${escape(v.photo.file)}" target="_blank" rel="noopener"><img class="house-image" src="${escape(v.photo.file)}" alt="${escape(v.photo.label)}" loading="lazy" width="720" height="400"></a><figcaption>Foto de referência da casa · ${external(v.photo.source,'fonte oficial ↗')} · toque para ampliar</figcaption></figure>`:'';
    return `<article class="venue-card ${v.id==='palacio'?'is-featured':''}" id="casa-${v.id}">
      <div class="venue-identity"><span class="venue-index">${String(index+1).padStart(2,'0')}</span><div><h3>${escape(v.name)}</h3><span class="location">${escape(v.city)} · ${escape(v.category)}</span></div><div>${v.added?'<span class="new-badge">NOVA</span>':''}<span class="priority-label">${escape(priorityText[v.priority])}</span></div></div>
      ${qualification(v)}
      ${v.booking?`<div class="booking-badge"><span aria-hidden="true">✦</span> ${escape(v.booking.label)} ${external(v.booking.source,'Ver documento ↗')}</div>`:''}
      <div class="social-strip">${socialLink(v.instagram,v.name,v.type==='secretaria'?'Prefeitura / pasta':v.type?'Evento / produtora':'Casa')}${socialLink(v.personalSocial,v.shortPerson||v.person,'Pessoa')}${!v.instagram&&!v.personalSocial?'<span class="social-missing">Instagram não confirmado · nenhum perfil foi inferido</span>':''}</div>
      ${bookingState}
      <div class="person-block"><div class="person-topline"><span class="field-label">${v.type?'REFERÊNCIA NOMINAL DO ACERVO':v.person?'CONTATO / REFERÊNCIA ENCONTRADA':'CAMINHO PARA PEDIR O RESPONSÁVEL'}</span>${badge(v)}</div><strong class="person-name">${escape(contactName(v))}</strong><span class="person-role">${escape(v.role)}</span></div>
      <div class="channel-area"><div class="channel-description"><span class="field-label">CANAL DISPONÍVEL E SUA FINALIDADE</span></div><b class="channel-description-label">${escape(v.channelType)}</b><span class="number ${v.phone?'':'no-number'}">${escape(v.display)}</span>${v.contactOwner?`<p class="channel-owner"><b>De quem é:</b> ${escape(v.contactOwner)}</p>`:''}<div class="action-row">${actions(v)}</div>${v.contactEvidenceUrl?`<a class="contact-proof" href="${escape(v.contactEvidenceUrl)}" target="_blank" rel="noopener noreferrer">↗ Fonte deste canal · conferida em 28/10/2026</a>`:''}<p class="channel-caveat ${v.id==='coracao'?'pending-note':''}">${escape(v.whatsappEvidence)}</p>${v.routeInstruction?`<div class="contact-suggestion"><span class="field-label">SUGESTÃO · NÃO É MENSAGEM PRONTA</span><p>${escape(v.routeInstruction)}</p></div>`:''}</div>
      ${secondaryChannel(v)}
      ${!v.type?`<details class="card-details"><summary>Por que avaliar o cachê de R$ 30 mil?</summary><div class="detail-content"><p>${escape(v.budgetReason)}</p><h4>Quem produz / compra a data?</h4><p>${escape(v.programmingModel)}</p><p class="budget-caveat">Avaliação de prospecção, não faixa de cachê comprovada. Faltam orçamento, demanda regional e aprovação do contratante.</p></div></details>`:''}
      ${artistHistory(v)}
      <details class="card-details"><summary>${v.type?'Operação, calendário e encaixe comercial':'Casa, capacidade e encaixe comercial'}</summary><div class="detail-content">${photo}<div class="facts"><div class="fact"><span class="field-label">CAPACIDADE</span><strong>${escape(v.capacity)}</strong><small>${escape(v.capacityNote)}</small></div><div class="fact"><span class="field-label">INGRESSO</span><strong>${escape(v.ticket)}</strong><small>${escape(v.ticketNote)}</small></div></div><h4>Estrutura e padrão</h4><p>${escape(v.quality)}</p><h4>Encaixe para João Bosco & Gabriel</h4><p>${escape(v.fit)}</p>${v.booking?`<h4>Histórico da dupla · ${escape(v.booking.date)}</h4><p>${escape(v.booking.note)}</p>${external(v.booking.source,'Abrir evidência oficial ↗','history-source')}`:''}</div></details>
      ${v.type?`<details class="card-details"><summary>Sugestão de encaminhamento</summary><div class="detail-content"><p>${escape(v.strategy)}</p><p>O nome do acervo não comprova que a pessoa compra a programação atual. Confirme função, destinatário e canal antes de enviar uma proposta.</p></div></details>`:''}
      <details class="card-details"><summary>O que está comprovado e fonte de cada informação</summary><div class="detail-content"><h4>${escape(v.person||'Pessoa da programação não identificada')}</h4><p>${escape(v.proof)}</p><ul class="source-list">${v.sources.map(([label,url])=>`<li>${external(url,label+' ↗')}</li>`).join('')}</ul><p class="checked">${escape(v.checked)}</p></div></details>
      <div class="tracking"><div class="tracking-row"><label for="status-${v.id}">Status da conversa<select id="status-${v.id}" data-track="status" data-id="${v.id}">${statuses.map(([value,label])=>`<option value="${value}" ${saved.status===value?'selected':''}>${label}</option>`).join('')}</select></label><label for="date-${v.id}">Próximo retorno<input id="date-${v.id}" type="date" value="${escape(saved.date)}" data-track="date" data-id="${v.id}"></label></div><label class="note-label" for="note-${v.id}">Seu retorno / contato confirmado<textarea id="note-${v.id}" data-track="note" data-id="${v.id}" placeholder="Quem atendeu, contato direto indicado e próximo passo…">${escape(saved.note)}</textarea></label></div>
    </article>`;
  }
  function selected() {
    const query = normalize(search.value.trim());
    return venues.filter(v => {
      const filterMatch = activeFilter==='all' || (activeFilter==='target'&&v.screening==='potential') || (activeFilter==='conditional'&&v.screening!=='potential') || (activeFilter==='confirmed'&&v.bookingConfirmed) || (activeFilter==='artistic'&&v.contactStatus==='rota-artistica') || (activeFilter==='whatsapp' && v.whatsapp) || (activeFilter==='direct' && v.direct) || (activeFilter==='new'&&v.added) || (activeFilter==='pending'&&isPending(v)) || (activeFilter==='followup' && (stateFor(v.id).status!=='novo' || stateFor(v.id).date || stateFor(v.id).note));
      return filterMatch && (!query || normalize([v.name,v.city,v.region,v.person,v.role,v.channelType].join(' ')).includes(query));
    }).sort((a,b)=>sort.value==='name'?a.name.localeCompare(b.name,'pt-BR'):sort.value==='city'?a.city.localeCompare(b.city,'pt-BR'):a.priority-b.priority || venues.indexOf(a)-venues.indexOf(b));
  }
  function render() {
    const list = selected(); grid.innerHTML = list.map((v,index)=>renderCard(v,index)).join('');
    document.getElementById('results').textContent = `${list.length} de ${venues.length} casas em SP · ${list.filter(v=>v.bookingConfirmed).length} compradores com contato direto confirmado · canais públicos não equivalem a atendimento testado`;
    document.getElementById('emptyState').hidden = list.length!==0;
    filterButtons.forEach(b=>{ b.classList.toggle('active',b.dataset.filter===activeFilter); b.setAttribute('aria-pressed',String(b.dataset.filter===activeFilter)); });
  }
  function renderPeople() {
    const groups = new Map();
    allVenues.forEach(v=>{ if(!groups.has(v.personKey)) groups.set(v.personKey,[]); groups.get(v.personKey).push(v); });
    document.getElementById('peopleGrid').innerHTML=[...groups.values()].map(group=>{
      const v=group[0];return `<article class="people-card"><span class="field-label">${v.type==='secretaria'?'SECRETARIA · REFERÊNCIA DO ACERVO':v.type?'EVENTO · REFERÊNCIA DO ACERVO':v.person?'CASA · PONTE / REFERÊNCIA':'CASA · ROTA SEM NOME'}</span><h3>${escape(contactName(v))}</h3><p>${escape(v.role)}</p><div class="houses">${group.map(h=>`<a href="#casa-${h.id}">${escape(h.name)} ↗</a>`).join('')}</div>${badge(v)}${v.personalSocial?socialLink(v.personalSocial,v.shortPerson||v.person,'Pessoa'):''}${group.length>1?'<p>Mesmo canal institucional: coordenar o encaminhamento às duas casas. Não significa mesmo comprador confirmado.</p>':''}</article>`;
    }).join('');
  }
  function renderConsultations() {
    const query=normalize(consultSearch.value.trim());
    const list=consultations.filter(v=>(consultFilter==='all'||v.type===consultFilter||(consultFilter==='booked'&&v.booking))&&(!query||normalize([v.name,v.city,v.person,v.shortPerson||'',v.role].join(' ')).includes(query)));
    consultGrid.innerHTML=list.map((v,i)=>renderCard(v,i)).join('');
    document.getElementById('consultResults').textContent=`${list.length} de ${consultations.length} registros complementares · canais do acervo sinalizados para reconfirmação`;
    document.getElementById('consultEmpty').hidden=list.length!==0;
    document.querySelectorAll('[data-consult-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.consultFilter===consultFilter);b.setAttribute('aria-pressed',String(b.dataset.consultFilter===consultFilter));});
  }
  document.querySelectorAll('[data-consult-filter]').forEach(b=>b.addEventListener('click',()=>{consultFilter=b.dataset.consultFilter;renderConsultations();}));
  document.querySelectorAll('[data-open-consult]').forEach(a=>a.addEventListener('click',()=>{consultFilter=a.dataset.openConsult;consultSearch.value='';renderConsultations();}));
  consultSearch.addEventListener('input',renderConsultations);
  document.getElementById('resetConsult').addEventListener('click',()=>{consultFilter='all';consultSearch.value='';renderConsultations();});
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast('Copiado.'); }
    catch (_) { window.prompt('Copie o texto:',text); }
  }
  filterButtons.forEach(b=>b.addEventListener('click',()=>{ activeFilter=b.dataset.filter; render(); }));
  search.addEventListener('input',render); sort.addEventListener('change',render);
  document.getElementById('resetFilters').addEventListener('click',()=>{activeFilter='all';search.value='';render();});
  document.addEventListener('keydown',e=>{ if(e.key==='/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {e.preventDefault();search.focus();search.scrollIntoView({block:'center'});} });
  document.addEventListener('click',e=>{
    const number=e.target.closest('[data-copy-number]'); if(number){const v=allVenues.find(x=>x.id===number.dataset.copyNumber);copy(v.display);}
    const anchor=e.target.closest('a[href^="#casa-"]'); if(anchor){e.preventDefault();const id=anchor.getAttribute('href').slice(1);if(!document.getElementById(id)){activeFilter='all';search.value='';consultFilter='all';consultSearch.value='';render();renderConsultations();} const target=document.getElementById(id);if(target){history.replaceState(null,'','#'+id);target.scrollIntoView({behavior:'smooth',block:'start'});}}
  });
  document.addEventListener('input',e=>{
    const field=e.target;if(!field.dataset.track)return;
    tracking[field.dataset.id]={...stateFor(field.dataset.id),[field.dataset.track]:field.value,updatedAt:new Date().toISOString()};persist();
  });
  document.getElementById('exportButton').addEventListener('click',()=>{
    const data={exportedAt:new Date().toISOString(),project:'João Bosco & Gabriel — casas de show',researchDate:'2026-10-28',retornos:allVenues.map(v=>({casa:v.name,tipo:v.type||'casa',pessoa:v.person||null,funcao:v.role,compradorConfirmado:!!v.bookingConfirmed,orcamentoConfirmado:!!v.budgetConfirmed,recorte:v.screening||'acervo',canal:v.channelType,titularDoCanal:v.contactOwner||'Consultar ressalvas da ficha',numero:v.phone,whatsapp:v.whatsapp,email:v.email,fonteDoCanal:v.contactEvidenceUrl||null,...stateFor(v.id)}))};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='retornos-casas-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Backup dos retornos exportado.');
  });
  document.getElementById('totalMetric').textContent=venues.length;
  document.querySelectorAll('[data-house-count]').forEach(el=>el.textContent=venues.length);
  document.querySelectorAll('[data-target-count]').forEach(el=>el.textContent=venues.filter(v=>v.screening==='potential').length);
  document.querySelectorAll('[data-confirmed-count]').forEach(el=>el.textContent=venues.filter(v=>v.bookingConfirmed).length);
  render();renderConsultations();renderPeople();
  const mobileLinks=[...document.querySelectorAll('.mobile-nav a')];
  const mobileSections=mobileLinks.map(a=>document.querySelector(a.getAttribute('href')));
  let navFrame=0;
  function updateMobileNav() {
    navFrame=0;
    let active=0;
    mobileSections.forEach((section,i)=>{if(section.getBoundingClientRect().top<window.innerHeight*.4)active=i;});
    mobileLinks.forEach((a,i)=>{a.classList.toggle('current',i===active);if(i===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  }
  window.addEventListener('scroll',()=>{if(!navFrame)navFrame=requestAnimationFrame(updateMobileNav);},{passive:true});
  updateMobileNav();
})();
