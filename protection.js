// ============================================
// باكيدجات — حماية الموقع
// © 2026 Omar Kandil — 0102691400
// جميع الحقوق محفوظة
// ============================================

// ===== منع النقر الأيمن =====
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  showProtectionAlert('⚠️ النقر الأيمن معطل — هذا الموقع محمي');
  return false;
});

// ===== منع اختصارات أدوات المطورين =====
document.addEventListener('keydown', function(e) {
  // F12
  if (e.key === 'F12') {
    e.preventDefault();
    showProtectionAlert('⚠️ أدوات المطورين معطلة — هذا الموقع محمي');
    return false;
  }
  
  // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
  if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
    e.preventDefault();
    showProtectionAlert('⚠️ أدوات المطورين معطلة — هذا الموقع محمي');
    return false;
  }
  
  // Ctrl+U (عرض المصدر)
  if (e.ctrlKey && e.key === 'u') {
    e.preventDefault();
    showProtectionAlert('⚠️ عرض المصدر معطل — هذا الموقع محمي');
    return false;
  }
  
  // Ctrl+S (حفظ الصفحة)
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    showProtectionAlert('⚠️ حفظ الصفحة معطل — هذا الموقع محمي');
    return false;
  }
  
  // Ctrl+P (طباعة)
  if (e.ctrlKey && e.key === 'p') {
    e.preventDefault();
    showProtectionAlert('⚠️ الطباعة معطلة — هذا الموقع محمي');
    return false;
  }
  
  // Ctrl+A (تحديد الكل)
  if (e.ctrlKey && e.key === 'a') {
    e.preventDefault();
    showProtectionAlert('⚠️ تحديد النص معطل — هذا الموقع محمي');
    return false;
  }
  
  // Ctrl+C (نسخ)
  if (e.ctrlKey && e.key === 'c') {
    e.preventDefault();
    showProtectionAlert('⚠️ النسخ معطل — هذا الموقع محمي');
    return false;
  }
  
  // Ctrl+X (قص)
  if (e.ctrlKey && e.key === 'x') {
    e.preventDefault();
    showProtectionAlert('⚠️ القص معطل — هذا الموقع محمي');
    return false;
  }
  
  // Ctrl+V (لصق)
  if (e.ctrlKey && e.key === 'v') {
    e.preventDefault();
    showProtectionAlert('⚠️ اللصق معطل — هذا الموقع محمي');
    return false;
  }
});

// ===== منع تحديد النص =====
document.addEventListener('selectstart', function(e) {
  e.preventDefault();
  return false;
});

// ===== منع سحب الصور =====
document.addEventListener('dragstart', function(e) {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
    showProtectionAlert('⚠️ سحب الصور معطل — هذا الموقع محمي');
    return false;
  }
});

// ===== منع نسخ الصور =====
document.addEventListener('copy', function(e) {
  e.preventDefault();
  showProtectionAlert('⚠️ النسخ معطل — هذا الموقع محمي');
  return false;
});

// ===== منع قص =====
document.addEventListener('cut', function(e) {
  e.preventDefault();
  showProtectionAlert('⚠️ القص معطل — هذا الموقع محمي');
  return false;
});

// ===== منع لصق =====
document.addEventListener('paste', function(e) {
  e.preventDefault();
  showProtectionAlert('⚠️ اللصق معطل — هذا الموقع محمي');
  return false;
});

// ===== كشف فتح أدوات المطورين =====
let devtoolsOpen = false;
const devtoolsThreshold = 160;

function detectDevTools() {
  const widthThreshold = window.outerWidth - window.innerWidth > devtoolsThreshold;
  const heightThreshold = window.outerHeight - window.innerHeight > devtoolsThreshold;
  
  if (widthThreshold || heightThreshold) {
    if (!devtoolsOpen) {
      devtoolsOpen = true;
      showProtectionAlert('⚠️ تم اكتشاف أدوات المطورين — هذا الموقع محمي');
      // إخفاء المحتوى
      document.body.style.opacity = '0.1';
      setTimeout(function() {
        document.body.style.opacity = '1';
      }, 3000);
    }
  } else {
    devtoolsOpen = false;
  }
}

// فحص دوري
setInterval(detectDevTools, 1000);

// ===== منع التحديد عبر CSS =====
// إضافة أنماط منع التحديد
const style = document.createElement('style');
style.textContent = `
  * {
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
    -webkit-touch-callout: none !important;
  }
  
  img {
    -webkit-user-drag: none !important;
    -khtml-user-drag: none !important;
    -moz-user-drag: none !important;
    -o-user-drag: none !important;
    user-drag: none !important;
    pointer-events: none !important;
  }
  
  a, button {
    pointer-events: auto !important;
  }
`;
document.head.appendChild(style);

// ===== إظهار تنبيه الحماية =====
function showProtectionAlert(message) {
  // إزالة أي تنبيه سابق
  const existing = document.getElementById('protection-alert');
  if (existing) existing.remove();
  
  const alert = document.createElement('div');
  alert.id = 'protection-alert';
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #c0392b;
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    font-family: 'Tajawal', sans-serif;
    font-size: 14px;
    font-weight: 700;
    z-index: 99999;
    box-shadow: 0 4px 20px rgba(192, 57, 43, 0.4);
    animation: protectionFadeIn 0.3s ease;
    text-align: center;
    max-width: 90%;
  `;
  alert.textContent = message;
  document.body.appendChild(alert);
  
  setTimeout(function() {
    alert.style.animation = 'protectionFadeOut 0.3s ease';
    setTimeout(function() {
      alert.remove();
    }, 300);
  }, 2000);
}

// إضافة أنماط الحركة
const animStyle = document.createElement('style');
animStyle.textContent = `
  @keyframes protectionFadeIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes protectionFadeOut {
    from { opacity: 1; transform: translateX(-50%) translateY(0); }
    to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  }
`;
document.head.appendChild(animStyle);

// ===== إضافة علامة مائية =====
function addWatermark() {
  const watermark = document.createElement('div');
  watermark.id = 'site-watermark';
  watermark.innerHTML = '© 2026 | Omar Kandil — +20 1026914000';
  watermark.style.cssText = `
    position: fixed;
    bottom: 10px;
    left: 10px;
    background: rgba(10, 61, 98, 0.8);
    color: rgba(255, 255, 255, 0.7);
    padding: 4px 12px;
    border-radius: 4px;
    font-family: 'Tajawal', sans-serif;
    font-size: 11px;
    font-weight: 500;
    z-index: 9999;
    pointer-events: none;
    letter-spacing: 0.5px;
  `;
  document.body.appendChild(watermark);
}

// ===== إضافة إشعار حقوق ملكية في الكونسول =====
console.log('%c© 2026 Omar Kandil — +20 102 691 4000', 'color: #f5a623; font-size: 16px; font-weight: bold;');
console.log('%cهذا الموقع محمي بموجب قانون حقوق النشر. جميع الحقوق محفوظة.', 'color: #c0392b; font-size: 12px;');

// ===== نسخ رقم الهاتف =====
function copyPhoneNumber(btn) {
  const phone = '+201026914000';
  navigator.clipboard.writeText(phone).then(function() {
    const originalText = btn.textContent;
    btn.textContent = '✅';
    setTimeout(function() {
      btn.textContent = originalText;
    }, 1500);
  }).catch(function() {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = phone;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    const originalText = btn.textContent;
    btn.textContent = '✅';
    setTimeout(function() {
      btn.textContent = originalText;
    }, 1500);
  });
}

// ===== التهيئة =====
document.addEventListener('DOMContentLoaded', function() {
  addWatermark();
});
