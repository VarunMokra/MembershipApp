export default function MemberDetails({ member }) {
  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow text-sm flex flex-col items-center justify-center">
      <div className="w-full max-w-xs">
        {Object.entries(member).map(([key, value]) => {
          if (key !== "Image")
            return (
              <div className="mb-2 flex justify-center items-start" key={key}>
                <span
                  className="font-medium text-gray-700 w-28 text-right pr-2"
                  title={key}
                >
                  {key}:
                </span>
                <span
                  className="text-blue-600 text-left flex-1 break-words overflow-auto"
                  style={{
                    wordBreak: "break-word",
                    maxWidth: "180px",
                    whiteSpace: "pre-line",
                  }}
                >
                  {value}
                </span>
              </div>
            );
        })}
      </div>
    </div>
  );
}
