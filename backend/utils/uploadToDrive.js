const fs = require("fs");
const { google } = require("googleapis");

// Load Google API Keys
const apikeys = require("../Api_Key.json"); // Ensure this file is in your project root
const SCOPE = ["https://www.googleapis.com/auth/drive"];

// 🔹 Function to authorize Google Drive API
async function authorize() {
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    );

    await jwtClient.authorize();
    return jwtClient;
}

// 🔹 Main function to handle file upload
async function uploadToDrive(file) {
    if (!file || !file.buffer) {
        throw new Error("File buffer is missing or file is not uploaded properly.");
    }

    try {
        const authClient = await authorize(); // Ensure you have the authorization setup correctly
        const drive = google.drive({ version: 'v3', auth: authClient });

        const fileMetaData = {
            name: file.originalname, // Use uploaded file name
            parents: ['1IEpoP5jxYa9Ljvcqc5wqLGhJTqeIZgId'], // Your folder ID
        };
        console.log("File metadata prepared", fileMetaData);

        // Here, we are using a BufferStream to convert the buffer into a stream
        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null); // End the stream

        const media = {
            body: bufferStream, // Using the buffer stream
            mimeType: file.mimetype,
        };
        console.log("Media prepared", media);

        const response = await new Promise((resolve, reject) => {
            drive.files.create(
                {
                    resource: fileMetaData,
                    media: media,
                    fields: "id",
                },
                (error, response) => {
                    if (error) {
                        console.error("Error uploading to Google Drive", error);
                        return reject(error);
                    }
                    console.log("File uploaded successfully", response.data);
                    resolve(response.data);
                }
            );
        });

        return response;
    } catch (error) {
        console.error("Error in uploadToDrive:", error);
        throw error;
    }
}

// Helper to create a readable stream from buffer
const { Readable } = require('stream');

// 🔹 Function to List Files in a Folder
async function listFiles(folderId) {
    const authClient = await authorize();
    const drive = google.drive({ version: "v3", auth: authClient });

    const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: "files(id, name, webViewLink, webContentLink)",
    });

    return response.data.files; // List of files
}

async function downloadFile(fileId) {
    const authClient = await authorize();
    const drive = google.drive({ version: "v3", auth: authClient });

    const response = await drive.files.get(
        {
            fileId: fileId,
            alt: "media",
        },
        { responseType: "stream" }
    );

    const dest = fs.createWriteStream(`./${fileId}.png`); // Change as needed
    response.data.pipe(dest);

    return new Promise((resolve, reject) => {
        dest.on("finish", () => resolve(`File downloaded as ${fileId}.png`));
        dest.on("error", reject);
    });
}
// 🔹 Export the function
module.exports = {
    uploadToDrive,
    listFiles,
    downloadFile,
    
}
