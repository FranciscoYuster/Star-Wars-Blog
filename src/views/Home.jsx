import React, { useContext } from 'react';
import { StarwarsContext } from '../context/starwarsContext';
import Card from '../components/Card';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const { people, planets, vehicles, starships, species, films } = useContext(StarwarsContext);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get('search') ? params.get('search').toLowerCase() : '';

  // Filtrado de cada categoría según el query.
  const filteredPeople = people.filter(item => item.name.toLowerCase().includes(searchQuery));
  const filteredPlanets = planets.filter(item => item.name.toLowerCase().includes(searchQuery));
  const filteredVehicles = vehicles.filter(item => item.name.toLowerCase().includes(searchQuery));
  const filteredStarships = starships.filter(item => item.name.toLowerCase().includes(searchQuery));
  const filteredSpecies = species.filter(item => item.name.toLowerCase().includes(searchQuery));
  const filteredFilms = films.filter(item => item.title.toLowerCase().includes(searchQuery));

  // Renderiza una sección en una sola fila horizontal con scroll.
  const renderSection = (title, items, displayKey, type) => (
    <>
      <h1 className="text-warning">{title}</h1>
      <div className="d-flex flex-nowrap overflow-auto mb-4">
        {items.map(item => (
          <div key={item.uid} className="me-3">
            <Card item={item} type={type} displayName={item[displayKey]} />
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="container-fluid w-100 p-3 bg-dark text-light">
      {renderSection("Characters", filteredPeople, "name", "people")}
      {renderSection("Planets", filteredPlanets, "name", "planets")}
      {renderSection("vehicles", filteredVehicles, "name", "vehicles")}
      {renderSection("Starships", filteredStarships, "name", "starships")}
      {renderSection("Species", filteredSpecies, "name", "species")}
      
      <h1 className="text-warning">Films</h1>
      <div className="d-flex flex-nowrap  bg-dark overflow-auto mb-4">
        {filteredFilms.map(item => (
          <div key={item.uid} className="me-3">
            <Card item={item} type="films" displayName={item.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
