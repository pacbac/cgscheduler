import { generateTableEntries } from '../static-data'

export default (state = generateTableEntries(), action) => {
  switch(action.type){
    case "SET_AJAX_TABLE":
      return { ...action.tableData, selectedElem: state.selectedElem }
    case "CHANGE_SELECTED_ELEM":
      return { ...state, selectedElem: action.data }
    case "EDIT_ELEM": {
      let {year, category, i} = action.location
      return { //order from out to in: year, 'edits', i, category
        ...state,
        [year]: {
          ...state[year],
          edits: {
            ...state[year].edits,
            [i]: {
              ...state[year].edits[i],
              [category]: action.text
            }
          }
        }
      }
    }

    default:
      return state
  }
}
