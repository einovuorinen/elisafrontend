import React, { useState, useEffect } from 'react'
import { Navbar, NavbarToggler, NavbarText } from 'reactstrap'
import axios from 'axios'

const SearchForm = (props) => {
  return(
    <div  className='belowNav'>
    Search for a program
    <form onSubmit={props.search} className='searchForm'>
      channel: 
        <select onChange={props.getResultsbyChannel}>
          {props.channelData.map(channel => <option value={channel.id}>{channel.name}</option>)}
        </select>
      date: <input type='date'
        	value={props.date}
        	onChange={props.getResultsByDate}
    	/>
      <button type="submit">Search</button>
    </form>
    </div>
  )
}

const Display = (props) => {
  const f = props.filter.toLowerCase()
  return (
	  <table className='table'>
        {props.displayData.filter(item => (item.name && item.name.toLowerCase().includes(f)) || (item.description && item.description.toLowerCase().includes(f)))
          .map(item => {
            return (
              <tr key={item.id}>
                <td className='firstColumn'>{item.name}</td>
                <td>{item.rightColumn}</td>
                <td><FavoriteButton favorite={props.favorite} favorites={props.favorites} type={item.type} id={item.id}/></td>
              </tr>)}
          )}
            </table>
	)
}

const FavoriteButton = (props) => {
  if (!props.favorites.find(x => x.id === props.id)) {
    return <button className='favoriteButton' onClick={() => props.favorite(props.id, props.type)}>Favorite</button>
  } else {
    return <button className='favoriteButton' onClick={() => props.favorite(props.id, props.type)}>Remove from Favorites</button>
  }
}

const Filter = (props) => {
	return (
	  <div>
    	<NavbarText>Keywords:</NavbarText><input 
        	value={props.filter}
        	onChange={props.filterResults}
    	/>
	  </div>
	)
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='alert alert-primary'>
      {message}
    </div>
  )
}

const App = () => {

  const [channel, setchannel] = useState(37) // yle1 id as default
  const [date, setdate] = useState('')
  const [programData, setProgramData] = useState([])
  const [filter, setFilter] = useState('')
  const [channelKeys, setChannelKeys] = useState([])
  const [livePrograms, setLivePrograms] = useState([])
  const [favorites, setFavorites] = useState(localStorage.favorites ? JSON.parse(localStorage.favorites) : [])
  const [notif, setNotification] = useState(null)

  const [channelsIsOpen, setChannelsIsOpen] = useState(true)
  const [searchIsOpen, setSearchIsOpen] = useState(false)
  const [liveIsOpen, setLiveIsOpen] = useState(false)
  const [favoritesIsOpen, setFavoritesIsOpen] = useState(false)

  const toggleChannel = () => {
    setSearchIsOpen(false)
    setChannelsIsOpen(true)
    setLiveIsOpen(false)
    setFavoritesIsOpen(false)
    setFilter('')
  }
  const toggleSearch = () => {
    setSearchIsOpen(true)
    setChannelsIsOpen(false)
    setLiveIsOpen(false)
    setFavoritesIsOpen(false)
    setFilter('')
  }
  const toggleLive = () => {
    setSearchIsOpen(false)
    setChannelsIsOpen(false)
    setLiveIsOpen(true)
    setFavoritesIsOpen(false)
    setFilter('')
  }

  const toggleFavorites = () => {
    setSearchIsOpen(false)
    setChannelsIsOpen(false)
    setLiveIsOpen(false)
    setFavoritesIsOpen(true)
    setFilter('')
  }

  const hook = () => {
    axios
      .get('/channelnames')
      .then(response => {
        setChannelKeys(response.data)
      })
    axios
      .get('/liveprograms')
      .then(response => {
        setLivePrograms(response.data)
      })
    console.log(livePrograms)
  }
  
  useEffect(hook, [])

  const getResultsbyChannel = (event) => {
    setchannel(event.target.value)
  }

  const getResultsByDate = (event) => {
    setdate(event.target.value)
  }

  const search = async (event) => {
    event.preventDefault()
    const response = await axios.post('/search', {channel: channel, date: date})
    setProgramData(response.data)
  }

  const filterResults = (event) => {
    setFilter(event.target.value)
  }

  const favorite = (id, type) => {
    if (!favorites.find(x => x.id === id)) {
      switch (type) {
        case 'program':
          setFavorites(favorites.concat(programData.find(elem => elem.id === id)))
          break
        case 'liveProgram':
          setFavorites(favorites.concat(livePrograms.find(elem => elem.id === id)))
          break
        case 'channel':
          setFavorites(favorites.concat(channelKeys.find(elem => elem.id === id)))
          break
        default: return
      }
      localStorage.setItem('favorites', JSON.stringify(favorites))
      setNotification(`Added ${type} to favorites`)
      setTimeout(() => {
        setNotification(null)
        }, 2500)
    } else {
      setFavorites(favorites.filter(item => item.id != id))
      localStorage.setItem('favorites', JSON.stringify(favorites))
      setNotification(`Removed ${type} from favorites`)
      setTimeout(() => {
        setNotification(null)
        }, 2500)
      return
    }
  }

  return (
    <div className='App'>
      <Navbar className='dark'>
        <NavbarToggler onClick={toggleChannel}>All Channels</NavbarToggler>
        <NavbarToggler onClick={toggleSearch}>Search</NavbarToggler>
        <NavbarToggler onClick={toggleLive}>Live Programs</NavbarToggler>
        <NavbarToggler onClick={toggleFavorites}>Favorites</NavbarToggler>
        <Filter
          filter={filter}
          filterResults={filterResults}
        />
      </Navbar>
      <Notification message={notif}/>
      <div style={{ display: searchIsOpen ? '' : 'none' }}>
        <SearchForm
          channelData={channelKeys}
          channel={channel}
          date={date}
          getResultsbyChannel={getResultsbyChannel}
          getResultsByDate={getResultsByDate}
          search={search}
        />
        <Display
          displayData={programData.map(program => {
            return ({
              type:'program',
              id:program.id,
              name:program.name,
              description:program.shortDescription,
              rightColumn:program.startTime
            })
          })}
          filter={filter}
          favorite={favorite}
          favorites={favorites}
        />
      </div>
      <div style={{ display: channelsIsOpen ? '' : 'none' }}>
        <div className='belowNav'>These are all the available channels</div>
        <Display
          displayData={channelKeys.map(channel => {
            return ({
              type:'channel',
              id:channel.id,
              name:channel.name,
              description:channel.description,
              rightColumn:channel.id
            })
          })}
          filter={filter}
          favorite={favorite}
          favorites={favorites}
        />
      </div>
      <div style={{ display: liveIsOpen ? '' : 'none'}}>
        <div className='belowNav'>These are currently live programs</div>
        <Display
          displayData={livePrograms.map(program => {
            return ({
              type:'liveProgram',
              id:program.id,
              name:program.name,
              description:program.shortDescription,
              rightColumn:program.startTime
            })
          })}
          filter={filter}
          favorite={favorite}
          favorites={favorites}
        />
      </div>
      <div style={{ display: favoritesIsOpen ? '' : 'none'}}>
        <div className='belowNav'>These are your favorites</div>
        <Display
          displayData={favorites.map(item => {
            return ({
              type:'item',
              id:item.id,
              name:item.name,
              description:item.shortDescription,
              rightColumn:item.type
            })
          })}
          filter={filter}
          favorite={favorite}
          favorites={favorites}
        />
      </div>
    </div>
  );
}

export default App;
