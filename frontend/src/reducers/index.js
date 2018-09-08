import { editTableElement, addEntryElement, deleteEntryElement } from '../actions'
import { initialState } from '../static-data'

export default (state = initialState, action) => {
  switch(action.type){
    case "CHANGE_TAB":
      return { ...state, selectedYr: action.selectedYr }
    case "SET_AJAX_DATA":
      //merge: the action.data placed after state so that the new data replaces the old
      return { ...state, ...action.data }
    default: return state
  }
}
