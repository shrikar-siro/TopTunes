import "./App.css";
//import bootstrap css.
import "bootstrap/dist/css/bootstrap.min.css";
// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function TrackItem() {
  const { id } = useParams();
  return (
    <>
      <div>
        <p>This is a track item! The id is {id}</p>
      </div>
    </>
  );
}

export default TrackItem;
