import "./App.css";
//import bootstrap css.
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";

//create constants for ClientID and Client Secret Key
export const ClientID = "aca121a33cce401a863f6bc07ea333bf";
export const ClientSecretKey = "513d6ea70d55407c9cd2299e3f3cb0c8";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [artistID, setID] = useState(null);
  const [tracks, setTracks] = useState([]);
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);

  const { id } = useParams();

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

  useEffect(() => {
    const data = localStorage.getItem(`tracks-${id}`);
    const artistName = localStorage.getItem("search-artist-name");
    if (data) {
      setTracks(JSON.parse(data));
      if (artistName && document.getElementById(artistName) == null) {
        setArtist(artistName);
      }
      navigate(`/artists/${id}`);
    }
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
    localStorage.setItem(`tracks-${artistID}`, JSON.stringify(data.tracks));
    localStorage.setItem("search-artist-name", artist);
    setTracks(data.tracks);
    console.log(data.tracks);
    console.log(data.tracks.length);
    if (data.tracks.length == 0) {
      return (
        <>
          <div className="alert alert-warning">
            Your artist has no songs on spotify. Enter another artist and try
            again.
          </div>
        </>
      );
    }
  }

  async function handleSearch() {
    const artistID = await getArtistID();
    if (artistID) {
      const savedTracks = localStorage.getItem(`tracks-${artistID}`);
      const theArtist = localStorage.setItem("search-artist-name", artist);
      console.log(artistID);
      if (savedTracks) {
        const artistName = localStorage.getItem("search-artist-name");
        if (artistName) {
          setArtist(artistName);
        }
        console.log("saved tracks found!!");
        setTracks(JSON.parse(savedTracks));
        console.log(artistName);
        navigate(`/artists/${artistID}`);
      } else {
        searchFor(artistID);
        navigate(`/artists/${artistID}`);
      }
    } else {
      return (
        <>
          <div className="alert alert-warning">
            Invalid artist name. Please enter the name correctly and try again.
          </div>
        </>
      );
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
              ref={nameRef}
              value={artist}
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

        {/** making a new container -> this will hold the top tracks as cards for the specific artist they choose.*/}
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
