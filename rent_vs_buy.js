let years_at_home = 15
let price_of_home = 800000
// let monthly_rent = 2965

let mortgage_rate = 0.0375
let percent_downpayment = 0.15
let length_years_of_mortgage = 25

let home_growth_rate = 0.03
let rent_growth_rate = 0.025
let investment_return_rate = 0.07
let inflation_rate = 0.03

let property_tax_rate = 0.02
let marginal_tax_rate = 0.3

let closing_cost_rate_of_buying_home = 0.06
let closing_cost_rate_of_selling_home = 0.045

let maintenance_and_renovation_rate = 0.01
let homeowners_insurance_rate = 0.0046
let monthly_utilities_cost = 100
let monthly_common_fees = 0

let months_of_security_deposit = 3
let renters_insurance_rate = 0
let capital_gains_tax_rate = 0.2

let single_or_married = 'single' // not used

// Assumptions
// long term tax 20%
// Capital non taxable 250000
// Amortization schedule: https://www.fool.com/the-ascent/personal-loans/articles/how-is-loan-amortization-schedule-calculated/#:~:text=Its%20relatively%20easy%20to%20produce,to%20get%20your%20monthly%20interest.?source=awin&awc=12195_1590807213_cbc7f1086fc03f05e3d77441d3a80b35&utm_source=aw&utm_medium=affiliate&utm_campaign=101248

// Algorithm to caclulate rent cost to match cost of buying home

let calculate_monthly_rent_to_match_buying_house = () => {
	min = 0;
	max = 10000;
	let monthly_rent;

	while (min < max) {
		monthly_rent = (min + max) / 2;

		let buyer_initial_cost_data = get_total_initial_cost_for_buyer(percent_downpayment, closing_cost_rate_of_buying_home, price_of_home);
		let buyer_total_recurring_cost_data = get_total_recurring_costs_for_buyer(years_at_home);
		let buyer_net_proceeds = calculate_net_proceeds_for_buyer();
		let buyer_total = calculate_total_cost(buyer_initial_cost_data, buyer_total_recurring_cost_data, buyer_net_proceeds);

		let renter_initial_cost_data = get_total_initial_cost_for_renter(monthly_rent);
		let renter_recurring_cost_data = get_total_recurring_costs_for_renter(years_at_home, monthly_rent);
		let renter_net_proceeds = monthly_rent * months_of_security_deposit;
		let renter_total = calculate_total_cost(renter_initial_cost_data, renter_recurring_cost_data, renter_net_proceeds);

		renter_total = Math.round(renter_total);
		buyer_total = Math.round(buyer_total);

		if (renter_total == buyer_total) {
			return {
				'buyer_initial_cost_data': buyer_initial_cost_data,
				'buyer_total_recurring_cost_data': buyer_total_recurring_cost_data,
				'buyer_net_proceeds': buyer_net_proceeds,
				'buyer_total': buyer_total,
				'renter_initial_cost_data': renter_initial_cost_data,
				'renter_recurring_cost_data': renter_recurring_cost_data,
				'renter_net_proceeds': renter_net_proceeds,
				'renter_total': renter_total,
				'monthly_rent': monthly_rent
			};
		} else if (renter_total < buyer_total) {
			min = monthly_rent;
		} else {
			max = monthly_rent;
		}
	}
}

let get_total_initial_cost_for_buyer = (percent_downpayment, closing_cost_rate, home_price) => { 
	let total_initial_cost = (percent_downpayment * home_price) + (closing_cost_rate * home_price);
	let total_opportunity_cost = calculate_opportunity_cost_with_start_year(0, total_initial_cost, investment_return_rate, years_at_home) 
	return {
		'total_initial_cost': total_initial_cost,
		'total_opportunity_cost': (total_opportunity_cost - total_initial_cost) * (1 - capital_gains_tax_rate)
	}
}

let get_total_initial_cost_for_renter = (monthly_rent) => {
	let total_initial_cost = monthly_rent * months_of_security_deposit;
	let total_opportunity_cost = calculate_opportunity_cost_with_start_year(0, total_initial_cost, investment_return_rate, years_at_home) 
	return {
		'total_initial_cost': total_initial_cost,
		'total_opportunity_cost': (total_opportunity_cost - total_initial_cost) * (1 - capital_gains_tax_rate)
	}
}

