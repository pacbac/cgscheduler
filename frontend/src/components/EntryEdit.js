import React, { Component } from 'react'

 // contains the subset of categories only editable by textfield
const entryCategories = ['place', 'moderator', 'children', 'youth']

const Entries = props => {
  let renderEntries = props.entries.map(entry => <li>{entry}</li>)
  return (
    <div className="entries">
      <ul>
        {renderEntries}
      </ul>
    </div>
  )
}

class EntryEdit extends Component {
  render(){
    let renderCategories = entryCategories.map(category => (
      <div className={category+'-entries'}>
        <h3>{category}</h3>
        {/* If pre-ajax call, entries is undefined and so there will be no elements */}
        <Entries entries={this.props.entries ? this.props.entries[category] : []}/>
      </div>
    ))
    return (
      <div className="entries-pool"
        style={{display: (this.props.yr === this.props.selectedYr ? 'show' : 'none')}}>
        {renderCategories}
      </div>
    )
  }
}

export default EntryEdit
