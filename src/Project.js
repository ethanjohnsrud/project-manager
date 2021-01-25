import React, {Component } from 'react';
import upIcon from '../src/assets/whiteUpDisplay.png';
import downIcon from '../src/assets/whiteDownDisplay.png';
import trashIcon from '../src/assets/whiteTrash.png';
import topArrow from '../src/assets/whiteTopArrow.png';
import Task from './Task';
import './index.css';
import './Project.css';


class Project extends Component  {
    constructor(props) {
        super(props);
        this.state={
            displayList: this.props.displayList,
            displayChildren: false,
            totalTime: 0,
            totalValue: 0,
            priority: 'ERR',
            totalHourTime: 0,
            totalMinuteTime: 0
        }
        // console.log('~~~> Project Active - Loading Data');
        this.configureTotals();
        this.configurePriority();
    }
    componentDidMount = () => {
        this.configureTotals();
        this.configurePriority();
    }
    componentWillReceiveProps = () => {
        this.configureTotals();
        this.configurePriority();
        if(this.props.id === 0)
            this.setState({displayList: true});
    }
    toggleDisplayList = () => {
        // console.log('Project.toggleDisplayList() Called.');
        this.setState({displayList: !this.state.displayList});
    }
    displayList = () => {
        // console.log('Project.displayList() Called.');
        this.setState({displayList: true, displayChildren: false});
    }
    hideList = () => {
        // console.log('Project.hideList() Called.');
        this.setState({displayList: false, displayChildren: false});
    }
    configureTotals = () => {
        // console.log('Project.configureTotals() Called.');
        let totalMilliseconds = 0;
        this.props.tasks.forEach( (tas) => {
            // console.log('Project-checking-TAS: ', totalMilliseconds, tas);
            tas.entries.forEach( (ent) => {
                if(ent.endTime !== 0){ //endtime set
                    totalMilliseconds = totalMilliseconds + (parseInt(ent.endTime) - parseInt(ent.startTime));
                    // console.log('Project-checking-ENT: ', totalMilliseconds, ent);
                }
                // else
                //     console.log('Project-skipped: ', ent);
            });
        });
        const totalHours = parseInt((totalMilliseconds/(1000*60*60)));
        const totalMinutes = parseInt((totalMilliseconds/(1000*60))%60);
        // console.log('Project_Time_calculated:', totalMilliseconds, totalHours, totalMinutes);

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
    titleUpdate = (event) => { 
        // console.log('Project.titleUpdate() Called.');
        const project = {priority: this.props.priority, title: event.target.value, description: this.props.description, rate: this.props.rate, tasks: this.props.tasks}
        this.props.editProject(this.props.id, project);
    }
    descriptionUpdate = (event) => {
        // console.log('Project.descriptionUpdate() Called.');
        const project = {priority: this.props.priority, title: this.props.title, description: event.target.value, rate: this.props.rate, tasks: this.props.tasks}
        this.props.editProject(this.props.id, project);
    }
    rateUpdate = (event) => {
        // console.log('Project.rateUpdate() Called.');
        const project = {priority: this.props.priority, title: this.props.title, description: this.props.description, rate: event.target.value, tasks: this.props.tasks}
        this.props.editProject(this.props.id, project);
    }
    priorityUpdate = () => {
        // console.log('Project.priorityUpdate() Called.');
        let newPriority = 0;
        switch(this.props.priority) {
            case 0:
                newPriority = 1;
                break;
            case 1:
                newPriority = 2;
                break;
            case 2:
                newPriority = 3;
                break;
            case 3:
                newPriority = 0;
                break;
            default: 
        }
        const project = {priority: newPriority, title: this.props.title, description: this.props.description, rate: this.props.rate, tasks: this.props.tasks}
        this.props.editProject(this.props.id, project);
    }
    deleteTask = (taskID) => {
        this.props.tasks.splice(taskID,1);
        this.forceUpdate();
        this.props.saveProjects();
    }
    newTask = () => {
        this.props.tasks.unshift({priority: 3, length: 1, title: '', description: '', entries: []});
        this.setState({displayList: true, displayChildren: true});
        // this.forceUpdate();
        this.props.saveProjects();
    }
    setTask = (taskID, task) => {
        // console.log('-Setting Task: ', taskID, task);
        this.props.tasks[taskID] = task;
        this.forceUpdate();
        this.props.saveProjects();
    }
    changeTask = (taskID, task) => {
        // console.log('-Setting Task: ', taskID, task);
        this.props.tasks[taskID] = task;
        this.setState({displayList: false});
        setTimeout(()=>{this.setState({displayList: true})}, 100);
        this.forceUpdate();
        this.props.saveProjects();
    }
    deleteProject = () => {
        this.props.deleteProject(this.props.id);
    }
    managerUpdate = () => {
        this.props.managerUpdate();
    }
    moveToTop = () => { this.props.moveToTop(this.props.id);}
    addRecord = (rec) => {
        this.props.addRecord({title: rec.title, description: rec.description, origin: `${this.props.title} : ${rec.origin}`});
    }

    render = () => {
        return (
            <div className='projectBox'>
                <section className='projectHeader'>
                    <img alt={''}  src={topArrow} className='upArrowIcon' onClick={this.moveToTop}/>
                    <input className='projectTitle' value={this.props.title} type='text' onChange={this.titleUpdate} placeholder = 'Project Title Here!'  />   
                    {this.getDisplayIcon()}
                    <section className='buttonBox'>
                        <button className='blackButton' onClick={this.newTask}>New Task</button>
                    </section>
                    <section className='projectTimeBox'>
                        <label className='projectSubTitle'>Rate: $</label>
                        <input className='projectSubInput' value={this.props.rate}  type='number' step='0.01' onChange={this.rateUpdate} placeholder = 'Rate!'  spellCheck="false"/>   
                    </section>
                    <section className='projectTimeBox'>
                        <label className='projectSubTitle'>Accumulated: $ {this.state.totalValue.toFixed(2)}</label>
                    </section>
                    <section className='projectTimeBox'>
                        <label className=' projectSubInput' type='number' >{this.state.totalHourTime}</label>
                        <label className='projectSubTitle'>:</label>
                        <label className='projectSubInput' type='number'>{this.state.totalMinuteTime}</label>
                    </section>
                    <img alt={''}  src={trashIcon} className='trashIcon' onClick={this.deleteProject}/>
                </section>
                {this.state.displayList ? 
                    <div className='maxSize'>
                        <textarea className='projectDescription' value={this.props.description}  name='description' resize='vertical' type='message' onChange={this.descriptionUpdate} placeholder = 'Explain the Goal!'  spellCheck="false"/>   
                        {this.getTasks()}
                        {/* {(this.props.tasks.length > 0) ?
                            <div>{this.props.tasks.map((tas, ID) => {
                                return( <Task key={ID} id={ID} priority={tas.priority} title={tas.title} description={tas.description} rate={this.props.rate} entries={tas.entries} editTask={this.setTask} />);
                            })}</div> : null} */}
                    </div> 
                : <div onClick={this.displayList}> { (this.props.tasks.length > 0) ? <figure className='projectLine' ></figure> : null } </div> }
            </div>
        );
    }
    getTasks = () => {
        if(this.props.tasks.length > 0) {
            let returnOrder = [];
            //add id and add entry objects to be sorted
            this.props.tasks.forEach((tas, ID) => {
                returnOrder.push( <Task 
                                    key={ID} 
                                    id={ID} 
                                    displayList={this.state.displayChildren} 
                                    priority={tas.priority} 
                                    length={tas.length} 
                                    title={tas.title} 
                                    description={tas.description} 
                                    rate={this.props.rate} 
                                    entries={tas.entries} 
                                    editTask={this.setTask} 
                                    changeTask={this.changeTask} 
                                    deleteTask={this.deleteTask} 
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
    getDisplayIcon = () => {
        // console.log('Project.getDisplayIcon() -called');
        if(this.state.displayList)
            return(<img alt={''}  src={upIcon} className='displayIcon' onClick={this.hideList}/>);
        else
            return(<img alt={''}  src={downIcon} className='displayIcon' onClick={this.displayList}/>);
    }
}


export default Project;
