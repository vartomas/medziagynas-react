import React from 'react'
import './styles/menu.css'

function Menu(props) {
    const mobileMenu = 
    <ul className='mobileMenu'>
      <li style={{backgroundColor: props.menuList === 'barak' ? '#6fb1d4' : null, borderLeft: props.menuList === 'barak' ? '10px solid white' : null}} onClick={() => props.handleClick('barak')}>Barak</li>
      <li style={{backgroundColor: props.menuList === 'solvent' ? '#6fb1d4' : null, borderLeft: props.menuList === 'solvent' ? '10px solid white' : null}} onClick={() => props.handleClick('solvent')}>Solvent</li>
      <li style={{backgroundColor: props.menuList === 'laminatai' ? '#6fb1d4' : null, borderLeft: props.menuList === 'laminatai' ? '10px solid white' : null}} onClick={() => props.handleClick('laminatai')}>Laminatai</li>
      <li style={{backgroundColor: props.menuList === 'tekstile' ? '#6fb1d4' : null, borderLeft: props.menuList === 'tekstile' ? '10px solid white' : null}} onClick={() => props.handleClick('tekstile')}>Tekstilė</li>
      <li style={{backgroundColor: props.menuList === 'plokstes' ? '#6fb1d4' : null, borderLeft: props.menuList === 'plokstes' ? '10px solid white' : null}} onClick={() => props.handleClick('plokstes')}>Plokštės</li>
      <li style={{backgroundColor: props.menuList === 'dazai' ? '#6fb1d4' : null, borderLeft: props.menuList === 'dazai' ? '10px solid white' : null}} onClick={() => props.handleClick('dazai')}>Dažai</li>
      <li onClick={props.handleLogout}>Logout ({props.user})</li>
    </ul>

    return(
    <>
        <ul className='menuList'>
            <li style={{backgroundColor: props.menuList === 'barak' ? '#6fb1d4' : null, borderLeft: props.menuList === 'barak' ? '10px solid white' : null}} onClick={() => props.handleClick('barak')}>Barak</li>
            <li style={{backgroundColor: props.menuList === 'solvent' ? '#6fb1d4' : null, borderLeft: props.menuList === 'solvent' ? '10px solid white' : null}} onClick={() => props.handleClick('solvent')}>Solvent</li>
            <li style={{backgroundColor: props.menuList === 'laminatai' ? '#6fb1d4' : null, borderLeft: props.menuList === 'laminatai' ? '10px solid white' : null}} onClick={() => props.handleClick('laminatai')}>Laminatai</li>
            <li style={{backgroundColor: props.menuList === 'tekstile' ? '#6fb1d4' : null, borderLeft: props.menuList === 'tekstile' ? '10px solid white' : null}} onClick={() => props.handleClick('tekstile')}>Tekstilė</li>
            <li style={{backgroundColor: props.menuList === 'plokstes' ? '#6fb1d4' : null, borderLeft: props.menuList === 'plokstes' ? '10px solid white' : null}} onClick={() => props.handleClick('plokstes')}>Plokštės</li>
            <li style={{backgroundColor: props.menuList === 'dazai' ? '#6fb1d4' : null, borderLeft: props.menuList === 'dazai' ? '10px solid white' : null}} onClick={() => props.handleClick('dazai')}>Dažai</li>
            <li style={{backgroundColor: props.menuList === 'users' ? '#6fb1d4' : null, borderLeft: props.menuList === 'users' ? '10px solid white' : null, display: props.isAdmin ? 'flex' : 'none'}} onClick={() => props.handleClick('users')}>Users</li>
            <li style={{backgroundColor: props.menuList === 'logai' ? '#6fb1d4' : null, borderLeft: props.menuList === 'logai' ? '10px solid white' : null, display: props.isAdmin ? 'flex' : 'none'}} onClick={() => props.handleClick('logai')}>Logai</li>
        </ul>
        {props.mobileMenu ? mobileMenu : null}
    </>
    )
}

export default Menu