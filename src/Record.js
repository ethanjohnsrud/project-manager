import React, {Component } from 'react';
import RecordEntry from './RecordEntry';
import topArrow from '../src/assets/blackTopArrow.png';
import upArrow from '../src/assets/blackUpArrow.png';
import downArrow from '../src/assets/blackDownArrow.png';
import upIcon from '../src/assets/blackUpDisplay.png';
import downIcon from '../src/assets/blackDownDisplay.png';
import whiteTrashIcon from '../src/assets/whiteTrash.png';
import blackTrashIcon from '../src/assets/blackTrash.png';
import expandIcon from '../src/assets/expand.png';
import contractIcon from '../src/assets/contract.png';
import './index.css';
import './Record.css';
import './RecordEntry.css';


class Record extends Component  {
    constructor(props) {
        super(props);
        this.state={
            displayEntry: false,
            showTagList: false,
            expand: false
        }
        // console.log('~~~> Record Active - Loading Data');
    }
    componentWillMount = () => {
    }
    componentWillReceiveProps = () => {
        this.forceUpdate();
    }
    componentWillUnmount = () => {
    }
     displayEntry = () => {
        // console.log('Task.displayList() Called.');
        this.setState({displayEntry: true});
    }
    hideEntry = () => {
        // console.log('Task.hideList() Called.');
        this.setState({displayEntry: false});
    }
    titleUpdate = (event) => { 
        // console.log('Record.titleUpdate() Called.');
        const record = {title: event.target.value, description: this.props.description, tags: this.props.tags, entry: this.props.entry}
        this.props.editRecord(this.props.id, record);
    }
    descriptionUpdate = (event) => {
        // console.log('Record.descriptionUpdate() Called.');
        const record = {title: this.props.title, description: event.target.value, tags: this.props.tags, entry: this.props.entry}
        this.props.editRecord(this.props.id, record);
    }

    deleteRecord = () => {
        this.props.deleteRecord(this.props.id);
    }

    estimateTitleHeight = () => {
        let rows = 1;
        const windowSize = window.innerWidth * 0.45;  //in pixels
        let windowPixelsUsed = 96; //add/cancel Tag Button
        this.props.tags.forEach((tag) => {
            const tagSize = 63 + (11.5*tag.length);
            if((windowPixelsUsed + tagSize) < windowSize) 
                windowPixelsUsed = windowPixelsUsed + tagSize;
            else {
                rows++;
                windowPixelsUsed = tagSize;
            }
        });
        // console.log('Calculated Height: ', (rows) * 26, windowSize);
        return (rows) * 26; //pixels
    }

    moveRecordToTop = () => { this.props.moveToTop(this.props.id);}
    moveRecordUp = () => { this.props.moveUp(this.props.id, true);}
    moveRecordDown = () => { this.props.moveUp(this.props.id, false);}
    expandDescription = () => {this.setState({expand: !this.state.expand});}

    toggleAddTagsList = () => {this.setState({showTagList: !this.state.showTagList});}

    activateTag = (id) => {
        this.props.allTagButtons[id].active = true;
        this.props.recordManagerUpdate();
     }

     deactivateTag = (id) => {
         this.props.allTagButtons[id].active = false;
         this.props.recordManagerUpdate();
     }

    removeTag = (id) => {
        // console.log('Deleting Tag: ', id, this.props.allTagButtons[id], this.props.tags);
        this.props.tags.forEach((tag, y) => {
            if(tag === this.props.allTagButtons[id].title)
                this.props.tags.splice(y,1);
        });        
        this.props.recordManagerUpdate();
        this.props.saveRecords();
    }

    addTag = (id) => {
        // console.log('Adding Tag: ', id, this.props.allTagButtons[id], this.props.tags);
        let exist = false;
        this.props.tags.forEach((tag) => {  //verify not already in there
            if(tag === this.props.allTags[id])
                exist = true;
        });
        if(!exist) {
            this.props.tags.push(this.props.allTags[id]);
            this.props.recordManagerUpdate();
            this.props.saveRecords();
            }
        this.setState({showTagList: false});
    }

