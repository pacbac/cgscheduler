/* NORMAL CONSTANTS */

// all categories
export const categories = ['dates', 'place', 'topic', 'moderator', 'children', 'youth', 'remarks']

// contains the subset of categories only editable by textfield
export const entryCategories = ['place', 'moderator', 'children', 'youth']

export const year = new Date().getFullYear()
export const yrs = [year - 1, year, year + 1]

/* INITIALIZE STATE */

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

export const initialState = {
  yrs,
  selectedYr: year,
  //create an object containing empty strings for each tab
  tableEntries: createBlankTemplate(categories),
  entriesPool: createBlankTemplate(entryCategories),
  tableChanged: false,
  entriesOpen: false
}
