import React, { Component } from 'react'
import { store } from '../store'
import { closeEntries, openEntries } from '../actions'

class OptionBtns extends Component {
  editEntriesPool(){
    let curState = store.getState()
    if(curState.entriesOpen)
      store.dispatch(closeEntries())
    else {
      store.dispatch(openEntries())
    }
  }

  render(){
    let curState = store.getState()
    return (
      <div className="save-btns">
        {curState.entriesOpen ?
          [(<button key="edit-entries-btn"
            name="edit-entries-pool"
            onClick={this.editEntriesPool}>Save Entries Pool</button>),
          <button key="cancel-entries-btn" name="cancel-entries">Cancel Entries</button>] :
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
