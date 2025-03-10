import "./App.css";
//import bootstrap css.
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";

//create constants for ClientID and Client Secret Key
const ClientID = "aca121a33cce401a863f6bc07ea333bf";
const ClientSecretKey = "513d6ea70d55407c9cd2299e3f3cb0c8";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [tracks, setTracks] = useState([]);
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

  async function searchFor() {
    console.log(`Searching for ${artist}...`);

    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };
    //use get request to get the artist ID.
    var artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + artist + "&type=artist",
      searchParameters
    )
      .then((result) => result.json())
      .then((data) => {
        return data.artists.items[0].id;
      });
    //use another get request to get the most popular tracks of the artist using their artist ID.
    var topTracks = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/top-tracks" +
        "?market=US&limit=20",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setTracks(data.tracks);
      });
    console.log(tracks);
  }

  //---code:
  //
  //
  // const moods = [
  //   "Select",
  //   "Happy",
  //   "Sad",
  //   "Chill",
  //   "Energetic",
  //   "Romance",
  //   "Work-Out",
  //   "Party",
  // ];
  const [artist, setArtist] = useState("");

  return (
    <>
      <div className="app w-75 mx-auto row justify-content-center">
        <p className="h1 p-3">TopTunes</p>
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
              onClick={searchFor}
            >
              Search
            </button>
          </div>
        </div>

        {/** making a new container -> this will hold the albums as cards for the specific artist they choose.*/}
        <div className="container-fluid align-items-center">
          <div className="mx-auto row row-cols-3 gap-auto">
            {tracks
              .sort((a, b) => b.popularity - a.popularity)
              .map((track, i) => {
                return (
                  <div className="card" key={i}>
                    <img
                      src={track.album.images[0].url}
                      className="card-img-top"
                    ></img>
                    <div className="card-body">
                      <p className="h4 card-title">{track.name}</p>
                      <p className="card-text">
                        Popularity: {track.popularity}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
