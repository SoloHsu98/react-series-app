/** @jsxImportSource @emotion/react */
import React from "react";
import Footer from "src/components/Footer";
import NavBar from "src/components/NavBar";
import HeroSection from "src/components/HeroSection";
import { css } from "@emotion/react";
import TrendingSeries from "src/components/TrendingSeries";
import PopularSeries from "src/components/PopularSeries";
const Home = () => {
  return (
    <div>
      <NavBar />
      <HeroSection />
      <div css={styles.mainContainer}>
        <TrendingSeries />
        <PopularSeries />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
const styles = {
  mainContainer: css`
    width: 100%;
    height: 100%;
    background-color: #404258;
  `,
};
