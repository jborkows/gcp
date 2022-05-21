import * as React from 'react'
import Link from 'next/link'
import { UserShortInfo } from './UserShortInfo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { screeSize } from '../components/hooks/useMediaQuery'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './Header.module.css'
import { useAuthentication } from '../authentication/hooks'


type MenuItem = {
  url: string,
  title: string,
  needsAuth: boolean
}

const menuItems: Array<MenuItem> = [
  { url: "", title: "Strona główna", needsAuth: false },
  { url: "periodicTasks", title: "Zadania", needsAuth: true }
]

const MenuItemDisplayer = () => {
  const router = useRouter()
  const authentication = useAuthentication()
  const activeStyle = (menuItem: MenuItem) => router.asPath === "/" + menuItem.url ? styles.active : ''
  const display = menuItems
    .filter(menuItem => !menuItem.needsAuth || authentication.authenticated)
    .map(menuItem =>
      <Link href={`/${menuItem.url}`} key={menuItem.url}>
        <a className={`${activeStyle(menuItem)} ${styles.menuItem}`}>{menuItem.title}</a>
      </Link>
    )
  return <React.Fragment>
    {display}
  </React.Fragment>
}

interface SmallMenuProps {
  disable: () => void,
  hiddingClassName: string | null
}

const SmallMenu = (props: SmallMenuProps) => {
  return <div >
    <div className={styles.smallMenuOverlay} onClick={() => props.disable()}></div>
    <div className={styles.smallMenu + " " + (props.hiddingClassName || '')}>
      <MenuItemDisplayer />
      <p onClick={() => props.disable()}><FontAwesomeIcon icon={faArrowLeft}/></p>
    </div>
  </div>
}

const Hamburger = () => {

  const [menuVisible, changeVisibility] = useState(false)
  const [hiddingCss, setHidding] = useState("")

  const showMenu = () => {
    setHidding("")
    changeVisibility(true)
  }

  const disable = () => {
    setHidding(styles.hidding);
  }

  useEffect(() => {
    if (!hiddingCss) {
      return
    }
    setTimeout(() => {
      changeVisibility(false)
    }, 1000)
  }, [hiddingCss])

  return (
    <header className={styles.smallScreenHeader}>
      <p onClick={() => showMenu()}><FontAwesomeIcon icon={faBars} /></p>
      {menuVisible && <SmallMenu disable={() => disable()} hiddingClassName={hiddingCss} />}
      <UserShortInfo />
    </header>
  )
}

const AnyScreen = () => (
  <header className={styles.anyScreenHeader}>
    <div className={styles.anyScreenHeaderMenuItems}>
      <MenuItemDisplayer />
    </div>
    <UserShortInfo />
  </header>
)

const Header = () => {
  const currentSize = screeSize()

  const isSmall = currentSize == "SMALL"

  return (
    <React.Fragment>
      {isSmall && <Hamburger />}
      {!isSmall && <AnyScreen />}
    </React.Fragment>
  )
}

export default Header
