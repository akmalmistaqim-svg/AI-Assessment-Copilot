/**
 * =========================================================================
 * COMPONENT OWNERSHIP PATTERN (shadcn/ui Philosophy):
 * =========================================================================
 * File ini mengimplementasikan pola "Component Ownership" ala shadcn/ui.
 * Komponen Badge BUKAN paket dependensi node_modules eksternal, melainkan
 * kode sumber lokal yang dimiliki dan dikontrol penuh di dalam repositori
 * (js/components/badge.js).
 * 
 * Karakteristik Component Ownership:
 * 1. Anda bebas memodifikasi token warna, dot styling, animasi, atau varian
 *    tanpa menunggu rilis update dari library luar.
 * 2. Transparansi kode: sangat mudah di-debug dan dipelihara secara mandiri.
 * 3. Terintegrasi native dengan CSS Variables dan Tailwind v4 design tokens.
 * =========================================================================
 */

/**
 * Badge Variants Configuration (CVA)
 * Variants: active | submitted | pending | graded
 * Sizes: sm | md | lg
 */
const badgeVariants = (typeof window !== 'undefined' && window.cva) 
  ? window.cva(
      'badge inline-flex items-center gap-1.5 rounded-full font-medium leading-none select-none',
      {
        variants: {
          variant: {
            active: 'badge-active bg-status-active-bg text-status-active-text',
            submitted: 'badge-submitted bg-status-submitted-bg text-status-submitted-text',
            pending: 'badge-pending bg-status-pending-bg text-status-pending-text',
            graded: 'badge-graded bg-status-graded-bg text-status-graded-text',
          },
          size: {
            sm: 'py-0.5 px-2 text-[11px]',
            md: 'py-1 px-2.5 text-xs',
            lg: 'py-1.5 px-3 text-sm',
          },
        },
        defaultVariants: {
          variant: 'active',
          size: 'md',
        },
      }
    )
  : function (props = {}) {
      const v = props.variant || 'active';
      const s = props.size || 'md';
      const map = {
        active: 'badge-active bg-status-active-bg text-status-active-text',
        submitted: 'badge-submitted bg-status-submitted-bg text-status-submitted-text',
        pending: 'badge-pending bg-status-pending-bg text-status-pending-text',
        graded: 'badge-graded bg-status-graded-bg text-status-graded-text',
      };
      const sizeMap = {
        sm: 'py-0.5 px-2 text-[11px]',
        md: 'py-1 px-2.5 text-xs',
        lg: 'py-1.5 px-3 text-sm',
      };
      return `badge inline-flex items-center gap-1.5 rounded-full font-medium leading-none select-none ${map[v] || map.active} ${sizeMap[s] || sizeMap.md} ${props.className || ''}`.trim();
    };

/**
 * Hydrate and apply CVA classes to all [data-component="badge"] elements in DOM
 */
function applyBadgeVariants(root = document) {
  const badgeEls = root.querySelectorAll('[data-component="badge"]');
  badgeEls.forEach((el) => {
    const variant = el.getAttribute('data-variant') || 'active';
    const size = el.getAttribute('data-size') || 'md';
    const extraClass = el.getAttribute('data-class') || '';

    const generatedClass = badgeVariants({
      variant,
      size,
      className: extraClass,
    });

    el.className = generatedClass;
  });
}

// Auto-hydrate on DOM ready if in browser
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    applyBadgeVariants();
  });
}

// Global and Module Export
if (typeof window !== 'undefined') {
  window.badgeVariants = badgeVariants;
  window.applyBadgeVariants = applyBadgeVariants;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { badgeVariants, applyBadgeVariants };
}
