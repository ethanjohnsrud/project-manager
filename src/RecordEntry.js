import React, {Component } from 'react';
import './index.css';
import './RecordEntry.css';


class RecordEntry extends Component  { //read only
    constructor(props) {
        super(props);
        this.state={
        }
        // console.log('~~~> RecordEntry Active - Loading Data');
    }
    componentDidMount = () => {
    }
    componentWillReceiveProps = () => {
    }
    componentWillUnmount = () => {
    }
    render = () => {
        return (
            <div className='recordEntryBox'>
                <div className='recordEntryHeader'>
                    <input className='recordEntryTitle' value={this.props.title} type='text' onChange={this.titleUpdate} placeholder = 'RecordEntry Title Here!'  spellCheck="false"/>   
                    <label className='recordEntrySubTitle' >{this.props.origin}</label>
                </div>
                <textarea className='recordEntryDescription' value={this.props.description}  resize='both' name='description' type='message' placeholder = 'NO-Title'  spellCheck="false" readOnly/>
            </div>
        );
    }
}

export default RecordEntry;
