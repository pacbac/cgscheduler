/* SET DATA RETRIEVED FROM AJAX CALLS */

export const setAjaxTable = tableData => ({ type: "SET_AJAX_TABLE",  tableData })

export const setAjaxPool = poolData => ({type: "SET_AJAX_POOL", poolData })

/* SET NEW DATA FROM MANUAL ENTRY */

export const editTableElement = text => ({ type: "EDIT_ELEMENT", text })

export const addEntryElement = text => ({ type: "ADD_ENTRY",  text, exists: true })

export const deleteEntryElement = text => ({ type: "DELETE_ENTRY", text, exists: false })

export const changeTab = selectedYr => ({ type: "CHANGE_TAB", selectedYr })

/* OPTION BUTTONS */

export const openEntries = () => ({ type: "OPEN_ENTRIES" })

export const closeEntries = () => ({ type: "CLOSE_ENTRIES" })
