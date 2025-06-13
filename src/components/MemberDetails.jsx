export default function MemberDetails({ member }) {
  // Helper to mask contact numbers
  const maskContact = (val) => {
    // Split by space or slash, then mask each number
    return val
      .split(/[\s/]+/)
      .filter(Boolean)
      .map((num) => {
        const trimmed = num.trim();
        if (/^\d{10}$/.test(trimmed)) {
          return "XXXXX" + trimmed.slice(5);
        }
        // fallback: mask first 5 chars if not exactly 10 digits
        return "XXXXX" + trimmed.slice(5);
      })
      .join(" ");
  };

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow text-base flex flex-col items-start justify-center">
      <div className="w-full">
        {Object.entries(member).map(([key, value]) => {
          if (key !== "Image" && !key.startsWith("_")) {
            let displayValue = value;
            if (key === "Cont./Whatsapp") {
              displayValue = maskContact(value);
            }
            // Special rendering for Telugu key
            if (key === "విలువైన తెలుగు మంచి మాట") {
              return (
                <div
                  key={key}
                  className="mb-4 flex flex-col items-center justify-center w-full"
                >
                  <div className="w-full bg-white border border-gray-300 rounded-lg shadow p-4 flex flex-col items-center">
                    <div
                      className="text-base  mb-2 text-center text-slate-400"
                      style={{ fontFamily: "'Ramabhadra', sans-serif" }}
                    >
                      {key}
                    </div>
                    <div
                      className="text-lg font-bold text-center text-indigo-600"
                      style={{ fontFamily: "'Ramabhadra', sans-serif" }}
                    >
                      {displayValue}
                    </div>
                  </div>
                </div>
              );
            }
            // Default rendering
            return (
              <div
                className="mb-2 flex flex-row items-start text-right"
                key={key}
              >
                <span
                  className="font-sm text-gray-700 min-w-[120px] mr-2 break-word"
                  title={key}
                >
                  {key}:
                </span>
                <span
                  className="text-blue-600 font-bold text-left"
                  style={{
                    whiteSpace: "pre-line",
                    fontFamily: "'Maiandra GD', sans-serif",
                  }}
                >
                  {displayValue}
                </span>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="mt-4 text-red-600 text-base text-center font-semibold w-full animate-blink">
        Check Your Details Properly Before Submitting!!
      </div>
    </div>
  );
}
