//--------------------------------------------------------------
//------------------EXPRESS SERVER SETUP -----------------------
//--------------------------------------------------------------

const express = require('express');
const app = express();
const path = require('path');
const http = require('http').createServer(app);

const serverPort = 5555;
let serverResponse = 0;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname , 'build' , 'index.html'));
});

const server = http.listen(serverPort, () => {
    console.log("Listening on port: " + serverPort);
});


//------------------------------------------------------------------------
//-------------------------SOCKET.IO--------------------------------------
//------------------------------------------------------------------------
const io = require('socket.io')(http);
// const io = require('socket.io')(http, { path: '/socket-io' });
// const socketio = require('socket.io');
const fs = require('fs');

const saveProjectsFile = 'savedProjects.json';
const saveRecordsFile = 'savedRecords.json';
const saveRecordTagsFile = 'savedRecordTags.json';


//SOCKET.IO
io.on('connect',(socket)=>{
    console.log(`${serverResponse++}:`);   
    console.log('+++ Server: Client Connection Established...');
    socket.emit('fromServer','Welcome to the Socket.IO Server!');  
    
    //Importing Data: Projects
    try {
        if(fs.existsSync(saveProjectsFile)){  //stays in JSON format
            const projects = fs.readFileSync(saveProjectsFile);
            const processedData = JSON.parse(projects); //second parse locally
            io.emit('loadProjects',processedData); //to everyone
            console.log(`>-Finished Importing: ${saveProjectsFile}`,);
        } else
            console.log('>-No Saved Data Found-<','\n', '-> No Importing...');
    } catch( err){ console.log(`ERROR: Failed to Read: ${saveProjectsFile}`, err);}

    //Importing Data: Records
    try {
        if(fs.existsSync(saveRecordsFile)){  //stays in JSON format
            const records = fs.readFileSync(saveRecordsFile);
            const processedData = JSON.parse(records);  //second parse locally
            io.emit('loadRecords',processedData); //to everyone
            console.log(`>-Finished Importing: ${saveRecordsFile}`);
        } else
            console.log('>-No Saved Data Found-<','\n', '-> No Importing...');
    } catch( err){ console.log(`ERROR: Failed to Read: ${saveRecordsFile}`, err);}

    //Importing Data: Record Tags
    try {
        if(fs.existsSync(saveRecordTagsFile)){  //stays in JSON format
            const recordTags = fs.readFileSync(saveRecordTagsFile);
            const processedData = JSON.parse(recordTags); //second parse locally
            io.emit('loadRecordTags',processedData); //to everyone
            console.log(`>-Finished Importing: ${saveRecordTagsFile}`);
        } else
            console.log('>-No Saved Data Found-<','\n', '-> No Importing...');
    } catch( err){ console.log(`ERROR: Failed to Read: ${saveRecordTagsFile}`, err);}


    socket.on('toServer',(data)=>{
        console.log(`${serverResponse++}:`);
        console.log('### Server: [toServer] Information Received: ',data);
    });

    socket.on('serverReturn',(data)=>{
        console.log(`${serverResponse++}:`);
        console.log(`Server: [serverReturn] DATA: ${data}`);
        io.emit('fromServer',{data}); //to everyone
    });

    socket.on('disconnect',()=>{
        console.log(`${serverResponse++}:`);
        console.log('--- Server: Client Connection Lost...');
    });

    socket.on('saveProjects',(projects)=>{  //stays in JSON FORMAT
        console.log(`${serverResponse++}:`);
    //     console.log(`Server: [saveProjects] DATA: ${projects}`, projects);
        const jsonData = JSON.stringify(projects);  //second parse locally
        fs.writeFileSync(saveProjectsFile, jsonData);
        console.log(`>-Saving Projects to File: ${saveProjectsFile}`);
        io.emit('saved');
    });
    socket.on('saveRecords',(records)=>{
        console.log(`${serverResponse++}:`);
    //     console.log(`Server: [saveRecords] DATA: ${records}`);
        const jsonData = JSON.stringify(records); //second parse locally
        fs.writeFileSync(saveRecordsFile, jsonData);
        console.log(`>-Saving Records to File: ${saveRecordsFile}`);
        io.emit('saved');
    });
    socket.on('saveRecordTags',(recordTags)=>{
        console.log(`${serverResponse++}:`);
    //     console.log(`Server: [saveRecordTags] DATA: ${recordTags}`);
        const jsonData = JSON.stringify(recordTags); //second parse locally
        fs.writeFileSync(saveRecordTagsFile, jsonData);
        console.log(`>-Saving Record Tags to File: ${saveRecordTagsFile}`);
        io.emit('saved');
    });
});
