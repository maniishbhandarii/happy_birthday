const content = birthdayContent;
const nameNodes = document.querySelectorAll('[data-name]');
const noteNameNode = document.querySelector('[data-note-name]');
const ageNodes = document.querySelectorAll('[data-age]');
const messageNode = document.querySelector('[data-message]');
const signoffNode = document.querySelector('[data-signoff]');

nameNodes.forEach((node) => { node.textContent = content.name; });
noteNameNode.textContent = content.noteName;
ageNodes.forEach((node) => { node.textContent = String(content.age).slice(-1); });
messageNode.textContent = content.message;
signoffNode.textContent = content.signoff;

document.querySelector('.hero').classList.add('is-ready');

const progressBar = document.querySelector('.scroll-progress span');
const hero = document.querySelector('.hero');
const doodles = document.querySelectorAll('.doodle');
let scrollFrame;
function updateScrollAnimation() {
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? window.scrollY / scrollRange : 0;
  progressBar.style.transform = `scaleX(${progress})`;
  const heroProgress = Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1);
  doodles.forEach((doodle, index) => {
    doodle.style.setProperty('--scroll-shift', `${heroProgress * (index ? -18 : 24)}px`);
  });
  scrollFrame = undefined;
}
window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollAnimation);
}, { passive: true });
updateScrollAnimation();

const photos = [
  ['1.jpg', 'where the light finds you'],
  ['2.jpg', 'a little wild, a lot lovely'],
  ['3.jpg', 'golden hour feels like you'],
  ['4.jpg', 'more blue skies ahead'],
  ['5.jpg', 'new heights, new dreams'],
  ['6.jpg', 'soft days are coming'],
  ['7.jpg', 'the whole sky is cheering']
];

const gallery = document.getElementById('photo-gallery');
photos.forEach(([file, caption], index) => {
  const figure = document.createElement('figure');
  figure.className = `photo-card photo-${index + 1}`;
  figure.innerHTML = `<span class="washi" aria-hidden="true"></span><img src="images/${file}" alt="${caption}" loading="lazy"><figcaption>${caption}</figcaption><span class="photo-number">0${index + 1}</span>`;
  gallery.appendChild(figure);
});

const audio = document.getElementById('birthday-audio');
const musicToggle = document.getElementById('music-toggle');
const musicLabel = document.getElementById('music-label');
let graffitiAudioContext;
function playGraffitiSound() {
  graffitiAudioContext ||= new AudioContext();
  const context = graffitiAudioContext;
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(220, now);
  oscillator.frequency.exponentialRampToValueAtTime(620, now + 0.08);
  oscillator.frequency.exponentialRampToValueAtTime(110, now + 0.22);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.25);
}
function toggleMusic() {
  if (audio.paused) {
    audio.play().then(() => {
      musicToggle.setAttribute('aria-pressed', 'true');
      musicLabel.textContent = 'music on';
    }).catch(() => { musicLabel.textContent = 'tap again'; });
  } else {
    audio.pause();
    musicToggle.setAttribute('aria-pressed', 'false');
    musicLabel.textContent = 'music off';
  }
}
musicToggle.addEventListener('click', toggleMusic);
document.getElementById('open-card').addEventListener('click', () => {
  document.getElementById('letter').scrollIntoView({ behavior: 'smooth' });
  if (audio.paused) toggleMusic();
});

document.getElementById('wish-button').addEventListener('click', (event) => {
  event.currentTarget.classList.add('is-lit');
  document.querySelector('.wish-section').classList.add('celebrating');
  playGraffitiSound();
  const graffitiBurst = document.getElementById('graffiti-burst');
  graffitiBurst.replaceChildren();
  ['✦', '♡', '✧', '★', '〰', '✦', '♡', '✧', '★', '〰', '✦', '♡'].forEach((mark, index) => {
    const graffitiMark = document.createElement('span');
    graffitiMark.className = `graffiti-mark graffiti-mark-${index + 1}`;
    graffitiMark.textContent = mark;
    graffitiBurst.appendChild(graffitiMark);
  });
  graffitiBurst.classList.remove('is-active');
  requestAnimationFrame(() => graffitiBurst.classList.add('is-active'));
  document.getElementById('final-line').textContent = 'May this year be as beautiful as you are.';
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
}, { threshold: 0.16 });
document.querySelectorAll('.reveal').forEach((section) => observer.observe(section));
