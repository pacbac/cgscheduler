import React, { Component } from 'react';
import { store } from '../store'
import { categories } from '../static-data'
import { changeSelectedElem } from '../actions'
import TrackVisibility from 'react-on-screen'

class TableLabel extends Component {
  render() {
    const { isVisible, label } = this.props
    // fix position to top of screen when it goes offscreen
    const style = isVisible ? {} : {
      position: 'fixed',
      top: 0,
      zIndex: 2,
      width: this.permLbl ? this.permLbl.offsetWidth : 0
    }
    return [
      <div className="tbl-lbl" ref={elem => {this.permLbl = elem }}>{label}</div>,
      !isVisible && <div className="tbl-lbl" style={style}>{label}</div>
    ]
  }
}


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
          <TrackVisibility>
            <TableLabel label={categories[i]}/>
          </TrackVisibility>
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
