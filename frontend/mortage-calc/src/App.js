import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

function App() {

  // useState functions to get the values from the inmputs
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanDuration, setLoanDuration] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [isFixedRate, setIsFixedRate] = useState(true);

  const loanDurationInMonths = loanDuration * 12;

  const handleInputChange = (setState) => (e) => {
    const value = e.target.value;

    //Removing the initial 0
    const removeLeadingZero = value === '' ? '': Number(value);
    setState(removeLeadingZero);
  }

  // Fixed monthly payment calculation
  const calculateFixedMonthlyPayment = () => {
    const loanDurationMonths = loanDuration * 12;
    const interestDecimal = interestRate / 100 / 12;

    const numerator = interestDecimal * loanAmount;
    const denominator = 1 - Math.pow(1 + interestDecimal, -loanDurationMonths);

    return numerator / denominator;

  };

  const calculateNonFixedMonthlyPayment = (P, r1, r2, n, changeAfterMonths) => {
    // Initial interest rate 
    const interestDecimal1 = r1 / 100 / 12;
    const interestDecimal2 = r2 / 100 / 12;
    const months = n * 12;

    const numeratorOne = interestDecimal1 * P;
    const denominatorOne = 1 - Math.pow(1 + interestDecimal1, -changeAfterMonths);

    const initialPayment = numeratorOne / denominatorOne;


    // New balance after interest rate change
    const balanceRemaining = P - initialPayment * changeAfterMonths;

    const numeratorTwo = interestDecimal2 * balanceRemaining;
    const denominatorTwo = 1 - Math.pow(1 + interestDecimal2, -(months - changeAfterMonths));

    const newPayment = numeratorTwo / denominatorTwo;

    return initialPayment + newPayment;

  };

  const handleCalculate = () => {
    if (isFixedRate) {
      const payment = calculateFixedMonthlyPayment(loanAmount, interestRate, loanDuration);
      setMonthlyPayment(payment.toFixed(2)); 

      if (!payment) {
        setMonthlyPayment(0);
      }
    } else {
      const payment = calculateNonFixedMonthlyPayment(loanAmount, interestRate, 5.0, loanDuration, 60);
      setMonthlyPayment(payment.toFixed(2));
    }

  };

  // sort through loanDuration months
  const loanDurationLabel = () => {
    const labels = []
    const displayInMonths = loanDuration * 12 > 12 ? 12: loanDuration * 12;
    for (let i = 1; i <= displayInMonths; i++){
      labels.push(`Month: ${i}`)
    }
    return labels;
  }

  const data = {
    labels: loanDurationLabel(),
    datasets: [
      {
        label: `Monthly Payments`,
        data: Array(loanDuration * 12).fill(monthlyPayment),
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.3,
      },
    ],
  };
  

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };


  return (
    <>
    <header>
      <div id="header" className="container">
          <h1 href="#header">Loan Calculator</h1>
      </div>
    </header>
      <div className="container">
        <div className="loan-amount">
          <input value={loanAmount} type="number" onChange={handleInputChange(setLoanAmount)} placeholder="Enter Loan Amount"></input>
        </div>
        <div className="loan-duration">
          <input value={loanDuration} type="number" placeholder="Enter Loan Duration" onChange={handleInputChange(setLoanDuration)}></input>
        </div>
        <div className="interest-rate">
          <input value={interestRate} type="number" placeholder="Enter Interest Rate" onChange={handleInputChange(setInterestRate)}></input>
        </div>
        <div className="loan-type">
          <div className="fixedBox">
            <input name="loan-type" id="fixed" type="checkbox" value="fixed" checked={isFixedRate} onChange={() => setIsFixedRate(!isFixedRate)} />
            <label for="fixed">Fixed</label>
          </div>
          <div>
            <button onClick={handleCalculate}>Calculate</button>
          </div>

          <div className="container">
            <p>Loan Amount: {loanAmount} </p>
            <p>Interest Rate: {interestRate} </p>
            <p>Loan Duration: {loanDuration} years / {loanDurationInMonths} months </p>
            <h3>Monthly Payment: ${monthlyPayment}</h3>
          </div>
        </div>
      </div>

      <div>
        <Line data={data} options={options} />
      </div>
    </>
  );
}

export default App;
