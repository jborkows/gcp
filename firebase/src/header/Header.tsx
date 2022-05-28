import * as React from 'react'
import Link from 'next/link'
import { UserShortInfo } from './UserShortInfo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { screeSize } from '../components/hooks/useMediaQuery'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './Header.module.css'
import { useRoles } from '../authentication/hooks'
import { MenuItem, menuItems } from '../components/routing'


const MenuItemDisplayer = () => {
  const router = useRouter()
  const roles = useRoles()
  const [items,_] = useState(menuItems)
  const activeStyle = (menuItem: MenuItem) => router.asPath === "/" + menuItem.url ? styles.active : ''
  const display = items
    .filter(menuItem => menuItem.menuItemVisibility === "DISPLAYABLE")
    .filter(menuItem => menuItem.isAllowed(roles))
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
      <p onClick={() => props.disable()}><FontAwesomeIcon icon={faArrowLeft} /></p>
    </div>
  </div>
}

type HiddingState = "SHOWED" | "HIDDING" | "HIDDEN"

interface HiddingMenuResponse {
  showMenu: () => void,
  hideMenu: () => void,
  state: HiddingState
}

const useHidddingMenu = (): HiddingMenuResponse => {

  const [state, setState] = useState<HiddingState>("HIDDEN")
  const showMenu = () => setState("SHOWED")

  const disable = () => setState("HIDDING")

  useEffect(() => {
    if (state === "SHOWED" || state === "HIDDEN") {
      return
    }
    setTimeout(() => {
      setState("HIDDEN")
    }, 800)
  }, [state])

  return {
    showMenu: showMenu,
    hideMenu: disable,
    state: state
  }
}

const Hamburger = () => {
  const { state, showMenu, hideMenu } = useHidddingMenu()
  const hiddingCss = state === 'HIDDING' ? styles.hidding : "";

  return (
    <header className={styles.smallScreenHeader}>
      <p onClick={() => showMenu()}><FontAwesomeIcon icon={faBars} /></p>
      {state !== 'HIDDEN' && <SmallMenu disable={() => hideMenu()} hiddingClassName={hiddingCss} />}
      <UserShortInfo />
    </header>
  )
}

interface BigMenuProps {
  disable: () => void,
  hiddingClassName: string | null
}

const BigMenu = (props: SmallMenuProps) => {
  return <div >
    <div className={styles.bigMenuOverlay} onClick={() => props.disable()}></div>
    <div className={styles.bigMenu + " " + (props.hiddingClassName || '')}>
      <MenuItemDisplayer />
    </div>
  </div>
}

const AnyScreen = () => {
  const { state, showMenu, hideMenu } = useHidddingMenu()
  const hiddingCss = state === 'HIDDING' ? styles.hidding : "";
  return <header>
    {state !== 'HIDDEN' && <BigMenu disable={() => hideMenu()} hiddingClassName={hiddingCss} />}
    <div className={styles.anyScreenHeader}>
      <div className={styles.anyScreenHeaderMenuItems}>
        <p onClick={() => showMenu()} className={styles.anyScreenHeaderMenuItemsHamburger}><FontAwesomeIcon size='2x' icon={faBars} className={styles.anyScreenHeaderMenuItemsHamburgerIcon} /></p>
        <MenuItemDisplayer />

      </div>
      <UserShortInfo />
    </div>
  </header>
}
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
