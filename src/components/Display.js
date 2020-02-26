import React from 'react'

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

export default Display