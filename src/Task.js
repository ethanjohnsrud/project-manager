import React, {Component } from 'react';
import upIcon from '../src/assets/blackUpDisplay.png';
import downIcon from '../src/assets/blackDownDisplay.png';
import trashIcon from '../src/assets/blackTrash.png';
import Entry from './Entry';
import './index.css';
import './Task.css';


class Task extends Component  {
    constructor(props) {
        super(props);
        this.state={
            displayList: this.props.displayList,
            showPriorityOptions: false,
            showLengthOptions: false,
            totalTime: 0,
            totalValue: 0,
            priority: 'ERR',
            length: 'ERR',
            totalHourTime: 0,
            totalMinuteTime: 0,
        }
        // console.log('~~~> Task Active - Loading Data');
    }

    componentDidMount = () => {
        this.configureTotals();
        this.configurePriority();
        this.configureLength();
    }
    componentWillReceiveProps = () => {
        this.configureTotals();
        this.configurePriority();
        this.configureLength();
        if(this.props.id === 0)
            this.setState({displayList: true});
    }
    toggleDisplayList = () => {
        // console.log('Task.toggleDisplayList() Called.');
        this.setState({displayList: !this.state.displayList});
    }
    displayList = () => {
        // console.log('Task.displayList() Called.');
        this.setState({displayList: true});
    }
    hideList = () => {
        // console.log('Task.hideList() Called.');
        this.setState({displayList: false});
    }
    configureTotals = () => {
        // console.log('Task.configureTotals() Called.');
        let totalMilliseconds = 0;
        this.props.entries.forEach( (ent) => {
            if(ent.endTime !== 0) //endtime set
                totalMilliseconds = totalMilliseconds + (parseInt(ent.endTime) - parseInt(ent.startTime));
        });
        const totalHours = parseInt((totalMilliseconds/(1000*60*60)));
        const totalMinutes = parseInt((totalMilliseconds/(1000*60))%60);
        // console.log('Task_Time_calculated:', totalMilliseconds, totalHours, totalMinutes);

        let totalValue = (this.props.rate) * (totalHours + (totalMinutes/60.0));
        this.setState({totalHourTime: totalHours, totalMinuteTime: totalMinutes, totalValue: totalValue}); 
    }
    configurePriority = () => {
        switch(this.props.priority) {
            case 0:
                this.setState({priority: 'DONE'});
                break;
            case 1:
                this.setState({priority: 'LOW'});
                break;
            case 2:
                this.setState({priority: 'MED'});
                break;
            case 3:
                this.setState({priority: 'HIGH'});
                break;
            default:
                this.setState({priority: 'ERR'});
                break;
        }
    }
    configureLength = () => {
        switch(this.props.length) {
            case 0:
                this.setState({length: 'QUICK'});
                break;
            case 1:
                this.setState({length: 'GENERAL'});
                break;
            case 2:
                this.setState({length: 'EXTENSIVE'});
                break;
            default:
                this.setState({length: 'ERR'});
                break;
        }
    }
    titleUpdate = (event) => { 
        // console.log('Task.titleUpdate() Called.');
        const task = {priority: this.props.priority, length: this.props.length, title: event.target.value, description: this.props.description, entries: this.props.entries}
        this.props.editTask(this.props.id, task);
    }
    descriptionUpdate = (event) => {
        // console.log('Task.descriptionUpdate() Called.');
        const task = {priority: this.props.priority, length: this.props.length, title: this.props.title, description: event.target.value, entries: this.props.entries}
        this.props.editTask(this.props.id, task);
    }
    deleteEntry = (entryID) => {
        this.props.entries.splice(entryID,1);
        this.forceUpdate();
        this.props.saveProjects();
    }
    newEntry = () => {
        this.props.entries.unshift({title: '', description: '', startTime: 0, endTime: 0});
        this.setState({displayList: true});
        this.forceUpdate();
        this.props.saveProjects();
    }
    setEntry = (entryID, entry) => {
        // console.log('-Setting Entry: ', entryID, entry);
        this.props.entries[entryID] = entry;
        // this.setState({displayList: false});
        this.forceUpdate();
        this.props.saveProjects();
    }
    changeEntry = (entryID, entry) => {
        // console.log('-Setting Entry: ', entryID, entry);
        this.props.entries[entryID] = entry;
        // this.setState({displayList: false});
        setTimeout(()=>{this.setState({displayList: true})}, 150);
        this.forceUpdate();
        this.props.saveProjects();
    }
    moveEntry = (id, up) => {
        // console.log("Task.moveEntry() --called", id, up);
        if(up && (id !== 0) && (this.props.entries.length>1)){
            const temp = this.props.entries[id-1];
            this.props.entries[id-1] = this.props.entries[id];
            this.props.entries[id] = temp;
        } else if(!up && (id !== (this.props.entries.length-1)) && (this.props.entries.length>1)) {
            const temp = this.props.entries[id+1];
            this.props.entries[id+1] = this.props.entries[id];
            this.props.entries[id] = temp;
        }
        setTimeout(()=>{this.setState({displayList: true})}, 150);
        this.forceUpdate();
        this.props.saveProjects();
    }
    deleteTask = () => {
        this.props.deleteTask(this.props.id);
    }
    setPriority = (event) => {
        // console.log('--+Selecting Priority: ', event.target.value);
        let newPriority = 'ERR';
        if(event.target.value === 0){
            newPriority = 'DONE';
            // console.log('-++Setting DONE');
        } else if(event.target.value === 1){
            newPriority = 'LOW';
            // console.log('-++Setting LOW');
        } else if(event.target.value === 2){
            newPriority = 'MED';
            // console.log('-++Setting MED');
        } else if(event.target.value === 3){
            newPriority = 'HIGH';
            // console.log('-++Setting High');
        }
        this.setState({priority: newPriority, showPriorityOptions: false});
        const task = {priority: event.target.value, length: this.props.length, title: this.props.title, description: this.props.description, entries: this.props.entries}
        this.props.changeTask(this.props.id, task);
    }
    setLength = (event) => {
        let newLength = 'ERR';
        if(event.target.value === 0){
            newLength = 'QUICK';
        } else if(event.target.value === 1){
            newLength = 'GENERAL';
        } else if(event.target.value === 2){
            newLength = 'EXTENSIVE';
        }
        this.setState({length: newLength, showLengthOptions: false});
        const task = {priority: this.props.priority, length: event.target.value, title: this.props.title, description: this.props.description, entries: this.props.entries}
        this.props.changeTask(this.props.id, task);
    }
    showPrioritySelection = () => {
        this.setState({showPriorityOptions: true});
    }
    showLengthSelection = () => {
        this.setState({showLengthOptions: true});
    }
    addRecord = (rec) => {
        this.props.addRecord({title: rec.title, description: rec.description, origin: this.props.title});
    }
    managerUpdate = () => {
        this.props.managerUpdate();
    }