    render = () => {
        return (
            <div className='recordBox'>
                <div className='recordHeader'>
                    <img alt={''} src={topArrow} className='adjustTopIcon' onClick={this.moveRecordToTop}/>
                    <section className='directionArrowBox'>
                        <img alt={''} src={upArrow} className='adjustArrowIcon' onClick={this.moveRecordUp}/>
                        <img alt={''} src={downArrow} className='adjustArrowIcon' onClick={this.moveRecordDown}/>
                    </section>
                    <textarea className='recordTitle' value={this.props.title} style={{height: this.estimateTitleHeight()}} type='text' onChange={this.titleUpdate} placeholder = 'Record Title Here!' spellCheck="false" />   
                    {this.getDisplayIcon()}
                    {this.getAllTags()}
                    {this.getExpandIcon()}
                    <img alt={''} src={blackTrashIcon} className='trashIcon' onClick={this.deleteRecord}/>
                </div>
                {(this.state.expand) ? <textarea className='recordDescription' style={{height: 500}} value={this.props.description}  resize='both' name='description' type='message' onChange={this.descriptionUpdate} placeholder = 'Explain whats happening!'  />
                :  <textarea className='recordDescription' value={this.props.description}  name='description' type='message' onChange={this.descriptionUpdate} placeholder = 'Explain whats happening!'  spellCheck="false"/>}
                {((this.props.entry === null) || (!this.state.displayEntry)) ? null :
                    <RecordEntry title={this.props.entry.title} description={this.props.entry.description} origin={this.props.entry.origin} />
                }
            </div>
        );
    }
    getDisplayIcon = () => {
        // console.log('Record.getDisplayIcon() -called');
        if((this.state.displayEntry) && (this.props.entry !== null))
            return(<img alt={''} src={upIcon} className='displayIcon' onClick={this.hideEntry}/>);
        else if((!this.state.displayEntry) && (this.props.entry !== null))
            return(<img alt={''} src={downIcon} className='displayIcon' onClick={this.displayEntry}/>);
        else
            return(null);
    }

    getExpandIcon = () => {
        // console.log('Record.getExpandIcon() -called');
        if(this.state.expand)
            return(<img alt={''} src={contractIcon} className='adjustTopIcon' onClick={this.expandDescription}/>);
        else 
            return(<img alt={''} src={expandIcon} className='adjustTopIcon' onClick={this.expandDescription}/>);
    }

    getAllTags = () => {
        // console.log('+Received: ', this.props.allTagButtons, this.props.allTagButtons.length, window.innerWidth);
        const windowSize = window.innerWidth * 0.45;  //in pixels
        let windowPixelsUsed = 96; //add/cancel Tag Button
        let fieldAdded = false;
        let currentRow = [];
        let collection = [];
        this.props.allTagButtons.forEach((but,id) => {
            this.props.tags.forEach((tag) => {
                if(but.title === tag) {
                    const tagSize = 63 + (11.5*but.title.length);
                    if((windowPixelsUsed + tagSize) < windowSize) {
                        currentRow.push(this.getTagStyle(but,id));
                        windowPixelsUsed = windowPixelsUsed + tagSize;
                    } else {
                        if(!fieldAdded) {
                            currentRow.push(this.getAddTagButton());
                            if(this.state.showTagList)
                                currentRow.push(<section className="recordAddTagBox">{this.getTagList()}</section>);

                            fieldAdded = true;  //only execute firstTime
                        }
                        
                        collection.push(<section className='recordTagsHeaderBox'>{currentRow}</section>);
                        windowPixelsUsed = tagSize;
                        currentRow = [];
                        currentRow.push(this.getTagStyle(but,id));
                    }
                }
            });
        });
        if(!fieldAdded) {
            currentRow.push(this.getAddTagButton());
            if(this.state.showTagList)
                currentRow.push(<section className="recordAddTagBox">{this.getTagList()}</section>);
        }

        collection.push(<section className='recordTagsHeaderBox'>{currentRow}</section>);
        // console.log('+Returning: ', collection);
        return(<section className='recordTagsCollection'>{collection}</section>);
    }

    getTagStyle = (tag,id) => {
        // console.log('+-Generating: ', tag);
        if(tag.active)//true
            return(
                <section key={id} className='recordTagButtonBoxSelected' value={id} >
                    <button className='recordTagButtonTitleSelected' onClick={()=>this.deactivateTag(id)}>{tag.title}</button>
                    <img alt={''} src={whiteTrashIcon} className='recordTagButtonTrashIcon' value={id} onClick={()=>this.removeTag(id)}/>
                </section>
            );
        else
            return(
                <section className='recordTagButtonBox' value={id} >
                    <button className='recordTagButtonTitle' onClick={()=>this.activateTag(id)}>{tag.title}</button>
                    <img alt={''} src={blackTrashIcon} className='recordTagButtonTrashIcon' value={id} onClick={()=>{this.removeTag(id);}}/>
                </section>
            );
    }

    getAddTagButton = () => {
        if(this.state.showTagList)
            return(<section key={'addTagButton'} className='recordAddTagButtonBox' >
                    <button className='recordAddTagButtonTitle' onClick={this.toggleAddTagsList}>Cancel</button>
                </section>);
        else
            return(<section key={'addTagButton'} className='recordAddTagButtonBox' >
                        <button className='recordAddTagButtonTitle' onClick={this.toggleAddTagsList} read>Add Tag</button>
                    </section>);
    }

    getTagList = () => {
        // console.log('DIsplaying: ', this.props.tags);
        const tagList = [];
        this.props.allTags.forEach((t,id) => {
            tagList.push(<li className='recordAddTagOption' onClick={() => {this.addTag(id)}} key={id}>{t}</li>);
        });
        return(<ol className='recordAddTagContent'>{tagList}</ol>);
    }
}

export default Record;
