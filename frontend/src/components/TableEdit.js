import React, { Component } from 'react'
import Element from './Element.js'

class TableEdit extends Component {
  render(){
    let categories = this.props.categories
    let dates = this.props.dates
    let edits = this.props.edits

    // create a 2D array of the edits that contains JSX elements
    let renderCategories = categories.map(category => {
      if(category === 'dates'){
        return dates.map((date, i) => {
          return (<Element i={i}
            content={(date in edits && "newDate" in edits[date]) ? edits[date].newDate : date}/>)
        })
      } else {
        return dates.map((date, i) => (
          <Element i={i}
            content={(date in edits && category in edits[date]) ? edits[date][category] : ''}/>
        ))
      }
    })

    // convert the renderCategories 2D array into a renderable 1D mapping array (with div wrappers)
    let elements = []
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
    return (
      <div className="table">
        {elements}
      </div>
    )
  }
}

export default TableEdit
