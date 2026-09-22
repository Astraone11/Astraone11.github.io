const accountBase = 'https://nitrova-porsche.xboxsteam94.chatgpt.site';
const cars = [
  {slug:'911-gt3-rs',model:'911 GT3 RS',category:'Track',era:'911 HERITAGE',image:'911-gt3-rs-4k.webp',description:'Siluet 911 yang dibentuk untuk lintasan. Foto ini menampilkan generasi GT3 RS berwarna oranye dengan sayap besar dan detail motorsport.',account:'/cars/911-gt3-rs'},
  {slug:'mission-x',model:'Mission X',category:'Concept',era:'FUTURE CONCEPT',image:'mission-x-4k.webp',description:'Visi hypercar listrik Porsche, dengan proporsi rendah, kabin dramatis, dan garis bodi yang dibuat untuk mengejar performa.',account:'/cars/mission-x'},
  {slug:'911-carrera',model:'911 Carrera',category:'Sports',era:'911 ICON',image:'911-carrera-4k.webp',description:'Karakter 911 dalam bentuk yang sederhana dan ikonis. Warna biru muda memperjelas siluet dan detail fasianya.',account:'/cars/911-carrera'},
  {slug:'911-gt3-r',model:'911 GT3 R',category:'Track',era:'MOTORSPORT',image:'gt3-r-4k.webp',description:'Mobil balap GT3 R dengan livery khas lintasan, sayap belakang tinggi, dan aerodinamika yang menonjol.',account:'/cars'},
  {slug:'718-cayman',model:'718 Cayman',category:'Sports',era:'MID-ENGINE',image:'718-cayman-4k.webp',description:'Coupe bermesin tengah dengan tampilan ringkas dan proporsi yang mengutamakan kelincahan.',account:'/cars'},
  {slug:'911-carrera-gts',model:'911 Carrera GTS',category:'Sports',era:'GRAND TOURING',image:'carrera-gts-4k.webp',description:'Siluet Carrera berwarna merah dengan karakter GTS yang terlihat dari detail eksterior dan postur yang tegas.',account:'/cars'}
];
cars.forEach(car=>Object.assign(car,{brand:'Porsche',body:car.category==='Track'?'Race car':'Coupe',fuel:car.slug==='mission-x'?'Electric':'Petrol',badge:'Featured',tagline:car.era,power:null,topSpeed:null,accel:null,engine:'Lihat varian',transmission:'Lihat varian',drivetrain:'Lihat varian',gallery:[car.image]}));
cars.push(
  {slug:'agera-r-white',brand:'Koenigsegg',model:'Agera R · White',category:'Hypercar',body:'Coupe',fuel:'Petrol',badge:'Limited',era:'SWEDISH ENGINEERING',tagline:'Aerodinamika dalam balutan putih',image:'koenigsegg-agera-r-cutout.webp',gallery:['koenigsegg-agera-r-cutout.webp','koenigsegg-agera-r-front-cutout.webp'],power:1140,topSpeed:null,accel:null,engine:'5.0L twin-turbo V8',transmission:'7-speed dual clutch',drivetrain:'RWD',description:'Agera R berwarna putih dengan garis hitam dan merah. Foto kedua memperlihatkan bagian depan dan pintu yang terbuka.'},
  {slug:'agera-r-silver',brand:'Koenigsegg',model:'Agera R · Silver',category:'Hypercar',body:'Coupe',fuel:'Petrol',badge:'Performance',era:'AERO / DETAIL',tagline:'Agera R dari sudut depan',image:'koenigsegg-agera-r-front-cutout.webp',gallery:['koenigsegg-agera-r-front-cutout.webp','koenigsegg-agera-r-cutout.webp'],power:1140,topSpeed:null,accel:null,engine:'5.0L twin-turbo V8',transmission:'7-speed dual clutch',drivetrain:'RWD',description:'Perspektif depan Agera R berwarna terang dengan pintu diangkat. Satu karakter, sudut pandang baru.'},
  {slug:'agera-r-black',brand:'Koenigsegg',model:'Agera R · Black',category:'Hypercar',body:'Coupe',fuel:'Petrol',badge:'Limited',era:'DARK EDITION',tagline:'Siluet Agera dalam gelap',image:'koenigsegg-agera-r-black-cutout.webp',gallery:['koenigsegg-agera-r-black-cutout.webp'],power:1140,topSpeed:null,accel:null,engine:'5.0L twin-turbo V8',transmission:'7-speed dual clutch',drivetrain:'RWD',description:'Foto Koenigsegg hitam dalam studio. Detail karbon dan profil aerodinamis menjadi fokus visual.'},
  {slug:'koenigsegg-study',brand:'Koenigsegg',model:'Concept Study',category:'Concept',body:'Coupe',fuel:'Petrol',badge:'New',era:'FUTURE FORM',tagline:'Studi visual hypercar',image:'koenigsegg-concept-cutout.webp',gallery:['koenigsegg-concept-cutout.webp'],power:null,topSpeed:null,accel:null,engine:'Belum tersedia',transmission:'Belum tersedia',drivetrain:'Belum tersedia',description:'Studi desain yang terinspirasi Koenigsegg pada gambar referensi. Identitas model dan spesifikasinya belum terverifikasi.'},
  {slug:'bmw-m4',brand:'BMW',model:'M4 Competition',category:'Coupe',body:'Coupe',fuel:'Petrol',badge:'Performance',era:'M COUPE',tagline:'Coupe performa yang ekspresif',image:'bmw-m4-cutout.webp',gallery:['bmw-m4-cutout.webp'],power:510,topSpeed:250,accel:3.9,engine:'3.0L twin-turbo inline-six',transmission:'8-speed M Steptronic',drivetrain:'RWD',description:'BMW M4 Competition dalam warna hijau terang. Angka performa merujuk varian M4 Competition Coupé dan dapat berbeda menurut tahun serta pasar.'},
  {slug:'bmw-m5',brand:'BMW',model:'M5',category:'Sedan',body:'Sedan',fuel:'Petrol',badge:'Featured',era:'M SEDAN',tagline:'Sedan yang berjiwa lintasan',image:'bmw-m5-cutout.webp',gallery:['bmw-m5-cutout.webp'],power:null,topSpeed:null,accel:null,engine:'V8 twin-turbo',transmission:'M Steptronic',drivetrain:'M xDrive',description:'BMW M5 berwarna perak dalam suasana showroom. Spesifikasi khusus unit pada foto belum diverifikasi.'},
  {slug:'bmw-m6',brand:'BMW',model:'M6 Gran Coupé',category:'Coupe',body:'Coupe',fuel:'Petrol',badge:'Limited',era:'GRAND TOURING',tagline:'Garis panjang, tenaga besar',image:'bmw-m6.webp',gallery:['bmw-m6.webp'],power:null,topSpeed:null,accel:null,engine:'V8 twin-turbo',transmission:'Lihat varian',drivetrain:'RWD',description:'BMW M6 Gran Coupé menampilkan proporsi panjang dan siluet grand touring yang elegan.'},
  {slug:'bmw-i7',brand:'BMW',model:'i7 M70 xDrive',category:'Sedan',body:'Sedan',fuel:'Electric',badge:'New',era:'ELECTRIC M',tagline:'Performa listrik dalam kemewahan',image:'bmw-i7-cutout.webp',gallery:['bmw-i7-cutout.webp'],power:660,topSpeed:250,accel:3.7,engine:'Dual electric motors',transmission:'Single-speed',drivetrain:'AWD',description:'BMW i7 M70 xDrive memadukan tenaga listrik dan kenyamanan sedan mewah. Foto referensi menampilkan interpretasi visual model i7.'},
  {slug:'bmw-m6-gt3',brand:'BMW',model:'M6 GT3',category:'Race car',body:'Race car',fuel:'Petrol',badge:'Performance',era:'MOTORSPORT',tagline:'Dibangun untuk grid balap',image:'bmw-m6-gt3-cutout.webp',gallery:['bmw-m6-gt3-cutout.webp'],power:null,topSpeed:null,accel:null,engine:'V8 twin-turbo',transmission:'Racing sequential',drivetrain:'RWD',description:'BMW M6 GT3 dengan livery motorsport dan sayap aerodinamis, difoto di lintasan.'}
);
const $ = id => document.getElementById(id);
const image = car => `images/${car.image}`;
const safeText = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');

