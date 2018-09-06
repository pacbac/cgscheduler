import React, { Component } from 'react';
import TableEdit from './TableEdit.js'
import EntryEdit from './EntryEdit.js'

class Notebook extends Component {

  render(){
    return (
      <div className={"notebook" + (this.props.yr === this.props.selectedYr ? " selected-notebook" : "")}
        id={`${this.props.yr}-notebook`}>
        <TableEdit categories={this.props.categories}
          dates={this.props.dates}
          edits={this.props.edits}/>
        <EntryEdit/>
      </div>
    )
  }
}

export default Notebook
