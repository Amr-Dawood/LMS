const fs = require('fs');
const { google }= require('googleapis');

const apikeys = require('./Api_Key.json');
const SCOPE = ['https://www.googleapis.com/auth/drive'];

// A Function that can provide access to google drive api
async function authorize(){
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    );

    await jwtClient.authorize();

    return jwtClient;
}

// A Function that will upload the desired file to google drive folder
async function uploadFile(authClient){
    return new Promise((resolve,rejected)=>{
        const drive = google.drive({version:'v3',auth:authClient}); 

        var fileMetaData = {
            name:'mydrivetext.txt',    
            parents:['1IEpoP5jxYa9Ljvcqc5wqLGhJTqeIZgId'] // A folder ID to which file will get uploaded
        }

        drive.files.create({
            resource:fileMetaData,
            media:{
                body: fs.createReadStream('mydrivetext.txt'), // files that will get uploaded
                mimeType:'text/plain'
            },
            fields:'id'
        },function(error,file){
            if(error){
                return rejected(error)
            }
            resolve(file);
        })
    });
}

authorize().then(uploadFile).catch("error",console.error()); // function call