import { generateSelected } from '../static-data'

export default (state = generateSelected(), action) => {
  switch(action.type){
    default: return state
  }
}
