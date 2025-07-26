//── DARK MODE WITH MEMORY ─────────────────────────────────────────
const darkToggle = document.getElementById('darkToggle');
if (localStorage.getItem('dark') === 'true') document.body.classList.add('dark');
darkToggle.onclick = () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('dark', document.body.classList.contains('dark'));
};

//── LANGUAGE SWITCH (dir rtl for Arabic) ─────────────────────────
const langSwitch = document.getElementById('langSwitch');
langSwitch.onchange = () => {
  document.documentElement.lang = langSwitch.value;
  document.documentElement.dir = (langSwitch.value === 'ar') ? 'rtl' : 'ltr';
};

//── BACK TO TOP ───────────────────────────────────────────────────
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.style.display = window.scrollY > 400 ? 'block' : 'none';
});
backToTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

//── SEARCH FILTER ────────────────────────────────────────────────
const searchInput = document.getElementById('search');
const clearBtn    = document.getElementById('clearSearch');
[searchInput, clearBtn].forEach(el => el.style.userSelect = 'none');

clearBtn.onclick = () => {
  searchInput.value = '';
  filterBooks('');
};
searchInput.oninput = () => filterBooks(searchInput.value.trim().toLowerCase());

function filterBooks(query) {
  document.querySelectorAll('.card').forEach(card => {
    const text = card.dataset.title.toLowerCase();
    card.style.display = text.includes(query) ? '' : 'none';
  });
}

//── PRAYER TIMES + HIJRI ─────────────────────────────────────────
const prayerTimes = [
  {name:'Fajr', time:'04:45 AM'},
  {name:'Dhuhr',time:'12:15 PM'},
  {name:'Asr',  time:'03:45 PM'},
  {name:'Maghrib',time:'06:30 PM'},
  {name:'Isha', time:'08:00 PM'}
];
const prayerList = document.getElementById('prayerList');
prayerTimes.forEach(p=> {
  let li = document.createElement('li');
  li.textContent = `${p.name}: ${p.time}`;
  prayerList.appendChild(li);
});
document.getElementById('hijriDate').textContent = '12 Dhu al-Hijjah 1446';

//── FEATURED BOOKS WITH REFRESH ─────────────────────────────────
const allFeatured = [
  {cover:'covers/quran_management.jpg', title:'Quran & Management',    file:'quran_management.pdf',    desc:'Strategies from the Quran for modern management.'},
  {cover:'covers/tafsir_insights.jpg',   title:'Tafsir Insights',      file:'tafsir_insights.pdf',     desc:'Deep exegesis of key surahs.'},
  {cover:'covers/islamic_history.jpg',   title:'Islamic History',      file:'islamic_history.pdf',     desc:'Chronicles from the Prophetic era to today.'},
  {cover:'covers/fiqh_simplified.jpg',   title:'Fiqh Simplified',       file:'fiqh_simplified.pdf',      desc:'Easy guide to everyday fiqh rulings.'},
  {cover:'covers/spiritual_practices.jpg', title:'Spiritual Practices', file:'spiritual_practices.pdf', desc:'Daily routines for heart purification.'},
  {cover:'covers/prophetic_character.jpg', title:'Prophetic Character', file:'prophetic_character.pdf', desc:'Lessons from the Prophet’s manners.'}
];
const featuredGrid   = document.getElementById('featuredGrid');
document.getElementById('refreshFeatured').onclick = () => renderFeatured();
function renderFeatured(n = 4) {
  featuredGrid.innerHTML = '';
  allFeatured
    .sort(() => Math.random() - .5)
    .slice(0,n)
    .forEach(b => createCard(b, featuredGrid));
}
renderFeatured();

//── LATEST UPLOADS WITH BATCHING ────────────────────────────────
const latestUploads = [
  {cover:'uploads/book1.jpg',title:'New Tafsir Release',file:'new_tafsir.pdf',desc:'Latest commentary on Makki verses.'},
  {cover:'uploads/book2.jpg',title:'Modern Fiqh Guide', file:'modern_fiqh.pdf', desc:'Fiqh rulings for 21st century.'},
  {cover:'uploads/book3.jpg',title:'Islamic Finance',  file:'islamic_finance.pdf',desc:'Principles of Shariah-compliant finance.'},
  {cover:'uploads/book4.jpg',title:'Sufi Insights',    file:'sufi_insights.pdf',   desc:'Inner dimensions of worship.'},
  {cover:'uploads/book5.jpg',title:'Arabic Grammar',   file:'arabic_grammar.pdf',  desc:'Key rules for classical Arabic.'},
  {cover:'uploads/book6.jpg',title:'Ethics in Islam',  file:'ethics.pdf',          desc:'Moral conduct from Qur’an & Sunnah.'}
];
let latestIndex = 0, perBatch = 4;
const latestGrid   = document.getElementById('latestGrid');
const showMoreBtn  = document.getElementById('showMoreLatest');
showMoreBtn.onclick = loadLatest;
function loadLatest() {
  latestUploads.slice(latestIndex, latestIndex+perBatch)
    .forEach(b => createCard(b, latestGrid));
  latestIndex += perBatch;
  if (latestIndex >= latestUploads.length) showMoreBtn.style.display = 'none';
}
loadLatest();

//── CARD CREATION & DOWNLOAD COUNT ─────────────────────────────
function getCount(key){ return +localStorage.getItem(key) || 0; }
function incCount(key){ localStorage.setItem(key, getCount(key)+1); }
function createCard(book, container) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.title = book.title;
  card.dataset.desc  = book.desc;
  card.innerHTML = `
    <img loading="lazy" src="${book.cover}" alt="${book.title}" />
    <h3>${book.title}</h3>
    <a href="pdfs/${book.file}" class="btn" download>${book.desc}</a>
    <div class="count">Downloaded: <span>${getCount(book.file)}</span></div>
  `;
  // download counter
  card.querySelector('a.btn').onclick = () => {
    incCount(book.file);
    card.querySelector('.count span').textContent = getCount(book.file);
  };
  container.appendChild(card);
  observer.observe(card);
}

//── LAZY-LOAD FADE-IN WITH INTERSECTION OBSERVER ──────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: .1 });

//── SMOOTH SCROLL FOR ANCHORS ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.onclick = e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))
      .scrollIntoView({ behavior:'smooth' });
  };
});
