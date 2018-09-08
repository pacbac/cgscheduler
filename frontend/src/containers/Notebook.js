import React, { Component } from 'react';
import TableEdit from './TableEdit.js'
import EntryEdit from './EntryEdit.js'
import OptionBtns from './OptionBtns.js'
import { store } from '../store'

class Notebook extends Component {

  render(){
    let curState = store.getState()
    return (
      <div className={"notebook" + (this.props.yr === curState.selectedYr ? " selected-notebook" : "")}
        id={`${this.props.yr}-notebook`}>
        <TableEdit yr={this.props.yr}/>
          <OptionBtns/>
        <EntryEdit yr={this.props.yr}/>
      </div>
    )
  }
}

export default Notebook
