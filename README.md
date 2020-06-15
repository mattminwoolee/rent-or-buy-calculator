# Rent or Buy Calculator
A financial tool that evaluates whether it is better to rent or buy a home when taking the following into account: home price, mortgage rate, length of mortgage, downpayment, investment opportunity costs, maintenance costs, closing costs, etc.

Link to app can be found here: https://rent-or-buy.herokuapp.com/

* Inspired by NY Times Upshot (https://www.nytimes.com/interactive/2014/upshot/buy-rent-calculator.html)

## Methodology

Create two balance sheets:
1. Buying a home
2. Renting a home

Each balance sheet can be broken down to the following costs: 
1. Initial costs - Upfront costs (aka security deposit or downpayment)
2. Recurring costs - Monthly / yearly expenses
* For buyers, this includes, mortgage payments, property taxes, homeowner's insurance, property tax, and tax deductibles from mortgage interest and other tax charges
* For renters, this includes monthly rent and renter's insurance (if applicable)
3. Opportunity costs - Money you could have made if you had invested the recurring and initial costs
4. Net proceeds - Total gains
5. Total cost - Sum of all four costs above

Based on the input variables, calculate the balance sheet for Total Cost of buying a home. Then, calculate monthly rent required to match Total Cost of renting a home to the Total Cost of buying a home.

The calculator will evaluate that if one can rent a similar home that is less or equal to the output Rent from the previous step, it is better to rent than buying a home.

## Project Roadmap

1. Organize all balance sheet equations into a google spread sheet (https://docs.google.com/spreadsheets/d/1A-KkhHklJCiloOEByyXgQ1C8z7P0_O18yJPTZH-MX1Y/edit?usp=sharing)
2. Obtain confidence by running several variations and compare output with calculator from NY Times
3. Migrate formulas into a script file and test
4. Build React app to create responsive UI
5. Plug calculations from step 3 into React app
6. Deploy and enjoy (:

## References

* https://www.nytimes.com/2014/05/22/upshot/rent-or-buy-the-math-is-changing.html
* https://www.nytimes.com/interactive/2014/upshot/buy-rent-calculator.html
* https://finance.zacks.com/manually-calculate-mortgage-1820.html
* http://www.moneychimp.com/articles/finworks/fmbasinv.htm
* https://support.microsoft.com/en-ie/office/how-to-calculate-compound-interest-for-an-intra-year-period-in-excel-dc752788-2c5b-4ba6-a008-bba79ef45e74
* https://www.wikihow.com/Calculate-Amortization#:~:text=To%20calculate%20amortization%2C%20start%20by,find%20the%20principal%20payment%20amount.
