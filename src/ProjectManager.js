import React, {Component } from 'react';
import Project from './Project';
import './index.css';


class ProjectManager extends Component  {
    constructor(props) {
        super(props);
        this.state={
            projects: [],
            displayChildren: false,
        }
        console.log('~~~> ProjectManager Active - Loading Data');
    }
    deleteProject = (projectID) => {
        this.props.projects.splice(projectID,1);
        this.forceUpdate();
        this.props.saveProjects();
    }
    newProject = () => {
        this.props.projects.unshift({priority: 3, title: '', description: '', rate: 0, tasks: []});
        this.setState({displayChildren: true});
        this.forceUpdate();
        this.props.saveProjects();
    }
    setProject = (projectID, project) => {
        console.log('-Setting Project: ', projectID, project);
        this.props.projects[projectID] = project;
        this.forceUpdate();
        this.props.saveProjects();
    }
    moveToTop = (id) => {
        // console.log("ProjectManager.moveToTop() --called", id);
        if(this.props.projects.length>1){
            for(let i = id; i>0; i--){
                const temp = this.props.projects[i-1];
                this.props.projects[i-1] = this.props.projects[i];
                this.props.projects[i] = temp;
            }
        } 
        this.forceUpdate();
        this.props.saveProjects();
    }
    addRecord = (rec) => {
        this.props.addRecord(rec);
    }
    projectManagerUpdate = () => {
        this.forceUpdate();
        console.log('***ProjectManagerUpdate() -Called!!!');
    }

    render = () => {
        return (
            <div >
                <section className='mainHeader'>
                    <label className='mainTitle'>PROJECT MANAGER</label>
                    <section className='buttonBox'>
                        <button className='whiteButton' onClick={this.newProject}>New Project</button>
                        <button className='whiteButton' onClick={this.props.changeView}>Records</button>
                        {(this.props.saved) ? <label className='whiteSaveIcon' >Saved</label> : <label className='whiteBlankSaveIcon' ></label>}
                    </section>
                </section>
                {this.getProjects()}           
            </div>
        );
    } 
    getProjects = () => {
        if(this.props.projects.length > 0) {
            let returnOrder = [];
            //add id and add entry objects to be sorted
            this.props.projects.forEach((pro, ID) => {
                returnOrder.push( <Project 
                                    key={ID} 
                                    id={ID} 
                                    displayList={this.state.displayChildren} 
                                    priority={pro.priority} 
                                    title={pro.title} 
                                    description={pro.description} 
                                    rate={pro.rate} 
                                    tasks={pro.tasks} 
                                    editProject={this.setProject} 
                                    changeProject={this.changeProject} 
                                    deleteProject={this.deleteProject} 
                                    moveToTop={this.moveToTop} 
                                    addRecord={this.addRecord} 
                                    projectManagerUpdate={this.projectManagerUpdate}
                                    saveProjects={this.props.saveProjects}
                                    />);
            });
            return (<div>{returnOrder}</div>);
        } else
            return  (<div>{null}</div>);
    }
}

export default ProjectManager;
