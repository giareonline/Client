export default function NoImage({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-[#F1F5F9] ${className}`}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#CBD5E1]"
      >
        <rect
          x="6"
          y="10"
          width="36"
          height="28"
          rx="4"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="17" cy="20" r="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M6 32 L16 24 L22 30 L30 20 L42 32"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="20"
          y1="4"
          x2="28"
          y2="4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
