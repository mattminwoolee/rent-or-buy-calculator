import React, { Component } from 'react';
import Slider from '@material-ui/core/Slider';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import styles from './../styles/InputController.css';

class InputController extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      error: false
    }
  }
  
  formatHeaderText(input_type) {
    // Replace '_' with space and capitalize first letter
    let capitalized_input_type = input_type.charAt(0).toUpperCase() + input_type.slice(1)
    return capitalized_input_type.replace(/_/g, ' ')
  }

  handleSubmit(e) {
    let value = e.target.value
    if (this.props.min < value && value < this.props.max ) {
      this.props.handleInputChange(e, value, this.props.input_type)
      this.setState({
        error: false
      })
    } else {
      this.setState({
        error: true
      })
    }
  }

  render() {
    return(
      <form className={ styles.inputController } onChange={this.handleSubmit.bind(this)}>
        <h3>{this.formatHeaderText(this.props.input_type)}</h3>
        <div className={ styles.flexContainer }>
          <input 
            className={this.state.error ? styles.errorInput : ''}
            type="text" 
            placeholder={this.props.value}
          />
          <DefaultSlider
            value={this.props.value}
            aria-labelledby="discrete-slider-small-steps"
            step={this.props.step}
            min={this.props.min ? this.props.min : 0 }
            max={this.props.max}
            onChange={(e, value) => { this.props.handleInputChange(e, value, this.props.input_type) }}
          />
        </div>
      </form>
    )
  }
}

var DefaultSlider = withStyles({
  root: {
    color:'#0C57C9'
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: 12,
    marginLeft: 0,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  track: {
    marginTop: 23,
    height: 2,
    borderRadius: 4,
  },
  rail: {
    marginTop: 23,
    height: 2,
    borderRadius: 4,
  }
})(Slider);

export default InputController;