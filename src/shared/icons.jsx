const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const ChevronDown = ({ className }) => (
  <svg {...base} className={className}><path d="m6 9 6 6 6-6" /></svg>
);
export const SearchIcon = ({ className }) => (
  <svg {...base} className={className}>
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
  </svg>
);
export const CheckCircle = ({ className }) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" />
  </svg>
);
export const ClearIcon = ({ className }) => (
  <svg {...base} className={className} fill="currentColor" stroke="none">
    <circle cx="12" cy="12" r="10" opacity=".25" />
    <path d="m8.5 8.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
export const WarnIcon = ({ className }) => (
  <svg {...base} className={className}>
    <path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17.5v.01" />
  </svg>
);
export const Spinner = ({ className = "" }) => (
  <svg {...base} className={`animate-spin ${className}`}>
    <path d="M12 3a9 9 0 1 0 9 9" />
  </svg>
);
