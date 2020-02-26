import React from 'react'

const FavoriteButton = (props) => {
    if (!props.favorites.find(x => x.id === props.id)) {
      return <button className='favoriteButton' onClick={() => props.favorite(props.id, props.type)}>Favorite</button>
    } else {
      return <button className='favoriteButton' onClick={() => props.favorite(props.id, props.type)}>Remove from Favorites</button>
    }
}

export default FavoriteButton