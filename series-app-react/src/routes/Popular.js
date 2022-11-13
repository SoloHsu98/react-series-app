/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import apolloClient from "../lib/apolloClient";
import { css } from "@emotion/react";
import { GET_POPULAR_SERIES } from "src/graphql/queries/popular";
import { API_URL } from "src/config";
import Footer from "src/components/Footer";
import NavBar from "src/components/NavBar";
import { Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
const Popular = () => {
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
        rating: series?.attributes?.Rating,
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
        <h2 css={styles.title}>All Popular Series</h2>
        <div css={styles.seriesContainer}>
          {info.map((seriesCard) => (
            <div key={seriesCard?.id}>
              <div css={styles.imageCard}>
                <img src={`${API_URL}${seriesCard?.poster}`} alt="trending" />
                <div>
                  <span css={styles.ratingIcon}>
                    <AiFillStar size={32} color="#fff" />
                  </span>
                  <p css={styles.viewRating}>{seriesCard?.rating} / 10</p>
                  <Link
                    to={`/${seriesCard.status}/details/seriesId=${seriesCard.id}/mode=view-details`}
                  >
                    <button css={styles.viewDetailBtn}>View Detail</button>
                  </Link>
                </div>
              </div>
              <p css={styles.seriesName}>{seriesCard?.title}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Popular;
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
    position: relative;
    width: 200px;
    height: 300px;
    border: 2px solid #fff;
    border-radius: 8px;
    margin-bottom: 1em;
    cursor: pointer;
    filter: drop-shadow(10px 8px 8px rgba(0, 0, 0, 0.4));
    &:before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0);
    }
    &:hover {
      &:before {
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
    &:hover button {
      opacity: 1;
    }

    &:hover {
      border: 2px solid #486af5;
      p,
      span {
        opacity: 1;
      }
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
  `,
  viewDetailBtn: css`
    border: 2px solid #fff;
    width: 65%;
    padding: 1em;
    color: #fff;
    font-weight: 500;
    font-size: 16px;
    border-radius: 8px;
    background: rgba(64, 66, 88, 0.77);
    position: absolute;
    top: 60%;
    left: 50%;

    transform: translate(-50%, -50%);
    opacity: 0;
  `,
  viewRating: css`
    position: absolute;
    color: #fff;
    font-size: 1.5rem;
    font-weight: 500;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
  `,
  ratingIcon: css`
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
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
