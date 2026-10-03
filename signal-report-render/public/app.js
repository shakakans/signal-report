const categories=['AI','Finance','Crypto','Politics','World'];
const names=['AI & TECHNOLOGY','FINANCE','BITCOIN & CRYPTO','POLITICS','WORLD NEWS'];
const el=id=>document.getElementById(id);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=s=>/^https?:\/\//.test(s)?escape(s):'#';
const age=d=>{const h=Math.max(0,(Date.now()-Date.parse(d))/3600000);return h<1?Math.floor(h*60)+'m ago':h<24?Math.floor(h)+'h ago':Math.floor(h/24)+'d ago';};
const link=(s,cls='')=>`<a class="${cls}" href="${url(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.title)}</a>`;
const photo=(s,lead=false)=>s.image?`<figure class="${lead?'lead-photo':'story-photo'}"><a href="${url(s.url)}" target="_blank" rel="noopener noreferrer"><img src="${url(s.image)}" alt="${escape(s.title)}" loading="${lead?'eager':'lazy'}"></a><figcaption>${escape(s.imageSource||s.source)}</figcaption></figure>`:'';
const related=s=>s.related.length?`<details><summary>More coverage</summary>${s.related.slice(0,3).map(r=>`<a class="related" href="${url(r.url)}" target="_blank" rel="noopener noreferrer">${escape(r.title)}<span>${escape(r.source)}</span></a>`).join('')}</details>`:'';
const story=(s,p)=>`<article class="story">${p?photo(s):''}${link(s,'headline')}<div class="meta">${escape(s.source)} · ${age(s.published)}${s.sources.length>1?`<b> · ▲ ${s.sources.length} SOURCES</b>`:''}</div>${related(s)}</article>`;
let data=null,busy=false,pendingEdition=null;
document.querySelector('main').dataset.theme='dark';

function render(){
 const lead=data?.stories[0];
 el('columns').innerHTML=categories.map((c,i)=>{const all=data?.stories.filter(s=>s.category===c&&s.url!==lead?.url)||[];const rows=all.slice(0,25);const photos=rows.filter(s=>s.image).slice(0,2).map(s=>s.url);return `<section id="${c.toLowerCase()}" class="column"><h2 class="section-heading">${names[i]}</h2>${rows.map(s=>story(s,photos.includes(s.url))).join('')||`<p class="empty">${data?'No recent headlines in this section.':'Awaiting headlines…'}</p>`}</section>`;}).join('');
 if(!data)return;
 el('status').textContent=`Updated ${new Intl.DateTimeFormat('en-NZ',{hour:'numeric',minute:'2-digit',timeZone:'Pacific/Auckland'}).format(new Date(data.updated))} NZ · ${data.available}/${data.total} feeds available · Refreshes every 5 minutes`;
 el('failed').textContent=data.failed.length?'Unavailable this refresh: '+data.failed.join(', '):'All 22 feeds responded on the last check.';
 if(lead)el('lead').innerHTML=`<section class="lead"><div class="hero-grid">${photo(lead,true)}<div class="hero-copy">${link(lead,'lead-title')}<div class="lead-meta">${escape(lead.source)} · ${lead.category} · ${age(lead.published)}${lead.sources.length>1?` · ${lead.sources.length} SOURCES ON THIS STORY`:''}</div>${lead.related.length?`<ul class="lead-related">${lead.related.slice(0,3).map(s=>`<li>${link(s)} <span class="meta">${escape(s.source)}</span></li>`).join('')}</ul>`:''}</div></div></section>`;
 else el('lead').innerHTML='<section class="loading"><h2>The wires are quiet.</h2><p>No recent headlines available. Refresh to try again.</p></section>';
 document.querySelectorAll('img').forEach(img=>img.onerror=()=>{img.closest('figure').hidden=true;});
}
async function refresh(manual=false){if(busy)return;busy=true;el('refresh').disabled=true;el('refresh').textContent='Refreshing…';try{const r=await fetch('/api/news',{signal:AbortSignal.timeout(25000)});if(!r.ok)throw new Error();const next=await r.json();if(!manual&&data&&JSON.stringify(next.stories.map(s=>s.url))!==JSON.stringify(data.stories.map(s=>s.url))){pendingEdition=next;el('edition-notice').hidden=false;return;}if(!manual&&data&&JSON.stringify(next.stories.map(s=>s.url))===JSON.stringify(data.stories.map(s=>s.url)))return;data=next;pendingEdition=null;el('edition-notice').hidden=true;el('notice').hidden=!data.stale;el('notice').textContent=data.stale?'Sources are unavailable. Showing the previous edition.':'';render();}catch{el('notice').hidden=false;el('notice').textContent='Could not refresh the wires. Retry shortly.'+(data?' Previous headlines remain below.':'');}finally{busy=false;el('refresh').disabled=false;el('refresh').textContent='Refresh';}}
el('refresh').onclick=()=>refresh(true);el('apply-edition').onclick=()=>{if(pendingEdition){data=pendingEdition;pendingEdition=null;el('edition-notice').hidden=true;render();}};render();refresh();setInterval(()=>refresh(),300000);
