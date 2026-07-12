export default function WolfLogo({ size = 24, className = '', style = {} }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Left side of the face/ear */}
      <path d="M 25 15 L 15 55 L 40 70 L 65 40" />
      {/* Right side of the face/ear */}
      <path d="M 75 15 L 85 55 L 60 70 L 35 40" />
      {/* Bottom anchor/nose */}
      <path d="M 50 75 L 50 95" />
      <path d="M 40 80 L 50 95 L 60 80" />
    </svg>
  );
}
