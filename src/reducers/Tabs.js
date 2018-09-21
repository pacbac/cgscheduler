import { generateTabs } from '../static-data'

export default (state = generateTabs(), action) => {
  switch(action.type){
    case "CHANGE_TAB":
      return { ...state, selectedYr: action.selectedYr }
    default:
      return state
  }
}
