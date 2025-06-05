import { useEffect, useState } from "react";
import {
  fetchDepartmentMembers,
  fetchMasterSheetData,
} from "../utils/sheetHelpers";
import Banner from "../components/Banner";
import MemberCard from "../components/MemberCard";
import DepartmentDropdown from "../components/DepartmentDropdown";
import PendingCountBadge from "../components/PendingCountBadge";
import { MASTER_SHEET_ID } from "../utils/env";

export default function Home() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [members, setMembers] = useState([]);
  const [gapiReady, setGapiReady] = useState(false);

  async function loadData() {
    if (window.gapi?.client?.sheets) {
      try {
        const data = await fetchMasterSheetData(MASTER_SHEET_ID);
        setDepartments(data);
      } catch (err) {
        console.error("Failed to fetch master sheet:", err);
      }
    } else {
      console.warn("GAPI not ready yet");
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.gapi?.client?.sheets) {
        clearInterval(interval);
        setGapiReady(true);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadData();
  }, [gapiReady]);

  const handleSelect = async (dept) => {
    setSelectedDept(dept);
    const data = await fetchDepartmentMembers(dept["Sheet ID"]);
    setMembers(data);
  };
  const handleShare = () => {
    const link = `${window.location.origin}/member/${selectedDept["Sheet ID"]}`;
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="px-2 py-8 mx-auto max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Select Department
      </h1>
      <DepartmentDropdown departments={departments} onSelect={handleSelect} />
      {selectedDept && (
        <>
          <button
            onClick={handleShare}
            className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl text-base font-medium shadow-md hover:bg-blue-700 transition"
          >
            Change Details
          </button>
          <Banner imageUrl={selectedDept["Banner URL"]} />
          <PendingCountBadge members={members} />
          <div className="grid grid-cols-2 gap-6 mt-6">
            {members.map((member, index) => (
              <MemberCard key={index} member={member} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
