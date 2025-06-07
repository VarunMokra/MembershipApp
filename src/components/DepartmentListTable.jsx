export default function DepartmentListTable({
  departments,
  onCopyLink,
  pendingCounts,
  pendingCountsLoading,
  selectedDept,
}) {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-2 text-left text-sm font-bold text-gray-800 bg-gray-50 rounded-tl-xl">
              Department
            </th>
            <th className="px-6 py-2 text-left text-sm font-bold text-gray-800 bg-gray-50 rounded-tr-xl">
              Pending
            </th>
          </tr>
        </thead>
        <tbody>
          {departments.length === 0 ? (
            <tr>
              <td colSpan={2} className="px-6 py-6 text-center text-gray-400">
                No departments found.
              </td>
            </tr>
          ) : (
            departments.map((dept, idx) => {
              const isSelected =
                selectedDept && selectedDept["Sheet ID"] === dept["Sheet ID"];
              return (
                <tr
                  key={dept["Sheet ID"]}
                  className={`transition cursor-pointer ${
                    isSelected
                      ? "bg-blue-100 border-l-4 border-blue-600"
                      : idx % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                  } hover:bg-blue-50`}
                  onClick={() => onCopyLink(dept)}
                  title="Click to copy upload link"
                >
                  <td
                    className={`px-6 py-2 border-b border-gray-100 font-medium text-blue-700 transition ${
                      isSelected ? "text-blue-900 font-bold" : ""
                    }`}
                  >
                    {dept["Department Name"]}
                  </td>
                  <td className="px-6 py-2 border-b border-gray-100">
                    {pendingCountsLoading ? (
                      <span className="inline-block animate-pulse bg-gray-200 text-gray-400 text-xs px-3  rounded-full">
                        Loading...
                      </span>
                    ) : (
                      <span
                        className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${
                          (pendingCounts[dept["Sheet ID"]] ?? 0) === 0
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {pendingCounts[dept["Sheet ID"]] ?? "-"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
