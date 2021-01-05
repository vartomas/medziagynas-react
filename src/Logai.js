import React, {useState, useEffect} from 'react'
import { logsRef, mediaRef } from './Firebase'
import './styles/logs.css'

function Logai() {
    const [logs, setLogs] = useState([])
    const [mediaList, setMediaList] = useState([])
    const [stats, setStats] = useState([])
    const [sortBy, setSortBy] = useState()
    const [category, setCategory] = useState()
    const [reqStats, setReqStats] = useState([])
    
    useEffect(() => {
        const now = Date.now()
        const cutoff = now - 90 * 24 * 60 * 60 * 1000
        let logList = []
        logsRef.once('value')
        .then(snapshot => {
            const data = snapshot.val()
            let index = 0
            let logCount = 0
            for (let log in data) {
            const obj = {
                beforeCount: data[log].beforeCount,
                afterCount: data[log].afterCount,
                mediaName: data[log].mediaName,
                mediaSize: data[log].mediaSize,
                category: data[log].category,
                user: data[log].user,
                date: new Date(data[log].date),
                key: Object.keys(snapshot.val())[index],
                olderThanMonth: data[log].date < (now - (30 * 24 * 60 * 60 * 1000)) ? true : false
            }
            logList.unshift(obj)
            index++
            logCount++
            if (obj.date < cutoff) {logsRef.child(obj.key).remove()}
            if (Object.keys(data).length === logCount) setLogs([...logList])
            }
        })
        mediaRef.once('value')
        .then(snapshot => {
            const data = snapshot.val()
            let index = 0
            for (let media in data) {
                const obj = {
                    name: data[media].name,
                    size: data[media].size,
                    category: data[media].category,
                    addedCount: 0,
                    removedCount: 0,
                    key: Object.keys(snapshot.val())[index]
                }
                setMediaList(list => [...list, obj])
                index++
            }
        })
    },[])

    const generateStats = (days) => {
        let mediaListArr = mediaList.map(media => ({...media}))
        let logListArr = [...logs]
        console.log(logListArr)
        if (days === 90) {
            for (let i = 0; i < mediaListArr.length; i++) {
                for (let j = 0; j < logListArr.length; j++) {
                    if (logListArr[j].mediaName === mediaListArr[i].name && logListArr[j].mediaSize === mediaListArr[i].size) {
                        const action = logListArr[j].beforeCount > logListArr[j].afterCount ? false : true
                        const count = action ? Math.abs(logListArr[j].afterCount - logListArr[j].beforeCount) : Math.abs(logListArr[j].beforeCount - logListArr[j].afterCount)
                        action ? mediaListArr[i].addedCount = mediaListArr[i].addedCount + count : mediaListArr[i].removedCount = mediaListArr[i].removedCount + count
                    }
                    if (i === mediaListArr.length - 1 && j === logListArr.length - 1) {
                        setStats([...mediaListArr])
                        setReqStats([...mediaListArr])
                        setSortBy('removed')
                        setCategory('bendrai')
                    }
                }
            }
        } else {
            for (let i = 0; i < mediaListArr.length; i++) {
                for (let j = 0; j < logListArr.length; j++) {
                    if (logListArr[j].mediaName === mediaListArr[i].name && logListArr[j].mediaSize === mediaListArr[i].size) {
                        if (logListArr[j].olderThanMonth === false) {
                            const action = logListArr[j].beforeCount > logListArr[j].afterCount ? false : true
                            const count = action ? Math.abs(logListArr[j].afterCount - logListArr[j].beforeCount) : Math.abs(logListArr[j].beforeCount - logListArr[j].afterCount)
                            action ? mediaListArr[i].addedCount = mediaListArr[i].addedCount + count : mediaListArr[i].removedCount = mediaListArr[i].removedCount + count
                        }
                    }
                    if (i === mediaListArr.length - 1 && j === logListArr.length - 1) {
                        setStats([...mediaListArr])
                        setReqStats([...mediaListArr])
                        setSortBy('removed')
                        setCategory('bendrai')
                    }
                }
            }
        }
    }

    const naming = category => {
        let name = ''
        switch(category) {
            case 'barak': name = 'Barak'
                break
            case 'solvent': name = 'Solvent'
                break
            case 'laminatai': name = 'Laminatai'
                break
            case 'tekstile': name = 'Tekstilė'
                break
            case 'plokstes': name = 'Plokštės'
                break
            case 'dazai': name = 'Dažai'
                break
            default: name = 'Medžiaga'
                break
        }
        return name
    }

    const logList = logs.map(e => {
        return (
            <li key={e.key} className='logListItem'>
                <span className='liDate'>{e.date.getFullYear()}/{e.date.getMonth() + 1}/{e.date.getDate()} {e.date.getHours().toString().length === 1 ? '0' + e.date.getHours().toString() : e.date.getHours().toString()}:{e.date.getMinutes().toString().length === 1 ? '0' + e.date.getMinutes().toString() : e.date.getMinutes().toString()}</span>
                <span className='liUser'>{e.user}</span>
                <span className='liChange' style={e.beforeCount > e.afterCount ? {color: 'red'} : {color: 'green'}}>{e.beforeCount > e.afterCount ? '-' + Math.abs(e.afterCount - e.beforeCount) : '+' + Math.abs(e.beforeCount - e.afterCount)}</span>
                <span className='liMedia'>{e.mediaName}, {e.mediaSize} ({naming(e.category)})</span>
                <span className='liMorph'>{e.beforeCount} {'->'} {e.afterCount}</span>
            </li>
        )
    })

    const statsList = reqStats.map(e => {
        return (
            <li key={e.key} className='statsListItem'>
                <span className='removedListItem'>-{e.removedCount}</span>
                <span className='addedListItem'>+{e.addedCount}</span>
                <span className='nameListItem'>{e.name}</span>
                <span className='sizeListItem'>{e.size}</span>
                {category === 'bendrai' ? <span className='categoryListItem'>{naming(e.category)}</span> : null}
            </li>
        )
    })

    const handleChangeSort = (e) => {
        const value = e.target.value
        setSortBy(value)
    }

    const handleChangeCategory = (e) => {
        const value = e.target.value
        setCategory(value)
    }

    useEffect(() => {
        let stateCopy = [...stats]
        if (category !== 'bendrai') stateCopy = stateCopy.filter(e => e.category === category)
        sortBy === 'removed' ?
            setReqStats(stateCopy.sort((a, b) => (a.removedCount > b.removedCount) ? -1 : 1))
            :
            setReqStats(stateCopy.sort((a, b) => (a.addedCount > b.addedCount) ? -1 : 1))
    },[sortBy, category, stats])

    return (
        <>
            <div className='logsMenu'>
                <span className='logsTop'>
                    <span style={{marginLeft: '12px'}}>90 dienų laikotarpis</span>
                </span>
                <span className='statsTop'>
                    <span>Generuoti statistiką</span>
                    <button onClick={() => generateStats(90)}>90d.</button>
                    <button onClick={() => generateStats(30)}>30d.</button>
                    <span>Rūšiuoti</span>
                    <select name='sort' value={sortBy} onChange={handleChangeSort}>
                        <option value='removed'>pagal suvartotas</option>
                        <option value='added'>pagal užsakytas</option>
                    </select>
                    <select name='category' value={category} onChange={handleChangeCategory}>
                        <option value='bendrai'>bendrai</option>
                        <option value='barak'>barak</option>
                        <option value='solvent'>solvent</option>
                        <option value='laminatai'>laminatai</option>
                        <option value='tekstile'>tekstilė</option>
                        <option value='plokstes'>plokštės</option>
                        <option value='dazai'>dažai</option>
                    </select>
                </span>
            </div>
            <div className='logsPage'>
                <ul className='logList'>
                    {logList}
                </ul>
                <ul className='statsList'>
                    {statsList}
                </ul>
            </div>
        </>
    )
}

export default Logai