function card(car,index,featured=false){
  if(featured)return `<article class="feature-card reveal"><div class="feature-media"><span class="feature-number">0${index+1} / 03</span><img src="${image(car)}" alt="${safeText(car.brand+' '+car.model)}" loading="lazy"></div><div class="feature-info"><p>${safeText(car.era)}</p><h3>${safeText(car.model)}</h3><a href="#car/${car.slug}" aria-label="Lihat detail ${safeText(car.brand+' '+car.model)}">Lihat detail <span aria-hidden="true">↗</span></a></div></article>`;
  const specs=[[car.power,car.power+' HP'],[car.topSpeed,car.topSpeed+' km/h'],[car.accel,car.accel+' s']].filter(([value])=>value).map(([,label])=>`<span>${label}</span>`).join('');
  return `<article class="car-card reveal"><div class="car-media"><span class="car-badge">${safeText(car.badge)}</span><img src="${image(car)}" alt="${safeText(car.brand+' '+car.model)}" loading="lazy"></div><div class="car-info"><p>${safeText(car.brand)} / ${safeText(car.category)}</p><h3>${safeText(car.model)}</h3><span>${safeText(car.tagline)}</span>${specs?`<div class="card-specs">${specs}</div>`:''}<button type="button" data-detail="${car.slug}" aria-label="Lihat detail ${safeText(car.brand+' '+car.model)}">Lihat detail ↗</button></div></article>`;
}

