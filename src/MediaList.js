import React from 'react'
import './styles/mediaList.css'
import './styles/admin.css'
import Logai from './Logai.js'

function MediaList(props) {
    const addUser = 
    <form className='addUserForm' autoComplete="off" onSubmit={props.handleAddUserSubmit}>
        <label htmlFor="addUserName">Prisijungimo vardas: </label>
            <div><input type='text' name='addUserName' onChange={props.handleChange}></input></div>
        <label htmlFor="addUserPassword">Passwordas: </label>
            <div><input type='password' name='addUserPassword' onChange={props.handleChange}></input></div>
        <label htmlFor="admin">Administratorius?: </label>
        <input type='checkbox' name='adminCheckBox' onChange={props.handleChange}></input>
        <br/>
        <button className='addMediaButton'>Pridėti</button>
    </form>

    const addUserBtn =             
    <div>
        <div className='addUser' onClick={props.handleAddUser}>
            Prideti juzerį
        </div>
        {props.addUser ? addUser : null}
    </div>

    const userList = props.userList.map(e => {
        return(
            <div key={e.key} className='userListItem'>
                <p>{e.username}</p>
                <p style={{color: e.isAdmin ? 'green' : 'black'}}>{e.isAdmin ? 'Administratorius' : 'Paprastas'}</p>
                <button onClick={() => props.handleDeleteUser(e.key, e.username)}>Delete</button>
            </div>
        )
    })

    const userDisplay = <div >{userList}{addUserBtn}</div>

    const mediaList = props.mediaList.map(e => 
        <li 
            style={{backgroundColor: e.count <= 0 ? '#fff8f4' : '#f1fff2'}}
            key={e.key}
        >
        <span className='mediaName'>{e.name}</span> 
        <span className='mediaSize'>{e.size}</span> 
        <span className='mediaCount'>{e.count} vnt.</span>
        <span 
        className='countChange'
        style={{visibility: e.changeCount !== 0 ? 'visible' : 'hidden', color: e.changeCount > 0 ? '#06d6a0' : '#d00000'}}
        >
        {e.changeCount > 0 ? '+' + e.changeCount : e.changeCount}
        </span>
            <span className='editBtns'>
                <span className='plusSign' onClick={() => props.handleCount(e.key, true)}> <i className="fas fa-plus-square"></i></span>
                <span className='minusSign' onClick={() => props.handleCount(e.key, false)}> <i className="fas fa-minus-square"></i></span>
                <span className='okSign' style={{color: e.changeCount !== 0 ? '#a0e426' : '#e5e5e5'}} onClick={() => props.handleUpdate(e.key)}> <i className="fas fa-check"></i></span>
            </span>
            {props.adminEdit ? 
            <span>
                <span style={{color: 'orange', marginRight: '3px', cursor: 'pointer'}}><i className="fas fa-edit" onClick={() => props.handleEditMedia(e.key, e.name, e.size)}/></span>
                <span style={{color: 'red', cursor: 'pointer'}} onClick={() => props.handleDelete(e.key)}><i className="fas fa-trash-alt"/></span>
            </span> : null}
            {props.editKey === e.key ?
                            <div>
                                <input type='text' name='editName' value={props.editName} onChange={props.handleChange}/>
                                <input type='text' name='editSize' value={props.editSize} onChange={props.handleChange}/>
                                <span className='saveEdit' onClick={() => props.handleUpdateMedia(e.key)}><i className="fas fa-check"></i></span>
                            </div> : null}
        </li>
        )
        const mediaTopMarks =             
            <div className='topMarks'>
                <span className='nameMark'>{props.menuList === 'dazai' ? 'Agregatas' : 'Pavadinimas'}</span>
                <span className='sizeMark'>{props.menuList === 'dazai' ? 'Spalva' : 'Plotis'}</span>
                <span className='countMark'>Kiekis</span>
                <span className='countChangeMark'></span>
                <span className='editMark'>Koreguoti</span>
            </div>
        const usersTopMarks = 
            <div>
                <div className='topMarks'>
                    <span className='nameMark'>Juzeriai</span>
                </div>
            </div>
        const logaiTopMarks = 
        <div>
            <div className='topMarks'>
                <span className='nameMark'>Logai</span>
            </div>
        </div>
        return (
            <div className='media'>
                {props.menuList === 'users' ? usersTopMarks : props.menuList === 'logai' ? logaiTopMarks : mediaTopMarks}
                <ul className='mediaList'>
                    {props.menuList === 'users' ? userDisplay : props.menuList === 'logai' ? <Logai /> : mediaList}
                </ul>
            </div>
        )
}

export default MediaList



