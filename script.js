//───────────────────────────────────────────────────────────────
// A) DARK MODE MEMORY
//───────────────────────────────────────────────────────────────
const darkToggle = document.getElementById('darkToggle');
if (localStorage.getItem('dark') === 'true') {
  document.body.classList.add('dark');
}
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('dark', document.body.classList.contains('dark'));
});

//───────────────────────────────────────────────────────────────
// B) LANGUAGE SWITCH & DIRECTION
//───────────────────────────────────────────────────────────────
const langSwitch = document.getElementById('langSwitch');
langSwitch.addEventListener('change', () => {
  document.documentElement.lang = langSwitch.value;
  document.documentElement.dir  = langSwitch.value === 'ar' ? 'rtl' : 'ltr';
});

//───────────────────────────────────────────────────────────────
// C) BACK TO TOP BUTTON
//───────────────────────────────────────────────────────────────
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.style.display = window.scrollY > 400 ? 'block' : 'none';
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

//───────────────────────────────────────────────────────────────
// D) SEARCH FILTER
//───────────────────────────────────────────────────────────────
const searchInput = document.getElementById('search');
const clearBtn    = document.getElementById('clearSearch');
clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  filterBooks('');
});
searchInput.addEventListener('input', () => {
  filterBooks(searchInput.value.trim().toLowerCase());
});
function filterBooks(q) {
  document.querySelectorAll('.card').forEach(card => {
    card.style.display = card.dataset.title.toLowerCase().includes(q) ? '' : 'none';
  });
}

//───────────────────────────────────────────────────────────────
// E) FEATURED BOOKS WITH REFRESH
//───────────────────────────────────────────────────────────────
const allFeatured = [
  { cover:'covers/quran_management.jpg', title:'Quran & Management', file:'quran_management.pdf', desc:'Management lessons from the Quran.' },
  { cover:'covers/tafsir_insights.jpg',   title:'Tafsir Insights',     file:'tafsir_insights.pdf',   desc:'Deep exegesis of key verses.' },
  { cover:'covers/islamic_history.jpg',   title:'Islamic History',     file:'islamic_history.pdf',   desc:'From the Prophet’s era onward.' },
  { cover:'covers/fiqh_simplified.jpg',   title:'Fiqh Simplified',      file:'fiqh_simplified.pdf',   desc:'Everyday rulings made easy.' },
  { cover:'covers/spiritual_practices.jpg', title:'Spiritual Practices',file:'spiritual_practices.pdf', desc:'Daily routines for heart.' },
  { cover:'covers/prophetic_character.jpg', title:'Prophetic Character',file:'prophetic_character.pdf', desc:'Manners of the Prophet.' }
];
const featuredGrid = document.getElementById('featuredGrid');
document.getElementById('refreshFeatured').addEventListener('click', () => {
  renderFeatured();
});
function renderFeatured(count = 4) {
  featuredGrid.innerHTML = '';
  allFeatured
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .forEach(book => createCard(book, featuredGrid));
}
renderFeatured();

//───────────────────────────────────────────────────────────────
// F) LATEST UPLOADS WITH BATCHING
//───────────────────────────────────────────────────────────────
const latestUploads = [
  { cover:'uploads/book1.jpg', title:'New Tafsir Release', file:'new_tafsir.pdf', desc:'Makki verses commentary.' },
  { cover:'uploads/book2.jpg', title:'Modern Fiqh Guide',  file:'modern_fiqh.pdf', desc:'Fiqh for today’s challenges.' },
  { cover:'uploads/book3.jpg', title:'Islamic Finance',    file:'islamic_finance.pdf', desc:'Shariah‐compliant principles.' },
  { cover:'uploads/book4.jpg', title:'Sufi Insights',      file:'sufi_insights.pdf', desc:'Inner dimensions of worship.' },
  { cover:'uploads/book5.jpg', title:'Arabic Grammar',     file:'arabic_grammar.pdf', desc:'Classical Arabic rules.' },
  { cover:'uploads/book6.jpg', title:'Ethics in Islam',    file:'ethics.pdf', desc:'Moral conduct in Islam.' }
];
let latestIndex = 0, perBatch = 4;
const latestGrid  = document.getElementById('latestGrid');
const showMoreBtn = document.getElementById('showMoreLatest');
showMoreBtn.addEventListener('click', loadLatest);
function loadLatest() {
  latestUploads
    .slice(latestIndex, latestIndex + perBatch)
    .forEach(book => createCard(book, latestGrid));
  latestIndex += perBatch;
  if (latestIndex >= latestUploads.length) {
    showMoreBtn.style.display = 'none';
  }
}
loadLatest();

