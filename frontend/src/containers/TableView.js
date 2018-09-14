import React from 'react';
import { store } from '../store'
import Table from './Table.js'

const Element = ({position, clicked, content}) => {
  let { selectedElems: { selectedTblElem } } = store.getState()
  return (
    <div className="element"
      i={position.i}
      category={position.category}
      onClick={clicked}>
      {(selectedTblElem.i === position.i
        && selectedTblElem.category === position.category
        && selectedTblElem.year === position.year) ?
        <div className="hover">{content}</div>
       : content}
    </div>
  )
}

class TableView extends Table {
  render(){
    console.log(store.getState())
    return <div className="table">{this.getElements(Element)}</div>
  }
}

export default TableView
