export default function DepartmentListTable({
  departments,
  onCopyLink,
  pendingCounts,
  pendingCountsLoading,
  selectedDept,
  totalCounts = {},
}) {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200">
        <thead>
          <tr>
            <th className="px-2 py-2 text-left text-xs font-bold text-gray-800 bg-gray-50 rounded-tl-xl">
              Department
            </th>
            <th className="px-2 py-2 text-center text-xs font-bold text-gray-800 bg-gray-50">
              Total
            </th>
            <th className="px-2 py-2 text-center text-xs font-bold text-gray-800 bg-gray-50">
              Completed
            </th>
            <th className="px-2 py-2 text-center text-xs font-bold text-gray-800 bg-gray-50 rounded-tr-xl">
              Pending
            </th>
          </tr>
        </thead>
        <tbody>
          {departments.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-2 py-6 text-center text-gray-400">
                No departments found.
              </td>
            </tr>
          ) : (
            departments.map((dept, idx) => {
              const isSelected =
                selectedDept && selectedDept["Sheet ID"] === dept["Sheet ID"];
              const total = totalCounts[dept["Sheet ID"]] ?? "-";
              const pending = pendingCounts[dept["Sheet ID"]] ?? "-";
              const completed =
                typeof total === "number" && typeof pending === "number"
                  ? total - pending
                  : "-";
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
                    className={`px-2 py-2 border-b border-gray-100 font-medium text-blue-700 transition ${
                      isSelected ? "text-blue-900 font-bold" : ""
                    }`}
                  >
                    {dept["Department Name"]}
                  </td>
                  <td className="px-2 py-2 border-b border-gray-100 text-center">
                    {pendingCountsLoading ? (
                      <span className="inline-block animate-pulse bg-gray-200 text-gray-400 text-xs px-2 rounded-full">
                        Loading...
                      </span>
                    ) : (
                      <span className="inline-block text-xs px-2 py-1 rounded-full font-semibold bg-yellow-100 text-yellow-800">
                        {total}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2 border-b border-gray-100 text-center">
                    {pendingCountsLoading ? (
                      <span className="inline-block animate-pulse bg-gray-200 text-gray-400 text-xs px-2 rounded-full">
                        Loading...
                      </span>
                    ) : (
                      <span className="inline-block text-xs px-2 py-1 rounded-full font-semibold bg-green-100 text-green-700">
                        {completed}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2 border-b border-gray-100 text-center">
                    {pendingCountsLoading ? (
                      <span className="inline-block animate-pulse bg-gray-200 text-gray-400 text-xs px-2 rounded-full">
                        Loading...
                      </span>
                    ) : (
                      <span
                        className={`inline-block text-xs px-2 py-1 rounded-full font-semibold ${
                          pending === 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {pending}
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
