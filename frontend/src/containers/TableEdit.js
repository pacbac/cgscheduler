import React, { Component } from 'react'
import { categories, entryCategories } from '../static-data'
import { store } from '../store'
import { editElem, changeSelectedElem, editAPITableElem } from '../actions'

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
    this.handleChange = this.handleChange.bind(this)
    let {year, i, category} = this.props.position
    let tblEntries = store.getState().tableEntries
    const flattenedKey = [year, i, category].join(", ")
    const content = tblEntries[flattenedKey] || ''
    this.state = { content }
  }

  handleChange(e){
    this.setState({content: e.target.value})
  }

  componentWillUnmount(){
    store.dispatch(editElem(this.state.content, this.props.position))
    store.dispatch(editAPITableElem(this.state.content, this.props.position))
  }

  render(){
    let curState = store.getState()
    let yr = curState.tabs.selectedYr
    let options = curState.entriesPool[`${yr}, ${this.props.position.category}`] || []
    options.push("")
    options.push("Canceled")
    options = Array.from(new Set(options)) // remove duplicates
    return (
      <select className="edit-field" onChange={this.handleChange}>
        {options.map(elem => (
          <option value={elem}
            selected={this.state.content === elem}>{elem}</option>)
        )}
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

  render(){
    return (
      <div className="table">
        {this.getElements()}
      </div>
    )
  }
}

export default TableEdit
