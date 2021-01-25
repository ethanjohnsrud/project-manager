import React, {Component } from 'react';
import './index.css';
import './RecordTagsHeader.css';
import whiteTrashIcon from '../src/assets/whiteTrash.png';
import whiteEditIcon from '../src/assets/whiteTrash.png';
import blackTrashIcon from '../src/assets/blackTrash.png';
import blackEditIcon from '../src/assets/blackTrash.png';


class RecordTagsHeader extends Component  { //read only
    constructor(props) {
        super(props);
        this.state={
            tagButtons:[],
            newField:'',
            editingID: null
        }
        // console.log('~~~> RecordTagsHeader Active - Loading Data', this.props);
    }
    componentWillMount = () => {
    }
    componentWillReceiveProps = () => {
        this.forceUpdate();
    }
    componentWillUnmount = () => {
    }
    newTagFieldChange = (event) => {
        this.setState({newField: event.target.value});
    }
    newTag = (event) => {
        event.preventDefault();
        let exist = false;
        this.props.allTagButtons.forEach((tag) => {  //prevent duplicates
                if(tag.title === this.state.newField)
                    exist = true;
        });
        if(!exist) {
            if(this.state.editingID === null){
                this.props.recordTags.push(this.state.newField); //add to Server
                this.props.allTagButtons.push({title: this.state.newField, active: false}); //add locally
            } else { //editingID == ID
                this.props.recordTags[this.state.editingID] = this.state.newField; //add to Server
                this.props.allTagButtons[this.state.editingID] = {title: this.state.newField, active: false}; //add locally
            }
            this.props.saveRecordTags();
        }
        this.setState({newField:'', editingID: null});
    }
    editTag = (id) => {
        // console.log('Editing Tag: ', id, this.props.allTagButtons[id]);
        this.setState({newField: this.props.allTagButtons[id].title, editingID: id});
    }
    deleteTag = (id) => {
        // console.log('Deleting Tag: ', id, this.props.allTagButtons[id]);
        this.props.allRecords.forEach((rec) => {
            rec.tags.forEach((tag, i) => {
                if(this.props.recordTags[id] === tag)
                    rec.tags.splice(i,1); //should only be one match or nothing
            })
        });
        this.props.recordTags.splice(id,1);
        this.props.allTagButtons.splice(id,1);
        this.props.recordManagerUpdate();
        this.props.saveRecordTags();
    }
    activateTag = (id) => {
       this.props.allTagButtons[id].active = true;
       this.props.recordManagerUpdate();
    }
    deactivateTag = (id) => {
        this.props.allTagButtons[id].active = false;
        this.props.recordManagerUpdate();
    }

    render = () => {
        return (
            <div>
                {this.getAllTags()}
            </div>
        );
    }

    getAllTags = () => {
        // console.log('+Received: ', this.props.allTagButtons, this.props.allTagButtons.length, window.innerWidth);
        const windowSize = window.innerWidth;  //in pixels
        let windowPixelsUsed = 156; //for edit field
        let fieldAdded = false;
        let currentRow = [];
        let collection = [];
        for(let id=0; id<this.props.allTagButtons.length; id++) {
            // console.log('+*called');
            const tagSize = 83 + (11.5*this.props.allTagButtons[id].title.length);
            if((windowPixelsUsed + tagSize) < windowSize) {
                currentRow.push(this.getTagStyle(this.props.allTagButtons[id],id));
                windowPixelsUsed = windowPixelsUsed + tagSize;
            }
            else {
                if(!fieldAdded){
                    currentRow.push(<form key={'NEW'} id={'newTagForm'} onSubmit={this.newTag}>
                                    <input className='newTagField' value={this.state.newField}  onChange={this.newTagFieldChange} name='newTag' type='text' placeholder = 'New Tag'/>
                                </form>);
                    fieldAdded = true;  //only execute firstTime
                }
                
                collection.push(<section className='recordTagsHeaderBox'>{currentRow}</section>);
                windowPixelsUsed = 0;
                currentRow = [];
                currentRow.push(this.getTagStyle(this.props.allTagButtons[id],id));
            }
        }
        if(!fieldAdded){
            currentRow.push(<form key={'NEW'} id={'newTagForm'} onSubmit={this.newTag}>
                            <input className='newTagField' value={this.state.newField}  onChange={this.newTagFieldChange} name='newTag' type='text' placeholder = 'New Tag'/>
                        </form>);
            fieldAdded = true;  //only execute firstTime
        }
        collection.push(<section className='recordTagsHeaderBox'>{currentRow}</section>);
        console.log('+Returning: ', collection);
        return(<section >{collection}</section>);
    }
    getTagStyle = (tag,id) => {
        // console.log('+-Generating: ', tag);
        if(tag.active)//true
            return(
                <section key={id} className='tagButtonBoxSelected' value={id} >
                    <img alt={''} src={whiteEditIcon} className='tagButtonEditIcon' value={id} onClick={()=>this.editTag(id)}/>
                    <button className='tagButtonTitleSelected' onClick={()=>this.deactivateTag(id)}>{tag.title}</button>
                    <img alt={''} src={whiteTrashIcon} className='tagButtonTrashIcon' value={id} onClick={()=>this.deleteTag(id)}/>
                </section>
            );
        else
            return(
                <section key={id} className='tagButtonBox' value={id} >
                    <img alt={''} src={blackEditIcon} className='tagButtonEditIcon' value={id} onClick={()=>this.editTag(id)}/>
                    <button className='tagButtonTitle' onClick={()=>this.activateTag(id)}>{tag.title}</button>
                    <img alt={''} src={blackTrashIcon} className='tagButtonTrashIcon' value={id} onClick={()=>{this.deleteTag(id);}}/>
                </section>
            );
    }
}

export default RecordTagsHeader;
