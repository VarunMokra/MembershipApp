export default function MemberCard({ member }) {
  const dummyImage = "/dummy-avatar.png";

  const isGoogleDriveLink = (url) => {
    return url && typeof url === "string" && url.includes("drive.google.com");
  };
  const imageUrl = isGoogleDriveLink(member["Image"])
    ? member["Image"]
    : dummyImage;

  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start">
      <div className="flex-shrink-0 mb-3 sm:mb-0 sm:mr-4 w-24 h-24 overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt={member["Name"] || "Member Image"}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">
          ID: {member["ID"]}
        </span>
        <span className="text-base text-gray-900 font-semibold">
          {member["Name"]}
        </span>
      </div>
    </div>
  );
}
