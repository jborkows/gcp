import * as React from 'react'
import Link from 'next/link'
import { UserShortInfo } from './UserShortInfo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { screeSize } from '../components/hooks/useMediaQuery'

const Hamburger = () => {
  return (
    <FontAwesomeIcon icon={faBars} />
  )
}

const AnyScreen = ({ pathname }) => (
  <React.Fragment>
    <Link href="/">
      <a className={pathname === '/' ? 'is-active' : ''}>Home</a>
    </Link>
    <Link href="/about">
      <a className={pathname === '/about' ? 'is-active' : ''}>About sth</a>
    </Link>
    <UserShortInfo />
  </React.Fragment>
)

const Header = ({ pathname }) => {
  const currentSize = screeSize()
  const isSmall = currentSize == "SMALL"
  return (<header>
    {isSmall && <Hamburger />}
    {!isSmall && <AnyScreen {...pathname} />}
  </header>
  )
}

export default Header
