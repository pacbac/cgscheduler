import { generateTableEntries } from '../static-data'

export default (state = generateTableEntries(), action) => {
  switch(action.type){
    case "SET_AJAX_TABLE":
      return { ...action.tableData }
    case "EDIT_ELEM": {
      let {year, category, i} = action.location
      return {
        ...state,
        [[year, i, category].join(", ")]: action.text
      }
    }
    default:
      return state
  }
}
