import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StarwarsContext } from '../context/starwarsContext';
// Asegúrate de tener la imagen placeholder en la ruta indicada o ajústala según tu proyecto.

const Card = ({ item, type, displayName }) => {
  const { toggleFavorite, favorites } = useContext(StarwarsContext);
  const isFavorite = favorites.some(fav => fav.uid === item.uid && fav.type === type);

  return (
    <div
      className="card m-3"
      style={{ width: '18rem', backgroundColor: '#222222', border: '1px solid #FFD700' }}
    >

      <img
        src={`https://starwars-visualguide.com/assets/img/characters/${item.uid}.jpg`}
        crossOrigin="anonymous"
        onError={(e) => {
          e.target.onerror = null; // Evita loop infinito si falla la imagen de respaldo.
          e.target.src = 'https://i.imgflip.com/9ktwut.jpg';
        }}
        className="card-img-top"
        alt="Star Wars Img"
      />

      
      <div className="card-body">
        <h5 className="card-title text-warning">{displayName}</h5>
        <Link to={`/details/${type}/${item.uid}`} className="btn btn-primary">
          See more
        </Link>
        <button
          className="btn btn-warning ms-2"
          onClick={() => toggleFavorite(item, type)}
          title="Agregar a favoritos"
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
    </div>
  );
};

export default Card;
