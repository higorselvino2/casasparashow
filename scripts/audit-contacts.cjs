// Read-only external checks in an isolated browser. Does not send messages/forms.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const data={window:{}};
for(const f of ['casas.js','consultas.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),data);
const manual={
  uzna:{url:'https://www.instagram.com/uzna.oficial/',method:'Perfil oficial lido via interface do navegador, em 28/10/2026',published:'Link visível “Entre em contato — WhatsApp”: https://wa.me/551531912425. Camarote separado: 5515996693344.'},
  coracao:{url:'https://www.instagram.com/coracaosertanejo/',method:'Bio oficial lida via interface do navegador, em 28/10/2026',published:'Bio: WhatsApp (11) 99898-3963. Publicações de reservas indicam (11) 95433-5586.'}
};
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
  const records=[];let next=0;
  await Promise.all(Array.from({length:3},async()=>{
    while(next<data.window.CASAS.length){
      const v=data.window.CASAS[next++];
      const record={id:v.id,venue:v.name,channelSource:v.contactEvidenceUrl,phone:v.phone||null,whatsapp:v.whatsapp||null,email:v.email||null,phoneOwner:v.contactOwner,bookingConfirmed:false,budgetConfirmed:false,deliveryTested:false,sourceReviewDate:'2026-10-28'};
      if(manual[v.id]){records.push({...record,sourceCheck:manual[v.id],result:'Publicação conferida manualmente; atendimento não testado'});continue;}
      const page=await browser.newPage();
      try{
        const response=await page.goto(v.contactEvidenceUrl,{waitUntil:'networkidle',timeout:40000});
        const body=await page.locator('body').innerText();
        const channels=await page.locator('a[href^="tel:"],a[href^="mailto:"],a[href*="wa.me"],a[href*="whatsapp.com"]').evaluateAll(as=>as.map(a=>({label:a.innerText.trim(),href:a.getAttribute('href')})));
        const options=await page.locator('select option').allTextContents();
        const haystack=body+' '+channels.map(c=>c.href).join(' ')+' '+await page.content();
        const digits=haystack.replace(/\D/g,'');
        const local=v.phone?.replace(/^55/,'');
        record.httpStatus=response?.status();record.finalUrl=page.url();
        record.phonePublished=v.phone?digits.includes(v.phone)||digits.includes(local):null;
        record.emailPublished=v.email?haystack.toLowerCase().includes(v.email.toLowerCase()):null;
        record.contactLinks=channels.filter(c=>!c.href.includes('text=')).map(c=>({label:c.label,href:c.href}));
        record.formAreas=[...new Set(options.map(x=>x.trim()))].filter(Boolean);
        record.result=record.httpStatus===200?'Página acessível; conferir finalidade na ficha. Não testa atendimento.':'Resposta técnica insuficiente';
      }catch(e){record.result='Não comprovado automaticamente; não confundir bloqueio com contato inválido';record.error=e.message;}
      finally{await page.close();}
      records.push(record);console.log(v.id,record.httpStatus,record.phonePublished,record.emailPublished);
    }
  }));
  await browser.close();
  records.sort((a,b)=>a.id.localeCompare(b.id));
  fs.writeFileSync(path.join(root,'relatorios','auditoria-contatos-2026-10-28.json'),JSON.stringify({date:'2026-10-28',scope:'12 casas anteriores e 3 novas. Os 16 registros complementares do acervo não foram revalidados documentalmente.',limits:'Publicação e destinos de canais, não entrega, resposta, identidade do atendente, autoridade para contratar ou cachê disponível. Sem contato com terceiros.',records},null,2));
  console.log('Auditoria documental/técnica salva:',records.length,'casas');
})();
