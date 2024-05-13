import React from 'react';
import Movie from './Movie';
import classes from './MoviesList.module.css';

const MoviesList = (props) => {
  const handleDeleteMovie = (movieId) => {
    props.onDeleteMovie(movieId);
  };

  return (
    <ul className={classes['movies-list']}>
      {props.movies.map((movie) => (
        <li key={movie.id}>
          <Movie
            title={movie.title}
            releaseDate={movie.releaseDate}
            openingText={movie.openingText}
          />
          <button onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default MoviesList;
