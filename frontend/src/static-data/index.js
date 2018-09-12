/* NORMAL CONSTANTS */

// all categories
export const categories = ['dates', 'place', 'topic', 'moderator', 'children', 'youth', 'remarks']

// contains the subset of categories only editable by textfield
export const entryCategories = ['place', 'moderator', 'children', 'youth']

const selectedYr = new Date().getFullYear()
export const yrs = [selectedYr - 1, selectedYr, selectedYr + 1]

/* INITIALIZE STATE */

//create a nested object containing empty strings/objs/arrays

export const generateTableEntries = () => ({})

export const generateEntriesPool = () => ({})

export const generateTabs = () => ({yrs, selectedYr})

export const generateSelected = () => ({
  selectedTblElem: { //gives the "coordinates" for the table slot currently being edited
    year: undefined,
    i: undefined,
    category: undefined
  }
})

export const generateOptionBtns = () => ({tableChanged: false, entriesOpen: false})

export const generateAPIRequest = () => ({
  edits: {},
  entries: {}
})
