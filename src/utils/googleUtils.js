import axios from "axios";
import { BACKEND_URL } from "./env";

// Upload image using backend API
export async function uploadToDrive(file, folderId, memberId) {
  const form = new FormData();
  form.append("image", file);
  form.append("memberId", memberId);
  form.append("folderId", folderId);

  const res = await axios.post(`${BACKEND_URL}/api/upload-image`, form);
  return res.data;
}

// Update sheet with image and comment using backend API
export async function updateSheetWithImageAndComment(
  sheetId,
  memberId,
  comment
) {
  const res = await axios.post(
    `${BACKEND_URL}/api/update-sheet`,
    { sheetId, memberId, comment },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
}
