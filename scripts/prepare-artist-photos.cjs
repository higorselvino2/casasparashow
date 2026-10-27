/* Downloads de retratos de referência, sem alterar os arquivos do acervo.
 * Gera o catálogo local com autoria/licença e fonte de cada imagem.
 */
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'assets','artists','retratos');
const wikiArtists=[
  ['Marcos & Belutti','Marcos & Belutti'],
  ['Jorge & Mateus','Jorge & Mateus'],['James Blunt','James Blunt'],
  ['Belo','Belo (cantor)'],
  ['Zé Neto & Cristiano','Zé Neto & Cristiano'],['Gusttavo Lima','Gusttavo Lima'],
  ['Henrique & Juliano','Henrique & Juliano'],['Lauana Prado','Lauana Prado'],
  ['Marília Mendonça','Marília Mendonça'],['Maria Cecília & Rodolfo','Maria Cecília & Rodolfo'],
  ['Leonardo','Leonardo (cantor)'],['Jão','Jão'],['Ivete Sangalo','Ivete Sangalo'],
  ['Eduardo Costa','Eduardo Costa (cantor)'],['Fábio Jr.','Fábio Jr.'],['Roberto Carlos','Roberto Carlos']
];
const spotifyArtists=[['Pixote','0ciLF0bOuu2BhqzCEZgHoB'],['Turma do Pagode','5JG9GISYjRLQUJMH2C6iJ5'],['Bruna Viola','1FSqw66rqtbCLDgy9D751C'],['Fiduma & Jeca','2h73KyGixa4A1xlhcxjpG1']];
const headers={'User-Agent':'MapaDePalcos/1.0 (artist reference photographs)'};
const plain=s=>String(s||'').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').trim();
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
async function response(url){const r=await fetch(url,{headers,signal:AbortSignal.timeout(25000)});if(!r.ok)throw Error(r.status+' '+url);return r;}
async function json(url){return (await response(url)).json();}
function api(base,params){return base+'?'+new URLSearchParams({format:'json',...params});}
async function save(name,url,refresh=false){
  if(!refresh&&!process.argv.includes('--refresh')) {
    const cached=fs.readdirSync(out).find(file=>file.replace(/\.[^.]+$/,'')===slug(name));
    if(cached)return 'assets/artists/retratos/'+cached;
  }
  const r=await response(url);
  const type=r.headers.get('content-type')||'';
  if(!type.startsWith('image/'))throw Error('Not an image: '+url);
  const ext=type.includes('png')?'png':type.includes('webp')?'webp':'jpg';
  const file='assets/artists/retratos/'+slug(name)+'.'+ext;
  fs.writeFileSync(path.join(root,file),Buffer.from(await r.arrayBuffer()));
  return file;
}
(async()=>{
  fs.mkdirSync(out,{recursive:true});
  const data=await json(api('https://pt.wikipedia.org/w/api.php',{action:'query',prop:'pageimages|info',inprop:'url',pithumbsize:'640',titles:wikiArtists.map(a=>a[1]).join('|')}));
  const pages=Object.values(data.query.pages);
  const credits=await json(api('https://commons.wikimedia.org/w/api.php',{action:'query',prop:'imageinfo',iiprop:'extmetadata|url',titles:pages.map(p=>'File:'+p.pageimage).join('|')}));
  const creditPages=Object.values(credits.query.pages);
  const photos={};
  let cursor=0;
  const jobs=[...wikiArtists.map(([name,title])=>async()=>{
    const p=pages.find(p=>p.title===title);
    if(!p?.thumbnail)throw Error('No photograph for '+name);
    const credit=creditPages.find(c=>c.title.replace(/_/g,' ')==='File:'+p.pageimage.replace(/_/g,' '))?.imageinfo?.[0];
    if(!credit)throw Error('Missing attribution: '+name);
    const meta=credit.extmetadata;
    const imageUrl=p.thumbnail.source.split('?')[0];
    photos[name]={file:await save(name,imageUrl),source:credit.descriptionurl,author:plain(meta.Artist?.value),license:plain(meta.LicenseShortName?.value),licenseUrl:meta.LicenseUrl?.value||credit.descriptionurl,imageUrl};
    console.log('OK',name);
  }),...spotifyArtists.map(([name,id])=>async()=>{
    const source='https://open.spotify.com/artist/'+id;
    const embed=await json('https://open.spotify.com/oembed?url='+encodeURIComponent(source));
    if(!embed.thumbnail_url)throw Error('No profile photograph: '+name);
    photos[name]={file:await save(name,embed.thumbnail_url),source,author:'Imagem do perfil do artista no Spotify',license:'Foto de divulgação · direitos dos respectivos titulares',licenseUrl:source,imageUrl:embed.thumbnail_url};
    console.log('OK',name);
  })];
  await Promise.all(Array.from({length:4},async()=>{while(cursor<jobs.length)await jobs[cursor++]();}));
  const bandImage='https://cdn-academy.akamaized.net/sscdn/tb/652x652/palcomp3-discografia/b/7/6/8/3af158f156834b4db632066b094d5790.jpg';
  photos['Inimigos da HP']={file:await save('Inimigos da HP',bandImage,true),source:'https://www.palcomp3.com.br/inimigosdahp/',author:'Foto de divulgação no perfil da banda no Palco MP3',license:'Direitos dos respectivos titulares',licenseUrl:'https://www.palcomp3.com.br/inimigosdahp/',imageUrl:bandImage};
  photos['João Bosco & Gabriel']={file:'assets/artists/joao-bosco-gabriel-capa.jpg',source:'https://open.spotify.com/intl-pt/artist/21WAvVROZ83oUvJwFTG2dH',author:'Imagem do perfil da dupla no Spotify',license:'Foto de divulgação · direitos dos respectivos titulares',licenseUrl:'https://open.spotify.com/intl-pt/artist/21WAvVROZ83oUvJwFTG2dH'};
  fs.writeFileSync(path.join(root,'artist-photos.js'),'/* Catálogo gerado por scripts/prepare-artist-photos.cjs. Retratos de referência, não fotografias dos shows citados. */\nwindow.ARTIST_PHOTOS = '+JSON.stringify(photos,null,2)+';\n');
  console.log('Catálogo local:',Object.keys(photos).length,'artistas.');
})().catch(e=>{console.error(e);process.exitCode=1;});
