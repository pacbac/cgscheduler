import React, { Component } from 'react'
import { entryCategories } from '../static-data'
import { store } from '../store'
import { closeEntries, openEntries, editAPIPool, editEntryPool } from '../actions'

class Entries extends Component {
  render(){
    return (
      <div className="entries" onClick={this.clicked}>
        <textarea category={this.props.category}
          onChange={this.props.onChange}
          defaultValue={this.props.entriesPool.join("\n")}/>
      </div>
    )
  }
}

class EntryEdit extends Component {
  constructor(props){
    super(props)

    this.state = {
      entriesOpen: store.getState().optionBtns.entriesOpen,
      entries: {}
    }

    this.saveOrOpenPool = this.saveOrOpenPool.bind(this)
    this.change = this.change.bind(this)
    this.cancelPool = this.cancelPool.bind(this)
  }

  saveOrOpenPool(){
    let curState = store.getState()
    if(curState.optionBtns.entriesOpen){ // if entries are open, then the save button is pressed
      /*
         creates a hashset containing entries that have been added/deleted
         compared to the prev entry pool. Organized by diff = { category: { entryName: bool } }
         where if bool = true, then the name was added, and if bool = false, the name was deleted.
         Used to send only changed information back to the API.
      */
      let diff = {}
      Object.keys(this.state.entries).forEach(category => {
        diff[category] = {}
        let curEntries = this.state.entries[category]
        let prevEntries = curState.entriesPool[`${this.props.yr}, ${category}`] || []

        curEntries.filter(entry => !prevEntries.includes(entry))
          .map(entry => diff[category][entry] = true)
        prevEntries.filter(entry => !curEntries.includes(entry))
          .map(entry => diff[category][entry] = false)
      })
      store.dispatch(editAPIPool(diff, this.props.yr))
      /*
         NOTE: if all entries were changed to be deleted, the array will have one
         element that is an empty string, not an empty array.
         Thus, if a value is an empty array, it means that the previous entries were never changed.
      */
      // remove potential duplicates from array
      store.dispatch(editEntryPool(this.state.entries, this.props.yr))
      store.dispatch(closeEntries())
      console.log(store.getState())
    } else
      store.dispatch(openEntries())
  }

  change(e){
    let category = e.target.getAttribute("category")
    var entriesValues = e.target.value.split("\n")
    //set the state of the entry pool for the corresponding category to the new value
    this.setState(prevState => ({
      entries: {
        ...prevState.entries,
        [category]: entriesValues
      }
    }))
  }

  cancelPool(){
    store.dispatch(closeEntries())
    this.setState({entries: {}})
  }

  render(){
    let curState = store.getState()
    console.log(this.state)
    if(curState.optionBtns.entriesOpen){
      let renderCategories = entryCategories.map(category => (
        <div key={this.props.yr + category+'-entries'} className={category+'-entries'}>
          <h3>{category}</h3>
          <Entries category={category} yr={this.props.yr}
          onChange={this.change}
          entriesPool={`${this.props.yr}, ${category}` in curState.entriesPool ?
            curState.entriesPool[`${this.props.yr}, ${category}`] : []}/>
        </div>
      ))
      const editBtn = (<button key="edit-entries-btn"
        name="edit-entries-pool"
        onClick={this.saveOrOpenPool}>Save Entries Pool</button>)
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
    } else
      return (
        <div className="save-btns">
          <button key="edit-entries-btn"
            name="edit-entries-pool"
            onClick={this.saveOrOpenPool}>Edit Entries Pool</button>
        </div>
      )
  }
}

export default EntryEdit
