import React from 'react';
import TableView from './TableView.js'
import { store } from '../store'
import '../css/view.css'

const NotebookView = props => (
  <div className={"notebook" + (props.yr === store.getState().tabs.selectedYr ? " selected-notebook" : "")}
    id={`${props.yr}-notebook`}>
    <TableView yr={props.yr}/>
  </div>
)

export default NotebookView
