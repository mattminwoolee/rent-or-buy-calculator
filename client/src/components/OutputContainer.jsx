import React, { Component } from 'react';
import styles from './../styles/OutputContainer.css';
import { Grid, Cell } from "styled-css-grid";
import Sticky from 'react-sticky-el';



var OutputContainer = ({ output_data }) => { 
  return(
    <Sticky className={ styles.outputContainer }>
      <div className={ styles.flexContainer }>
        <h2>If you can rent a similar home for less than.. </h2>
        <h1 className={ styles.displayOutput }>${ output_data.monthly_rent } / month</h1>
        <h2>... then renting is better.</h2>
        <Grid className={ styles.grid } columns={7}>
          <Cell width={3}></Cell>
          <Cell width={2}>Rent</Cell>
          <Cell width={2}>Buy</Cell>

          <Cell width={3}>Initial costs:</Cell>
          <Cell width={2}>${ output_data.renter.initial_costs }</Cell>
          <Cell width={2}>${ output_data.buyer.initial_costs }</Cell>

          <Cell width={3}>Recurring costs:</Cell>
          <Cell width={2}>${ output_data.renter.recurring_costs }</Cell>
          <Cell width={2}>${ output_data.buyer.recurring_costs }</Cell>

          <Cell width={3}>Opportunity costs:</Cell>
          <Cell width={2}>${ output_data.renter.opportunity_costs }</Cell>
          <Cell width={2}>${ output_data.buyer.opportunity_costs }</Cell>

          <Cell width={3}>Net Proceeds:</Cell>
          <Cell width={2}>-${ output_data.renter.net_proceeds }</Cell>
          <Cell width={2}>-${ output_data.buyer.net_proceeds }</Cell>

          <Cell width={3}>Total: $</Cell>
          <Cell width={2}>${ output_data.renter.total }</Cell>
          <Cell width={2}>${ output_data.buyer.total }</Cell>
        </Grid>
      </div>
    </Sticky>
  )
}

export default OutputContainer;