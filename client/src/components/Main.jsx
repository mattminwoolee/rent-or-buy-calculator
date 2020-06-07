import React, { Component } from 'react';
import InputContainer from './InputContainer.jsx';
import OutputContainer from './OutputContainer.jsx';
import styles from './../styles/Main.css';

var Main = (props) => { 
  return(
    <main>
      <InputContainer handleInputChange={ props.handleInputChange } input_data={ props.input_data }/>
      <OutputContainer output_data={ props.output_data }/>
    </main>
  )
}

export default Main;