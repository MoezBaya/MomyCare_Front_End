export function IconButton({ icon: Icon, onClick, className = "", label }) {
  return (
    <button
      onClick={onClick}
      className={`h-10 w-10 rounded-[12px] border border-[#ebe7f5] bg-white flex items-center justify-center hover:bg-[#f5f3ff] transition-colors ${className}`}
      aria-label={label}
    >
      {Icon && <Icon className="h-4 w-4 text-[#5b21b6]" />}
    </button>
  );
}