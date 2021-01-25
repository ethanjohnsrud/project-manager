import React, {Component } from 'react';
import ProjectManager from './ProjectManager';
import RecordManager from './RecordManager';
import './index.css';

import io from 'socket.io-client';
// const socket = io.connect("http://localhost:5555/", { path: '/socket-io' });
const socket = io.connect("http://localhost:5555/");

 
class App extends Component {
  constructor(props) {
    super(props);
    this.state={
        projects: [],
        records: [],
        recordTags: [],
        view: true,
        saved: false,
        online: false
    }
    console.log('~~~> App Active - Launching Application');
  }
  
  componentDidMount = () => {
    console.log('This is Socket.io: ', socket.io);
    socket.on('connect', () => {
      this.setState({online: true});
        console.log('>>> Client: [connect] Server Connection Established.');
        socket.emit('toServer', 'SOCKET.IO Connection Established!')
    });
    socket.on('disconnect', () => {
      this.setState({online: false});
        console.log('<<< Client: [disconnect] Server Lost Connection.');
    });
    socket.on('fromServer', (data) => {
        console.log(`Client: [fromServer] Receiving from Server: `, data);
    });
    socket.on('saved', (data) => {
      // console.log(`Client: [saved] Server Saved File Successfully`);
      this.setState({saved: true}, () => {
        setTimeout(() => {
          this.setState({saved: false});
        }, 5000);
      })
    });
    socket.on('loadProjects', (rawData) => {
      console.log(`Client: [loadProjects] Saving Project Data Import.`, rawData);
      if(rawData !== null) {
        // const processedData = JSON.parse(rawData.processedData.processedData);
        this.setState({projects: rawData});
        console.log('-> Processed Projects Import: ', rawData);
      }
    });
    socket.on('loadRecords', (rawData) => {
      console.log(`Client: [loadRecords] Saving Records Data Import.`);
      if(rawData !== null) {
        // const processedData = JSON.parse(rawData);
        this.setState({records: rawData});
        console.log('-> Processed Projects Records: ', rawData);
      }
    });
    socket.on('loadRecordTags', (rawData) => {
      console.log(`Client: [loadRecordTags] Saving Record Tags Data Import.`);
      if(rawData !== null) {
        // const processedData = JSON.parse(rawData);
        this.setState({recordTags: rawData});
        console.log('-> Processed Record Tags Import: ', rawData);
      }
    });
  }
  saveProjects = () => {
    // console.log('Client: Sending Projects to Server for Saving.');
    // const processedData = JSON.stringify(this.state.projects);
    socket.emit('saveProjects', this.state.projects);
  }
  saveRecords = () => {
    // console.log('Client: Sending Records to Server for Saving.');
    // const processedData = JSON.stringify(this.state.records);
    socket.emit('saveRecords', this.state.records);
  }
  saveRecordTags = () => {
    // console.log('Client: Sending Record Tags to Server for Saving.');
    // const processedData = JSON.stringify(this.state.recordTags);
    socket.emit('saveRecordTags', this.state.recordTags);
  }
  toggleView = () =>{
    this.setState({view: !this.state.view});
  }
  addRecord = (recordEntry) => {
    this.state.records.unshift({title: recordEntry.title, description: recordEntry.description, tags: [], entry: recordEntry});
    this.saveRecords();
    this.forceUpdate();
  }

  render = () => {
    return (
        <div >
          {(this.state.online) ?
            <section>
              {(this.state.view) ? 
                  <ProjectManager 
                    changeView={this.toggleView} 
                    addRecord={this.addRecord} 
                    projects={this.state.projects}
                    saveProjects={this.saveProjects}
                    saved={this.state.saved}
                    />     
                :
                  <RecordManager 
                    changeView={this.toggleView} 
                    records={this.state.records}
                    recordTags={this.state.recordTags}
                    saveRecords={this.saveRecords}
                    saveRecordTags={this.saveRecordTags}
                    saved={this.state.saved}
                    />
              }
            </section>
            :
            <label>{'Database is Offline -> Please Relaunch Application'}</label>
          }
        </div>
    );
  }
}

export default App;
