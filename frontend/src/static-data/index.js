/* NORMAL CONSTANTS */

// all categories
export const categories = ['dates', 'place', 'topic', 'moderator', 'children', 'youth', 'remarks']

// contains the subset of categories only editable by textfield
export const entryCategories = ['place', 'moderator', 'children', 'youth']

const selectedYr = new Date().getFullYear()
export const yrs = [selectedYr - 1, selectedYr, selectedYr + 1]

/* INITIALIZE STATE */

//create a nested object containing empty strings/objs/arrays
const createBlankTemplate = categoryArr => { // generate blank object template to store data

  const createTableEntries = () => ({
    dates: [...Array(24)].map(() => ''),
    edits: categoryArr.reduce((total, category) => ({
      ...total,
      [category]: {}
    }), {})
  })

  const createEntriesPool = () => categoryArr.reduce((total, category) => ({
    ...total,
    [category]: []
  }), {})

  /*
    a table uses all 7 categories, whereas the entries pool only uses 4
    so this property can be used to determine what kind of object we should return
  */
  return yrs.reduce((total, yr) => ({
    ...total,
    [yr]: categoryArr.length === 7 ? createTableEntries() : createEntriesPool()
  }), {})
}

export const generateTableEntries = () => createBlankTemplate(categories)

export const generateEntriesPool = () => createBlankTemplate(entryCategories)

export const generateTabs = () => ({yrs, selectedYr})

export const generateOptionBtns = () => ({tableChanged: false, entriesOpen: false})
