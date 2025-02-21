import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StarwarsContext } from '../context/starwarsContext';

const Details = () => {
  // Obtenemos el tipo e id de la URL
  const { type, id } = useParams();
  
  // Extraemos del contexto los datos de cada categoría
  const { people, planets, vehicles, starships, species } = useContext(StarwarsContext);
  
  // Estados para almacenar los detalles, el nombre del homeworld y errores
  const [details, setDetails] = useState(null);
  const [homeworldName, setHomeworldName] = useState('');
  const [error, setError] = useState('');

  // Pedimos los detalles del recurso
  useEffect(() => {
    fetch(`https://www.swapi.tech/api/${type}/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('HTTP error! Status: ' + response.status);
        }
        return response.json();
      })
      .then(data => setDetails(data.result))
      .catch(err => {
        console.error("Error fetching details:", err);
        setError(err.message);
      });
  }, [type, id]);

  // Si el recurso tiene homeworld (usualmente en people), pedimos su nombre
  useEffect(() => {
    if (details && details.properties.homeworld) {
      fetch(details.properties.homeworld)
        .then(response => {
          if (!response.ok) {
            throw new Error('HTTP error! Status: ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          if (data.result && data.result.properties) {
            setHomeworldName(data.result.properties.name);
          }
        })
        .catch(err => console.error("Error fetching homeworld:", err));
    }
  }, [details]);

  // Si hay error o no se cargaron los detalles aún, se muestra un mensaje
  if (error) {
    return <div className="container mt-4 text-center text-white">Error al cargar los detalles: {error}</div>;
  }
  if (!details) {
    return <div className="container mt-4 text-center text-white">Cargando...</div>;
  }

  // Usamos el título si es film, o el nombre para otros recursos
  const propsData = details.properties;
  const displayName = type === 'films' ? propsData.title : propsData.name;

  // Función simple para renderizar los valores
  function renderValue(key, value) {
    // Caso especial para "homeworld"
    if (key === 'homeworld' && typeof value === 'string') {
      const parts = value.split('/');
      const resourceId = parts[5];
      return (
        <Link to={`/details/planets/${resourceId}`} style={{ color: '#FFD700' }}>
          {homeworldName ? homeworldName : value}
        </Link>
      );
    }

    // Si el campo es "people" o "characters" y es un array, mostramos nombres del contexto
    if ((key === 'people' || key === 'characters') && Array.isArray(value)) {
      return value.map((item, index) => {
        const parts = item.split('/');
        const resourceId = parts[5];
        // Buscamos en el contexto de "people"
        const found = people.find(p => p.uid === resourceId);
        const nameToShow = found ? found.name : item;
        return (
          <span key={index}>
            <Link to={`/details/people/${resourceId}`} style={{ color: '#FFD700' }}>
              {nameToShow}
            </Link>
            {index < value.length - 1 ? ', ' : ''}
          </span>
        );
      });
    }

    // Para otros campos relacionados (planets, vehicles, starships, species)
    if (Array.isArray(value)) {
      return value.map((item, index) => {
        const parts = item.split('/');
        const resourceId = parts[5];
        let resourceType = key; // Por defecto, usamos la key como tipo
        let found, nameToShow;
        if (key === 'planets') {
          found = planets.find(p => p.uid === resourceId);
          nameToShow = found ? found.name : item;
        } else if (key === 'vehicles') {
          found = vehicles.find(p => p.uid === resourceId);
          nameToShow = found ? found.name : item;
        } else if (key === 'starships') {
          found = starships.find(p => p.uid === resourceId);
          nameToShow = found ? found.name : item;
        } else if (key === 'species') {
          found = species.find(p => p.uid === resourceId);
          nameToShow = found ? found.name : item;
        } else {
          nameToShow = item;
        }
        return (
          <span key={index}>
            <Link to={`/details/${resourceType}/${resourceId}`} style={{ color: '#FFD700' }}>
              {nameToShow}
            </Link>
            {index < value.length - 1 ? ', ' : ''}
          </span>
        );
      });
    }

    // Si es una cadena que es una URL de SWAPI, creamos el enlace
    if (typeof value === 'string' && value.startsWith('https://www.swapi.tech/api/')) {
      const parts = value.split('/');
      const resourceType = parts[4];
      const resourceId = parts[5];
      return (
        <Link to={`/details/${resourceType}/${resourceId}`} style={{ color: '#FFD700' }}>
          {value}
        </Link>
      );
    }

    // En caso contrario, se muestra el valor tal cual
    return value;
  }

  return (
    <div
      className="container-fluid p-5"
      style={{
        backgroundImage: 'url(/assets/star-wars-bg2.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}
    >
      <div className="card shadow" style={{
        backgroundColor: 'rgba(0,0,0,0.8)',
        border: '2px solid #FFD700'
      }}>
        <div className="card-header bg-dark text-warning" style={{
          fontFamily: '"Star Jedi", sans-serif',
          borderBottom: '1px solid #FFD700'
        }}>
          <h2 className="card-title mb-0">{displayName}</h2>
        </div>
        <div className="row g-0">
          {/* Columna izquierda para la imagen */}
          <div className="col-md-4" style={{ backgroundColor: 'transparent' }}>
            <img
              src={`https://starwars-visualguide.com/assets/img/${type}/${id}.jpg`}
              alt={displayName}
              className="img-fluid"
              crossOrigin="anonymous"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://i.imgflip.com/9ktwut.jpg';
              }}
              style={{
                height: '100%',
                width: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                borderRight: '2px solid #FFD700'
              }}
            />
          </div>
          {/* Columna derecha para los detalles */}
          <div className="col-md-8">
            <div className="card-body" style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              opacity: 0.9,
              padding: '20px'
            }}>
              <ul className="list-group list-group-flush">
                {Object.entries(propsData)
                  .filter(([key]) => !['created', 'edited', 'name', 'url'].includes(key))
                  .map(([key, value]) => (
                    <li key={key} className="list-group-item" style={{
                      color: '#fff',
                      backgroundColor: 'transparent',
                      borderBottom: '1px solid #FFD700'
                    }}>
                      <strong>{key}:</strong> {renderValue(key, value)}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="text-end m-3 mt-3">
              <Link to="/" className="btn btn-warning" style={{ fontFamily: '"Star Jedi", sans-serif' }}>
                Regresar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
