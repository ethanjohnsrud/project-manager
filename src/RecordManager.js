import React, {Component } from 'react';
import RecordTagsHeader from './RecordTagsHeader';
import Record from './Record';
import './index.css';


class RecordManager extends Component {
    constructor(props) {
        super(props);
        this.state={
            display: true,
            allTagButtons:[],
            displayRecords: [],
            searchContents: ''
        }
        // console.log('~~~> RecordManager Active - Loading Data', this.props);
    } 
    componentWillMount = () => {
        // console.log('%MOUNTING', this.props);
        // this.importTags();
        // this.getDisplayRecords();
    }
    componentWillReceiveProps = () => {
        // console.log('%RECEIVED', this.props);
        // this.importTags();
        // this.getDisplayRecords();
    }
    componentWillUnmount = () => {
    }
    importTags = () => {
        console.log('+++RecordTagsHeader: Received Tags: ', this.props.recordTags);
        this.props.recordTags.forEach(tag => {
            let match = false;
            this.state.allTagButtons.forEach((t) => { //prevent duplicates on refresh
                if(t.title === tag)
                    match = true;
            });
            if(!match)
            this.state.allTagButtons.push({title: tag, active: false});
        });
        //tagsMatching
        this.state.allTagButtons.forEach((but) => {
            if(but.active === true) {
                this.state.displayRecords.forEach((rec, i) => {
                    let match = false;
                    this.props.records[i].tags.forEach((tag) => {
                        if(but.title === tag)
                            match = true;
                    });
                    if(!match)
                        rec.matches = 0;
                });
            }
        });
    }  

    getDisplayRecords = () => {
        console.log('%getDisplayRecords-Called');
        this.state.displayRecords.splice(0, this.state.displayRecords.length); //clear
        if(this.state.searchContents === null || this.state.searchContents === '') {
            this.props.records.forEach((rec, i) => { //Initialize
            this.state.displayRecords.push({id: i, matches: 1});
            });
        } else {
            const searchCriteria = this.state.searchContents.trim().split(' '); //array of words
            // console.log('%Calculating Search Matches', this.state.searchContents, searchCriteria, this.props.records);
            // let returnOrder = [];
            this.props.records.forEach((rec, id) => {
                // console.log('%Checking: ', rec);
                let matches = 0;
                    //Go through Title
                    searchCriteria.forEach((ser) => { //linear search
                        // console.log('%Checking with: ', ser, rec.title);
                        let i = 0;
                        while ((i + ser.length) <= rec.title.length) {
                            let j = 0;
                            while ((rec.title.charAt(i + j).toLowerCase() === ser.charAt(j).toLowerCase()) && (rec.title.charAt(i + j).toLowerCase() !== '')) {
                                // console.log(`%Comparing >${rec.title.charAt(i + j).toLowerCase()}< && >${ser.charAt(j).toLowerCase()}< `);
                                j += 1;
                                if (j >= ser.length){
                                    // console.log('%MAATCH');
                                    matches = matches + 2;
                                }
                            }
                            i += 1;
                        }
                    });
                    //Go through Description
                    searchCriteria.forEach((ser) => { //linear search
                        let i = 0;
                        while ((i + ser.length) <= rec.description.length) {
                            let j = 0;
                            while ((rec.description.charAt(i + j).toLowerCase() === ser.charAt(j).toLowerCase())  && (rec.description.charAt(i + j).toLowerCase() !== '')) {
                                j += 1;
                                if (j >= ser.length)
                                    matches++;
                            }
                            i += 1;
                        }
                    });
                    //Go through Tags
                    rec.tags.forEach((tag) => {
                        searchCriteria.forEach((ser) => { //linear search
                            let i = 0;
                            while ((i + ser.length) <= tag.length) {
                                let j = 0;
                                while ((tag.charAt(i + j).toLowerCase() === ser.charAt(j).toLowerCase()) && (tag.charAt(i + j).toLowerCase() !== ''))  {
                                    j += 1;
                                    if (j >= ser.length)
                                        matches = matches + 5;
                                }
                                i += 1;
                            }
                        });
                    });
                //Find Location in list
                let added = false;
                this.state.displayRecords.forEach((item,k) => {
                    if((matches > item.matches) && !added){
                        added = true;
                        this.state.displayRecords.splice(k,0,{id: id, matches: matches});
                    } 
                });
                if(!added)
                    this.state.displayRecords.push({id: id, matches: matches});
                // console.log('%List so far:', this.state.displayRecords);
            });
        }      
        // this.recordManagerUpdate();  
        // console.log('%Showing Results:', this.state.displayRecords); 
        return;  
    }

