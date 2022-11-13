/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import apolloClient from "../lib/apolloClient";
import { css } from "@emotion/react";
import { GET_POPULAR_SERIES } from "src/graphql/queries/popular";
import { API_URL } from "src/config";
import Footer from "src/components/Footer";
import NavBar from "src/components/NavBar";
import { Link } from "react-router-dom";
const Ongoing = () => {
  const [info, setInfo] = useState([]);
  const getAllPopularSeries = async () => {
    const {
      data: { seriesDetails },
    } = await apolloClient.query({
      fetchPolicy: "network-only",
      query: GET_POPULAR_SERIES,
    });
    const seriesInfo = seriesDetails?.data?.map((series) => {
      return {
        id: series?.id,
        status: series?.attributes?.status,
        title: series?.attributes?.title,
        poster: series?.attributes?.posterUrl?.data?.attributes?.url,
      };
    });

    setInfo(seriesInfo);
  };

  useEffect(() => {
    getAllPopularSeries();
  }, []);
  return (
    <div>
      <NavBar />
      <div css={styles.container}>
        <h2 css={styles.title}>All Ongoing Series</h2>
        <div css={styles.seriesContainer}>
          {info.map((seriesCard) => (
            <div key={seriesCard.id}>
              <Link
                to={`/${seriesCard.status}/details/seriesId=${seriesCard.id}/mode=view-details`}
              >
                <div css={styles.imageCard}>
                  <img src={`${API_URL}${seriesCard?.poster}`} alt="trending" />
                </div>
              </Link>
              <p css={styles.seriesName}>{seriesCard?.title}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Ongoing;
const styles = {
  container: css`
    padding: 2em;
    width: 100%;
    height: 100%;
    background-color: #404258;
  `,
  title: css`
    text-align: center;
    margin-bottom: 2em;
    font-size: 2em;
    color: #fff;
    font-weight: 600;
  `,
  imageCard: css`
    width: 200px;
    height: 300px;
    border: 2px solid #fff;
    border-radius: 8px;
    margin-bottom: 1em;
    cursor: pointer;
    filter: drop-shadow(10px 8px 8px rgba(0, 0, 0, 0.4));
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
  `,
  seriesName: css`
    white-space: nowrap;
    max-width: 200px;
    font-size: 1em;
    color: #fff;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  seriesContainer: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 2em 4em;
  `,
};
