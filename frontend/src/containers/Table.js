import React, { Component } from 'react';
import { store } from '../store'
import { categories } from '../static-data'
import { changeSelectedElem } from '../actions'


class Table extends Component {
  // when an element gets clicked on
  clicked(e){
    //only applies to elements, not children inside elements
    if(e.target.className === "element"){
      let i = parseInt(e.target.getAttribute("i"))
      let category = e.target.getAttribute("category")
      let year = store.getState().tabs.selectedYr
      store.dispatch(changeSelectedElem({year, i, category}))
    }
  }

  // TableView Elements are different from TableEdit Elements
  getElements(Element){
    let curTableEntries = store.getState().tableEntries
    let elements = []
    let renderCategories;

    const arr24 = [...Array(24)] //a temporary 24-slot array for the 24 slots per category
    // create a 2D array of the edits that contains JSX elements
    renderCategories = categories.map(category => (
      arr24.map((date, i) => {
        const flattenedKey = [this.props.yr, i, category].join(", ")
        const value = curTableEntries[flattenedKey] || ''
        return (<Element key={[this.props.yr, i, category].join("_")}
          position={{i, category, year: this.props.yr}}
          clicked={this.clicked}
          content={value}/>)
      })
    ))
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
}

export default Table
