import { Search } from "lucide-react";

export function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b87b0]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-[280px] h-10 pl-10 pr-4 rounded-[12px] border border-[#ebe7f5] bg-white text-[13px] text-[#1e1b4b] placeholder:text-[#8b87b0] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all"
      />
    </div>
  );
}