    render = () => {
        return (
            <div>{this.getWindow()}</div>
        );
    }
    getWindow = () => {
        if(this.props.priority === 0)
            return(<div className='taskGeneralBox'>{this.getContent()}</div>);
        switch(this.props.length) {
            case 0:
                return(<div className='taskQuickBox'>{this.getContent()}</div>);
            case 1:
                return(<div className='taskGeneralBox'>{this.getContent()}</div>);
            case 2:
                return(<div className='taskExtensiveBox'>{this.getContent()}</div>);
            default:
        }
    }
    getContent = () => {
        switch(this.props.priority) {
            case 0:
                return(<section className='maxSize'>
                            {this.getHeader('taskDoneHeader')}
                            {this.state.displayList ? 
                                <div className='maxSize'>
                                {this.getDescription()}
                                {this.getEntries()}
                                </div> 
                            : <div className='center' onClick={this.displayList}> { (this.props.entries.length > 0) ? <figure className='taskLine' ></figure> : null } </div> }
                        </section>);
            case 1:
                return(<section className='maxSize'>
                    {this.getHeader('taskLowHeader')}
                        {this.state.displayList ? 
                            <div className='maxSize'>
                            {this.getDescription()}
                            {this.getEntries()}
                            </div> 
                        : <div className='center' onClick={this.displayList}> { (this.props.entries.length > 0) ? <figure className='taskLine' ></figure> : null } </div> }
                    </section>);
            case 2:
                return(<section className='maxSize'>
                    {this.getHeader('taskMedHeader')}
                        {this.state.displayList ? 
                            <div className='maxSize'>
                            {this.getDescription()}
                            {this.getEntries()}
                            </div> 
                        : <div className='center' onClick={this.displayList}> { (this.props.entries.length > 0) ? <figure className='taskLine' ></figure> : null } </div> }
                    </section>);
            case 3:
                return(<section className='maxSize'>
                        {this.getHeader('taskHighHeader')}
                        {this.state.displayList ? 
                            <div className='maxSize'>
                            {this.getDescription()}
                            {this.getEntries()}
                            </div> 
                        : <div className='center' onClick={this.displayList}> { (this.props.entries.length > 0) ? <figure className='taskLine' ></figure> : null } </div> }
                    </section>);
            default:
        }
    }

