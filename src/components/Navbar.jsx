import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StarwarsContext } from '../context/starwarsContext';

const Navbar = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useContext(StarwarsContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() === '') {
      navigate('/');
    } else {
      navigate(`/?search=${search}`);
    }
  };

  // Agrupar favoritos por categoría
  const groupedFavorites = favorites.reduce((acc, fav) => {
    if (!acc[fav.type]) {
      acc[fav.type] = [];
    }
    acc[fav.type].push(fav);
    return acc;
  }, {});

  // Función para mantener el color sin hover
  const handleMouseOver = (e) => {
    e.currentTarget.style.backgroundColor = '#FFD700';
    e.currentTarget.style.borderColor = '#FFD700';
  };
  const handleMouseOut = (e) => {
    e.currentTarget.style.backgroundColor = '#FFD700';
    e.currentTarget.style.borderColor = '#FFD700';
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#000000', borderBottom: '2px solid #FFD700' }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-warning" to="/">StarWars Blog</Link>
        <div className="d-flex ms-auto align-items-center">
          <form className="d-flex me-3" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search..."
              aria-label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ backgroundColor: '#333333', color: '#ffffff', borderColor: '#FFD700' }}
            />
            <button className="btn btn-outline-warning" type="submit">
            Search
            </button>
          </form>
          <div className="dropdown">
            <button
              className="btn btn-warning dropdown-toggle"
              type="button"
              id="favoritesDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              Favorites ({favorites.length})
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end overflow-auto vh-50"
              aria-labelledby="favoritesDropdown"
              style={{ backgroundColor: '#222222', borderColor: '#FFD700' }}
            >
              {favorites.length > 0 ? (
                Object.entries(groupedFavorites).map(([cat, items]) => (
                  <React.Fragment key={cat}>
                    <h6 className="dropdown-header text-warning">{cat} ({items.length})</h6>
                    {items.map(fav => (
                      <li
                        key={`${fav.type}-${fav.uid}`}
                        className="d-flex align-items-center justify-content-between px-2"
                      >
                        <Link className="dropdown-item bg-dark text-light flex-grow-1" to={`/details/${fav.type}/${fav.uid}`}>
                          {fav.name || fav.title}
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(fav, fav.type);
                          }}
                        >
                          &times;
                        </button>
                      </li>
                    ))}
                    <li><hr className="dropdown-divider" /></li>
                  </React.Fragment>
                ))
              ) : (
                <li>
                  <span className="dropdown-item bg-dark text-light">No favorites</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
