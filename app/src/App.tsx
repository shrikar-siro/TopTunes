import "./App.css";
//import bootstrap css.
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

//create constants for ClientID and Client Secret Key
const ClientID = "aca121a33cce401a863f6bc07ea333bf";
const ClientSecretKey = "513d6ea70d55407c9cd2299e3f3cb0c8";

function App() {
  const moods = [
    "Select",
    "Happy",
    "Sad",
    "Chill",
    "Energetic",
    "Romantic",
    "Focused",
    "Party",
  ];
  const [mood, setMood] = useState("");
  const [artist, setArtist] = useState("");

  return (
    <>
      <div className="app w-75 mx-auto row justify-content-center">
        <p className="h1 p-3">Modify: Songs By Mood</p>
        <div className="contianer-fluid">
          {/*the input group is where the inputs (button, datalist field) will live.*/}
          <div className="input-group mb-3 input-group-lg">
            <select
              className="form-select"
              aria-placeholder="Type to Search..."
              onChange={(e) => setMood(e.target.value)}
            >
              {moods.map((mood, i) => (
                <option value={mood} key={i} className="text-center">
                  {mood}
                </option>
              ))}
            </select>
            <input
              className="form-control p-3 text-center"
              type="text"
              placeholder="Type artist name..."
              id="artistName"
              onChange={(e) => setArtist(e.target.value)}
            ></input>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                console.log(
                  `User pressed button, with a mood of ${mood} and artist of ${artist}`
                )
              }
            >
              Search
            </button>
          </div>
        </div>

        {/** making a new container -> this will hold the albums as cards for the specific artist they choose.*/}
        <div className="container-fluid">
          <div className="mx-auto row row-cols-4 gap-3">
            <div className="card p-3">
              <img src="..." className="card-img-top"></img>
              <div className="card-body">
                <p className="h5 card-title">Album Name Here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default App;
