import React, { Component } from 'react';
import './css/edit.css';
import Notebook from './containers/Notebook.js'
import { store } from './store'
import { changeTab, setAjaxTable, setAjaxPool } from './actions'
import { yrs } from './static-data'

class App extends Component {

  componentDidMount(){
    fetch('api/get')
      .then(res => res.json())
      .then(({...result, dataStatus}) => {
        if(dataStatus){
          store.dispatch(setAjaxTable(result.tableEntries))
          store.dispatch(setAjaxPool(result.entriesPool))
        }
      }
      , err => console.log(err))
  }

  render(){
    let yrNotebooks = yrs.map(yr => <Notebook key={`${yr}-notebook`} yr={yr}/>)
    return (
      <div className="center-content">
        <Tabs/>
        {yrNotebooks}
      </div>
    )
  }
}

class Tabs extends Component {
  tabChange(e){
    const newSelectYr = parseInt(e.target.innerHTML)
    store.dispatch(changeTab(newSelectYr))
  }

  render(){
    let labels = yrs.map(yr => (
        <div key={yr+" yr-lbl"}
          className={"yr-lbl" + (yr === store.getState().tabs.selectedYr ? " selected-yr" : "")}
          onClick={this.tabChange}>
          {yr}
        </div>
      ))
    return <div className="yr-tabs">{labels}</div>
  }
}

export default App
