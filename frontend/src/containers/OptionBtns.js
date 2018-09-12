import React, { Component } from 'react'
import { store } from '../store'

class OptionBtns extends Component {

  render(){
    let curState = store.getState().optionBtns
    return (
      <div className="save-btns">
        {curState.tableChanged ?
          [<button key="submit-tbl-btn" type="submit" name="save-tbl">Save Tables</button>,
          <button key="cancel-tbl-btn" name="cancel">Cancel</button>] : null}
      </div>
    )
  }
}

export default OptionBtns
