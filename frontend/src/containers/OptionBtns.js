import React, { Component } from 'react'
import { store } from '../store'
import { closeEntries, openEntries } from '../actions'

class OptionBtns extends Component {
  editEntriesPool(){
    let curState = store.getState().optionBtns
    if(curState.entriesOpen){
      store.dispatch(closeEntries())

    } else {
      store.dispatch(openEntries())
    }
  }

  cancelPool(){
    store.dispatch(closeEntries())
  }

  render(){
    let curState = store.getState().optionBtns
    return (
      <div className="save-btns">
        {curState.entriesOpen ?
          [(<button key="edit-entries-btn"
            name="edit-entries-pool"
            onClick={this.editEntriesPool}>Save Entries Pool</button>),
          (<button key="cancel-entries-btn"
            name="cancel-entries"
            onClick={this.cancelPool}>Cancel Entries</button>
          )] :
          <button key="edit-entries-btn"
            name="edit-entries-pool"
            onClick={this.editEntriesPool}>Edit Entries Pool</button>}
        {curState.tableChanged ?
          [<button key="submit-tbl-btn" type="submit" name="save-tbl">Save Tables</button>,
          <button key="cancel-tbl-btn" name="cancel">Cancel</button>] : null}
      </div>
    )
  }
}

export default OptionBtns