function revealNew(){
  document.querySelectorAll('.reveal:not(.visible)').forEach(el=>observer.observe(el));
}
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}});
},{threshold:.08});

function renderCollection(){
  const query=$('search').value.trim().toLowerCase();
  const category=$('category').value,brand=$('brand').value,body=$('body').value,fuel=$('fuel').value,power=$('power').value,speed=$('speed').value;
  const sort=$('sort').value;
  const results=cars.filter(car=>(category==='all'||car.category===category)&&(brand==='all'||car.brand===brand)&&(body==='all'||car.body===body)&&(fuel==='all'||car.fuel===fuel)&&(power==='all'||car.power>=Number(power))&&(speed==='all'||car.topSpeed>=Number(speed))&&`${car.model} ${car.brand} ${car.era} ${car.category} ${car.body} ${car.fuel} ${car.tagline}`.toLowerCase().includes(query));
  if(sort==='name')results.sort((a,b)=>a.model.localeCompare(b.model));
  if(sort==='name-desc')results.sort((a,b)=>b.model.localeCompare(a.model));
  if(sort==='power')results.sort((a,b)=>(b.power||0)-(a.power||0));
  if(sort==='speed')results.sort((a,b)=>(b.topSpeed||0)-(a.topSpeed||0));
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
  $('studio-image').alt=`${car.brand} ${car.model}, tampak studio`;
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
  $('dialog-image').alt=`${car.brand} ${car.model}`;
  $('dialog-brand').textContent=`${car.brand.toUpperCase()} / COLLECTION`;
  $('dialog-category').textContent=car.category.toUpperCase();
  $('dialog-era').textContent=car.era;
  $('dialog-specs').innerHTML=[['Power',car.power&&car.power+' HP'],['Top Speed',car.topSpeed&&car.topSpeed+' km/h'],['0–100 km/h',car.accel&&car.accel+' s'],['Engine / Motor',car.engine&&!car.engine.startsWith('Belum')&&car.engine],['Transmission',car.transmission&&!car.transmission.startsWith('Belum')&&car.transmission],['Drivetrain',car.drivetrain&&!car.drivetrain.startsWith('Belum')&&car.drivetrain]].filter(([,value])=>value&&value!=='Lihat varian').map(([key,value])=>`<div><dt>${safeText(key)}</dt><dd>${safeText(String(value))}</dd></div>`).join('');
  $('dialog-gallery').innerHTML=car.gallery.map((src,index)=>`<button type="button" data-gallery="${src}" aria-label="Lihat foto ${index+1} ${safeText(car.model)}" aria-pressed="${index===0}"><img src="images/${src}" alt="" loading="lazy"></button>`).join('');
  $('dialog-account').href=accountBase+(car.account||'/login');
  $('dialog-account').innerHTML=car.account?'Buka favorit di situs akun <span aria-hidden="true">↗</span>':'Masuk ke situs akun <span aria-hidden="true">↗</span>';
  $('dialog-contact').href=`mailto:xboxsteam94@gmail.com?subject=${encodeURIComponent('NITROVA — '+car.brand+' '+car.model)}`;
  if(!dialog.open)dialog.showModal();
}
function closeDetail(){if(location.hash.startsWith('#car/'))location.hash='#cars';else if(dialog.open)dialog.close()}

