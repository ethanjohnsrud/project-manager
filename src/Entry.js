import React, {Component } from 'react';
import recordIcon from '../src/assets/recordingIcon.png';
import trashIcon from '../src/assets/blackTrash.png';
import upArrow from '../src/assets/blackUpArrow.png';
import downArrow from '../src/assets/blackDownArrow.png';
import './index.css';
import './Entry.css';


class Entry extends Component  {
    constructor(props) {
        super(props);
        this.state={
            totalHourTime: 0,
            totalMinuteTime: 0,
            totalSecondTime: 0,
            priority: 'ERR',
            length: 'ERR',
            showPriorityOptions: false,
            showLengthOptions: false,
            timing: false,
            timer: null
        }
        // console.log('~~~> Entry Active - Loading Data');
    }
    componentDidMount = () => {
        this.configureTotals();
    }
    componentWillReceiveProps = () => {
        this.configureTotals();
    }
    componentWillUnmount = () => {
        if(this.state.timing) //if active end
            this.endTimeNow();
    }
    toggleDisplayList = () => {
        // console.log('Entry.toggleDisplayList() Called.');
        this.setState({displayList: !this.state.displayList});
    }
    configureTotals = () => {
        // console.log('Entry.configureTotals() Called.', this.props.startTime, this.props.endTime);
        if(this.props.endTime !== 0) {  //endtime set
            const totalMilliseconds = parseInt(this.props.endTime) - parseInt(this.props.startTime);
            const totalHours = parseInt((totalMilliseconds/(1000*60*60)));
            const totalMinutes = parseInt((totalMilliseconds/(1000*60))%60);
            const totalSeconds = parseInt((totalMilliseconds/(1000))%60);
            // console.log('Entry_Time_calculated:', totalMilliseconds, totalHours, totalMinutes, totalSeconds);
            this.setState({totalHourTime: totalHours, totalMinuteTime: totalMinutes, totalSecondTime: totalSeconds});
        } 
    }
    titleUpdate = (event) => { 
        // console.log('Entry.titleUpdate() Called.');
        const entry = {title: event.target.value, description: this.props.description, startTime: this.props.startTime, endTime: this.props.endTime}
        this.props.editEntry(this.props.id, entry);
    }
    descriptionUpdate = (event) => {
        // console.log('Entry.descriptionUpdate() Called.');
        const entry = {title: this.props.title, description: event.target.value, startTime: this.props.startTime, endTime: this.props.endTime}
        this.props.editEntry(this.props.id, entry);
    }
    timeMinuteUpdate = (event) => {
        // console.log('Entry.timeMinuteUpdate() Called.');
        const totalMilliseconds = (this.state.totalHourTime*60*60*1000) + (event.target.value*60*1000) + (this.state.totalSecondTime*1000);
        const entry = {title: this.props.title, description: this.props.description, startTime: 0, endTime: totalMilliseconds}
        this.props.editEntry(this.props.id, entry);
        this.setState({totalMinuteTime: event.target.value});
    }
    timeHourUpdate = (event) => { 
        // console.log('Entry.timeHourUpdate() Called.');
        const totalMilliseconds = (event.target.value*60*60*1000) + (this.state.totalMinuteTime*60*1000) + (this.state.totalSecondTime*1000);
        const entry = {title: this.props.title, description: this.props.description, startTime: 0, endTime: totalMilliseconds}
        this.props.editEntry(this.props.id, entry);
        this.setState({totalHourTime: event.target.value});
    }
    startTimeNow = () => {
        // console.log('Entry.startTimeNow() Called.');
        const time = new Date().getTime();
        // console.log('startTime:',time);
        const entry = {title: this.props.title, description: this.props.description, startTime: time, endTime: 0}
        this.props.editEntry(this.props.id, entry);
        this.setState({timing: true, timer: setInterval(()=>{
            const time = new Date().getTime();
            // console.log('countingTime:',time);
            const entry = {title: this.props.title, description: this.props.description, startTime: this.props.startTime, endTime: time}
            this.props.editEntry(this.props.id, entry)
        },1000)});
    }
    endTimeNow = () => {
        // console.log('Entry.endTimeNow() Called.');
        clearInterval(this.state.timer);
        this.setState({timing: false});
        const time = new Date().getTime();
        // console.log('endTime:',time);
        const entry = {title: this.props.title, description: this.props.description, startTime: this.props.startTime, endTime: time}
        this.props.editEntry(this.props.id, entry);
    }
    resetTime = () => {
        // console.log('Entry.resetTime() Called.');
        clearInterval(this.state.timer);
        this.setState({timing: false});
        this.setState({totalHourTime: 0, totalMinuteTime: 0, totalSecondTime: 0});
        const entry = {title: this.props.title, description: this.props.description, startTime: 0, endTime: 0}
        this.props.changeEntry(this.props.id, entry);
        this.forceUpdate();
    }
    deleteEntry = () => {
        this.props.deleteEntry(this.props.id);
    }
    moveEntryUp = () => { this.props.moveUp(this.props.id, true);}
    moveEntryDown = () => { this.props.moveUp(this.props.id, false);}
    addRecord = () => {this.props.addRecord({title: this.props.title, description: this.props.description});}
    render = () => {
        return (
            <div className='entryBox'>
                {(this.state.timing) ?
                <div className='entryTimingHeader'>
                    <input className='entryTimingTitle' value={this.props.title} type='text' onChange={this.titleUpdate} placeholder = 'Entry Title Here!'  spellCheck="false"/>   
                    <section className='entryTimeBox'>
                    <button className='whiteButton' name='endTimeNow' onClick={this.endTimeNow} >STOP</button>
                        {(this.props.startTime === 0 && this.props.endTime === 0) ? null : <button className='whiteButton' name='resetTime' onClick={this.resetTime} >RESET</button>}
                    </section>
                    {this.getTime()}
                </div>
                :
                <div className='entryHeader'>
                    <section className='directionArrowBox'>
                        <img alt={''} src={upArrow} className='arrowIcon' onClick={this.moveEntryUp}/>
                        <img alt={''} src={downArrow} className='arrowIcon' onClick={this.moveEntryDown}/>
                    </section>
                    <input className='entryTitle' value={this.props.title} type='text' onChange={this.titleUpdate} placeholder = 'Entry Title Here!'  spellCheck="false"/>   
                    <section className='entryTimeBox'>
                        {this.getButton()}
                        {(this.props.startTime === 0 && this.props.endTime === 0) ? null : <button className='whiteButton' name='resetTime' onClick={this.resetTime} >RESET</button>}
                    </section>
                    {this.getTime()}
                    <img alt={''} src={recordIcon} className='recordIcon' onClick={this.addRecord}/>
                    <img alt={''} src={trashIcon} className='trashIcon' onClick={this.deleteEntry}/>
                </div>
                }
                {(this.props.description === '') ?
                <textarea className='entryDescription' value={this.props.description}  style={{height: 20}} resize='none' name='description' type='message' onChange={this.descriptionUpdate} placeholder = 'Explain whats happening!'  spellCheck="false"/>
                :
                <textarea className='entryDescription' value={this.props.description}  resize='vertical' style={{height: 50}} name='description' type='message' onChange={this.descriptionUpdate} placeholder = 'Explain whats happening!'  spellCheck="false"/>}
            </div>
        );
    }

