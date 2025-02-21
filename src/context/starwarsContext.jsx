import React, { createContext, useState, useEffect } from 'react';

export const StarwarsContext = createContext();

// Función auxiliar recursiva para obtener todos los ítems de todas las páginas.
const fetchAllPages = (url, accumulated = []) => {
  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      const combined = accumulated.concat(data.results || []);
      if (data.next) {
        return fetchAllPages(data.next, combined);
      }
      return combined;
    });
};

// Funciones de carga para cada categoría
const loadPeople = (setPeople) => {
  const stored = localStorage.getItem('starwarsPeople');
  if (stored) {
    setPeople(JSON.parse(stored));
  } else {
    fetchAllPages('https://www.swapi.tech/api/people/')
      .then(allPeople => {
        setPeople(allPeople);
        localStorage.setItem('starwarsPeople', JSON.stringify(allPeople));
      })
      .catch(err => console.error("Error fetching people:", err));
  }
};

const loadPlanets = (setPlanets) => {
  const stored = localStorage.getItem('starwarsPlanets');
  if (stored) {
    setPlanets(JSON.parse(stored));
  } else {
    fetchAllPages('https://www.swapi.tech/api/planets/')
      .then(allPlanets => {
        setPlanets(allPlanets);
        localStorage.setItem('starwarsPlanets', JSON.stringify(allPlanets));
      })
      .catch(err => console.error("Error fetching planets:", err));
  }
};

const loadVehicles = (setVehicles) => {
  const stored = localStorage.getItem('starwarsVehicles');
  if (stored) {
    setVehicles(JSON.parse(stored));
  } else {
    fetchAllPages('https://www.swapi.tech/api/vehicles/')
      .then(allVehicles => {
        setVehicles(allVehicles);
        localStorage.setItem('starwarsVehicles', JSON.stringify(allVehicles));
      })
      .catch(err => console.error("Error fetching vehicles:", err));
  }
};

const loadStarships = (setStarships) => {
  const stored = localStorage.getItem('starwarsStarships');
  if (stored) {
    setStarships(JSON.parse(stored));
  } else {
    fetchAllPages('https://www.swapi.tech/api/starships/')
      .then(allStarships => {
        setStarships(allStarships);
        localStorage.setItem('starwarsStarships', JSON.stringify(allStarships));
      })
      .catch(err => console.error("Error fetching starships:", err));
  }
};

const loadSpecies = (setSpecies) => {
  const stored = localStorage.getItem('starwarsSpecies');
  if (stored) {
    setSpecies(JSON.parse(stored));
  } else {
    fetchAllPages('https://www.swapi.tech/api/species/')
      .then(allSpecies => {
        setSpecies(allSpecies);
        localStorage.setItem('starwarsSpecies', JSON.stringify(allSpecies));
      })
      .catch(err => console.error("Error fetching species:", err));
  }
};

const loadFilms = (setFilms) => {
  const stored = localStorage.getItem('starwarsFilms');
  if (stored) {
    setFilms(JSON.parse(stored));
  } else {
    fetch('https://www.swapi.tech/api/films/')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        const filmList = data.result || [];
        if (filmList.length === 0) {
          console.error("No se encontraron films:", data);
          return;
        }
        const filmsArray = filmList.map(film => ({
          ...film.properties,
          uid: film.uid
        }));
        setFilms(filmsArray);
        localStorage.setItem('starwarsFilms', JSON.stringify(filmsArray));
      })
      .catch(err => console.error("Error fetching films:", err));
  }
};

export const StarwarsProvider = ({ children }) => {
  const [people, setPeople] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [starships, setStarships] = useState([]);
  const [species, setSpecies] = useState([]);
  const [films, setFilms] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadPeople(setPeople);
    loadPlanets(setPlanets);
    loadVehicles(setVehicles);
    loadStarships(setStarships);
    loadSpecies(setSpecies);
    loadFilms(setFilms);
  }, []);

  const toggleFavorite = (item, type) => {
    const exists = favorites.find(fav => fav.uid === item.uid && fav.type === type);
    if (exists) {
      setFavorites(favorites.filter(fav => !(fav.uid === item.uid && fav.type === type)));
    } else {
      setFavorites([...favorites, { ...item, type }]);
    }
  };

  return (
    <StarwarsContext.Provider
      value={{
        people,
        planets,
        vehicles,
        starships,
        species,
        films,
        favorites,
        toggleFavorite,
      }}
    >
      {children}
    </StarwarsContext.Provider>
  );
};

export default StarwarsProvider;
