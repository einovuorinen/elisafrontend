import React from 'react'

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

export default SearchForm