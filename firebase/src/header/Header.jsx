import * as React from 'react'
import Link from 'next/link'
import { UserShortInfo } from './UserShortInfo'

const Header = ({ pathname }) => (
  <header>
    <Link href="/">
      <a className={pathname === '/' ? 'is-active' : ''}>Home</a>
    </Link>
    <Link href="/about">
      <a className={pathname === '/about' ? 'is-active' : ''}>About sth</a>
    </Link>
    <UserShortInfo/>
  </header>
)

export default Header
