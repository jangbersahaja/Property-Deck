import Link from 'next/link'
import type { ReactElement } from 'react'
import Layout from '../components/shared/Layout'
import type { NextPageWithLayout } from './_app'

const Page: NextPageWithLayout = () => {
  return (
    <>
      <div className="min-w-screen flex justify-center">
        <Link href="/calculator">
          <button className="px-5 text-lg font-bold text-white bg-slate-600 rounded-xl">
            Home Loan Calculator
          </button>
        </Link>
      </div>
    </>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
