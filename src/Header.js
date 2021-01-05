import React from 'react'
import './styles/header.css'

function Header(props) {
    const nustatymai = props.isAdmin ? <div className='adminBtn'><input type='checkbox' value={props.adminEdit} onChange={props.handleChange} name='adminEdit'/>Admin</div> : null
    return(
        <header>
            <div className='logo'>
            <span className='logoM'><i className="fab fa-medium"></i></span>
            <h1>Medžiagynas 0.45</h1>
            </div>
            {props.menuList !== 'logai' && props.menuList !== 'users' ? <span className='searchSpan'><span style={{color: 'white', fontSize: '24px', marginRight: '6px', marginLeft: '3px'}}><i className="fas fa-search"></i></span><input name='search' type='text' className='searchInput' placeholder='ieškoti...' onChange={props.handleChangeSearch} autoComplete="off"/></span> : null}
            {props.adminEdit ?
            <div 
                style={{
                    color: 'white', 
                    padding: '6px', 
                    border: '1px solid white', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    backgroundColor: '#2d74a3'
                    }}
                onClick={props.handleNewMedia}
            >
                    Sukurti naują medžiagą
            </div> : null}
            <div className='userBlock'>
                {nustatymai}
                <h3>{props.user}</h3>
                <button onClick={props.logout}>Logout</button>
            </div>
            <div className='mobileBurger' onClick={props.handleBurgerClick}>
                    <span className='burgerBtn'><i className="fas fa-bars"></i></span>
            </div>
        </header>
    )
}

export default Header