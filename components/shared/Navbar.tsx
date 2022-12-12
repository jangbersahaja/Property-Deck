import Link from 'next/link'
import { FcHome } from 'react-icons/fc'

const Navbar = () => {
  return (
    <nav>
      <Link href="/" className="flex items-center gap-3 p-5 " as="nav">
        <FcHome className="text-2xl" />
        <h1 className="text-xl font-bold uppercase">Property Deck</h1>
      </Link>
    </nav>
  )
}

export default Navbar
