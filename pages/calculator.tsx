import type { ReactElement } from 'react'
import Layout from '../components/shared/Layout'
import type { NextPageWithLayout } from './_app'
import LoanCalculator from '../components/LoanCalculator'

const Calculator: NextPageWithLayout = () => {
  return <LoanCalculator />
}

Calculator.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Calculator
