import React from 'react'
import { usersRef, mediaRef, logsRef } from './Firebase'
import { updateLocal, getFromLocal } from './localStorage'
import './styles/loginPage.css'
import './styles/main.css'
import './styles/loadingSpinner.css'
import Header from './Header'
import Menu from './Menu'
import MediaList from './MediaList'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      user: null,
      isAdmin: false,
      failedLoginAttempt: false,
      usernameInput: '',
      passwordInput: '',
      mediaList: [],
      userList: [],
      isLoading: false,
      menuList: 'barak',
      addUser: false,            
      addUserName: '',
      addUserPassword: '',
      adminCheckBox: false,
      adminEdit: false,
      editKey: '',
      editName: '',
      editSize: '',
      handleNewMedia: false,
      addMediaCategory: 'barak',
      addMediaName: '',
      addMediaSize: '',
      handleBurgerClick: false,
      search: '',
      selectedList: []
    }
  }

  componentDidMount() {
    const user = getFromLocal()
    if (!this.state.user) {
      if (user) this.setState({user: user[0], isAdmin: user[1]})
    }
    const self = this
    usersRef.on('value', function(snapshot) {
      const users = snapshot.val()
      let loadedData = []
      let index = 0
      for (let user in users) {
        const obj = {
          username: users[user].user,
          password: users[user].password,
          isAdmin: users[user].isAdmin,
          key: Object.keys(snapshot.val())[index]
        }
        loadedData.push(obj)
        index++
      }
      self.setState({
        userList: loadedData
      })
      const foundUser = loadedData.find(e => e.username === self.state.user)
      if (foundUser === undefined) {self.setState({user: null})}
    })
    mediaRef.on('value', function(snapshot) {
          self.setState({isLoading: true})
          const medias = snapshot.val()
          let loadedData = []
          let index = 0
          for (let media in medias) {
            const obj = {
              name: medias[media].name,
              size: medias[media].size,
              count: medias[media].count,
              category: medias[media].category,
              key: Object.keys(snapshot.val())[index],
              changeCount: 0
            }
            loadedData.push(obj)
            index++
          }
          const neededMedias = loadedData.filter(e => e.category === self.state.menuList)
          const sortedData = [...neededMedias].sort((a, b) => (a.name > b.name) ? 1 : (a.name === b.name) ? ((a.size > b.size) ? 1 : -1) : -1 )
          self.setState({
          mediaList: loadedData,
          selectedList: sortedData,
          isLoading: false
          }, () => {if (self.state.menuList === 'search') {self.handleSearch(self.state.search)}})
    })
  }

  handleChange = (e) => {
    const name = e.target.name
    this.setState({[name]: e.target.value})
  }

  handleSearch = (e) => {
    let searchFor
    if (typeof e === 'object') {searchFor = e.target.value} else {searchFor = this.state.search}
    if (searchFor === '') {
      this.handleMenu('barak')
    } else {this.setState({menuList: 'search'})}
      if (searchFor !== '') {
        this.setState({search: searchFor})
        const medias = this.state.mediaList
        let loadedData = []
        for (let i = 0; i < medias.length; i++) {
          if (medias[i].name.toLowerCase().includes(searchFor.toLowerCase()) || medias[i].size.toLowerCase().includes(searchFor.toLowerCase()) || medias[i].category.toLowerCase().includes(searchFor.toLowerCase())) {
          const obj = {
            name: medias[i].name,
            size: medias[i].size,
            count: medias[i].count,
            category: medias[i].category,
            key: medias[i].key,
            changeCount: medias[i].changeCount
          }
          loadedData.push(obj)
        }}
        const sortedData = [...loadedData].sort((a, b) => (a.name > b.name) ? 1 : (a.name === b.name) ? ((a.size > b.size) ? 1 : -1) : -1 )
        this.setState({
        selectedList: sortedData,
      })
    }
  }

  handleChangeAdminCheck = (e) => {
    const name = e.target.name
    this.setState({[name]: !this.state.adminEdit})
  }

  handleLogInPageSubmit = (e) => {
    e.preventDefault()
    const foundUser = this.state.userList.find(e => e.username === this.state.usernameInput)
    if (foundUser) {
      if (foundUser.password === this.state.passwordInput) {
          this.setState({user: this.state.usernameInput, failedLoginAttempt: false, isAdmin: foundUser.isAdmin})
          updateLocal([this.state.usernameInput, foundUser.isAdmin])
      } else this.setState({failedLoginAttempt: true})
    } else {this.setState({failedLoginAttempt: true})}
    this.setState({usernameInput: '', passwordInput: ''})
  }

  handleLogOut = () => {
    this.setState({user: null, menuList: 'barak', adminEdit: false, handleBurgerClick: false})
    updateLocal(null)
  }

  handleCount = (key, operator) => {
    let stateCopy = [...this.state.selectedList]
    const index = stateCopy.findIndex(e => e.key === key)
    stateCopy[index].changeCount = operator ? stateCopy[index].changeCount + 1 : stateCopy[index].changeCount - 1
    this.setState({selectedList: stateCopy})
  }

  handleUpdate = (key) => {
    let stateCopy = [...this.state.selectedList]
    const index = stateCopy.findIndex(e => e.key === key)
    const beforeCount = stateCopy[index].count
    if (stateCopy[index].changeCount === 0) return
    stateCopy[index].count = stateCopy[index].count + stateCopy[index].changeCount
    if (stateCopy[index].count < 0) {
      stateCopy[index].count = 0
      stateCopy[index].changeCount = 0
    }
    mediaRef.child(key).child('count').set(stateCopy[index].count)
    const afterCount = stateCopy[index].count
    if (beforeCount === afterCount) return
    const mediaName = stateCopy[index].name
    const mediaSize = stateCopy[index].size
    const category = stateCopy[index].category
    const user = this.state.user
    const date = Date.now()
    logsRef.push({
      beforeCount: beforeCount,
      afterCount: afterCount,
      mediaName: mediaName,
      mediaSize: mediaSize,
      category: category,
      user: user,
      date: date
    })
    if (this.state.menuList === 'search') {this.handleSearch(this.state.search)}
  }

  handleMenu = (category) => {
    const self = this
    this.setState({menuList: category})
        const medias = self.state.mediaList
        let loadedData = []
        for (let i = 0; i < medias.length; i++) {
          const obj = {
            name: medias[i].name,
            size: medias[i].size,
            count: medias[i].count,
            category: medias[i].category,
            key: medias[i].key,
            changeCount: medias[i].changeCount
          }
          loadedData.push(obj)
        }
        const neededMedias = loadedData.filter(e => e.category === category)
        const sortedData = [...neededMedias].sort((a, b) => (a.name > b.name) ? 1 : (a.name === b.name) ? ((a.size > b.size) ? 1 : -1) : -1 )
        self.setState({
        selectedList: sortedData,
        handleBurgerClick: false
      })
  }

  openAdmin = () => {
    const admin = !this.state.openAdmin
    this.setState({openAdmin: admin})
  }

  handleDeleteUser = (key, username) => {
    if (username === 'test') { return } else { usersRef.child(key).remove() }
  }

  handleAddUser = () => {
    const state = !this.state.addUser
    this.setState({addUser: state})
  }

  handleAddUserSubmit = (e) => {
    e.preventDefault()
    usersRef.push({
        user: this.state.addUserName,
        password: this.state.addUserPassword,
        isAdmin: this.state.adminCheckBox,
    })
    this.setState({addUser: false, adminCheckBox: false})
  }

  handleEditMedia = (key, name, size) => {
    this.setState({
      editKey: key,
      editName: name,
      editSize: size
    })
  }

  handleUpdateMedia = (key) => {
    mediaRef.child(key).child('name').set(this.state.editName)
    mediaRef.child(key).child('size').set(this.state.editSize)
    this.setState({editKey: '', editName: '', editSize: ''})
  } 

  handleDelete = (key) => {
    mediaRef.child(key).remove()
  }

  handleNewMedia = () => {
    this.setState({handleNewMedia: !this.state.handleNewMedia})
  }

  handleAddCategoryChange = (e) => {
    this.setState({addMediaCategory: e.target.value})
  }

  handleAddSubmit = (e) => {
    e.preventDefault()
    mediaRef.push({
        name: this.state.addMediaName,
        size: this.state.addMediaSize,
        count: 0,
        category: this.state.addMediaCategory,
        changeCount: 0
    })
    this.setState({handleNewMedia: false})
  }

  handleBurgerClick = () => {
    this.setState({handleBurgerClick: !this.state.handleBurgerClick})
  }

  render() {
    const addNewMediaPopup = 
      <div className='addNewMediaPopup'>
            <form className='addMediaForm' autoComplete="off" onSubmit={this.handleAddSubmit}>
                <label htmlFor="name">Medžiagos/dažų pavadinimas: </label>
                    <div><input type='text' name='addMediaName' onChange={this.handleChange}></input></div>
                <label htmlFor="name">Plotis/dažų spalva: </label>
                    <div><input type='text' name='addMediaSize' onChange={this.handleChange}></input></div>
                <label htmlFor="category">Pasirinkite kategoriją: </label>
                    <div><select name="category" className="chooseAddCategory" onChange={this.handleAddCategoryChange}>
                        <option value="barak">Barak</option>
                        <option value="solvent">Solvent</option>
                        <option value="laminatai">Laminatai</option>
                        <option value="tekstile">Tekstilė</option>
                        <option value="plokstes">Plokštes</option>
                        <option value="dazai">Dažai</option>
                    </select></div>
                <button className='addMediaButton'>Pridėti</button>
            </form>
      </div>
    let wrongPassword
    const loadingSpinner = <div className="loadingDiv"><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>
    let mediaListLoader = this.state.isLoading ? loadingSpinner : 
      <MediaList 
        addUser={this.state.addUser} 
        handleChange={this.handleChange} 
        handleAddUserSubmit={this.handleAddUserSubmit} 
        handleAddUser={this.handleAddUser} 
        handleDeleteUser={this.handleDeleteUser} 
        userList={this.state.userList} 
        menuList={this.state.menuList} 
        mediaList={this.state.selectedList} 
        handleCount={this.handleCount} 
        changeCount={this.state.changeCount} 
        handleUpdate={this.handleUpdate}
        adminEdit={this.state.adminEdit}
        handleEditMedia={this.handleEditMedia}
        handleDelete={this.handleDelete}
        editKey={this.state.editKey}
        editName={this.state.editName}
        editSize={this.state.editSize}
        handleUpdateMedia={this.handleUpdateMedia}
      />

    if (this.state.failedLoginAttempt) {wrongPassword = <p style={{color: 'white'}}>Netinka passwordas!</p>} else {wrongPassword = null}
    if (!this.state.user) {
      return (
        <div className='loginPage'>
          <span style={{color: 'white', fontSize: '100px'}}><i className="fab fa-medium"></i></span>
          <form onSubmit={this.handleLogInPageSubmit} autoComplete="off">
              <input type='text' placeholder='username' value={this.state.usernameInput} onChange={this.handleChange} name='usernameInput'/>
              <input type='password' placeholder='password'  value={this.state.passwordInput} onChange={this.handleChange} name='passwordInput'/>
              {wrongPassword}
              <button>Log in</button>
          </form>
        </div>
      )
    }
    return (
      <main>
        <Header 
          user={this.state.user} 
          logout={this.handleLogOut} 
          isAdmin={this.state.isAdmin} 
          adminEdit={this.state.adminEdit} 
          handleChange={this.handleChangeAdminCheck}
          handleNewMedia={this.handleNewMedia}
          handleBurgerClick={this.handleBurgerClick}
          handleChangeSearch={this.handleSearch}
          menuList={this.state.menuList}
        />
        <Menu 
          handleClick={this.handleMenu} 
          isAdmin={this.state.isAdmin} 
          menuList={this.state.menuList}
          mobileMenu={this.state.handleBurgerClick}
          user={this.state.user}
          handleLogout={this.handleLogOut}
        />
        {mediaListLoader}
        {this.state.handleNewMedia ? addNewMediaPopup : null}
      </main>
    )
  }
}

export default App;