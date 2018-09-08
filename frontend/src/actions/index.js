export const editTableElement = text => ({ type: "EDIT_ELEMENT", text })

export const addEntryElement = text => ({ type: "ADD_ENTRY",  text, exists: true })

export const deleteEntryElement = text => ({ type: "DELETE_ENTRY", text, exists: false })

export const changeTab = selectedYr => ({ type: "CHANGE_TAB", selectedYr })

export const setAjaxData = data => ({ type: "SET_AJAX_DATA",  data })