//───────────────────────────────────────────────────────────────
// G) CARD CREATION & DOWNLOAD COUNTER
//───────────────────────────────────────────────────────────────
function getCount(key) {
  return +localStorage.getItem(key) || 0;
}
function incCount(key) {
  localStorage.setItem(key, getCount(key) + 1);
}
function createCard(book, container) {
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('data-title', book.title);
  card.setAttribute('data-desc', book.desc);
  card.innerHTML = `
    <img loading="lazy" src="${book.cover}" alt="${book.title}"/>
    <h3>${book.title}</h3>
    <a href="pdfs/${book.file}" class="btn" download>Download PDF</a>
    <div class="count">Downloaded: <span>${getCount(book.file)}</span></div>
  `;
  card.querySelector('a.btn').addEventListener('click', () => {
    incCount(book.file);
    card.querySelector('.count span').textContent = getCount(book.file);
  });
  container.appendChild(card);
  observer.observe(card);
}

//───────────────────────────────────────────────────────────────
// H) ON-SCROLL FADE-IN
//───────────────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

//───────────────────────────────────────────────────────────────
// I) SMOOTH SCROLL FOR INTERNAL LINKS
//───────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(anchor.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});

//───────────────────────────────────────────────────────────────
// J) GEOLOCATION → PRAYER, HIJRI & QIBLA VIA ALADHAN
//───────────────────────────────────────────────────────────────
const prayerList  = document.getElementById('prayerList');
const hijriDate   = document.getElementById('hijriDate');
const compass     = document.getElementById('compass');
const calcMethod  = document.getElementById('calcMethod');

navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, {
  enableHighAccuracy: true, timeout: 10000, maximumAge: 0
});
function onGeoSuccess({ coords: { latitude: lat, longitude: lng } }) {
  loadPrayerHijri(lat, lng);
  loadQibla(lat, lng);
}
function onGeoError(err) {
  console.warn('Geolocation failed:', err.message);
  loadPrayerHijri(21.422487, 39.826206);
  loadQibla(21.422487, 39.826206);
}
calcMethod.addEventListener('change', () => {
  navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
});
function loadPrayerHijri(lat, lng) {
  fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=${calcMethod.value}`)
    .then(r => r.json()).then(json => {
      const t = json.data.timings, h = json.data.date.hijri;
      prayerList.innerHTML = '';
      ['Fajr','Dhuhr','Asr','Maghrib','Isha'].forEach(name => {
        const li = document.createElement('li');
        li.textContent = `${name}: ${t[name]}`;
        prayerList.appendChild(li);
      });
      hijriDate.textContent = `${h.day} ${h.month.en} ${h.year}`;
    })
    .catch(e => console.error('Aladhan error:', e));
}
function loadQibla(lat, lng) {
  fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lng}`)
    .then(r => r.json()).then(json => {
      compass.textContent = `${json.data.direction.toFixed(1)}° from North`;
    })
    .catch(e => console.error('Qibla API error:', e));
}

//───────────────────────────────────────────────────────────────
// K) DATE CONVERTER
//───────────────────────────────────────────────────────────────
const gregInput  = document.getElementById('greg');
const convertBtn = document.getElementById('convertBtn');
const converted  = document.getElementById('converted');
convertBtn.addEventListener('click', () => {
  const d = new Date(gregInput.value);
  if (isNaN(d)) return converted.textContent = 'Invalid date';
  converted.textContent = new Intl.DateTimeFormat('en-u-ca-islamic', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(d);
});

//───────────────────────────────────────────────────────────────
// L) STRIPE CHECKOUT FOR CARD DONATIONS
//───────────────────────────────────────────────────────────────
const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY');
document.getElementById('stripeBtn').addEventListener('click', () => {
  fetch('/create-stripe-session', { method: 'POST' })
    .then(r => r.json())
    .then(data => stripe.redirectToCheckout({ sessionId: data.sessionId }))
    .catch(e => console.error('Stripe error:', e));
});

//───────────────────────────────────────────────────────────────
// M) FEEDBACK MODAL HANDLING
//───────────────────────────────────────────────────────────────
const feedbackBtn   = document.getElementById('feedbackBtn');
const feedbackModal = document.getElementById('feedbackModal');
const closeBtn      = feedbackModal.querySelector('.close-btn');
const feedbackForm  = document.getElementById('feedbackForm');
const thankYouEl    = document.getElementById('fbThanks');

feedbackBtn.addEventListener('click', () => {
  feedbackModal.style.display = 'flex';
});
closeBtn.addEventListener('click', () => {
  feedbackModal.style.display = 'none';
});
window.addEventListener('click', e => {
  if (e.target === feedbackModal) feedbackModal.style.display = 'none';
});
feedbackForm.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    name:  feedbackForm.fbName.value.trim(),
    email: feedbackForm.fbEmail.value.trim(),
    msg:   feedbackForm.fbMessage.value.trim(),
    date:  new Date().toISOString()
  };
  console.log('Feedback submitted:', data);
  feedbackForm.style.display = 'none';
  thankYouEl.style.display = 'block';
});

//───────────────────────────────────────────────────────────────
// N) RIPPLE EFFECT ON ALL .btn
//───────────────────────────────────────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const circle = document.createElement('span');
    circle.className = 'ripple';
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  });
});
