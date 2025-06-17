export default function MemberSearch({ memberId, setMemberId, onSearch }) {
  return (
    <div className="mt-6">
      <input
        type="text"
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none"
        placeholder="Search Here"
      />
      <button
        onClick={onSearch}
        className="mt-3 w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition cursor-pointer flex items-center justify-center gap-1"
      >
        Search
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 inline-block"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>
      </button>
    </div>
  );
}
