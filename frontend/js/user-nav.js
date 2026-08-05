import { getUserProfile } from './storage.js';

export function renderHeaderUserProfile() {
  const container = document.getElementById('headerUserProfile');
  if (!container) return;

  const profile = getUserProfile();
  const name = profile.fullName || 'Guest Student';
  const hasAvatar = Boolean(profile.avatarUrl);

  const avatarHtml = hasAvatar
    ? `<img src="${profile.avatarUrl}" alt="Avatar" class="w-full h-full object-cover" />`
    : `<div class="w-full h-full bg-primary-container text-white flex items-center justify-center font-bold text-xs"><span class="material-symbols-outlined text-sm sm:text-base">person</span></div>`;

  container.innerHTML = `
    <a href="/settings" class="flex items-center gap-1.5 p-1 pr-2 sm:pr-3 rounded-full bg-surface-container-low border border-outline-variant hover:bg-surface-container transition-all no-underline shadow-sm">
      <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-primary/30 flex-shrink-0">
        ${avatarHtml}
      </div>
      <span class="font-bold text-xs text-on-surface truncate max-w-[80px] sm:max-w-[120px] hidden sm:inline">${name}</span>
    </a>
  `;
}

export function initMobileMenuToggle() {
  const mobileToggleBtn = document.getElementById('mobileMenuToggleBtn');
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');

  if (mobileToggleBtn && mobileMenuDrawer) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenuDrawer.classList.toggle('hidden');
      const icon = mobileToggleBtn.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = mobileMenuDrawer.classList.contains('hidden') ? 'menu' : 'close';
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuDrawer.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        if (!mobileMenuDrawer.classList.contains('hidden')) {
          mobileMenuDrawer.classList.add('hidden');
          const icon = mobileToggleBtn.querySelector('.material-symbols-outlined');
          if (icon) icon.textContent = 'menu';
        }
      }
    });

    // Close when clicking links inside drawer
    mobileMenuDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuDrawer.classList.add('hidden');
        const icon = mobileToggleBtn.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'menu';
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    renderHeaderUserProfile();
    initMobileMenuToggle();
  });
} else {
  renderHeaderUserProfile();
  initMobileMenuToggle();
}
