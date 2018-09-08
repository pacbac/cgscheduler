import React, { Component } from 'react';
import './css/edit.css';
import Notebook from './components/Notebook.js'
import { store } from './store'
import { changeTab, setAjaxData } from './actions'
import { yrs } from './static-data'

class App extends Component {
  constructor(props){
    super(props)
    this.elemSelect = this.elemSelect.bind(this)
  }

  componentDidMount(){
    fetch('api/get')
      .then(res => res.json())
      .then(result => store.dispatch(setAjaxData(result))
      , err => console.log(err))
  }

  elemSelect(){

  }

  render(){
    let curState = store.getState()
    let yrNotebooks = yrs.map(yr => (
        <Notebook key={`${yr}-notebook`} yr={yr}
          elemSelect={curState.elemSelect}/>
      ));
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
          className={"yr-lbl" + (yr === store.getState().selectedYr ? " selected-yr" : "")}
          onClick={this.tabChange}>
          {yr}
        </div>
      ))
    return <div className="yr-tabs">{labels}</div>
  }
}

export default App
