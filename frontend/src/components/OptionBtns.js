import React, { Component } from 'react'

const EntriesBtns = props => (
  props.entriesOpen ?
  (<div style={{margin: 0, padding: 0}}>
    <button name="edit-entries-pool">Save Entries Pool</button>
    <button name="cancel-entries">Cancel Entries</button>
  </div>) :
  (<div>
      <button name="edit-entries-pool">Edit Entries Pool</button>
    </div>)
)

class OptionBtns extends Component {
  render(){
    return (
      <div className="save-btns">
        {this.props.entriesOpen ?
          [<button key="edit-entries-btn" name="edit-entries-pool">Save Entries Pool</button>,
          <button key="cancel-entries-btn" name="cancel-entries">Cancel Entries</button>] :
          <button key="edit-entries-btn" name="edit-entries-pool">Edit Entries Pool</button>}
        {this.props.tableChanged ?
          [<button key="submit-tbl-btn" type="submit" name="save-tbl">Save Tables</button>,
          <button key="cancel-tbl-btn" name="cancel">Cancel</button>] : null}
      </div>
    )
  }
}

export default OptionBtns
