const updateLocal = (user) => {
    const toJSON = JSON.stringify(user)
    localStorage.setItem('user', toJSON)
}

const getFromLocal = () => {
    const userJSON = localStorage.getItem('user')
    const user = JSON.parse(userJSON)
    return user || null
}

export { updateLocal, getFromLocal }