    searchContentsUpdate = (event) => {
        this.setState({searchContents: event.target.value});
    }


    deleteRecord = (recordID) => {
        this.props.records.splice(recordID,1);
        this.forceUpdate();
        this.props.saveRecords();
    }
    newRecord = () => {
        this.props.records.unshift({title: '', description: '', tags: [], entry: null});
        this.forceUpdate();
        this.props.saveRecords();
    }
    setRecord = (recordID, record) => {
        // console.log('-Setting Record: ', recordID, record);
        this.props.records[recordID] = record;
        this.forceUpdate();
        this.props.saveRecords();
    }
    moveToTop = (id) => {
        // console.log("RecordManager.moveToTop() --called", id);
        if(this.props.records.length>1){
            for(let i = id; i>0; i--){
                const temp = this.props.records[i-1];
                this.props.records[i-1] = this.props.records[i];
                this.props.records[i] = temp;
            }
        } 
        this.recordManagerUpdate();
        this.props.saveRecords();
    }
    moveRecord = (id, up) => {
        // console.log("RecordManager.moveRecord() --called", id, up);
        if(up && (id !== 0) && (this.props.records.length>1)){
            const temp = this.props.records[id-1];
            this.props.records[id-1] = this.props.records[id];
            this.props.records[id] = temp;
        } else if(!up && (id !== (this.props.records.length-1)) && (this.props.records.length>1)) {
            const temp = this.props.records[id+1];
            this.props.records[id+1] = this.props.records[id];
            this.props.records[id] = temp;
        }
        this.recordManagerUpdate();
        this.props.saveRecords();
    }
    recordManagerUpdate = () => {
        this.setState({display: false});
        setTimeout(()=>{this.setState({display: true})}, 150);
        this.forceUpdate();
        // console.log('***RecordManagerUpdate() -Called!!!');
    }

    render = () => {
        return (
            <div >
                <section className='mainHeader'>
                    <label className='mainTitle'>RECORD MANAGER</label>
                        <input className='whiteSearchField' value={this.state.searchContents} type='text' onChange={this.searchContentsUpdate} placeholder = 'Search Records' />
                    <section className='buttonBox'>
                        <button className='whiteButton' onClick={this.newRecord}>New Record</button>
                        <button className='whiteButton' onClick={this.props.changeView}>Projects</button>
                        {(this.props.saved) ? <label className='whiteSaveIcon' >Saved</label> : <label className='whiteBlankSaveIcon' ></label>}
                    </section>
                </section>
                {(this.state.display) ?
                <section>
                    <RecordTagsHeader 
                        recordTags={this.props.recordTags}
                        allTagButtons={this.state.allTagButtons}
                        allTags={this.props.recordTags}
                        allRecords={this.props.records}
                        saveRecordTags={this.props.saveRecordTags}
                        recordManagerUpdate={this.recordManagerUpdate}
                        />
                    {this.getRecords()}  
                </section>
                : null }         
            </div>
        );
    } 
    getRecords = () => {
        // console.log('%SEEING', this.props);
        this.getDisplayRecords();
        this.importTags();
        if(this.props.records.length > 0) {
            let returnOrder = [];
            this.state.displayRecords.forEach((place, k) => {
                let rec = this.props.records[place.id];
                if(place.matches > 0)
                    returnOrder.push( <Record 
                                    key={place.id} 
                                    id={place.id} 
                                    title={rec.title} 
                                    description={rec.description} 
                                    tags={rec.tags}
                                    entry={rec.entry} 
                                    editRecord={this.setRecord} 
                                    deleteRecord={this.deleteRecord} 
                                    moveToTop={this.moveToTop} 
                                    moveUp={this.moveRecord} 
                                    recordManagerUpdate={this.recordManagerUpdate}
                                    saveRecords={this.props.saveRecords}
                                    allTagButtons={this.state.allTagButtons}
                                    allTags={this.props.recordTags}
                                    />);
            });
            return (<div>{returnOrder}</div>);
        } else
            return  (<div>{null}</div>);
    }
}

export default RecordManager;
