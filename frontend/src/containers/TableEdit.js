import React, { Component } from 'react'
import { categories } from '../static-data'
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
      if(this.state.content !== "")
        store.dispatch(editElem(this.state.content, this.props.location))
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
      store.dispatch(editElem(this.state.content, this.props.location))
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

const Element = ({i, category, clicked, content, yr}) => {
  let { tableEntries : { selectedElem } } = store.getState()
  return (
    <div className="element"
      i={i}
      category={category}
      onClick={clicked}>
      {(selectedElem.i === i && selectedElem.category === category) ?
      <TextField location={{i, category, year: yr}} content={content}/> : content}
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
            i={i}
            category={category}
            clicked={this.clicked}
            yr={this.props.yr}
            content={(i in tblEdits && "newDate" in tblEdits[i]) ? tblEdits[i].newDate : date}/>)
        })
      } else {
        return dates.map((date, i) => (
          <Element key={[this.props.yr, category, i].join("_")}
            i={i}
            category={category}
            clicked={this.clicked}
            yr={this.props.yr}
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
