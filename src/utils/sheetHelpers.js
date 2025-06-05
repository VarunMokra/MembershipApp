function parseSheetData(rows) {
  if (!rows || rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((row) => {
    const entry = {};
    headers.forEach((header, i) => {
      entry[header] = row[i] || "";
    });
    return entry;
  });
}

export async function fetchMasterSheetData(masterSheetId) {
  try {
    if (!window.gapi?.client?.sheets) {
      throw new Error("Google Sheets API not initialized.");
    }

    const response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: masterSheetId,
      range: "Sheet1", // change if your master sheet tab name is different
    });

    const data = parseSheetData(response.result.values);
    console.log("Master Sheet Data:", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch master sheet:", err);
    return [];
  }
}

export async function fetchDepartmentMembers(sheetId) {
  try {
    const response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1", // change if your department sheet tab name is different
    });

    const data = parseSheetData(response.result.values);
    console.log("Department Members:", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch department members:", err);
    return [];
  }
}
