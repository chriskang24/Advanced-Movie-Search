const { response } = require("express");
const { Pool } = require("pg");

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'finals'
});

const getMediaFromID = (id) => {
  // console.log("id from call:", id)
  // console.log(id === 'tt5109280')
  const queryString = `
  SELECT * FROM favorites
  WHERE imdb_id = $1;
  `

  const queryParams = [id]

  return pool.query(queryString, queryParams)
    .then(res => {
      return res.rows[0]
    })
}

exports.getMediaFromID = getMediaFromID;

const getIDsFromFavorites = (user_id, imdb_id) => {

  const queryString = `
  SELECT * FROM favorites
  WHERE user_id = $1 AND imdb_id = $2;
  `
  const queryParams = [user_id, imdb_id]

  return pool.query(queryString, queryParams)
    .then(res => {
      return res.rows[0]
    })
}

exports.getIDsFromFavorites = getIDsFromFavorites;

const deleteMediaFromFavorites = (user_id, imdb_id) => {

  const queryString = `
  DELETE FROM favorites
  WHERE user_id = $1 AND imdb_id = $2;
  `
  const queryParams = [user_id, imdb_id]

  return pool.query(queryString, queryParams)
  .then(res => {
    return res
  })

}

exports.deleteMediaFromFavorites = deleteMediaFromFavorites;

const getEmailFromUser = (id) => {
  const queryString = `
  SELECT * FROM users
  WHERE id = $1;
  `;
  const queryParams = [id]

  return pool.query(queryString, queryParams)
    .then(res => {
      return res.rows[0]
    })
}
exports.getEmailFromUser = getEmailFromUser;

const getUsersFromEmail = (email) => {
  const queryString = `
    SELECT * FROM users
    WHERE email = $1;
    `;
  const queryParams = [email]

  return pool.query(queryString, queryParams)
    .then(res => {
      return res.rows[0]
    })
}

exports.getUsersFromEmail = getUsersFromEmail;

const addUser = (email, password) => {
  const queryString = `
  INSERT INTO users (email, password)
  VALUES ($1, $2)
  RETURNING *;
  `
  const queryParams = [email, password]

  return pool.query(queryString, queryParams)
    .then(result => result.rows[0])
    .catch((err) => err);
}

exports.addUser = addUser;

const addMoviesToFavorites = (id, movie) => {
  const queryString = `
    INSERT INTO favorites (user_id, imdb_id)
    VALUES ($1, $2)
    RETURNING *;
    `
  const queryParams = [id, movie];

  return pool.query(queryString, queryParams)
    .then(result => result.rows[0])
    .catch((error) => error);
}

exports.addMoviesToFavorites = addMoviesToFavorites;

const getImdbIDsFromUserID = (id) => {
  const queryString = `
  SELECT * FROM favorites
  WHERE user_id = $1;
  `

  const queryParams = [id];

  return pool.query(queryString, queryParams)
    .then(result => result.rows)
    .catch((error) => error)

}

exports.getImdbIDsFromUserID = getImdbIDsFromUserID;

// const addMoviesToMedia = (title, type, year, id) => {
//   const queryString = `
//   INSERT INTO media (title, type, year, imdb_id)
//   VALUES ($1, $2, $3, $4)
//   RETURNING *;
//   `
//   const queryParams = [title, type, year, id];

//   return pool.query(queryString, queryParams)
//     .then(result => result.rows[0])
//     .catch((error) => error);
// }

// exports.addMoviesToMedia = addMoviesToMedia;

// const getMoviesFromFavorites = (id) => {
//   const queryString = `
//   SELECT media.* FROM media
//   JOIN favorites ON media.id = imdb_id
//   JOIN users ON users.id = user_id
//   WHERE user_id = $1;
//   `
//   const queryParams = [id]

//   return pool.query(queryString, queryParams)
//     .then(res => {
//       console.log('res:', res)
//       return res.rows
//     })
// }

// exports.getMoviesFromFavorites = getMoviesFromFavorites
