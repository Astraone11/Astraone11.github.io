const accountBase = 'https://nitrova-porsche.xboxsteam94.chatgpt.site';
const cars = [
  {slug:'911-gt3-rs',model:'911 GT3 RS',category:'Track',era:'911 HERITAGE',image:'911-gt3-rs-4k.webp',description:'Siluet 911 yang dibentuk untuk lintasan. Foto ini menampilkan generasi GT3 RS berwarna oranye dengan sayap besar dan detail motorsport.',account:'/cars/911-gt3-rs'},
  {slug:'mission-x',model:'Mission X',category:'Concept',era:'FUTURE CONCEPT',image:'mission-x-4k.webp',description:'Visi hypercar listrik Porsche, dengan proporsi rendah, kabin dramatis, dan garis bodi yang dibuat untuk mengejar performa.',account:'/cars/mission-x'},
  {slug:'911-carrera',model:'911 Carrera',category:'Sports',era:'911 ICON',image:'911-carrera-4k.webp',description:'Karakter 911 dalam bentuk yang sederhana dan ikonis. Warna biru muda memperjelas siluet dan detail fasianya.',account:'/cars/911-carrera'},
  {slug:'911-gt3-r',model:'911 GT3 R',category:'Track',era:'MOTORSPORT',image:'gt3-r-4k.webp',description:'Mobil balap GT3 R dengan livery khas lintasan, sayap belakang tinggi, dan aerodinamika yang menonjol.',account:'/cars'},
  {slug:'718-cayman',model:'718 Cayman',category:'Sports',era:'MID-ENGINE',image:'718-cayman-4k.webp',description:'Coupe bermesin tengah dengan tampilan ringkas dan proporsi yang mengutamakan kelincahan.',account:'/cars'},
  {slug:'911-carrera-gts',model:'911 Carrera GTS',category:'Sports',era:'GRAND TOURING',image:'carrera-gts-4k.webp',description:'Siluet Carrera berwarna merah dengan karakter GTS yang terlihat dari detail eksterior dan postur yang tegas.',account:'/cars'}
];
const $ = id => document.getElementById(id);
const image = car => `images/${car.image}`;
const safeText = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');

function card(car,index,featured=false){
  if(featured)return `<article class="feature-card reveal"><div class="feature-media"><span class="feature-number">0${index+1} / 03</span><img src="${image(car)}" alt="Porsche ${safeText(car.model)}" loading="lazy"></div><div class="feature-info"><p>${safeText(car.era)}</p><h3>${safeText(car.model)}</h3><a href="#car/${car.slug}" aria-label="Lihat detail Porsche ${safeText(car.model)}">Lihat detail <span aria-hidden="true">↗</span></a></div></article>`;
  return `<article class="car-card reveal"><div class="car-media"><img src="${image(car)}" alt="Porsche ${safeText(car.model)}" loading="lazy"></div><div class="car-info"><p>${safeText(car.category)}</p><h3>${safeText(car.model)}</h3><span>${safeText(car.era)}</span><button type="button" data-detail="${car.slug}" aria-label="Lihat detail Porsche ${safeText(car.model)}">Lihat detail ↗</button></div></article>`;
}

function revealNew(){
  document.querySelectorAll('.reveal:not(.visible)').forEach(el=>observer.observe(el));
}
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}});
},{threshold:.08});

function renderCollection(){
  const query=$('search').value.trim().toLowerCase();
  const category=$('category').value;
  const sort=$('sort').value;
  const results=cars.filter(car=>(category==='all'||car.category===category)&&`${car.model} ${car.era} ${car.category}`.toLowerCase().includes(query));
  if(sort==='name')results.sort((a,b)=>a.model.localeCompare(b.model));
  if(sort==='name-desc')results.sort((a,b)=>b.model.localeCompare(a.model));
  $('result-count').textContent=`${results.length} model`;
  $('collection-grid').innerHTML=results.length?results.map((car,index)=>card(car,index)).join(''):'<p class="empty-results">Tidak ada model yang cocok. Coba kata kunci atau kategori lain.</p>';
  revealNew();
}

let active=0,zoom=1,panX=0,panY=0,auto=true,autoTimer;
const stage=$('studio-stage');
function applyStudioTransform(){
  stage.style.setProperty('--zoom',zoom);
  stage.style.setProperty('--pan-x',`${panX}px`);
  stage.style.setProperty('--pan-y',`${panY}px`);
  $('zoom-level').textContent=`${Math.round(zoom*100)}%`;
}
function selectCar(index,manual=false){
  active=index;
  const car=cars[index];
  $('studio-image').src=image(car);
  $('studio-image').alt=`Porsche ${car.model}, tampak studio`;
  $('studio-index').textContent=`${String(index+1).padStart(2,'0')} / ${String(cars.length).padStart(2,'0')}`;
  $('studio-category').textContent=car.era;
  $('studio-name').textContent=car.model;
  $('studio-detail').href=`#car/${car.slug}`;
  zoom=1;panX=0;panY=0;applyStudioTransform();
  document.querySelectorAll('#model-list button').forEach((button,i)=>{
    button.classList.toggle('active',i===index);
    button.setAttribute('aria-pressed',String(i===index));
  });
  if(manual)setAuto(false);
}
function setAuto(value){
  auto=value;
  clearInterval(autoTimer);
  stage.classList.toggle('paused',!auto);
  $('auto-motion').textContent=auto?'Jeda animasi':'Lanjut animasi';
  $('auto-motion').setAttribute('aria-pressed',String(auto));
  if(auto&&!matchMedia('(prefers-reduced-motion: reduce)').matches){autoTimer=setInterval(()=>selectCar((active+1)%cars.length),6500)}
}

