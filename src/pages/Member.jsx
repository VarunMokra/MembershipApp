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
import { MASTER_SHEET_ID } from "../utils/env";

export default function Member() {
  const { departmentId } = useParams();

  const [gapiReady, setGapiReady] = useState(false);
  const [department, setDepartment] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [member, setMember] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [toast, setToast] = useState("");

  // New state for image and comment
  const [selectedImage, setSelectedImage] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Wait for GAPI to be ready
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.gapi?.client?.sheets) {
        clearInterval(interval);
        setGapiReady(true);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Fetch department info and member list once GAPI is ready
  useEffect(() => {
    if (!gapiReady || !departmentId) return;

    const loadData = async () => {
      try {
        const departments = await fetchMasterSheetData(MASTER_SHEET_ID);
        const dept = departments.find((d) => d["Sheet ID"] === departmentId);

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
  }, [gapiReady, departmentId, submitting]);

  const handleSearch = () => {
    setHasSearched(true);
    const found = members.find((m) => m["ID"] === memberId);
    setMember(found || null);

    // Show preview if image exists
    if (found && found["Image"]) {
      setSelectedImage({
        file: null,
        previewUrl: found["Image"],
        existing: true,
      });
    } else {
      setSelectedImage(null);
    }
    setComment(found?.Comments || "");
    // Do NOT clear memberId here
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
    if (!member || !selectedImage?.file) return;
    setSubmitting(true);
    try {
      // 1. Upload image to Drive
      const driveFolderId = department["Drive Folder ID"];
      const sheetId = department["Sheet ID"];
      const imageUrl = await uploadToDrive(
        selectedImage.file,
        driveFolderId,
        member["ID"]
      );

      // 2. Update sheet with image URL and comment
      await updateSheetWithImageAndComment(
        sheetId,
        member["ID"],
        imageUrl,
        comment.trim()
      );

      // 3. Refresh member data
      const updatedMembers = await fetchDepartmentMembers(
        department["Sheet ID"]
      );
      setMembers(updatedMembers);
      const updatedMember = updatedMembers.find((m) => m["ID"] === memberId);
      setMember(updatedMember || null);
      setSelectedImage(null);
      setComment("");
      setToast("Submitted successfully!");
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

      {member ? (
        <>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="col-span-1">
              {!member["Image"]?.trim() ? (
                <ImageUploader
                  onFileSelected={handleFileSelected}
                  selectedImage={selectedImage}
                />
              ) : (
                <div className="flex flex-col items-center">
                  <img
                    src={member["Image"]}
                    alt="Submitted"
                    className="w-40 h-40 object-cover rounded-lg border-2 border-green-400 shadow"
                  />
                  <div className="mt-2 text-green-700 font-semibold text-center text-base">
                    Image already submitted
                  </div>
                </div>
              )}
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
              disabled={member?.Image} // disable if image already submitted
            />
            {!member?.Image ? (
              <button
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition"
                type="button"
                onClick={handleSubmit}
                disabled={!selectedImage?.file || submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            ) : (
              <div className="mt-2 w-full text-center text-green-700 font-semibold">
                Image already submitted
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <PendingCountBadge members={members} />
          <MemberSearch
            memberId={memberId}
            setMemberId={setMemberId}
            onSearch={handleSearch}
          />
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
