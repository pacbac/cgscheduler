import React, { Component } from 'react'

const Element = props => (
  <div className={`element element${props.i}`}>
    {props.content}
  </div>
)

export default Element
