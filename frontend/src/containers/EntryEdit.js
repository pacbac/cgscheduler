import React, { Component } from 'react'
import { entryCategories } from '../static-data'
import { store } from '../store'
import { closeEntries, openEntries } from '../actions'

class Entries extends Component {
  render(){
    return (
      <div className="entries" onClick={this.clicked}>
        <textarea
          onChange={this.props.change}
          category={this.props.category}
          defaultValue={this.props.entriesPool.join("\n")}/>
      </div>
    )
  }
}

class EntryEdit extends Component {
  constructor(props){
    super(props)

    let entries = store.getState().entriesPool
    this.state = {
      entries: {}
    }
    this.change = this.change.bind(this)
    this.editEntriesPool = this.editEntriesPool.bind(this)
  }

  editEntriesPool(){
    let curState = store.getState().optionBtns
    if(curState.entriesOpen){
      let diff = {}
      let entries = this.state.entries
      Object.keys(entries).forEach(category => {
        console.log(entries, category)
        entries[category].filter(entry => !this.props.entriesPool.includes(entry))
          .forEach(entry => diff[category][entry] = true)
        this.props.entriesPool.filter(entry => !entries[category].includes(entry))
          .forEach(entry => diff[category][entry] = false)
      })
      console.log(diff)
      store.dispatch(closeEntries())
    } else {
      store.dispatch(openEntries())
    }
  }

  cancelPool(){
    store.dispatch(closeEntries())
  }

  change(e){
    const category = e.target.getAttribute("category")
    this.setState({ entries: { [category]: [e.target.value] } })
  }

  render(){
    let curState = store.getState()
    //console.log(this.state)
    if(curState.optionBtns.entriesOpen){
      let renderCategories = entryCategories.map(category => (
        <div key={this.props.yr + category+'-entries'} className={category+'-entries'}>
          <h3>{category}</h3>
          <Entries category={category} yr={this.props.yr}
          change={this.change}
          entriesPool={`${this.props.yr} ${category}` in curState.entriesPool ?
            curState.entriesPool[`${this.props.yr} ${category}`] : []}/>
        </div>
      ))
      const editBtn = (<button key="edit-entries-btn"
        name="edit-entries-pool"
        onClick={this.editEntriesPool}>Save Entries Pool</button>)
      const cancelBtn = (<button key="cancel-entries-btn"
        name="cancel-entries"
        onClick={this.cancelPool}>Cancel Entries</button>)
      return [
        <div key="save-btns" className="save-btns">{[editBtn, cancelBtn]}</div>,
        (<div key="entries-pool" className="entries-pool"
          style={{display: (this.props.yr === curState.tabs.selectedYr
            && curState.optionBtns.entriesOpen ? 'flex' : 'none')}}>
          {renderCategories}
        </div>)
      ]
    }
    return (
      <div className="save-btns">
        <button key="edit-entries-btn"
          name="edit-entries-pool"
          onClick={this.editEntriesPool}>Edit Entries Pool</button>
      </div>
    )
  }
}

export default EntryEdit
