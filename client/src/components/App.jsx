import React from 'react';
import styles from './../styles/App.css';
import Header from './Header.jsx';
import Main from './Main.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
      input_data: {
        'price_of_home': 800000,
        'years_at_home': 15,
        'mortgage_rate': 0.0375,
        'percent_downpayment': 0.15,
        'length_years_of_mortgage': 25,
        'home_growth_rate': 0.03,
        'rent_growth_rate': 0.025,
        'investment_return_rate': 0.07,
        'inflation_rate': 0.03,
        'property_tax_rate': 0.02,
        'marginal_tax_rate': 0.3,
        'closing_cost_rate_of_buying_home': 0.06,
        'closing_cost_rate_of_selling_home': 0.045,
        'maintenance_and_renovation_rate': 0.01,
        'homeowners_insurance_rate': 0.0046,
        'monthly_utilities_cost': 100,
        'monthly_common_fees': 0,
        'months_of_security_deposit': 3,
        'renters_insurance_rate': 0,
        'capital_gains_tax': 0.2,
        'single_or_married': 'single'
      },
      output_data: {
        buyer: {
          'initial_costs': 0,
          'recurring_costs': 0,
          'opportunity_costs': 0,
          'net_proceeds': 0,
          'total': 0
        },
        renter: {
          'initial_costs': 0,
          'recurring_costs': 0,
          'opportunity_costs': 0,
          'net_proceeds': 0,
          'total': 0
        },
        monthly_rent: 0
      }
    };
  }

  componentDidMount() {
    let new_state = this.state;
    let result = this.calculateOptimalRent();
    new_state.output_data = result;
    this.setState( new_state )
  }

  calculateOptimalRent() {
    let input_data = this.state.input_data,
        min = 0,
        max = 10000,
        monthly_rent;

    while (min < max) {
      monthly_rent = (min + max) / 2;
  
      let buyer_initial_cost_data = this.getBuyerInitialCostData();
      let buyer_total_recurring_cost_data = this.getBuyerRecurringCostData();
      let buyer_net_proceeds = this.getBuyerNetProceeds();
      let buyer_total = this.getTotalCost(buyer_initial_cost_data, buyer_total_recurring_cost_data, buyer_net_proceeds);
  
      let renter_initial_cost_data = this.getRenterInitialCostData(monthly_rent);
      let renter_recurring_cost_data = this.getRenterRecurringCostData(monthly_rent);
      let renter_net_proceeds = monthly_rent * input_data.months_of_security_deposit;
      let renter_total = this.getTotalCost(renter_initial_cost_data, renter_recurring_cost_data, renter_net_proceeds);

      if (Math.round(renter_total) == Math.round(buyer_total)) {
        return {
          'buyer': {
            'initial_costs': Math.round(buyer_initial_cost_data.total_initial_cost),
            'recurring_costs': Math.round(buyer_total_recurring_cost_data.total_recurring_cost),
            'opportunity_costs': Math.round(buyer_initial_cost_data.total_opportunity_cost + buyer_total_recurring_cost_data.total_opportunity_cost),
            'net_proceeds': Math.round(buyer_net_proceeds),
            'total': Math.round(buyer_total)
          },
          'renter': {
            'initial_costs': Math.round(renter_initial_cost_data.total_initial_cost),
            'recurring_costs': Math.round(renter_recurring_cost_data.total_recurring_cost),
            'opportunity_costs': Math.round(renter_initial_cost_data.total_opportunity_cost + renter_recurring_cost_data.total_opportunity_cost),
            'net_proceeds': Math.round(renter_net_proceeds),
            'total': Math.round(renter_total)
          },
          'monthly_rent' : Math.round(monthly_rent)
        };
      } else if (renter_total < buyer_total) {
        min = monthly_rent;
      } else {
        max = monthly_rent;
      }
    }
  }

  getBuyerInitialCostData() {
    let input_data = this.state.input_data
    let total_initial_cost = (input_data.percent_downpayment * input_data.price_of_home) + (input_data.closing_cost_rate_of_buying_home * input_data.price_of_home);
    let total_opportunity_cost = this.getOpportunityCost(0, total_initial_cost) 
    return {
      'total_initial_cost': total_initial_cost,
      'total_opportunity_cost': (total_opportunity_cost - total_initial_cost) * (1 - input_data.capital_gains_tax)
    }
  }

  getBuyerRecurringCostData() {
    let input_data = this.state.input_data,
        total_recurring_cost = 0, 
        total_tax_after_deductible = 0, 
        total_mortgage_payment_after_deductible = 0, 
        total_maintenance = 0, 
        total_homeowners_insurance = 0, 
        total_utilities = 0, 
        total_opportunity_cost = 0;
    let remaining_mortgage_principal = (input_data.price_of_home ) - (input_data.price_of_home * input_data.percent_downpayment);
    let yearly_mortgage_payment = this.getYearlyMortgagePayment();

    for (let year = 0; year < input_data.years_at_home; year++) {
      let tax_before_deductible = this.getYearlyFeeBasedOnRate(input_data.property_tax_rate, year);
      let tax_deductible = this.getDeductible(tax_before_deductible, input_data.marginal_tax_rate);
      let tax_after_deductible = tax_before_deductible - tax_deductible;

      let mortgage_payment_after_deductible = 0
      if (year < input_data.length_years_of_mortgage) {
        let mortgage_interest_to_pay = remaining_mortgage_principal * input_data.mortgage_rate;
        let mortgage_principal_to_pay = yearly_mortgage_payment - mortgage_interest_to_pay;
        remaining_mortgage_principal = remaining_mortgage_principal - mortgage_principal_to_pay;
        let mortgage_interest_deductible = this.getDeductible(mortgage_interest_to_pay, input_data.marginal_tax_rate);
        mortgage_payment_after_deductible = yearly_mortgage_payment - mortgage_interest_deductible;
      }

      let maintenance = this.getYearlyFeeBasedOnRate(input_data.maintenance_and_renovation_rate, year);
      let homeowners_insurance = this.getYearlyFeeBasedOnRate(input_data.homeowners_insurance_rate, year);
      let utilities = input_data.monthly_utilities_cost * 12;

      let recurring_cost = tax_after_deductible + mortgage_payment_after_deductible + maintenance + homeowners_insurance + utilities;
      recurring_cost = recurring_cost * (1 + input_data.inflation_rate);
      let opportunity_cost = this.getOpportunityCost(year, recurring_cost);
    
      total_tax_after_deductible += tax_after_deductible;
      total_mortgage_payment_after_deductible += mortgage_payment_after_deductible;
      total_maintenance += maintenance;
      total_homeowners_insurance += homeowners_insurance;
      total_utilities += utilities;
      total_recurring_cost += recurring_cost;
      total_opportunity_cost += opportunity_cost
    }
    return {
      'total_tax_after_deductible': total_tax_after_deductible,
      'total_mortgage_payment_after_deductible': total_mortgage_payment_after_deductible,
      'total_maintenance': total_maintenance,
      'total_homeowners_insurance': total_homeowners_insurance,
      'total_utilities': total_utilities,
      'total_recurring_cost': total_recurring_cost,
      'total_opportunity_cost': (total_opportunity_cost - total_recurring_cost) * (1 - input_data.capital_gains_tax)
    }
  }

  getBuyerNetProceeds() {
    let input_data = this.state.input_data,
        principal_left = 0;
    if (input_data.years_at_home < input_data.length_years_of_mortgage) {
      principal_left = this.getRemainingPrincipal()
    }
    let home_sell_value = this.getCompoundValue(input_data.price_of_home, input_data.home_growth_rate, input_data.years_at_home);
    let home_sell_fee = home_sell_value * input_data.closing_cost_rate_of_selling_home;
    return home_sell_value - home_sell_fee - principal_left;
  }

  getRenterInitialCostData(monthly_rent) {
    let input_data = this.state.input_data
    let total_initial_cost = monthly_rent * input_data.months_of_security_deposit;
    let total_opportunity_cost = this.getOpportunityCost(0, total_initial_cost)
    return {
      'total_initial_cost': total_initial_cost,
      'total_opportunity_cost': (total_opportunity_cost - total_initial_cost) * (1 - input_data.capital_gains_tax)
    }
  }

  getRenterRecurringCostData(monthly_rent) {
    let input_data = this.state.input_data
    let total_recurring_cost = 0,
        total_opportunity_cost = 0;
    for (let year = 0; year < input_data.years_at_home; year++) {
      let yearly_rent = this.getCompoundValue(monthly_rent * 12, input_data.rent_growth_rate, year);

      let yearly_recurring_cost = yearly_rent + (yearly_rent * input_data.renters_insurance_rate);
      yearly_recurring_cost = yearly_recurring_cost * (1 + input_data.inflation_rate);
      let op_cost = this.getOpportunityCost(year, yearly_recurring_cost);
      total_recurring_cost += yearly_recurring_cost
      total_opportunity_cost += op_cost;
    }
    return {
      'total_recurring_cost': total_recurring_cost,
      'total_opportunity_cost': (total_opportunity_cost - total_recurring_cost) * (1 - input_data.capital_gains_tax)
    }
  }

  getTotalCost(initial_cost_data, recurring_cost_data, net_proceeds) {
    let total_initial_cost = initial_cost_data.total_initial_cost;
    let op_cost_initial = initial_cost_data.total_opportunity_cost;
    let total_recurring_cost = recurring_cost_data.total_recurring_cost;
    let op_cost_recurring = recurring_cost_data.total_opportunity_cost;
    let total_op_cost = op_cost_initial + op_cost_recurring;

    return total_initial_cost + total_recurring_cost + total_op_cost - net_proceeds 
  }

  getYearlyFeeBasedOnRate(rate, year) {
    let input_data = this.state.input_data
    return input_data.price_of_home * Math.pow((1 + input_data.home_growth_rate), year) * rate;
  }

  getYearlyMortgagePayment() {
    let input_data = this.state.input_data
    let borrowed_amount = input_data.price_of_home - (input_data.price_of_home * input_data.percent_downpayment);
    let monthly_rate = input_data.mortgage_rate / 12;
    let total_monthly_payments = input_data.length_years_of_mortgage * 12;
    let x = 1 + monthly_rate;
    x = Math.pow(x, - total_monthly_payments);
    x = 1 - x;
    x = monthly_rate / x;
    let monthly_payment = x * borrowed_amount;
    return monthly_payment * 12;
  }

  getDeductible(amount, rate) {
    return amount * rate;
  }

  getRemainingPrincipal() {
    let input_data = this.state.input_data
    let remaining_mortgage_principal = (input_data.price_of_home ) - (input_data.price_of_home * input_data.percent_downpayment);
    let yearly_mortgage_payment = this.getYearlyMortgagePayment();
    for (let year = 0; year < input_data.years_at_home; year++) {
      if (year < input_data.length_years_of_mortgage) {
        let mortgage_interest_to_pay = remaining_mortgage_principal * input_data.mortgage_rate;
        let mortgage_principal_to_pay = yearly_mortgage_payment - mortgage_interest_to_pay;
        remaining_mortgage_principal = remaining_mortgage_principal - mortgage_principal_to_pay;
      }
    }
    return remaining_mortgage_principal
  }

  getCompoundValue(initial, rate, years) {
    return initial * Math.pow((1 + rate), years);
  }

  getOpportunityCost(start_year, start_amount) {
    let input_data = this.state.input_data
    return start_amount * Math.pow((1 + input_data.investment_return_rate), (input_data.years_at_home - start_year - 1))
  }

  handleInputChange(e, value, input_type) {
    let newState = this.state;
    newState.input_data[input_type] = value;
    this.setState(newState);
    let new_state = this.state;
    let result = this.calculateOptimalRent();
    new_state.output_data = result;
    this.setState( new_state )
  }

  render() {
    return (
      <div className={ styles.appContainer } >
        <div className={ styles.outerContainer }>
          <Header />
          <Main 
          handleInputChange={ this.handleInputChange.bind(this) } 
          input_data={ this.state.input_data }
          output_data={ this.state.output_data }
          />
        </div>
      </div>
    );
  }
}

export default App;