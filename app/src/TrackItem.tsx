import "./App.css";
//import bootstrap css.
import "bootstrap/dist/css/bootstrap.min.css";
// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useEffect } from "react";
import { useState } from "react";
import { ClientID, ClientSecretKey } from "./App";

function TrackItem() {
  //key fix: setting this to null instead of an array.
  const [information, setInformation] = useState(null);
  const { id } = useParams();

  const [accessToken, setAccessToken] = useState("");
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

  async function trackInfo() {
    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    //with the ID, we make another request to the API for the track data.

    var info = await fetch(
      "https://api.spotify.com/v1/tracks/" + id + "?market=US",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => setInformation(data));
  }

  useEffect(() => {
    if (!accessToken || !id) {
      console.log("information isn't there yet!");
      return;
    }
    trackInfo();
    //we pass accessToken and id as parameters to let the computer know to update state when accessToken changes.
  }, [accessToken, id]);

  //make sure that information exists before proceeding.
  if (!information) return <p>Loading...</p>;

  return (
    <>
      <div className="container-fluid w-75">
        <p className="h1 p-3 text-start text-weight-bold">{information.name}</p>
        <div className="mx-auto d-flex flex-row-reverse">
          <div className="container-fluid">
            <p className="h2">Track Details:</p>
            <ul className="list-group list-group-flush text-start w-auto">
              <li className="list-group-item h5">
                Album Name: {information.album.name}
              </li>
              <li className="list-group-item h5">
                Artist: {information.artists[0].name}
              </li>
              <li className="list-group-item h5">
                Track Number: {information.track_number}
              </li>
              <li className="list-group-item h5">
                Song URL:{" "}
                <a
                  href={information.external_urls.spotify}
                  className="link-primary h6"
                  target="_blank"
                >
                  {information.external_urls.spotify}
                </a>
              </li>
              <li className="list-group-item h5 p-0"></li>
            </ul>
            <a
              className="btn btn-primary"
              href={information.artists[0].external_urls.spotify}
              role="button"
              target="_blank"
            >
              See Artist Bio
            </a>
          </div>
          <div className="container-fluid">
            <img
              src={information.album.images[0].url}
              alt="album image"
              className="img-fluid"
            ></img>
          </div>
        </div>
      </div>
    </>
  );
}

export default TrackItem;
