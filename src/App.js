import React, { Component } from 'react';
import './css/main.css';
import { Switch, Route } from 'react-router-dom'
import Notebook from './containers/Notebook.js'
import NotebookView from './containers/NotebookView.js'
import { store } from './store'
import { changeTab, setAjaxTable, setAjaxPool } from './actions'
import { yrs } from './static-data'

class App extends Component {

  componentDidMount(){
    fetch('/api/get')
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
    let yrNotebooks = yrs.map(yr => (
      <Switch>
        <Route exact path="/" render={props => <NotebookView key={`${yr}-notebook`} yr={yr}/>}/>
        <Route exact path="/edit/" render={props => <Notebook key={`${yr}-notebook`} yr={yr}/>}/>
      </Switch>
    ))
    return (
      <React.Fragment>
        <h1 class="heading">Cell Group Schedule</h1>
        <div className="center-content">
          <Tabs/>
          {yrNotebooks}
        </div>
      </React.Fragment>
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
