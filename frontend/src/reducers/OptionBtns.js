import { generateOptionBtns } from '../static-data'

export default (state = generateOptionBtns(), action) => {
  switch(action.type){
    case "OPEN_ENTRIES":
      return { ...state, entriesOpen: true }
      case "CLOSE_ENTRIES":
        return { ...state, entriesOpen: false }
    default: return state
  }
}
