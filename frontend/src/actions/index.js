/* SET DATA RETRIEVED FROM AJAX CALLS */

export const setAjaxTable = tableData => ({ type: "SET_AJAX_TABLE",  tableData })

export const setAjaxPool = poolData => ({type: "SET_AJAX_POOL", poolData })


/* TABLE ACTIONS */

//change the selected element itself
export const changeSelectedElem = data => ({ type: "CHANGE_SELECTED_ELEM", data })

// edit contents of the selected element
export const editElem = (text, location) => ({ type: "EDIT_ELEM", text, location })

/* ENTRY POOL ACTIONS */

export const editEntryPool = (entries, year) => ({ type: "EDIT_ENTRY_POOL", entries, year })


/* OPTION BUTTONS */

export const openEntries = () => ({ type: "OPEN_ENTRIES" })

export const closeEntries = () => ({ type: "CLOSE_ENTRIES" })


/* TAB ACTIONS */

export const changeTab = selectedYr => ({ type: "CHANGE_TAB", selectedYr })

/* API RESPONSE ACTIONS */

export const editAPITableElem = (text, location) => ({ type: "EDIT_API_TABLE_ELEM", text, location })

export const editAPIPool = (pool, year) => ({ type: "EDIT_API_POOL", year, pool })