const dialog=$('car-dialog');
function syncRoute(){
  const match=location.hash.match(/^#car\/([a-z0-9-]+)$/);
  const car=match&&cars.find(item=>item.slug===match[1]);
  if(!car){if(dialog.open)dialog.close();return}
  $('dialog-title').textContent=car.model;
  $('dialog-desc').textContent=car.description;
  $('dialog-image').src=image(car);
  $('dialog-image').alt=`Porsche ${car.model}`;
  $('dialog-category').textContent=car.category.toUpperCase();
  $('dialog-era').textContent=car.era;
  $('dialog-account').href=accountBase+car.account;
  $('dialog-account').innerHTML=car.account.startsWith('/cars/')?'Buka favorit di situs akun <span aria-hidden="true">↗</span>':'Buka koleksi di situs akun <span aria-hidden="true">↗</span>';
  if(!dialog.open)dialog.showModal();
}
function closeDetail(){if(location.hash.startsWith('#car/'))location.hash='#cars';else if(dialog.open)dialog.close()}

$('featured-grid').innerHTML=cars.slice(0,3).map((car,index)=>card(car,index,true)).join('');
$('model-list').innerHTML=cars.map((car,index)=>`<button type="button" data-model="${index}" aria-pressed="${index===0}"><span>${String(index+1).padStart(2,'0')}</span>${safeText(car.model)}</button>`).join('');
$('filters').addEventListener('submit',event=>event.preventDefault());
['search','category','sort'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',renderCollection));
$('collection-grid').addEventListener('click',event=>{const button=event.target.closest('[data-detail]');if(button)location.hash=`#car/${button.dataset.detail}`});
$('model-list').addEventListener('click',event=>{const button=event.target.closest('[data-model]');if(button)selectCar(Number(button.dataset.model),true)});
$('zoom-in').addEventListener('click',()=>{zoom=Math.min(1.65,Math.round((zoom+.1)*100)/100);applyStudioTransform()});
$('zoom-out').addEventListener('click',()=>{zoom=Math.max(.8,Math.round((zoom-.1)*100)/100);applyStudioTransform()});
$('reset-view').addEventListener('click',()=>{zoom=1;panX=panY=0;applyStudioTransform()});
$('auto-motion').addEventListener('click',()=>setAuto(!auto));
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await stage.requestFullscreen()}catch{$('fullscreen').textContent='Layar penuh tidak didukung'}});
document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'Keluar layar penuh':'Layar penuh'});
let drag;
stage.addEventListener('pointerdown',event=>{if(event.button!==0)return;drag={x:event.clientX,y:event.clientY,panX,panY};stage.classList.add('dragging');stage.setPointerCapture(event.pointerId)});
stage.addEventListener('pointermove',event=>{if(!drag)return;panX=Math.max(-150,Math.min(150,drag.panX+event.clientX-drag.x));panY=Math.max(-100,Math.min(100,drag.panY+event.clientY-drag.y));applyStudioTransform()});
function stopDrag(){drag=null;stage.classList.remove('dragging')}
stage.addEventListener('pointerup',stopDrag);stage.addEventListener('pointercancel',stopDrag);
stage.addEventListener('keydown',event=>{const d=event.key.startsWith('Arrow')?event.key:'';if(!d)return;event.preventDefault();panX=Math.max(-150,Math.min(150,panX+(d==='ArrowRight'?15:d==='ArrowLeft'?-15:0)));panY=Math.max(-100,Math.min(100,panY+(d==='ArrowDown'?15:d==='ArrowUp'?-15:0)));applyStudioTransform()});
window.addEventListener('hashchange',syncRoute);
$('dialog-close').addEventListener('click',closeDetail);
$('dialog-back').addEventListener('click',closeDetail);
dialog.addEventListener('close',()=>{if(location.hash.startsWith('#car/'))location.hash='#cars'});
const menu=document.querySelector('.menu-toggle');
menu.addEventListener('click',()=>{const opened=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(opened));$('main-nav').classList.toggle('open',opened)});
$('main-nav').addEventListener('click',event=>{if(event.target.closest('a')){menu.setAttribute('aria-expanded','false');$('main-nav').classList.remove('open')}});
$('year').textContent=new Date().getFullYear();
renderCollection();revealNew();setAuto(!matchMedia('(prefers-reduced-motion: reduce)').matches);syncRoute();
