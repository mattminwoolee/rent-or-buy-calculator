import React, { Component } from 'react';
import styles from './../styles/Header.css';
import Logo from'./../../dist/assets/logos/logo-long-colored.png';


var Header = (props) => { 
  return(
    <header>
      {/* <h1>RENT<br/>OR<br/>BUY</h1> */}
      <img src={Logo}/>
      <h4></h4>
    </header>
  )
}

export default Header;