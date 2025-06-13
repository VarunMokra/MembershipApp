import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import MemberSearch from "../components/MemberSearch";
import MemberDetails from "../components/MemberDetails";
import ImageUploader from "../components/ImageUploader";
import {
  fetchDepartmentMembers,
  fetchMasterSheetData,
} from "../utils/sheetHelpers";
import PendingCountBadge from "../components/PendingCountBadge";
import {
  uploadToDrive,
  updateSheetWithImageAndComment,
} from "../utils/googleUtils";
import Toast from "../components/Toast";

export default function Member() {
  const { departmentId } = useParams();

  const [department, setDepartment] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [member, setMember] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ads, setAds] = useState([]);

  // Fetch department info and member list on mount or when dependencies change
  useEffect(() => {
    if (!departmentId) return;

    const loadData = async () => {
      try {
        const departments = await fetchMasterSheetData();
        const dept = departments.find((d) => d["Sheet ID"] === departmentId);
        const adImages = Object.entries(dept)
          .filter(
            ([key, value]) => /^AD\d+$/.test(key) && value && value.trim()
          )
          .map(([key, value]) => ({ key, url: value }));
        setAds(adImages);
        if (dept) {
          setDepartment(dept);
          const data = await fetchDepartmentMembers(dept["Sheet ID"]);
          setMembers(data);
        } else {
          console.error("Department not found");
        }
      } catch (err) {
        console.error("Error loading department or members:", err);
      }
    };

    loadData();
  }, [departmentId, submitting, member]);

  const handleSearch = async () => {
    setHasSearched(true);
    const found = members.find((m) => m["_ID"] === memberId);
    setMember(found || null);
    setComment(found?.Comments || "");
  };

  const handleFileSelected = (imgObj) => {
    // Clean up previous preview URL
    if (selectedImage && selectedImage.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    setSelectedImage(imgObj);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (!member || !selectedImage?.file || submitting) return;
    setSubmitting(true);
    try {
      // 1. Upload image to backend
      const driveFolderId = department["Drive Folder ID"];
      const sheetId = department["Sheet ID"];
      await uploadToDrive(selectedImage.file, driveFolderId, member["_ID"]);
      // 2. Update sheet with member ID and comment
      await updateSheetWithImageAndComment(
        sheetId,
        member["_ID"],
        comment.trim()
      );

      setSelectedImage(null);
      setComment("");
      setToast("Submitted successfully!");
      setMember(null);
      setHasSearched(false);
      setMemberId(""); // Clear only after successful submit
    } catch (err) {
      setToast("Error submitting: " + err.message);
    }
    setSubmitting(false);
  };

  const handleToastClose = () => setToast("");

  return (
    <div className="px-4 py-6 mx-auto max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
      {department && <Banner imageUrl={department["Banner URL"]} />}
      {toast === "Submitted successfully!" ? (
        <>
          <div className="text-green-700 text-center font-semibold my-8">
            Image submitted successfully!
          </div>
          <PendingCountBadge members={members} />
          <MemberSearch
            memberId={memberId}
            setMemberId={setMemberId}
            onSearch={handleSearch}
          />
        </>
      ) : member ? (
        member["Image"]?.trim() ? (
          <>
            <div className="flex flex-col items-center my-12">
              <div className="mt-4 text-green-700 font-semibold text-center text-base">
                Image already submitted
              </div>
            </div>
            <PendingCountBadge members={members} />
            <MemberSearch
              memberId={memberId}
              setMemberId={setMemberId}
              onSearch={handleSearch}
            />
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-1 mt-4">
                <ImageUploader
                  onFileSelected={handleFileSelected}
                  selectedImage={selectedImage}
                />
              </div>
              <div className="col-span-1 flex flex-col gap-4">
                <PendingCountBadge members={members} />
                <MemberSearch
                  memberId={memberId}
                  setMemberId={setMemberId}
                  onSearch={handleSearch}
                />
              </div>
            </div>
            <div className="mt-4">
              <MemberDetails member={member} />
              {/* Comment Box */}
              <textarea
                className="w-full mt-4 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                rows={3}
                placeholder="Add a comment..."
                value={comment}
                onChange={handleCommentChange}
              />
              {ads.map((ad) => {
                return <Banner key={ad.key} imageUrl={ad.url} />;
              })}
              <button
                className={`mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition ${
                  !selectedImage?.file || submitting
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                type="button"
                onClick={handleSubmit}
                disabled={!selectedImage?.file || submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )
      ) : (
        <>
          <PendingCountBadge members={members} />
          <MemberSearch
            memberId={memberId}
            setMemberId={setMemberId}
            onSearch={handleSearch}
          />
          {ads.map((ad) => {
            return <Banner key={ad.key} imageUrl={ad.url} />;
          })}
        </>
      )}

      {hasSearched && !member && (
        <p className="text-red-600 text-sm mt-2 text-center">
          Member not found. Please enter a valid ID.
        </p>
      )}

      <Toast message={toast} onClose={handleToastClose} />
    </div>
  );
}
