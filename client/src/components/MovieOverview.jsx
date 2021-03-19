import React, { useEffect, useState, forceUpdate } from "react";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import StreamablePlayer from "./StreamablePlayer";
import { useLocation } from "react-router";

export default function MovieOverview(props) {
  const [data, setData] = useState([]);
  const [isFavorite, setIsFavorite] = useState("");
  
  const location = useLocation();

  useEffect(() => {
    const onlyId = location.pathname.substring(7);
    const apiUrl = `https://www.omdbapi.com/?i=${onlyId}&apikey=4a3b711b`;
    axios.get(apiUrl).then((response) => {
      setData(response.data);
    });
  }, [location.pathname]);

  const loopOverRatings = (array) => {
    const allRatings = array.map((array) => {
      return (
        <p>
          {array.Source} {array.Value}
        </p>
      );
    });
    return allRatings;
  };

  const reactStarsFormat = {
    size: 40,
    count: 10,
    isHalf: false,
    value: 4,
    color: "blue",
    activeColor: "yellow",
    onChange: (newValue) => {
      console.log(`New user rating is: ${newValue}`);
    },
  };

  const convertDataToFavorites = () => {
    const movieID = document.location.pathname.split("/")[2];
    axios.post(`/api/favorites/new?movieID=${movieID}`, {
      headers: { "Authorization": localStorage.getItem("token") }
    }).then((response) =>{
      console.log(response)
      setIsFavorite("passed")
    })
  }

  useEffect(() => {
    const movieID = document.location.pathname.split("/")[2];
    axios.get(`/api/favorites/new?movieID=${movieID}`, {
      headers: { "Authorization": localStorage.getItem("token") },
    }).then((response) => {
      console.log("RESPONSE", response.data.pass)
      if(response.data.pass === "passed") {
        setIsFavorite(response.data.pass)
      } else {
        setIsFavorite("")
      }
      
    })
  },[])

  
  const validateFavorite = () => {
    const movieID = document.location.pathname.split("/")[2];
    axios.get(`/api/favorites/new?movieID=${movieID}`, {
      headers: { "Authorization": localStorage.getItem("token") },
    }).then((response) => {
      console.log("RESPONSE", response.data.pass)
      
      if(response.data.pass !== "passed") {
        console.log("inside the if statement")
        return (<button type="button" onClick={() => convertDataToFavorites(data)}> Add to Favorites </button>)
      } 
    })
  }

  const deleteFavorite = () => {
    const movieID = document.location.pathname.split("/")[2];
    axios.delete(`/api/favorites/new?movieID=${movieID}`, {
      headers: { "Authorization": localStorage.getItem("token") },
    }).then((response) => {
      console.log("delete passed", response)
      console.log("deletion is here", response.data.deletion)
      if(response.data.deletion === "true") {
        console.log("inside the if statement")
        setIsFavorite("")
      }
    })
  }



  return Object.keys(data).length > 0 ? (
    <article className="container">
      <section>
        <h2>{data.Title}</h2>
        {isFavorite !== "passed" ? 
          <button type="button" onClick={() => convertDataToFavorites()}> Add to Favorites </button> : <button type="button" onClick={() => deleteFavorite()}> Remove from Favorites </button> } 


        <button type="button" onClick={() => validateFavorite()}> Add to Watch List </button>
        <div id="page">
          <div id="divTable" class="InsideContent">
            <table id="logtable">
              <img
                className="poster"
                src={data.Poster}
                alt="movie poster"
              ></img>
            </table>
          </div>

          <div id="divMessage" class="InsideContent">
            <StreamablePlayer />
          </div>
        </div>
      </section>

      <div>
        <h3> Plot Overview: </h3>
        <p>{data.Plot}</p>

        {data.Type === "movie" && <h3>Movie Details:</h3>}
        {data.Type === "series" && <h3>TV Show Details:</h3>}
        <div>
          <p>Genres: {data.Genre}</p>
          {loopOverRatings(data.Ratings)}
        </div>

        <p>Year Released: {data.Year} </p>
        <p>Production: {data.Production}</p>
        <p>BoxOffice: {data.BoxOffice}</p>

        {data.Awards !== "N/A" && <p>{data.Awards}</p>}

        <h3>Cast & Crew:</h3>
        <p>Director: {data.Director}</p>
        <p>Relevant Actors: {data.Actors}</p>

        <h3>
          Leave a Rating Below:
          <ReactStars {...reactStarsFormat} />
        </h3>
        <div className="comments">
          <form>
            <textarea type="text" placeholder="Write comments here" />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </article>
  ) : (
    <h2>Loading</h2>
  );
}