    getButton = () => {
        if(this.props.startTime === 0 && this.props.endTime === 0 && (this.props.taskPriority !== 0))
            return(<button className='whiteButton' name='startTimeNow' onClick={this.startTimeNow} >START</button>);
        else if(this.state.timing && (this.props.taskPriority !== 0))
            return(<button className='whiteButton' name='endTimeNow' onClick={this.endTimeNow} >STOP</button>);
        else              //  this.props.endTime !== 0 => null 
            return(null);
    }

    getTime = () => {
        if(this.state.timing)
            return(
                <section className='entryTimeBox'>
                        <label className='entryTimingSubTitle'>Eclipsed: </label>
                        <label className='entryTimingSubTitle'>{this.state.totalHourTime}</label>
                        <label className='entryTimingSubTitle'>:</label>
                        <label className='entryTimingSubTitle'>{this.state.totalMinuteTime}</label>
                        <label className='entryTimingSubTitle'>:</label>
                        <label className='entryTimingSubTitle'>{this.state.totalSecondTime}</label>
                    </section>
            );
        else if(this.props.taskPriority === 0)
            return(
                <section className='entryTimeBox'>
                        <label className='entrySubTitle'>Eclipsed: </label>
                        <label className='entrySubInput'>{this.state.totalHourTime}</label>
                        <label className='entrySubTitle'>:</label>
                        <label className='entrySubInput'>{this.state.totalMinuteTime}</label>
                        <label className='entrySubTitle'>:</label>
                        <label className='entrySubInput'>{this.state.totalSecondTime}</label>
                    </section>
            );
        else
            return(
                <section className='entryTimeBox'>
                        <label className='entrySubTitle'>Eclipsed: </label>
                        <input className='entrySubInput' type='number' onChange={this.timeHourUpdate} value={this.state.totalHourTime} min='0' step='1'/>
                        <label className='entrySubTitle'>:</label>
                        <input className='entrySubInput' type='number' onChange={this.timeMinuteUpdate} value={this.state.totalMinuteTime} min='0' max='59' step='1'/>
                        <label className='entrySubTitle'>:</label>
                        <label className='entrySubInput' type='number'>{this.state.totalSecondTime}</label>
                    </section>
            );
    }
}

export default Entry;
