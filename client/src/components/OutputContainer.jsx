import React, { Component } from 'react';
import styles from './../styles/OutputContainer.css';

var OutputContainer = ({ output_data }) => { 
  return(
    <div className={ styles.outputContainer }>
      <p>If you can rent a similar home for less than.. </p>
      <h4>${ output_data.monthly_rent } / month</h4>
      <h4>Renter</h4>
      <p>Initial costs: ${ output_data.renter.initial_costs }</p>
      <p>Recurring costs: ${ output_data.renter.recurring_costs }</p>
      <p>Opportunity costs: ${ output_data.renter.opportunity_costs }</p>
      <p>Net Proceeds: -${ output_data.renter.net_proceeds }</p>
      <p>Total: ${ output_data.renter.total }</p>
      <h4>Buyer</h4>
      <p>Initial costs: ${ output_data.buyer.initial_costs }</p>
      <p>Recurring costs: ${ output_data.buyer.recurring_costs }</p>
      <p>Opportunity costs: ${ output_data.buyer.opportunity_costs }</p>
      <p>Net Proceeds: -${ output_data.buyer.net_proceeds }</p>
      <p>Total: ${ output_data.buyer.total }</p>
    </div>
  )
}

export default OutputContainer;