import React, { Component } from 'react';
import './css/edit.css';
import Notebook from './components/Notebook.js'

const Tabs = props => {
  let labels = props.tabs.map(yr => (
      <div key={yr+" yr-lbl"}
        className={"yr-lbl" + (yr === props.selectedYr ? " selected-yr" : "")}
        onClick={props.onClick}>
        {yr}
      </div>
    ))
  return <div className="yr-tabs">{labels}</div>
}

class App extends Component {
  constructor(props){
    super(props)

    let year = new Date().getFullYear()

    this.state = {
      tabs: [year - 1, year, year + 1],
      selectedYr: year
    }
    this.tabChange = this.tabChange.bind(this)
    this.elemSelect = this.tabChange.bind(this)
  }

  componentDidMount(){
    fetch('api/get')
      .then(res => res.json())
      .then(result => {
        result.selectedYr = result.tabs[1]
        this.setState(result)
      }, err => console.log(err))
  }

  tabChange(e){
    this.setState({
      selectedYr: e.target.innerText //innerText of a tab is just the year
    })
  }

  elemSelect(){

  }

  render(){
    let yrNotebooks = !("dates" in this.state) ? // "dates" only exists post-ajax call
      this.state.tabs.map(yr => <Notebook key={`${yr}-notebook`} yr={yr} selectedYr={this.state.selectedYr}/>) :
      this.state.tabs.map(yr => (
        <Notebook yr={yr}
          categories={this.state.categories}
          dates={this.state.dates[yr]}
          edits={this.state.edits[yr]}
          entries={this.state.entries[yr]}
          selectedYr={this.state.selectedYr}
          elemSelect={this.state.elemSelect}/>
      ));
    return (
      <div className="center-content">
        <Tabs tabs={this.state.tabs}
          selectedYr={this.state.selectedYr}
          onClick={this.tabChange}/>
        {yrNotebooks}
      </div>
    )
  }
}

export default App
