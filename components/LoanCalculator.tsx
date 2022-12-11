import { useState } from 'react'

const LoanCalculator = () => {
  interface Values {
    price: string
    downpayment: string
    period: string
    rate: string
  }

  const [userValues, setUserValues] = useState<Values>({
    price: '500,000',
    downpayment: '50,000',
    period: '35',
    rate: '3.5',
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserValues({ ...userValues, [event.target.name]: event.target.value })
  }

  const handleSubmitValues = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    calculateResults(userValues)
    calculateFee(userValues)
    setShowOther(true)
  }

  const [showOther, setShowOther] = useState(false)

  const [results, setResults] = useState({
    loanAmount: '',
    monthlyPayment: '',
    totalPayment: '',
    totalInterest: '',
    isResult: false,
  })

  const calculateResults = ({
    price,
    downpayment,
    period,
    rate,
  }: {
    price: string
    downpayment: string
    period: string
    rate: string
  }) => {
    const userLoan =
      Number(price.replace(/,/g, '')) - Number(downpayment.replace(/,/g, ''))
    const calculatedPeriod = Number(period) * 12
    const calculatedRate = Number(rate) / 100 / 12

    const x = Math.pow(1 + calculatedRate, calculatedPeriod)
    const monhtly = (userLoan * x * calculatedRate) / (x - 1)

    if (isFinite(monhtly)) {
      const monhtlyPaymentCalculated = monhtly.toFixed(2)
      const totalPaymentCalculated = (monhtly * calculatedPeriod).toFixed(2)
      const totalInterestCalculated = (
        monhtly * calculatedPeriod -
        userLoan
      ).toFixed(2)

      setResults({
        loanAmount: userLoan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        monthlyPayment: monhtlyPaymentCalculated
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        totalPayment: totalPaymentCalculated
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        totalInterest: totalInterestCalculated
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        isResult: true,
      })
    }
    return
  }

  const [fee, setFee] = useState({
    spaLawyer: '',
    dutyStamp: '',
    loanLawyer: '',
    loanStamp: '',
    totalFee: '',
    totalDownpayment: '',
  })

  const calculateFee = ({
    price,
    downpayment,
  }: {
    price: string
    downpayment: string
  }) => {
    const propertyPrice = Number(price.replace(/,/g, ''))
    const userLoan =
      Number(price.replace(/,/g, '')) - Number(downpayment.replace(/,/g, ''))

    const s = userLoan * 0.005

    let x = 0
    let y = 0
    let z = 0

    if (propertyPrice > 5000000) {
      x = (propertyPrice - 5000000) * 0.005 + 32500
    } else if (propertyPrice > 3000000) {
      x = (propertyPrice - 3000000) * 0.006 + 21500
    } else if (propertyPrice > 1000000) {
      x = (propertyPrice - 1000000) * 0.007 + 9000
    } else if (propertyPrice > 500000) {
      x = (propertyPrice - 500000) * 0.008 + 5000
    } else if (propertyPrice < 500001) {
      x = propertyPrice * 0.01
    }

    if (propertyPrice > 1000000) {
      y = (propertyPrice - 1000000) * 0.04 + 26000
    } else if (propertyPrice > 500000) {
      y = (propertyPrice - 500000) * 0.04 + 9000
      y = y / 2
    } else if (propertyPrice < 500001) {
      y = 0
    }

    if (userLoan > 5000000) {
      z = (userLoan - 5000000) * 0.005 + 32500
    } else if (userLoan > 3000000) {
      z = (userLoan - 3000000) * 0.006 + 21500
    } else if (userLoan > 1000000) {
      z = (userLoan - 1000000) * 0.007 + 9000
    } else if (userLoan > 500000) {
      z = (userLoan - 500000) * 0.008 + 5000
    } else if (userLoan < 500001) {
      z = userLoan * 0.01
    }

    const t = x + y + z + s
    const bt = Number(downpayment.replace(/,/g, '')) + t

    setFee({
      spaLawyer: x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      dutyStamp: y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      loanLawyer: z.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      loanStamp: s.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      totalFee: t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      totalDownpayment: bt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    })
  }

  return (
    <div>
      <div className="max-w-lg m-5 rounded-xl shadow-xl dark:bg-slate-500 ">
        <div className="flex p-5 bg-slate-700 text-white rounded-t-xl">
          <h2 className="ml-2 text-lg font-bold">Home Loan Calculator</h2>
        </div>
        <form onSubmit={handleSubmitValues}>
          <div className="p-5 grid gap-5 md:grid-cols-2  ">
            <label className="block">
              <span className="block text-sm font-medium">
                Propery Price (RM)
              </span>
              <input
                type="text"
                name="price"
                inputMode="decimal"
                pattern="[0-9,\.]+"
                min="50000"
                max="10000000"
                data-validate-number
                value={userValues.price}
                onFocus={(e) => (e.target.value = '')}
                onBlur={(e) => (e.target.value = userValues.price)}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
invalid:border-pink-500 invalid:text-pink-600
focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium">
                Downpayment (RM)
              </span>
              <input
                type="text"
                name="downpayment"
                inputMode="decimal"
                pattern="[0-9,\.]+"
                value={userValues.downpayment}
                onFocus={(e) => (e.target.value = '')}
                onBlur={(e) => (e.target.value = userValues.downpayment)}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
invalid:border-pink-500 invalid:text-pink-600
focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium">
                Loan Period (Years)
              </span>
              <input
                type="text"
                name="period"
                inputMode="decimal"
                pattern="[0-9,\.]+"
                value={userValues.period}
                onFocus={(e) => (e.target.value = '')}
                onBlur={(e) => (e.target.value = userValues.period)}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
invalid:border-pink-500 invalid:text-pink-600
focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium">
                Interest Rate (%)
              </span>
              <input
                type="text"
                name="rate"
                inputMode="decimal"
                pattern="[0-9,\.]+"
                value={userValues.rate}
                onFocus={(e) => (e.target.value = '')}
                onBlur={(e) => (e.target.value = userValues.rate)}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
invalid:border-pink-500 invalid:text-pink-600
focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
              />
            </label>
          </div>
          <div className="p-5 bg-slate-200 dark:bg-slate-600 flex justify-between rounded-b-xl">
            <div className="flex flex-col gap-2 ">
              <div>
                <h5 className="text-xs">Loan Amount:</h5>
                <h4 className="text-sm font-medium ">
                  RM{results.loanAmount}.00
                </h4>
              </div>
              <div>
                <h5 className="text-xs">Total Interest: </h5>
                <h4 className="text-sm font-medium ">
                  RM{results.totalInterest}
                </h4>
              </div>
              <div>
                <h5 className="text-xs">Total Payment:</h5>
                <h4 className="text-sm font-medium ">
                  RM{results.totalPayment}
                </h4>
              </div>
            </div>
            <div className="flex flex-col">
              <button
                type="submit"
                className="mb-5 py-1 text-lg bg-gradient-to-tr from-slate-700 to-slate-600 text-white rounded-xl border shadow-md dark:border-slate-200"
              >
                Calculate
              </button>
              <h3 className="text-md font-medium">Monthly Payment:</h3>
              <h1 className="text-4xl font-medium">
                RM{results.monthlyPayment}
              </h1>
            </div>
          </div>
        </form>
      </div>
      {showOther === true && (
        <div className="m-5 max-w-lg  rounded-xl overflow-hidden shadow-xl cursor-pointer bg-slate-200 dark:bg-slate-600">
          <div className="flex p-5 bg-slate-700 text-white rounded-t-xl">
            <h2 className="ml-2 text-lg font-bold">Other Fees</h2>
          </div>
          <div className="p-5 grid gap-5">
            <div className="mb-3">
              <h4>Sale & Purchase Agreement:</h4>
              <div className="my-3">
                <h5 className="text-xs">Lawyer Fee:</h5>
                <h4 className="text-sm font-medium ">RM{fee.spaLawyer}</h4>
              </div>
              <div>
                <h5 className="text-xs">Stamp Duty Fee:</h5>
                <h4 className="text-sm font-medium ">RM{fee.dutyStamp}</h4>
              </div>
            </div>
            <div>
              <h4>Loan Agreement:</h4>
              <div className="mb-3 flex">
                <input type="checkbox" name="includeLoan" id="" />
                <label htmlFor="" className="ml-3 text-xs">
                  Inlude Fees in Loan
                </label>
              </div>
              <div className="my-3">
                <h5 className="text-xs">Lawyer Fee:</h5>
                <h4 className="text-sm font-medium ">RM{fee.loanLawyer}</h4>
              </div>
              <div>
                <h5 className="text-xs">Agreement Stamp Duty:</h5>
                <h4 className="text-sm font-medium ">RM{fee.loanStamp}</h4>
              </div>
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-md font-medium">Total Payment:</h3>
            <h1 className="text-4xl font-medium">RM{fee.totalFee}</h1>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoanCalculator
