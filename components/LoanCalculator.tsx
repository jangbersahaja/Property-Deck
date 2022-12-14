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

  const [financeValue, setFinanceValue] = useState(
    ((Number(userValues.price.replace(/,/g, '')) -
      Number(userValues.downpayment.replace(/,/g, ''))) /
      Number(userValues.price.replace(/,/g, ''))) *
      100
  )

  const handleFinanceValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const finance = Number(event.target.value)

    setFinanceValue(finance)

    const dp = (
      Number(userValues.price.replace(/,/g, '')) -
      (Number(userValues.price.replace(/,/g, '')) * finance) / 100
    )
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    setUserValues({ ...userValues, downpayment: dp })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = event.target.value
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    setUserValues({ ...userValues, [event.target.name]: event.target.value })

    if (event.target.name === 'downpayment') {
      const x = Number(event.target.value.replace(/,/g, ''))

      const y =
        ((Number(userValues.price.replace(/,/g, '')) - x) /
          Number(userValues.price.replace(/,/g, ''))) *
        100

      setFinanceValue(y)
    }

    if (event.target.name === 'price') {
      const x = Number(event.target.value.replace(/,/g, ''))

      const y =
        ((x - Number(userValues.downpayment.replace(/,/g, ''))) /
          Number(userValues.price.replace(/,/g, ''))) *
        100

      setFinanceValue(y)
    }
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
      spaLawyer: x
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      dutyStamp: y
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      loanLawyer: z
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      loanStamp: s
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      totalFee: t
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      totalDownpayment: bt
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
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
                Property Price (RM)
              </span>
              <input
                type="text"
                name="price"
                inputMode="decimal"
                min={5}
                maxLength={11}
                pattern="[0-9,\.]+"
                required={true}
                value={userValues.price}
                onChange={handleInputChange}
                className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </label>
            <div className="grid grid-cols-2 gap-10">
              <label
                htmlFor="minmax-range"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                <span className="block text-sm font-medium">
                  Margin of Finance: {`${financeValue.toFixed(0)}` + '%'}
                </span>
                <input
                  id="minmax-range"
                  type="range"
                  min="0"
                  max="100"
                  step={1}
                  onChange={handleFinanceValue}
                  value={financeValue}
                  className="w-full mt-5 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium">
                  Downpayment (RM)
                </span>
                <input
                  type="text"
                  name="downpayment"
                  min={4}
                  maxLength={11}
                  pattern="[0-9,\.]+"
                  value={userValues.downpayment}
                  onChange={handleInputChange}
                  className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </label>
            </div>

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
                required={true}
                onChange={handleInputChange}
                className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                required={true}
                onChange={handleInputChange}
                className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </label>
          </div>
          <div className="p-5 bg-slate-200 dark:bg-slate-600 flex justify-between rounded-b-xl">
            <div className="flex flex-col gap-2 ">
              <div>
                <h5 className="text-xs">Loan Amount:</h5>
                <h4 className="text-sm font-medium ">
                  RM{results.loanAmount && results.loanAmount + '.00'}
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
        <div className="m-5 max-w-lg  rounded-xl overflow-hidden shadow-xl bg-slate-200 dark:bg-slate-600">
          <div className="flex p-5 bg-slate-700 text-white rounded-t-xl">
            <h2 className="ml-2 text-lg font-bold">Legal Fees & Stamp Duty</h2>
          </div>
          <div className="p-5 grid gap-7">
            <div>
              <h4>Sale & Purchase Agreement Costs:</h4>
              <div className="my-3">
                <h5 className="text-xs">SPA Legal Fee:</h5>
                <h4 className="text-md font-medium ">RM{fee.spaLawyer}</h4>
              </div>
              <div>
                <h5 className="text-xs">SPA Stamp Duty:</h5>
                <h4 className="text-md font-medium">
                  RM{fee.dutyStamp}
                  {Number(userValues.price.replace(/,/g, '')) < 1000001 && (
                    <span className="text-xs"> *Skim I-Miliki</span>
                  )}
                </h4>
              </div>
            </div>
            <div>
              <h4>Loan Documentation Costs:</h4>
              <div className="flex">
                <input
                  type="checkbox"
                  name="includeLoan"
                  id=""
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                />
                <label htmlFor="" className="ml-3 text-xs">
                  Inlude Fees in Loan
                </label>
              </div>
              <div className="my-3">
                <h5 className="text-xs">Loan Documentation Legal Fee:</h5>
                <h4 className="text-md font-medium ">RM{fee.loanLawyer}</h4>
              </div>
              <div>
                <h5 className="text-xs">Loan Documentation Stamp Duty:</h5>
                <h4 className="text-md font-medium ">RM{fee.loanStamp}</h4>
              </div>
            </div>
            <div>
              <h4>Other Costs:</h4>
              <div className="my-3">
                <h5 className="text-xs">Downpayment:</h5>
                <h4 className="text-md font-medium ">
                  RM{userValues.downpayment}.00
                </h4>
              </div>
            </div>
            <div>
              <h3 className="text-md font-medium">Total Payment:</h3>
              <h1 className="text-4xl font-medium">RM{fee.totalDownpayment}</h1>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoanCalculator
