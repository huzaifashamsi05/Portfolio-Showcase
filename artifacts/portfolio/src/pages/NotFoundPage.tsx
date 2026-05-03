import { useLocation } from "wouter";

export default function NotFoundPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#080c18] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400 opacity-20"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animation: `pulse ${Math.random() * 3 + 2}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div
          className="text-[10rem] font-black leading-none"
          style={{
            fontFamily: "Orbitron, sans-serif",
            background: "linear-gradient(135deg, #00f5ff, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 30px #00f5ff44)",
          }}
        >
          404
        </div>
        <h2
          className="text-2xl font-semibold text-[#00f5ff] mb-4 mt-2"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Signal Lost
        </h2>
        <p className="text-gray-400 mb-10 max-w-md text-sm leading-relaxed">
          The coordinates you entered don't exist in this dimension. Perhaps you
          took a wrong turn in the matrix.
        </p>
        <button
          onClick={() => setLocation("/")}
          className="px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #00f5ff22, #8b5cf622)",
            border: "1px solid #00f5ff66",
            color: "#00f5ff",
            fontFamily: "Space Grotesk, sans-serif",
            boxShadow: "0 0 20px #00f5ff22",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.boxShadow = "0 0 30px #00f5ff66";
            (e.target as HTMLButtonElement).style.background =
              "linear-gradient(135deg, #00f5ff44, #8b5cf644)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.boxShadow = "0 0 20px #00f5ff22";
            (e.target as HTMLButtonElement).style.background =
              "linear-gradient(135deg, #00f5ff22, #8b5cf622)";
          }}
        >
          Return to Base
        </button>
      </div>
    </div>
  );
}
