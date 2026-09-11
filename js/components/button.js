/**
 * =========================================================================
 * COMPONENT OWNERSHIP PATTERN (shadcn/ui Philosophy):
 * =========================================================================
 * File ini mengimplementasikan pola "Component Ownership" ala shadcn/ui.
 * Komponen Button BUKAN diinstal sebagai dependency pihak ketiga (npm blackbox),
 * melainkan diletakkan langsung di dalam codebase proyek (js/components/button.js).
 * 
 * Keuntungan pola Component Ownership:
 * 1. Full Control: Tim pengembang memiliki kendali 100% atas markup, logic,
 *    dan variasi styling tanpa terikat batasan library vendor.
 * 2. Direct Tailwind Integration: Token @theme Tailwind v4 dikonsumsi langsung
 *    tanpa abstraksi styling tersembunyi.
 * 3. Zero Dependency Overhead: Tidak memerlukan package runtime eksternal.
 * =========================================================================
 */

/**
 * Class Variance Authority (CVA) Core Helper
 * Menggabungkan base classes dengan variants, compoundVariants, dan defaultVariants.
 */
function cva(base, config = {}) {
  return function (props = {}) {
    const { variants = {}, defaultVariants = {} } = config;
    const resolvedProps = { ...defaultVariants, ...props };
    const classList = [base];

    for (const [variantName, variantOptions] of Object.entries(variants)) {
      const selectedOption = resolvedProps[variantName];
      if (selectedOption && variantOptions[selectedOption]) {
        classList.push(variantOptions[selectedOption]);
      }
    }

    if (props.className) {
      classList.push(props.className);
    }

    return classList.filter(Boolean).join(' ');
  };
}

/**
 * Button Variants Configuration (CVA)
 * Variants: primary | secondary | outline | destructive
 * Sizes: sm | md | lg
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition cursor-pointer select-none focus:outline-none whitespace-nowrap',
  {
    variants: {
      variant: {
        primary: 'btn btn-primary bg-primary-green text-white hover:bg-green-hover shadow-xs border border-transparent',
        secondary: 'btn btn-secondary bg-white border border-border-color text-text-primary hover:bg-slate-50 shadow-xs',
        outline: 'btn btn-outline-primary bg-transparent border border-primary-green text-primary-green hover:bg-light-green',
        destructive: 'btn bg-status-danger-bg text-status-danger-text border border-red-200 hover:bg-red-100 shadow-xs',
      },
      size: {
        sm: 'py-1.5 px-3 text-xs rounded-md',
        md: 'py-2 px-3.5 text-[13px] rounded-md',
        lg: 'py-2.5 px-4.5 text-sm rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

/**
 * Hydrate and apply CVA classes to all [data-component="button"] elements in DOM
 */
function applyButtonVariants(root = document) {
  const buttonEls = root.querySelectorAll('[data-component="button"]');
  buttonEls.forEach((el) => {
    const variant = el.getAttribute('data-variant') || 'primary';
    const size = el.getAttribute('data-size') || 'md';
    const isBlock = el.hasAttribute('data-block');
    const extraClass = el.getAttribute('data-class') || '';
    
    const generatedClass = buttonVariants({
      variant,
      size,
      className: `${isBlock ? 'w-full ' : ''}${extraClass}`.trim(),
    });

    el.className = generatedClass;
  });
}

// Auto-hydrate on DOM ready if in browser
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    applyButtonVariants();
  });
}

// Global and Module Export
if (typeof window !== 'undefined') {
  window.cva = cva;
  window.buttonVariants = buttonVariants;
  window.applyButtonVariants = applyButtonVariants;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { cva, buttonVariants, applyButtonVariants };
}
