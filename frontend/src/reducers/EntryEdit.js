import { generateEntriesPool } from '../static-data'

export default (state = generateEntriesPool(), action) => {
  switch(action.type){
    case "SET_AJAX_POOL":
      return action.poolData
    case "EDIT_ENTRY_POOL": {
      let entriesWithYr = {}
      // concatenate the year to each key first
      Object.keys(action.entries).forEach(entry => {
        if(action.entries[entry].length)
          entriesWithYr[action.year+", "+entry] = action.entries[entry]
      })
      return {
        ...state,
        ...entriesWithYr
      }
    }
    default:
      return state;
  }
}
