import "./App.css";
//import bootstrap css.
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import {
  Container,
  Card,
  InputGroup,
  FormControl,
  Button,
  Row,
} from "react-bootstrap";

function App() {
  const moods = [
    "Happy",
    "Sad",
    "Chill",
    "Energetic",
    "Romantic",
    "Focused",
    "Party",
  ];
  const [mood, setMood] = useState("");
  return (
    <>
      <div className="app">
        <Container>
          {/*the input group is where the inputs (button, datalist field) will live.*/}
          <InputGroup className="mb-3" size="lg">
            <FormControl
              className="form-control"
              list="moodList"
              type="input"
              placeholder="Type to Search..."
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  console.log("User pressed enter");
                }
              }}
              onChange={(e) => setMood(e.target.value)}
            ></FormControl>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                console.log(`User pressed button, and mood is ${mood}`)
              }
            >
              Search
            </button>
            <datalist id="moodList">
              {moods.map((mood, i) => (
                <option value={mood} key={i}></option>
              ))}
            </datalist>
          </InputGroup>
        </Container>
      </div>
    </>
  );
}

export default App;