    getHeader = (classType) => {
        return(
            <div className={classType}>
                {(!this.state.showPriorityOptions) ?
                    <button className='priorityButton' name='priority' onClick={this.showPrioritySelection}>{this.state.priority}</button>
                    :
                    <section className="taskPriorityBox">
                        <ol className='taskPriorityContent'>
                        <li className='taskPriorityOption' onClick={this.setPriority} key={3} value={3} >HIGH</li>
                        <li className='taskPriorityOption' onClick={this.setPriority} key={2} value={2} >MED</li>
                        <li className='taskPriorityOption' onClick={this.setPriority} key={1} value={1} >LOW</li>
                        <li className='taskPriorityOption' onClick={this.setPriority} key={0} value={0} >DONE</li>
                        </ol>
                    </section>
                }
                <input className='taskTitle' value={this.props.title}  name='description' type='text' onChange={this.titleUpdate} placeholder = 'Task Title Here!'  spellCheck='false'/>   
                {(this.props.priority !== 0) ?
                    <div>
                        {(!this.state.showLengthOptions) ?
                        <button className='lengthButton' name='length' onClick={this.showLengthSelection}>{this.state.length}</button>
                        :
                        <section className="taskLengthBox">
                            <ol className='taskLengthContent' >
                                <li className='taskLengthOption' onClick={this.setLength} key={0} value={0} >QUICK</li>
                                <li className='taskLengthOption' onClick={this.setLength} key={1} value={1} >GENERAL</li>
                                <li className='taskLengthOption' onClick={this.setLength} key={2} value={2} >EXTENSIVE</li>
                            </ol>
                        </section>
                        }
                    </div>
                : null}
                {this.getDisplayIcon()}
                {(this.props.priority !== 0) ?
                    <section className='buttonBox'>
                        <button className='whiteButton' onClick={this.newEntry}>New Entry</button>
                    </section>
                : null}
                <section className='taskTimeBox'>
                    <label className='taskSubTitle'>Cost: $ {this.state.totalValue.toFixed(2)}</label>
                </section>
                <section className='taskTimeBox'>
                    <label className='taskSubTitle'>Accumulated:</label>
                    <label className=' taskSubInput' type='number' >{this.state.totalHourTime}</label>
                    <label className='taskSubTitle'>:</label>
                    <label className='taskSubInput' type='number'>{this.state.totalMinuteTime}</label>
                </section>
                <img alt={''} src={trashIcon} className='trashIcon' onClick={this.deleteTask}/>
            </div>
        );
    }

    getEntries = () => {
        if(this.props.entries.length > 0) {
            let returnOrder = [];
            //add id and add entry objects to be sorted
            this.props.entries.forEach((ent, ID) => {
                returnOrder.push( <Entry 
                                    key={ID} 
                                    id={ID} 
                                    taskPriority={this.props.priority} 
                                    title={ent.title} 
                                    description={ent.description} 
                                    startTime={ent.startTime} 
                                    endTime={ent.endTime} 
                                    editEntry={this.setEntry} 
                                    changeEntry={this.changeEntry} 
                                    deleteEntry={this.deleteEntry} 
                                    moveUp={this.moveEntry} 
                                    addRecord={this.addRecord} 
                                    managerUpdate={this.managerUpdate}
                                    saveProjects={this.props.saveProjects}
                                    />);
            });
            //Sort List by recently used.
            for(let i = 0; i<returnOrder.length; i++) {  //Insertion Sort Algorithm   //largest to smallest
                let j = i-1;  
                let key = returnOrder[i];
                while (j >= 0 && returnOrder[j].props.priority < key.props.priority)  {    //move upwards, difference is
                    returnOrder[j+1] = returnOrder[j];
                    j--; 
                } 
                returnOrder[j+1] = key;
            }
            return (<div>{returnOrder}</div>);
        } else
            return  (<div>{null}</div>);
    }

    getDescription = () => {
        if(this.props.description === '')
            return(<textarea className='taskDescription' value={this.props.description}  name='description' type='message' style={{height: 20}} resize='none'  onChange={this.descriptionUpdate} placeholder = 'Explain the Goal!'  spellCheck='false'/>);
        else
            return(<textarea className='taskDescription' value={this.props.description}  name='description' type='message' style={{height: 70}} resize='vertical'  onChange={this.descriptionUpdate} placeholder = 'Explain the Goal!'  spellCheck='false'/>);
    }

    getDisplayIcon = () => {
        // console.log('Project.getDisplayIcon() -called');
        if(this.state.displayList)
            return(<img alt={''} src={upIcon} className='displayIcon' onClick={this.hideList}/>);
        else
            return(<img alt={''} src={downIcon} className='displayIcon' onClick={this.displayList}/>);
    }
}

export default Task;