let get_total_recurring_costs_for_buyer = (years) => {
	let total_recurring_cost = total_tax_after_deductible = total_mortgage_payment_after_deductible = total_maintenance = total_homeowners_insurance = total_utilities = total_opportunity_cost = 0;
	let remaining_mortgage_principal = (price_of_home ) - (price_of_home * percent_downpayment);
	let monthly_mortgage_payment = calculate_monthly_mortgage_payment(percent_downpayment, length_years_of_mortgage, percent_downpayment, price_of_home);
	let yearly_mortgage_payment = monthly_mortgage_payment * 12;

	for (let year = 0; year < years; year++) {
		let tax_before_deductible = get_yearly_fees_based_on_rate(year, property_tax_rate, home_growth_rate, price_of_home);
		let tax_deductible = calculate_total_deductible_from_fee(tax_before_deductible, marginal_tax_rate);
		let tax_after_deductible = tax_before_deductible - tax_deductible;

		let mortgage_payment_after_deductible = 0
		if (year < length_years_of_mortgage) {
			let mortgage_interest_to_pay = remaining_mortgage_principal * mortgage_rate;
			let mortgage_principal_to_pay = yearly_mortgage_payment - mortgage_interest_to_pay;
			remaining_mortgage_principal = remaining_mortgage_principal - mortgage_principal_to_pay;
			let mortgage_interest_deductible = calculate_total_deductible_from_fee(mortgage_interest_to_pay, marginal_tax_rate);
			mortgage_payment_after_deductible = yearly_mortgage_payment - mortgage_interest_deductible;
		}

		let maintenance = get_yearly_fees_based_on_rate(year, maintenance_and_renovation_rate, home_growth_rate, price_of_home);
		let homeowners_insurance = get_yearly_fees_based_on_rate(year, homeowners_insurance_rate, home_growth_rate, price_of_home);
		let utilities = monthly_utilities_cost * 12;

		let recurring_cost = tax_after_deductible + mortgage_payment_after_deductible + maintenance + homeowners_insurance + utilities;
		recurring_cost = recurring_cost * (1 + inflation_rate);
		let opportunity_cost = calculate_opportunity_cost_with_start_year(year, recurring_cost, investment_return_rate, years_at_home);
	
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
		'total_opportunity_cost': (total_opportunity_cost - total_recurring_cost) * (1 - capital_gains_tax_rate)
	}
}

let get_total_recurring_costs_for_renter = (years, monthly_rent) => {
	let total_recurring_cost = total_opportunity_cost = 0;
	for (let year = 0; year < years; year++) {
		let yearly_rent = calculate_compound_value(monthly_rent * 12, rent_growth_rate, year);

		let yearly_recurring_cost = yearly_rent + (yearly_rent * renters_insurance_rate);
		yearly_recurring_cost = yearly_recurring_cost * (1 + inflation_rate);
		op_cost = calculate_opportunity_cost_with_start_year(year, yearly_recurring_cost, investment_return_rate, years_at_home);
		total_recurring_cost += yearly_recurring_cost
		total_opportunity_cost += op_cost;
	}
	return {
		'total_recurring_cost': total_recurring_cost,
		'total_opportunity_cost': (total_opportunity_cost - total_recurring_cost) * (1 - capital_gains_tax_rate)
	}
}

let calculate_opportunity_cost_with_start_year = (year, cost, investment_rate, years) => {
	// Assuming I invest $100 first year (0), i am calculating to power of 40 - 0 - 1 = 39 years to compound
	// This is assuming that the money saved for year 0 is invested at the end of year. It is a conservative approach
	return cost * Math.pow((1 + investment_rate), (years - year - 1));
}

let calculate_total_cost = (initial_cost_data, recurring_cost_data, profits) => {
	let total_initial_cost = initial_cost_data.total_initial_cost;
	let op_cost_initial = initial_cost_data.total_opportunity_cost;
	let total_recurring_cost = recurring_cost_data.total_recurring_cost;
	let op_cost_recurring = recurring_cost_data.total_opportunity_cost;
	let total_op_cost = op_cost_initial + op_cost_recurring;

	return total_initial_cost + total_recurring_cost + total_op_cost - profits 
}

let calculate_compound_value = (initial, rate, years) => {
	return initial * Math.pow((1 + rate), years);
}

