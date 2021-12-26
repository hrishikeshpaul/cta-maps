import React from "react";

import { MapContainer } from "./map/MapContainer";
import { Nav } from "./nav/Nav";

import "./App.scss";

export const App = () => {
  return (
    <div className="App">
      <Nav />
      <MapContainer />
    </div>
  );
};
