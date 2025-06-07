import { gapi } from "gapi-script";
import { GOOGLE_API_KEY, GOOGLE_CLIENT_ID } from "./env";

const CLIENT_ID = GOOGLE_CLIENT_ID;
const API_KEY = GOOGLE_API_KEY;
const SCOPES =
  "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets";

let tokenClient;
let gapiInited = false;
let gisInited = false;

export function initGoogleApi() {
  return new Promise((resolve, reject) => {
    async function maybeInitialize() {
      if (gapiInited && gisInited) {
        // If already signed in, resolve immediately
        const token = gapi.auth.getToken();
        if (token && token.access_token) {
          resolve(token);
          return;
        }

        // Try silent access first
        tokenClient.callback = (resp) => {
          if (resp.error) {
            if (
              resp.error === "consent_required" ||
              resp.error === "interaction_required"
            ) {
              // Fallback to consent prompt if silent login fails
              tokenClient.requestAccessToken({ prompt: "consent" });
            } else {
              reject(resp);
            }
          } else {
            resolve(resp);
          }
        };

        try {
          tokenClient.requestAccessToken({ prompt: "" }); // Silent login
        } catch (error) {
          reject(error);
        }
      }
    }

    window.onGapiLoad = () => {
      gapi.load("client", async () => {
        try {
          await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
              "https://sheets.googleapis.com/$discovery/rest?version=v4",
            ],
          });
          gapiInited = true;
          maybeInitialize();
        } catch (error) {
          reject(error);
        }
      });
    };

    window.onGISLoad = () => {
      try {
        tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: () => {}, // Placeholder; will be overridden
        });
        gisInited = true;
        maybeInitialize();
      } catch (error) {
        reject(error);
      }
    };

    // Manually invoke if already loaded
    if (window.gapi) window.onGapiLoad();
    if (window.google) window.onGISLoad();
  });
}

export async function uploadToDrive(file, folderId, memberId) {
  // Get file extension from original file name
  const ext = file.name.split(".").pop();
  const fileName = `${memberId}.${ext}`;

  const metadata = {
    name: fileName,
    mimeType: file.type,
    parents: [folderId],
  };

  const accessToken = gapi.auth.getToken().access_token;

  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  form.append("file", file);

  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
    {
      method: "POST",
      headers: new Headers({ Authorization: "Bearer " + accessToken }),
      body: form,
    }
  );

  const data = await res.json();
  return `https://drive.google.com/uc?id=${data.id}`;
}

export async function updateSheetWithImageAndComment(
  sheetId,
  memberId,
  comment
) {
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Sheet1",
  });

  const rows = response.result.values;
  const headers = rows[0];
  const idCol = headers.findIndex((h) => h === "_ID");
  const photoCol = headers.findIndex((h) => h === "Image");
  const commentCol = headers.findIndex((h) => h === "Comments");

  const rowIndex = rows.findIndex((row) => row[idCol] === memberId);
  if (rowIndex === -1) throw new Error("Member ID not found");

  const updates = [];
  if (memberId && photoCol !== -1) {
    updates.push({
      range: `Sheet1!${String.fromCharCode(65 + photoCol)}${rowIndex + 1}`,
      values: [[memberId]],
    });
  }
  if (typeof comment === "string" && commentCol !== -1) {
    updates.push({
      range: `Sheet1!${String.fromCharCode(65 + commentCol)}${rowIndex + 1}`,
      values: [[comment]],
    });
  }

  if (updates.length === 0) return;

  await gapi.client.sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: sheetId,
    resource: {
      valueInputOption: "RAW",
      data: updates,
    },
  });
}

export async function getDriveFileIdByMemberId(folderId, memberId) {
  const res = await window.gapi.client.drive.files.list({
    q: `'${folderId}' in parents and name contains '${memberId}.' and trashed = false`,
    fields: "files(id, name)",
    pageSize: 1,
  });
  if (res.result.files && res.result.files.length > 0) {
    return res.result.files[0].id;
  }
  return null;
}
