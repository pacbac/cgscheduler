import React, { Component } from 'react';
import { store } from '../store'
import Table from './Table.js'

const veryLightGreen = '#eaffee'
const veryLightGreen2 = '#c9f2d0'

class Element extends Component {
  state = {
    hoverWidth: 0
  }

  render(){
    let {i, category, year} = this.props.position
    let { selectedElems: { selectedTblElem } } = store.getState()
    return (
      [(selectedTblElem.i === i
        && selectedTblElem.category === category
        && selectedTblElem.year === year
        && this.element !== undefined // if this is at least post-ajax call (this.element was set before)
        && this.element.offsetWidth < this.element.scrollWidth) ?
        <div className="hover"
          style={{minWidth: (this.element.offsetWidth+50)}}>{this.props.content}</div> : null,
        <div className="element" i={i} category={category}
          ref={el => {this.element = el}}
          style={{ backgroundColor: i % 2 === 0 ? veryLightGreen2 : veryLightGreen }}
          onClick={this.props.clicked}>{this.props.content}</div>]
    )
  }
}

class TableView extends Table {
  render(){
    return <div className="table">{this.getElements(Element)}</div>
  }
}

export default TableView
