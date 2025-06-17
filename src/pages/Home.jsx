import { useEffect, useState } from "react";
import {
  fetchDepartmentMembers,
  fetchMasterSheetData,
} from "../utils/sheetHelpers";
import Toast from "../components/Toast";
import DepartmentListTable from "../components/DepartmentListTable";

export default function Home() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [toast, setToast] = useState("");
  const [pendingCounts, setPendingCounts] = useState({});
  const [pendingCountsLoading, setPendingCountsLoading] = useState(false);
  const [totalCounts, setTotalCounts] = useState({});

  // Fetch all departments and counts
  async function loadData() {
    try {
      setPendingCountsLoading(true);
      const data = await fetchMasterSheetData();
      setDepartments(data);

      const pending = {};
      const total = {};

      for (const dept of data) {
        const members = await fetchDepartmentMembers(dept["Sheet ID"]);
        total[dept["Sheet ID"]] = members.length;
        pending[dept["Sheet ID"]] = members.filter(
          (m) => !m["Image"] || !m["Image"].trim()
        ).length;
      }
      setPendingCounts(pending);
      setTotalCounts(total);
      setPendingCountsLoading(false);
    } catch (err) {
      setPendingCountsLoading(false);
      console.error("Failed to fetch master sheet:", err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyLink = (dept) => {
    const link = `${window.location.origin}/${dept["Department Name"]}/${dept["Sheet ID"]}`;
    navigator.clipboard.writeText(link);
    setToast("Link Copied!");
    setSelectedDept(dept); // highlight the selected row
    window.open(link, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-start py-0 sm:py-8">
      <div className="w-full sm:w-11/12 md:w-4/5 lg:w-3/5 xl:w-2/5 bg-white/90 rounded-2xl shadow-2xl mt-0 sm:mt-10 mb-8 px-4 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col items-center mb-6">
          <img
            src="favicon_io/android-chrome-192x192.png"
            alt="App Logo"
            className="w-16 h-16 mb-2 rounded-full shadow-lg border-2 border-blue-200"
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 text-center drop-shadow mb-0">
            Online ID Card
          </h1>
          <p className="text-blue-500 text-center text-lg font-semibold mb-1">
            Admin Dashboard
          </p>
          <p className="text-gray-500 text-center text-base sm:text-lg font-normal mb-2">
            Manage department uploads and track pending members.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mb-2" />
          <p className="text-xs text-blue-600 mt-2 text-center">
            Tap or click on a department row to copy its upload link.
          </p>
        </div>
        <DepartmentListTable
          departments={departments}
          onCopyLink={handleCopyLink}
          pendingCounts={pendingCounts}
          pendingCountsLoading={pendingCountsLoading}
          selectedDept={selectedDept}
          totalCounts={totalCounts}
        />
        <div className="mt-8 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-blue-700">Online ID Card</span>.
          All rights reserved.
        </div>
      </div>
      {/* Always show Toast when toast is set */}
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
