import { editTableElement, addEntryElement, deleteEntryElement } from '../actions'
import { combineReducers } from 'redux'
import tableEntries from './TableEdit.js'
import entriesPool from './EntryEdit.js'
import optionBtns from './OptionBtns.js'
import tabs from './Tabs.js'

export default combineReducers({
  tabs,
  tableEntries,
  optionBtns,
  entriesPool,
})
