/** @jsxImportSource @emotion/react */
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { css } from "@emotion/react";
import Home from "./routes/Home";
import Trending from "./routes/Trending";
import Popular from "./routes/Popular";
import Ongoing from "./routes/Ongoing";
import BrowseSeries from "./routes/BrowseSeries";
import SeriesDetails from "./routes/SeriesDetails";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/ongoing" element={<Ongoing />} />
        <Route path="/browse-series" element={<BrowseSeries />} />
        <Route
          path="/:status/details/seriesId=:id/mode=view-details"
          element={<SeriesDetails />}
        />
      </Routes>
    </>
  );
}

export default App;
const styles = {
  title: css`
    color: blue;
  `,
};
