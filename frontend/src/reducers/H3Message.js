export default (state = {msg: ''}, action) => {
  switch(action.type){
    case 'CHANGE_MESSAGE': {
      let msg = action.dataStatus ?
        'Posted to database successfully.' :
        'Error: Could not post to server due to improper formatting.'
      return { msg }
    }
    case 'RESET_MESSAGE': {
      return { msg: '' }
    }
    default:
      return state
  }
}
