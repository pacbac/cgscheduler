import { generateSelected } from '../static-data'

export default (state = generateSelected(), action) => {
  switch(action.type){
    case "CHANGE_SELECTED_ELEM":
      return { ...state, selectedTblElem: action.data }
    default: return state
  }
}
