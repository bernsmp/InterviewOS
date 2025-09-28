export function Logo({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle Background */}
      <circle cx="24" cy="24" r="24" fill="#295B74" />
      
      {/* Clipboard */}
      <rect x="12" y="10" width="24" height="30" rx="2" fill="white" fillOpacity="0.9" />
      
      {/* Clipboard Header */}
      <rect x="18" y="8" width="12" height="6" rx="1" fill="#6794A7" />
      
      {/* Checkmark */}
      <path
        d="M18 24 L22 28 L30 20"
        stroke="#4ECDC4"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Line Details */}
      <rect x="16" y="32" width="16" height="2" rx="1" fill="#295B74" fillOpacity="0.3" />
      <rect x="16" y="36" width="12" height="2" rx="1" fill="#295B74" fillOpacity="0.3" />
    </svg>
  );
}