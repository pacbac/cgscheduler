import React, { Component } from 'react'
import { categories, entryCategories } from '../static-data'
import { store } from '../store'
import {
  editElem,
  changeSelectedElem,
  editAPITableElem,
  tableChanged,
  changeMsg,
  setAjaxPool,
  setAjaxTable
 } from '../actions'
 import csrfToken from '../JSUtils/cookie.js'

class TextField extends Component {
  constructor(props){
    super(props)
    this.handleEnter = this.handleEnter.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.state = { content: this.props.content }
  }

  handleEnter(e){
    if(e.which === 13){
      store.dispatch(editElem(this.state.content, this.props.position))
      store.dispatch(editAPITableElem(this.state.content, this.props.position))
      store.dispatch(changeSelectedElem({year: undefined, i: undefined, category: undefined}))
    }
  }

  handleChange(e){
    this.setState({ content: e.target.value })
    // edit apirequest object when this text changes in case save table is pressed
    // before the textfield is unmounted
    store.dispatch(editAPITableElem(e.target.value, this.props.position))
    store.dispatch(tableChanged())
  }

  /*
    if the user presses enter, the content would've' saved and the three
    properties (year, i, category) would be undefined.
    However, if the user clicked to another element without pressing enter,
    we perform a last-minute save of the content before the text field becomes unmounted
  */
  componentWillUnmount(){
    let {year, category, i} = store.getState().selectedElems.selectedTblElem
    if(year !== undefined
      && i !== undefined
      && category !== undefined
      && this.state.content !== ""){
      store.dispatch(editElem(this.state.content, this.props.position))
      store.dispatch(editAPITableElem(this.state.content, this.props.position))
    }
  }

  render(){
    return (
      <input className="edit-field"
        onKeyPress={this.handleEnter}
        onChange={this.handleChange}
        defaultValue={this.props.content}/>
    )
  }
}

class Dropdown extends Component {
  constructor(props){
    super(props)
    let {year, i, category} = this.props.position
    let tblEntries = store.getState().tableEntries
    const flattenedKey = [year, i, category].join(", ")
    const content = tblEntries[flattenedKey] || ''
    this.state = { content }
    this.handleChange = this.handleChange.bind(this)
    this.checkRowErr = this.checkRowErr.bind(this)
    this.checkColErr = this.checkColErr.bind(this)
  }

  handleChange(e){
    this.setState({ content: e.target.value })
    // notify of potential row/column edit conflicts to the user when setting a new value
    // however, whether the conflicts are actual problems depends on the user.
    this.checkRowErr(e.target.value)
    this.checkColErr(e.target.value)
    // the user may save the table while the dropdown still exists
    // so we assume the currently selected value is what they want
    store.dispatch(editAPITableElem(e.target.value, this.props.position))
  }

  // @param val: the new value of the dropdown (that hasn't been officially changed yet)
  checkRowErr(val){
    let { year, i, category } = this.props.position
    if(category === "place") return //place should be omitted from evaluation
    if(val === "Canceled" || val === "") return //"Canceled" doesn't count as duplicate
    let tblEntries = store.getState().tableEntries
    if(category === "youth" || category === "children"){
      // if not the first item, check if the item above is the same value
      if(tblEntries[`${year}, ${i}, moderator`] === val)
        alert(`Warning: ${val} has conflicts with other roles for ${tblEntries[`${year}, ${i}, dates`]}.`)
    } else if(category === "moderator"){
      if(tblEntries[`${year}, ${i}, children`] === val || tblEntries[`${year}, ${i}, youth`] === val)
        alert(`Warning: ${val} has conflicts with other roles for ${tblEntries[`${year}, ${i}, dates`]}.`)
    }
  }

  // @param val: the new value of the dropdown (that hasn't been officially changed yet)
  checkColErr(val){
    let { year, i, category } = this.props.position
    if(category === "place") return //place should be omitted from evaluation
    if(val === "Canceled" || val === "") return//"Canceled" doesn't count as duplicate
    let tblEntries = store.getState().tableEntries
    if(i > 0 && tblEntries[`${year}, ${i-1}, ${category}`] === val)
      alert(`Warning: ${val} is assigned consecutively to ${category} on ${tblEntries[`${year}, ${i-1}, dates`]} and ${tblEntries[`${year}, ${i}, dates`]}.`)
    if(i < 23 && tblEntries[`${year}, ${i+1}, ${category}`] === val)
      alert(`Warning: ${val} is assigned consecutively to ${category} on ${tblEntries[`${year}, ${i}, dates`]} and ${tblEntries[`${year}, ${i+1}, dates`]}.`)
  }

  componentWillUnmount(){
    store.dispatch(editElem(this.state.content, this.props.position))
    store.dispatch(tableChanged())
  }

  render(){
    let curState = store.getState()
    let yr = curState.tabs.selectedYr
    let options = curState.entriesPool[`${yr}, ${this.props.position.category}`] || []
    // remove duplicates and remove potential '' and 'Canceled' options if they exist
    options = Array.from(new Set(options)).filter(option => option !== '' && option !== 'Canceled')
    return (
      <select className="edit-field" onChange={this.handleChange}>
        <option value=''></option>
        {options.map(elem => (
          <option value={elem}
            selected={this.state.content === elem}>{elem}</option>)
        )}
        <option value='Canceled'>Canceled</option>
      </select>
    )
  }
}

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
        (entryCategories.includes(position.category) ?
        <Dropdown position={position}/> :
        <TextField position={position} content={content}/>)
       : content}
    </div>
  )
}

class TableEdit extends Component {
  constructor(props){
    super(props)
    this.clicked = this.clicked.bind(this)
  }

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

  getElements(){
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

  submit(e){
    console.log(store.getState())
    fetch('api/updateedits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      },
      body: JSON.stringify(store.getState().apiRequest.edits)
    }).then(res => res.json())
      .then(({...json, dataStatus}) => {
        store.dispatch(changeMsg(dataStatus))
      })
    e.preventDefault()
  }

  cancelEdits(){
    // fetch and repopulate table with old data
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
    return (
      [<div className="table">
        {this.getElements()}
      </div>,
      (store.getState().optionBtns.tableChanged ?
        (<div className="save-btns">
          <button type="submit" name="save-tbl" onClick={this.submit}>Save Tables</button>
          <button name="cancel" onClick={this.cancelEdits}>Cancel</button>
        </div>) : null)]
    )
  }
}

export default TableEdit
