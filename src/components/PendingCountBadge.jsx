// PendingCountBadge.jsx
import React from "react";

export default function PendingCountBadge({ members }) {
  // Function to determine if an image needs upload
  const needsImageUpload = (member) => {
    const imageUrl = member["Image"];
    return (
      !imageUrl ||
      typeof imageUrl !== "string" ||
      !imageUrl.includes("drive.google.com")
    );
  };

  const pendingCount = members.filter(needsImageUpload).length;

  // Determine dynamic styling based on the count
  const bgColor = pendingCount > 0 ? "bg-yellow-100" : "bg-green-100";
  const borderColor =
    pendingCount > 0 ? "border-yellow-300" : "border-green-300";
  const textColor = pendingCount > 0 ? "text-yellow-800" : "text-green-800";
  const countColor = pendingCount > 0 ? "text-red-600" : "text-green-800"; // Specific color for the number

  return (
    <div
      className={`mt-4 p-3 ${bgColor} border ${borderColor} ${textColor} rounded-lg shadow-sm text-center font-medium`}
    >
      Pending Count:{" "}
      <span className={`font-bold ${countColor}`}>{pendingCount}</span>
    </div>
  );
}
