import React, { Component } from 'react';
import Slider from '@material-ui/core/Slider';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import styles from './../styles/InputController.css';

var InputController = ( props ) => { 
  let formatHeaderText = (input_type) => {
    // Replace '_' with space and capitalize first letter
    let capitalized_input_type = input_type.charAt(0).toUpperCase() + input_type.slice(1)
    return capitalized_input_type.replace(/_/g, ' ')
  }

  return(
    <div className={ styles.inputController }>
      <h3>{formatHeaderText(props.input_type)}</h3>
      {props.value}
      <DefaultSlider
        value={props.value}
        aria-labelledby="discrete-slider-small-steps"
        step={props.step}
        min={ props.min ? props.min : 0 }
        max={props.max}
        onChange={(e, value) => { props.handleInputChange(e, value, props.input_type) }}
      />
    </div>
  )
}

var DefaultSlider = withStyles({
  root: {
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -11,
    marginLeft: 0,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  track: {
    height: 2,
    borderRadius: 4,
  },
  rail: {
    height: 2,
    borderRadius: 4,
  }
})(Slider);

export default InputController;