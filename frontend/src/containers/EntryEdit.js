import React, { Component } from 'react'
import { entryCategories } from '../static-data'
import { store } from '../store'

const Entries = ({ entriesPool }) => (
  <div className="entries">
      <ul>
        {entriesPool.map(entry => <li>{entry}</li>)}
      </ul>
    </div>
)

class EntryEdit extends Component {
  render(){
    let curState = store.getState()
    let renderCategories = entryCategories.map(category => (
      <div className={category+'-entries'}>
        <h3>{category}</h3>
        <Entries entriesPool={curState.entriesPool[this.props.yr][category]}/>
      </div>
    ))
    return (
      <div className="entries-pool"
        style={{display: (this.props.yr === curState.selectedYr
          && curState.entriesOpen ? 'flex' : 'none')}}>
        {renderCategories}
      </div>
    )
  }
}

export default EntryEdit
