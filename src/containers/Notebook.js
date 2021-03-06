import React, { Component } from 'react';
import TableEdit from './TableEdit.js'
import EntryEdit from './EntryEdit.js'
import { store } from '../store'
import { resetMsg } from '../actions'
import '../css/edit.css'

class Notebook extends Component {
  timedMsg(msg){
    setTimeout(() => store.dispatch(resetMsg()), 3000)
    return msg
  }

  render(){
    let curState = store.getState()
    return (
      <div className={"notebook" + (this.props.yr === curState.tabs.selectedYr ? " selected-notebook" : "")}
        id={`${this.props.yr}-notebook`}>
        <TableEdit yr={this.props.yr}/>
        <h3>{curState.h3Message.msg !== '' ? this.timedMsg(curState.h3Message.msg) : ''}</h3>
        <EntryEdit yr={this.props.yr}/>
      </div>
    )
  }
}

export default Notebook
