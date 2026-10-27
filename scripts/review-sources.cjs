const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'casas.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(root,'consultas.js'),'utf8'),context);
const venues=[...context.window.CASAS,...context.window.CONSULTAS];
const urls=[...new Set(venues.flatMap(v=>[...v.sources.map(s=>s[1]),v.instagram,v.personalSocial]).filter(u=>u&&/^https?:/.test(u)))];
const records=[];
async function check(url){
  try {
    const response=await fetch(url,{signal:AbortSignal.timeout(18000),headers:{'User-Agent':'Mozilla/5.0'}});
    const text=await response.text();
    const title=text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g,' ').trim()||'';
    const result={url,status:response.status,finalUrl:response.url,title,note:response.ok?'Resposta HTTP recebida; não comprova autenticidade nem atendimento.':'Fonte pode bloquear acesso automatizado; consulte manualmente.'};
    records.push(result);
    console.log(response.status,url);
  }catch(error){records.push({url,status:null,note:error.message});console.log('ERRO',url,error.message);}
}
(async()=>{
  let next=0;await Promise.all(Array.from({length:8},async()=>{while(next<urls.length){const url=urls[next++];await check(url);}}));
  fs.mkdirSync(path.join(root,'relatorios'),{recursive:true});
  fs.writeFileSync(path.join(root,'relatorios','fontes-http.json'),JSON.stringify({researchDate:'2026-10-27',checkedAt:new Date().toISOString(),meaning:'Checagem HTTP das fontes; os fatos foram revisados na pesquisa. Erro ou bloqueio HTTP não significa que a informação seja falsa. Nenhuma mensagem ou ligação foi feita.',records},null,2));
})();
