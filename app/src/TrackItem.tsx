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

    var response = await fetch(
      "https://api.spotify.com/v1/tracks/" + id + "?market=US",
      searchParameters
    );

    const data = await response.json();
    setInformation(data);
    return data;
  }

  useEffect(() => {
    if (!accessToken || !id) {
      return;
    }
    //calling method in useEffect, will get called again if id or accessToken changes.
    trackInfo();
    //we pass accessToken and id as parameters to let the computer know to update state when accessToken changes.
  }, [accessToken, id]);

  //make sure that information exists before proceeding.
  if (!information) return <p>Loading...</p>;

  return (
    <>
      <div className="container-fluid w-75 align-items-center">
        <p className="h1 p-3 text-start text-weight-bold">{information.name}</p>
        <hr />
        <div className="mx-auto d-flex flex-row-reverse p-3">
          <div className="container-fluid">
            <p className="h2">Track Details:</p>
            <ul className="list-group list-group-flush text-start w-auto">
              <li className="list-group-item h5 p-3">
                <b>Album Name: </b> {information.album.name}
              </li>
              <li className="list-group-item h5 p-3">
                <b>Main Artist: </b> {information.artists[0].name}
              </li>
              <li className="list-group-item h5 p-3">
                <b>Track Number: </b>
                {information.track_number}
              </li>
              <li className="list-group-item h5 p-3">
                <b>Duration: </b>
                {Math.ceil(information.duration_ms / 60000)} minutes
              </li>
              <li className="list-group-item h5 p-3">
                <b>Song URL: </b>{" "}
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
            <div className="container-fluid d-flex flex-row justify-content-center p-2 gap-2 text-center">
              <a
                className="btn btn-primary p-2"
                href={information.artists[0].external_urls.spotify}
                role="button"
                target="_blank"
              >
                Artist Profile
              </a>
              <a
                className="btn btn-primary p-2"
                href={information.album.external_urls.spotify}
                role="button"
                target="_blank"
              >
                Other Album Songs
              </a>
            </div>
          </div>
          <div className="container-fluid">
            <img
              src={information.album.images[0].url}
              alt="album image"
              className="img-fluid mx-auto"
            ></img>
          </div>
        </div>
      </div>
    </>
  );
}

export default TrackItem;
