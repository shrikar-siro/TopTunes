import "./App.css";
//import bootstrap css.
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

//create constants for ClientID and Client Secret Key
export const ClientID = "aca121a33cce401a863f6bc07ea333bf";
export const ClientSecretKey = "513d6ea70d55407c9cd2299e3f3cb0c8";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [id, setID] = useState(null);

  //get data - maybe we can move it to a different method?
  useEffect(() => {
    //API access token - process from spotify.
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        ClientID +
        "&client_secret=" +
        ClientSecretKey,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      //printing out the data (results.json) we get.
      .then((data) => setAccessToken(data.access_token));
  }, []);

  //create async function search for handling user parameters.
  //this function needs to be asynchronous because we're going to have many fetch statements in it, and we
  //need each statement to "wait its turn" before executing.

  var searchParameters = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  };

  //useMemo takes in two parameters - what is being memoized, and what it depends on. In this case, searchParameters depends on itself.

  async function getArtistID() {
    //use get request to get the artist ID.
    var response = await fetch(
      "https://api.spotify.com/v1/search?q=" + artist + "&type=artist",
      searchParameters
    );

    const data = await response.json();
    setID(data.artists.items[0].id);
    return data.artists.items[0].id;
  }

  async function searchFor(artistID: String) {
    //use another get request to get the most popular tracks of the artist using their artist ID.
    var response = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/top-tracks" +
        "?market=US&limit=20",
      searchParameters
    );

    const data = await response.json();
    setTracks(data.tracks);
    console.log(data.tracks);
  }

  async function handleSearch() {
    const artistID = await getArtistID();
    console.log("ArtistID: " + artistID);
    if (artistID) {
      searchFor(artistID);
    }
  }

  const [artist, setArtist] = useState("");

  return (
    <>
      <div className="app w-75 mx-auto row justify-content-center">
        <p className="h1 p-1">TopTunes</p>
        <p className="h4 mb-4 text-secondary">
          See your favorite artist's top tracks. Click on each track for
          additional information.
        </p>
        <div className="contianer-fluid">
          {/*the input group is where the inputs (button, datalist field) will live.*/}
          <div className="input-group mb-3 input-group-lg">
            <input
              className="form-control p-3"
              type="text"
              placeholder="Type artist name..."
              id="artistName"
              onChange={(e) => setArtist(e.target.value)}
            ></input>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        {/** making a new container -> this will hold the albums as cards for the specific artist they choose.*/}
        <div className="container-fluid align-items-center">
          <div className="mx-auto row row-cols-3 g-3">
            {tracks
              .sort((a, b) => b.popularity - a.popularity)
              .map((track, i) => {
                return (
                  <Link to={`/tracks/${track.id}`} key={i} className="link">
                    <div className="card p-0" key={i}>
                      <img
                        src={track.album.images[1].url}
                        className="card-img-top border border-dark img-fluid"
                      ></img>
                      <div className="card-body">
                        <p className="h5 card-title truncate-text">
                          {track.name}
                        </p>
                        <p className="card-text">
                          <b>Popularity: </b> {track.popularity}/100
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
