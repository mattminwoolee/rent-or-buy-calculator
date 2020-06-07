import React, { Component } from 'react';
import Slider from '@material-ui/core/Slider';
import { withStyles, makeStyles } from '@material-ui/core/styles';

var InputController = ( props ) => { 
  return(
    <div>
      <h4>{props.input_type.replace(/_/g, ' ')}</h4>
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
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  }
})(Slider);

export default InputController;