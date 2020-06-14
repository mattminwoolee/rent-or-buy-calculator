import React, { Component } from 'react';
import InputController from './InputController.jsx';
import styles from './../styles/InputContainer.css';

var InputContainer = (props) => { 
  return(
    <div className={ styles.inputContainer }>
      {Object.keys(props.input_data).map( (input_type, index) => 
        {
          let max, min, step;
          switch (input_type) {
            case 'price_of_home': 
              min = 30000
              max = 3000000
              step = 100
              break;
            case 'years_at_home':
              min = 1
              max = 40
              step = 1
              break;
            case 'mortgage_rate':
              min = 0
              max = .15
              step = .001
              break;
            case 'percent_downpayment':
              min = 0
              max = 1
              step = .001
              break;
            case 'length_years_of_mortgage':
              min = 1
              max = 40
              step = 1
              break;
            case 'home_growth_rate':
            case 'rent_growth_rate':
              min = -.05
              max = .15
              step = .001
              break;
            case 'investment_return_rate':
              min = -.1
              max = .20
              step = .001
              break;
            case 'inflation_rate':
              min = -.05
              max = .1
              step = .001
              break;
            case 'maintenance_and_renovation_rate':
            case 'homeowners_insurance_rate':
            case 'closing_cost_rate_of_buying_home':
            case 'closing_cost_rate_of_selling_home':
            case 'property_tax_rate':
            case 'renters_insurance_rate':
              min = 0
              max = .1
              step = .001
              break;
            case 'marginal_tax_rate':
            case 'capital_gains_tax':
              min = 0
              max = .5
              step = .001
              break;
            case 'monthly_utilities_cost':
              min = 0
              max = 2000
              step = 1
              break;
            case 'monthly_common_fees':
              min = 0
              max = 4000
              step = 1
              break;
            case 'months_of_security_deposit':
              min = 1
              max = 12
              step = 1
              break;
            default:
              break;
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