$('featured-grid').innerHTML=cars.slice(0,3).map((car,index)=>card(car,index,true)).join('');
$('porsche-grid').innerHTML=cars.filter(car=>car.brand==='Porsche').map((car,index)=>card(car,index)).join('');
$('koenigsegg-grid').innerHTML=cars.filter(car=>car.brand==='Koenigsegg').map((car,index)=>card(car,index)).join('');
$('bmw-grid').innerHTML=cars.filter(car=>car.brand==='BMW').map((car,index)=>card(car,index)).join('');
$('arrivals-grid').innerHTML=cars.filter(car=>car.badge==='New').map((car,index)=>card(car,index)).join('');
$('garage-grid').innerHTML=['Porsche','Koenigsegg','BMW'].map(brand=>{const car=cars.find(item=>item.brand===brand);return `<a class="garage-card reveal" href="#car/${car.slug}"><img src="${image(car)}" alt="${safeText(car.brand+' '+car.model)}" loading="lazy"><span>${brand.toUpperCase()} / PERFORMANCE</span><strong>${safeText(car.model)}</strong><small>Eksplorasi detail ↗</small></a>`}).join('');
$('model-list').innerHTML=cars.map((car,index)=>`<button type="button" data-model="${index}" aria-pressed="${index===0}"><span>${String(index+1).padStart(2,'0')}</span>${safeText(car.model)}</button>`).join('');
$('filters').addEventListener('submit',event=>event.preventDefault());
['search','brand','category','body','power','speed','fuel','sort'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',renderCollection));
$('collection-grid').addEventListener('click',event=>{const button=event.target.closest('[data-detail]');if(button)location.hash=`#car/${button.dataset.detail}`});
['porsche-grid','koenigsegg-grid','bmw-grid','arrivals-grid'].forEach(id=>$(id).addEventListener('click',event=>{const button=event.target.closest('[data-detail]');if(button)location.hash=`#car/${button.dataset.detail}`}));
$('dialog-gallery').addEventListener('click',event=>{const button=event.target.closest('[data-gallery]');if(!button)return;$('dialog-image').src=`images/${button.dataset.gallery}`;$('dialog-gallery').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)))});
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

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const cameraShots=[
  {image:'mission-x-4k.webp',alt:'Porsche Mission X, tampak tiga perempat depan',title:'FRONT QUARTER'},
  {image:'mission-x-4k.webp',alt:'Detail lampu depan Porsche Mission X',title:'HEADLIGHTS'},
  {image:'911-gt3-rs-4k.webp',alt:'Detail roda Porsche 911 GT3 RS',title:'WHEELS'},
  {image:'gt3-r-4k.webp',alt:'Detail sayap belakang Porsche 911 GT3 R',title:'REAR WING'}
];

const cameraFrame=$('camera-frame'),cameraImage=$('camera-image');
let currentShot=0,shotTimer,shotTransition,manualShot=false;
function showShot(index,manual=false){
  if(index===currentShot&&manual)return;
  if(manual){manualShot=true;clearInterval(shotTimer)}
  currentShot=index;
  const shot=cameraShots[index];
  clearTimeout(shotTransition);
  cameraFrame.classList.add('changing');
  shotTransition=setTimeout(()=>{
    cameraFrame.dataset.shot=String(index);
    cameraImage.src=`images/${shot.image}`;
    cameraImage.alt=shot.alt;
    $('camera-frame-index').textContent=`0${index+1} / 04`;
    $('camera-frame-title').textContent=shot.title;
    $('camera-rail').querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
    requestAnimationFrame(()=>cameraFrame.classList.remove('changing'));
  },reducedMotion.matches?0:220);
}
$('camera-rail').addEventListener('click',event=>{const button=event.target.closest('[data-shot]');if(button)showShot(Number(button.dataset.shot),true)});
const cameraObserver=new IntersectionObserver(entries=>{
  const visible=entries.some(entry=>entry.isIntersecting);
  clearInterval(shotTimer);
  if(visible&&!manualShot&&!reducedMotion.matches)shotTimer=setInterval(()=>showShot((currentShot+1)%cameraShots.length),5200);
},{threshold:.2});
cameraObserver.observe($('gallery'));
