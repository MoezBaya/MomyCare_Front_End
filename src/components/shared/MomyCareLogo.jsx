import picto from "@/assets/img/MomyCare-picto.png";

export default function MomyCareLogo({ variant = "row", size = "md", className = "" }) {
  const isCol = variant === "col";

  const sizeClasses = {
    sm: {
      container: isCol ? "gap-1" : "gap-2",
      img: "h-7 w-7",
      text: "text-base font-extrabold tracking-tight",
    },
    md: {
      container: isCol ? "gap-2" : "gap-3",
      img: "h-10 w-10",
      text: "text-xl font-black tracking-tight",
    },
    lg: {
      container: isCol ? "gap-3" : "gap-4",
      img: "h-16 w-16",
      text: "text-2xl font-black tracking-widest",
    },
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`flex items-center ${
        isCol ? "flex-col justify-center text-center" : "flex-row"
      } ${selectedSize.container} ${className}`}
    >
      <div className="relative transition-transform duration-300 hover:scale-105">
        <img
          src={picto}
          alt="MomyCare"
          className={`${selectedSize.img} object-contain`}
        />
      </div>
      <span
        className={`bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 bg-clip-text font-sans text-transparent ${selectedSize.text}`}
        style={{ fontFamily: "'Inter Variable', sans-serif" }}
      >
        momycare
      </span>
    </div>
  );
}
