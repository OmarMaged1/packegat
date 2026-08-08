// script.js — باكيدجات
// ============================================

// ===== القائمة المنسدلة =====
function toggleNav() {
  document.getElementById('mainNav').classList.toggle('open');
}

// ===== التبويبات =====
function showTab(btn, tabId) {
  const card = btn.closest('.country-body');
  if (!card) return;
  card.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  card.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');
}

// ===== تصفية الدول =====
function filterCountries(query) {
  const q = query.trim().toLowerCase();
  document.querySelectorAll('.country-card').forEach(card => {
    const name = card.getAttribute('data-country') || '';
    const text = card.textContent.toLowerCase();
    card.classList.toggle('hidden', q && !name.includes(q) && !text.includes(q));
  });
}

// ===== تمييز الرابط النشط عند التمرير =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// ===== إغلاق القائمة عند النقر على رابط =====
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mainNav').classList.remove('open');
  });
});

// ===== زر العودة للأعلى =====
const backToTopBtn = document.createElement('button');
backToTopBtn.className = 'back-to-top';
backToTopBtn.innerHTML = '↑';
backToTopBtn.setAttribute('aria-label', 'العودة للأعلى');
document.body.appendChild(backToTopBtn);

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

// ===== التمرير السلس لصفوف الجدول =====
document.querySelectorAll('.clickable-row').forEach(row => {
  row.addEventListener('click', () => {
    const targetId = row.getAttribute('data-target');
    if (targetId) {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// ===== سلايدر الصور التلقائي =====
function initSliders() {
  document.querySelectorAll('.gallery-slider').forEach(slider => {
    if (slider.dataset.initialized) return;
    slider.dataset.initialized = 'true';

    const track = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slider-slide');
    const dotsContainer = slider.querySelector('.slider-dots');
    const prevBtn = slider.querySelector('.slider-btn.prev');
    const nextBtn = slider.querySelector('.slider-btn.next');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    // إنشاء النقاط
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'الشريحة ' + (i + 1));
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
    }

    function updateSlider() {
      const viewport = slider.querySelector('.slider-viewport');
      const slideWidth = viewport ? viewport.offsetWidth : track.offsetWidth / totalSlides;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      slider.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      if (currentIndex >= totalSlides) currentIndex = 0;
      if (currentIndex < 0) currentIndex = totalSlides - 1;
      updateSlider();
      resetAutoPlay();
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // التشغيل التلقائي
    let autoPlayInterval = null;

    function startAutoPlay() {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    // تحضير الصور قبل بدء التشغيل التلقائي حتى لا تظهر الشرائح فارغة
    // (الصور كبيرة الحجم وقد تستغرق تحميلاً)، وإعادة حساب الموضع بعد التحميل
    let imagesReady = 0;
    const sliderImgs = slider.querySelectorAll('.slider-slide img');
    const fallbackStart = setTimeout(startAutoPlay, 2000); // بدء احتياطي بعد ثانيتين

    sliderImgs.forEach(img => {
      img.addEventListener('load', () => {
        imagesReady++;
        updateSlider(); // إعادة ضبط العرض بعد تحميل الصورة
        if (imagesReady === 1) {
          clearTimeout(fallbackStart);
          startAutoPlay();
        }
      });
      img.addEventListener('error', () => {
        // إخفاء الصورة المعطوبة وإظهار خلفية بديلة واضحة بدلاً من صفحة بيضاء
        const slide = img.closest('.slider-slide');
        if (slide) slide.classList.add('img-missing');
        img.remove();
      });
    });

    // إيقاف التشغيل التلقائي عند المرور بالماوس
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', resetAutoPlay);

    // دعم اللمس (Swipe) للموبايل
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide(); // Swipe left -> next
        } else {
          prevSlide(); // Swipe right -> prev
        }
      }
    });

    // ربط شرائح السلايدر باللايت بوكس
    slides.forEach((slide, index) => {
      const img = slide.querySelector('img');
      if (img) {
        img.addEventListener('click', () => {
          const caption = slide.querySelector('.slider-caption');
          const captionText = caption ? caption.textContent : '';
          openLightbox(img.src, captionText, slider);
        });
      }
    });

    // إعادة حساب الموضع عند تغيير حجم الشاشة
    window.addEventListener('resize', () => {
      updateSlider();
    });
  });
}

// ===== Lightbox (تكبير الصورة) =====
let lightbox = null;
let lightboxImages = [];
let lightboxIndex = 0;

function createLightbox() {
  if (lightbox) return lightbox;

  lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="إغلاق">×</button>
    <button class="lightbox-nav prev" aria-label="السابق">›</button>
    <img class="lightbox-img" src="" alt="">
    <button class="lightbox-nav next" aria-label="التالي">‹</button>
    <div class="lightbox-caption"></div>
  `;
  document.body.appendChild(lightbox);

  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-nav.prev');
  const nextBtn = lightbox.querySelector('.lightbox-nav.next');
  const img = lightbox.querySelector('.lightbox-img');
  const caption = lightbox.querySelector('.lightbox-caption');

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', e => { e.stopPropagation(); lightboxNav(-1); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); lightboxNav(1); });

  // إغلاق عند النقر على الخلفية
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // إغلاق بزر Escape
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxNav(1); // RTL: left = next
    if (e.key === 'ArrowRight') lightboxNav(-1); // RTL: right = prev
  });

  return lightbox;
}

function openLightbox(src, captionText, sliderEl) {
  createLightbox();

  // جمع كل صور السلايدر
  lightboxImages = [];
  if (sliderEl) {
    sliderEl.querySelectorAll('.slider-slide').forEach(slide => {
      const img = slide.querySelector('img');
      const cap = slide.querySelector('.slider-caption');
      if (img) {
        lightboxImages.push({
          src: img.src,
          caption: cap ? cap.textContent : ''
        });
      }
    });
  }

  // تحديد الفهرس الحالي
  lightboxIndex = lightboxImages.findIndex(item => item.src === src);
  if (lightboxIndex === -1) {
    lightboxImages = [{ src: src, caption: captionText }];
    lightboxIndex = 0;
  }

  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateLightbox() {
  if (lightboxImages.length === 0) return;
  const item = lightboxImages[lightboxIndex];
  const img = lightbox.querySelector('.lightbox-img');
  const caption = lightbox.querySelector('.lightbox-caption');
  const prevBtn = lightbox.querySelector('.lightbox-nav.prev');
  const nextBtn = lightbox.querySelector('.lightbox-nav.next');

  img.src = item.src;
  caption.textContent = item.caption;

  // إظهار/إخفاء أزرار التنقل
  if (lightboxImages.length <= 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
  }
}

function lightboxNav(direction) {
  if (lightboxImages.length <= 1) return;
  lightboxIndex += direction;
  if (lightboxIndex >= lightboxImages.length) lightboxIndex = 0;
  if (lightboxIndex < 0) lightboxIndex = lightboxImages.length - 1;
  updateLightbox();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== ربط صور المعرض القديم باللايت بوكس =====
function initGalleryLightbox() {
  document.querySelectorAll('.gallery-item img').forEach(img => {
    if (img.dataset.lightboxInit) return;
    img.dataset.lightboxInit = 'true';

    img.addEventListener('click', () => {
      const item = img.closest('.gallery-item');
      const caption = item ? item.querySelector('.caption') : null;
      const captionText = caption ? caption.textContent : (img.alt || '');

      // جمع كل صور المعرض في نفس الصفحة
      const gallery = img.closest('.gallery');
      const images = [];
      if (gallery) {
        gallery.querySelectorAll('.gallery-item img').forEach(gImg => {
          const gItem = gImg.closest('.gallery-item');
          const gCap = gItem ? gItem.querySelector('.caption') : null;
          images.push({
            src: gImg.src,
            caption: gCap ? gCap.textContent : (gImg.alt || '')
          });
        });
      }

      if (images.length > 0) {
        lightboxImages = images;
        lightboxIndex = images.findIndex(item => item.src === img.src);
        if (lightboxIndex === -1) lightboxIndex = 0;
        createLightbox();
        updateLightbox();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else {
        openLightbox(img.src, captionText, null);
      }
    });
  });
}

// ===== التهيئة عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', () => {
  initSliders();
  initGalleryLightbox();
});

// إعادة التهيئة عند تحميل المحتوى ديناميكياً
window.addEventListener('load', () => {
  initSliders();
  initGalleryLightbox();
});