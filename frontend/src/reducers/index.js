import { combineReducers } from 'redux'
import tableEntries from './TableEdit.js'
import entriesPool from './EntryEdit.js'
import optionBtns from './OptionBtns.js'
import tabs from './Tabs.js'
import apiRequest from './APIRequest.js'
import selectedElems from './selectedElems.js'

export default combineReducers({
  tabs,
  tableEntries,
  optionBtns,
  entriesPool,
  selectedElems,
  apiRequest
})
