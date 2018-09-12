import { generateAPIRequest } from '../static-data'

export default (state = generateAPIRequest(), action) => {
  switch(action.type){
    case "EDIT_API_TABLE_ELEM": {
      let {year, category, i} = action.location
      return {
        ...state,
        edits: {
          ...state.edits,
          [[year, i, category].join(", ")]: action.text
        }
      }
    }
    case "EDIT_API_POOL":
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.year]: action.pool
        }
      }
    default:
      return state
  }
}
