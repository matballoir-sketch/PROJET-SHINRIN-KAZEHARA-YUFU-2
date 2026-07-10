const intro = document.getElementById('intro');
const enterBtn = document.getElementById('enterBtn');
const musicToggle = document.getElementById('musicToggle');
const musicPlay = document.getElementById('musicPlay');
const yt = document.getElementById('youtubePlayer');
let musicOn = false;

function sendYT(command){
  yt.contentWindow?.postMessage(JSON.stringify({event:'command',func:command,args:[]}), '*');
}
function setMusic(on){
  musicOn = on;
  sendYT(on ? 'playVideo' : 'pauseVideo');
  musicToggle.textContent = on ? '♫' : '♪';
  musicPlay.textContent = on ? '❚❚' : '▶';
}
enterBtn.addEventListener('click',()=>{
  intro.classList.add('hidden');
  document.body.classList.remove('locked');
  setTimeout(()=>setMusic(true),450);
});
document.body.classList.add('locked');
musicToggle.addEventListener('click',()=>setMusic(!musicOn));
musicPlay.addEventListener('click',()=>setMusic(!musicOn));

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.chapter-panel');
tabs.forEach(tab=>tab.addEventListener('click',()=>{
  tabs.forEach(t=>t.classList.remove('active'));
  panels.forEach(p=>p.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById(tab.dataset.tab).classList.add('active');
}));

const menu = document.getElementById('mobileMenu');
const menuToggleBtn = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
function toggleMenu(open){menu.classList.toggle('open',open);menu.setAttribute('aria-hidden',String(!open));}
menuToggleBtn.addEventListener('click',()=>toggleMenu(true));
closeMenu.addEventListener('click',()=>toggleMenu(false));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));

const revealObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}})
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
document.querySelectorAll('.gallery-item').forEach(btn=>btn.addEventListener('click',()=>{
  lightboxImg.src = btn.dataset.src;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
}));
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');}
document.getElementById('lightboxClose').addEventListener('click',closeLightbox);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeLightbox();toggleMenu(false);}});

// Petals canvas
const canvas = document.getElementById('petalCanvas');
const ctx = canvas.getContext('2d');
let petals=[];
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);petals=createPetals();}
function createPetals(){return Array.from({length:Math.min(65,Math.floor(innerWidth/18))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,s:3+Math.random()*6,v:.25+Math.random()*.7,drift:-.45+Math.random()*.9,r:Math.random()*Math.PI,rv:-.025+Math.random()*.05,o:.12+Math.random()*.45}));}
function drawPetal(p){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.globalAlpha=p.o;ctx.fillStyle=Math.random()>.5?'#e7afd1':'#a87bc4';ctx.beginPath();ctx.moveTo(0,-p.s);ctx.bezierCurveTo(p.s,-p.s,p.s,p.s,0,p.s*1.5);ctx.bezierCurveTo(-p.s,p.s,-p.s,-p.s,0,-p.s);ctx.fill();ctx.restore();}
function animate(){ctx.clearRect(0,0,innerWidth,innerHeight);petals.forEach(p=>{p.y+=p.v;p.x+=p.drift+Math.sin(p.y*.008)*.25;p.r+=p.rv;if(p.y>innerHeight+20){p.y=-20;p.x=Math.random()*innerWidth}if(p.x<-20)p.x=innerWidth+20;if(p.x>innerWidth+20)p.x=-20;drawPetal(p)});requestAnimationFrame(animate)}
addEventListener('resize',resize);resize();animate();

// subtle hero parallax
const heroBg=document.querySelector('.hero-backdrop');
addEventListener('scroll',()=>{const y=Math.min(scrollY,innerHeight);heroBg.style.transform=`scale(1.03) translateY(${y*.08}px)`},{passive:true});
