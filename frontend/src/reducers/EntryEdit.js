import { generateEntriesPool } from '../static-data'

export default (state = generateEntriesPool(), action) => {
  switch(action.type){
    case "SET_AJAX_POOL":
      return action.poolData
    default:
      return state;
  }
}
