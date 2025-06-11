import axios from "axios";
import { BACKEND_URL } from "./env";

export async function fetchMasterSheetData() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/departments`);
    return response.data.departments || [];
  } catch (err) {
    console.error("Failed to fetch master sheet:", err);
    return [];
  }
}

export async function fetchDepartmentMembers(departmentId) {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/department`, {
      departmentSheetId: departmentId,
    });
    return response.data.members || [];
  } catch (err) {
    console.error("Failed to fetch department members:", err);
    return [];
  }
}
