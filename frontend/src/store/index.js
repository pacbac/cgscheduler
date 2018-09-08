import { createStore } from 'redux';
import reducer from '../reducers'
import { year, yrs, categories, entryCategories } from '../static-data'

export const store = createStore(reducer)
