import React, { Component } from 'react'

const categories = ['dates', 'place', 'topic', 'moderator', 'children', 'youth', 'remarks']

const Element = props => (
  <div className={`element element${props.i}`}>
    {props.content}
  </div>
)

class TableEdit extends Component {
  getElements(){
    let elements = []
    let renderCategories;
    if(!this.props.dates) { //check if ajax-called properties are available
      renderCategories = categories.map(category => (
        //return empty 24-week-length array of blank elements
        Array.apply(null, Array(24)).map((elem, i) => <Element i={i} key={category+i} content=''/>)
      ))
    } else {
      let dates = this.props.dates
      let edits = this.props.edits

      // create a 2D array of the edits that contains JSX elements
      renderCategories = categories.map(category => {
        if(category === 'dates'){
          return dates.map((date, i) => {
            return (<Element i={i}
              key={category+i}
              content={(date in edits && "newDate" in edits[date]) ? edits[date].newDate : date}/>)
          })
        } else {
          return dates.map((date, i) => (
            <Element i={i}
              key={category+i}
              content={(date in edits && category in edits[date]) ? edits[date][category] : ''}/>
          ))
        }
      })
    }

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