let get_yearly_fees_based_on_rate = (year, fee_rate, home_rate, home_price) => {
	return home_price * Math.pow((1 + home_rate), year) * fee_rate;
}

// Mortgage calculator source: https://finance.zacks.com/manually-calculate-mortgage-1820.html
let calculate_monthly_mortgage_payment = (mortgate_rate, years, percent_downpayment, price_of_home) => {
	let borrowed_amount = price_of_home - (price_of_home * percent_downpayment);
	let monthly_rate = mortgage_rate / 12;
	let total_monthly_payments = years * 12;
	let x = 1 + monthly_rate;
	x = Math.pow(x, - total_monthly_payments);
	x = 1 - x;
	x = monthly_rate / x;
	let monthly_payment = x * borrowed_amount;
	return monthly_payment;
}

let calculate_total_deductible_from_fee = (fee, marginal_tax_rate) => {
	return fee * marginal_tax_rate;
}

let calculate_total_remaining_principal_amount_at_year = (years_at_home) => {
	let remaining_mortgage_principal = (price_of_home ) - (price_of_home * percent_downpayment);
	let monthly_mortgage_payment = calculate_monthly_mortgage_payment(percent_downpayment, length_years_of_mortgage, percent_downpayment, price_of_home);
	let yearly_mortgage_payment = monthly_mortgage_payment * 12;
	for (let year = 0; year < years_at_home; year++) {
		if (year < length_years_of_mortgage) {
			let mortgage_interest_to_pay = remaining_mortgage_principal * mortgage_rate;
			let mortgage_principal_to_pay = yearly_mortgage_payment - mortgage_interest_to_pay;
			remaining_mortgage_principal = remaining_mortgage_principal - mortgage_principal_to_pay;
		}
	}
	return remaining_mortgage_principal
}

let calculate_net_proceeds_for_buyer = () => {
	let principal_amount_paid;
	let principal_left = 0;
	if (years_at_home < length_years_of_mortgage) {
		principal_left = calculate_total_remaining_principal_amount_at_year(years_at_home)
	}
	let home_sell_value = calculate_compound_value(price_of_home, home_growth_rate, years_at_home);
	let home_sell_fee = home_sell_value * closing_cost_rate_of_selling_home;
	return home_sell_value - home_sell_fee - principal_left;
}


let result = calculate_monthly_rent_to_match_buying_house()
console.log('result: ');
console.log('###############################');
console.log('BUYER:');
console.log('  Initial costs: ', result.buyer_initial_cost_data.total_initial_cost);
console.log('  Recurring costs: ', result.buyer_total_recurring_cost_data.total_recurring_cost);
console.log('  Opportunity costs: ', result.buyer_initial_cost_data.total_opportunity_cost + result.buyer_total_recurring_cost_data.total_opportunity_cost);
console.log('  Net Proceeds: ', result.buyer_net_proceeds);
console.log('  Total: ', result.buyer_total);
console.log('###############################');
console.log('RENTER:');
console.log('  Initial costs: ', result.renter_initial_cost_data.total_initial_cost);
console.log('  Recurring costs: ', result.renter_recurring_cost_data.total_recurring_cost);
console.log('  Opportunity costs: ', result.renter_initial_cost_data.total_opportunity_cost + result.renter_recurring_cost_data.total_opportunity_cost);
console.log('  Net Proceeds: ', result.renter_net_proceeds);
console.log('  Total: ', result.renter_total);
console.log('###############################');
console.log('Monthly rental should be: ', result.monthly_rent);


console.log('  Initial costs: ', result.buyer_initial_cost_data);



// console.log('get_total_initial_cost_for_buyer: ', get_total_initial_cost_for_buyer(percent_downpayment, closing_cost_rate_of_buying_home, price_of_home))
// console.log('get_total_recurring_costs_for_buyer: ', get_total_recurring_costs_for_buyer(years_at_home))
// console.log('total opportunity cost for buyer: ', get_total_initial_cost_for_buyer(percent_downpayment, closing_cost_rate_of_buying_home, price_of_home).total_opportunity_cost + get_total_recurring_costs_for_buyer(years_at_home).total_opportunity_cost)
// console.log('calculate_net_proceeds_for_buyer: ', calculate_net_proceeds_for_buyer())

