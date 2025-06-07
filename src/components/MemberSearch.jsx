export default function MemberSearch({ memberId, setMemberId, onSearch }) {
  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Enter ID
      </label>
      <input
        type="text"
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none"
        placeholder="Student APAAR No."
      />
      <button
        onClick={onSearch}
        className="mt-3 w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition cursor-pointer"
      >
        Search
      </button>
    </div>
  );
}
