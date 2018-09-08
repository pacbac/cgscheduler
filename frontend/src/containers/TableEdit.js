import React, { Component } from 'react'
import { categories } from '../static-data'
import { store } from '../store'

const Element = ({i, content}) => (
  <div className={`element element${i}`}>
    {content}
  </div>
)

class TableEdit extends Component {
  getElements(){
    let curState = store.getState()
    let elements = []
    let renderCategories;

    let curTableEntries = curState.tableEntries[this.props.yr]
    let dates = curTableEntries.dates
    let tblEdits = curTableEntries.edits
    let selectedYr = curState.tabs.selectedYr

    // create a 2D array of the edits that contains JSX elements
    renderCategories = categories.map(category => {
      if(category === 'dates'){
        return dates.map((date, i) => {
          return (<Element i={i}
            key={[selectedYr, category, i].join("_")}
            content={(date in tblEdits && "newDate" in tblEdits[date]) ? tblEdits[date].newDate : date}/>)
        })
      } else {
        return dates.map((date, i) => (
          <Element i={i}
            key={[selectedYr, category, i].join("_")}
            content={(date in tblEdits && category in tblEdits[date]) ? tblEdits[date][category] : ''}/>
        ))
      }
    })


    // convert the renderCategories 2D array into a renderable 1D mapping array (with div wrappers)
    for(let i = 0; i < categories.length; i++){
      elements.push((
        <div className={categories[i]}>
          <div className="navbar">{categories[i]}</div>
          <div className="info">
            {renderCategories[i]}
          </div>
        </div>
      ))
    }
    return elements
  }

  render(){
    return (
      <div className="table">
        {this.getElements()}
      </div>
    )
  }
}

export default TableEdit
