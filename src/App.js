import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://myapi-75747-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      const loadedMovies =[];
      for(const key in data){
        loadedMovies.push({
          id : key,
          title : data[key].title,
          openingText:data[key].openingText,
          releaseDate:data[key].releaseDate
        })
      }
      
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    try {
      const response = await fetch('https://myapi-75747-default-rtdb.firebaseio.com/movies.json',{
        method:'POST',
        body:JSON.stringify(movie),
        headers:{
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error('Something went wrong while adding the movie!');
      }
      fetchMoviesHandler(); // Fetch movies again to update the list
    } catch (error) {
      setError(error.message);
    }
  }

  async function deleteMovieHandler(movieId) {
    try {
      const response = await fetch(`https://myapi-75747-default-rtdb.firebaseio.com/movies/${movieId}.json`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Something went wrong while deleting the movie!');
      }
      // Update the movies list by filtering out the deleted movie
      setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
    } catch (error) {
      setError(error.message);
    }
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
