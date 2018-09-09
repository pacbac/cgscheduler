import React, { Component } from 'react'
import { categories, entryCategories } from '../static-data'
import { store } from '../store'
import { editElem, changeSelectedElem } from '../actions'

class TextField extends Component {
  constructor(props){
    super(props)
    this.handleEnter = this.handleEnter.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.state = { content: this.props.content }
  }

  handleEnter(e){
    if(e.which == 13){
      store.dispatch(editElem(this.state.content, this.props.position))
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
    let {year, category, i} = store.getState().tableEntries.selectedElem
    if(year !== undefined
      && i !== undefined
      && category !== undefined
      && this.state.content !== "")
      store.dispatch(editElem(this.state.content, this.props.position))
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
    let pos = this.props.position
    let tblEntries = store.getState().tableEntries
    let content;
    console.log(pos.year, pos.i, pos.category)
    if(tblEntries[pos.year] === undefined
      || tblEntries[pos.year].edits[pos.i] === undefined
      || tblEntries[pos.year].edits[pos.i][pos.category] === undefined)
      content = ''
    else
      content = tblEntries[pos.year].edits[pos.i][pos.category]
    this.state = { content }
  }

  handleChange(e){
    this.setState({content: e.target.value})
  }

  componentWillUnmount(){
    store.dispatch(editElem(this.state.content, this.props.position))
  }

  render(){
    let curState = store.getState()
    let yr = curState.tabs.selectedYr
    let options = curState.entriesPool[yr][this.props.position.category]
    return (
      <select className="edit-field" onChange={this.handleChange}>
        <option value=""></option>
        {options.map(elem => (
          <option value={elem}
            selected={this.state.content === elem}>{elem}</option>)
        )}
        <option value="Canceled">Canceled</option>
      </select>
    )
  }
}

const Element = ({position, clicked, content}) => {
  let { tableEntries : { selectedElem } } = store.getState()
  return (
    <div className="element"
      i={position.i}
      category={position.category}
      onClick={clicked}>
      {(selectedElem.i === position.i
        && selectedElem.category === position.category
        && selectedElem.year === position.year) ?
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
    if(e.target.className == "element"){
      let i = parseInt(e.target.getAttribute("i"))
      let category = e.target.getAttribute("category")
      let year = store.getState().tabs.selectedYr
      store.dispatch(changeSelectedElem({year, i, category}))
    }
  }

  getElements(){
    let curState = store.getState()
    let elements = []
    let renderCategories;

    let curTableEntries = curState.tableEntries[this.props.yr]
    let dates = curTableEntries.dates
    let tblEdits = curTableEntries.edits

    // create a 2D array of the edits that contains JSX elements
    renderCategories = categories.map(category => {
      if(category === 'dates'){
        return dates.map((date, i) => {
          return (<Element key={[this.props.yr, category, i].join("_")}
            position={{i, category, year: this.props.yr}}
            clicked={this.clicked}
            content={(i in tblEdits && "newDate" in tblEdits[i]) ? tblEdits[i].newDate : date}/>)
        })
      } else {
        return dates.map((date, i) => (
          <Element key={[this.props.yr, category, i].join("_")}
            position={{i, category, year: this.props.yr}}
            clicked={this.clicked}
            content={(i in tblEdits && category in tblEdits[i]) ? tblEdits[i][category] : ''}/>
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
