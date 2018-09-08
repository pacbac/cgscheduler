import { generateTableEntries } from '../static-data'

export default (state = generateTableEntries(), action) => {
  switch(action.type){
    case "SET_AJAX_TABLE":
      return action.tableData
    default:
      return state
  }
}
