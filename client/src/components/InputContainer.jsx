import React, { Component } from 'react';
import InputController from './InputController.jsx';
import styles from './../styles/InputContainer.css';

var InputContainer = (props) => { 
  return(
    <div className={ styles.inputContainer }>
      {Object.keys(props.input_data).map( (input_type, index) => 
        {
          let max, min, step;
          if (input_type.includes('monthly')) {
            max = 2000
            step = 5
          } else if (input_type.includes('rate') || input_type.includes('percent')) {
            max = 1
            step = .001
          } else if (input_type.includes('years')) {
            min = 1
            max = 40
            step = 1
          } else if (input_type.includes('months')) {
            max = 12
            step = 1
          } else if (input_type.includes('price') || input_type.includes('cost')) {
            max = 1000000
            step = 50
          } else {
            // render an input controller here
          }
          return(<InputController
                  min={ min }
                  max={ max }
                  step={ step }
                  key={ index }
                  handleInputChange={ props.handleInputChange } 
                  input_type={ input_type } 
                  value={ props.input_data[input_type] }
                  />)
        }
      )}
    </div>
  )
}

export default InputContainer;