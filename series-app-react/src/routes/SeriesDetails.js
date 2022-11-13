/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { css } from "@emotion/react";
import {
  GET_SERIES_BY_ID,
  GET_SIMILAR_SERIES,
} from "../graphql/queries/seriesDetails";
import apolloClient from "src/lib/apolloClient";
import Footer from "src/components/Footer";
import NavBar from "src/components/NavBar";
import { API_URL } from "src/config";
import { AiFillStar, AiFillEye } from "react-icons/ai";
import { FaDownload } from "react-icons/fa";
import { Link } from "react-router-dom";
const SeriesDetails = () => {
  const { id, status } = useParams();
  const [similarSeries, setSimilarSeries] = useState([]);
  const [info, setInfo] = useState([]);
  const [readMore, setReadMore] = useState(false);
  const getSingleSeries = async () => {
    const {
      data: { seriesDetail },
    } = await apolloClient.query({
      fetchPolicy: "network-only",
      query: GET_SERIES_BY_ID,
      variables: {
        id: id,
      },
    });
    const seriesInfo = {
      id: seriesDetail?.data?.id,
      title: seriesDetail?.data?.attributes?.title,
      year: seriesDetail?.data?.attributes?.Year,
      genre: seriesDetail?.data?.attributes?.genre,
      rating: seriesDetail?.data?.attributes?.Rating,
      totalEp: seriesDetail?.data?.attributes?.totalEpisodes,
      plot: seriesDetail?.data?.attributes?.plotSummary,
      status: seriesDetail?.data?.attributes?.status,
      poster: seriesDetail?.data?.attributes?.posterUrl?.data?.attributes?.url,
      casts: seriesDetail?.data?.attributes?.casts?.data?.map((actor) => {
        return {
          id: actor?.id,
          castName: actor?.attributes?.castName,
        };
      }),
    };

    setInfo(seriesInfo);
  };

  const getSimilarSeries = async () => {
    const {
      data: { seriesDetails },
    } = await apolloClient.query({
      fetchPolicy: "network-only",
      query: GET_SIMILAR_SERIES,
      variables: {
        pageSize: 4,
        id: id,
        status: status,
      },
    });
    const seriesInfo = seriesDetails?.data?.map((series) => {
      return {
        id: series?.id,
        status: series?.attributes?.status,
        poster: series?.attributes?.posterUrl?.data?.attributes?.url,
      };
    });
    setSimilarSeries(seriesInfo);
  };
  useEffect(() => {
    getSingleSeries();
    getSimilarSeries();
  }, [id, status]);

  return (
    <div>
      <NavBar />

      <div css={styles.mainContainer}>
        <div css={styles.detailContainer}>
          <div css={styles.detailInfo}>
            <div className="d-flex flex-column">
              <div css={styles.imageCard}>
                <img src={`${API_URL}${info?.poster}`} alt="trending" />
              </div>
              <div className="mt-4">
                <button
                  css={styles.actionBtn}
                  className="mb-3 d-flex align-items-center gap-4"
                >
                  <FaDownload /> Download Now
                </button>
                <button
                  css={styles.actionBtn}
                  className="mb-3 d-flex align-items-center gap-4"
                >
                  <AiFillEye size={21} />
                  Watch Now
                </button>
              </div>
            </div>

            <div>
              <div>
                <h3 css={styles.title}>{info?.title}</h3>
                <p className="d-flex gap-3 mt-3">
                  <span>{info?.year}</span>
                  <span className="d-flex align-items-center gap-1">
                    <AiFillStar />
                    {info?.rating} / 10
                  </span>
                </p>
                <p>Romance / {info?.genre} / Fantasy</p>
                <p>
                  <b>{info?.totalEp}</b> Episodes
                </p>
              </div>
              <div className="mt-5">
                <h3 css={styles.title}>Casts</h3>
                <ul css={styles.castList}>
                  {info?.casts?.map((actor) => (
                    <li key={actor?.id}>{actor?.castName}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h4 css={styles.similarTitle}>Similar Series</h4>
            <div css={styles.similarSeries}>
              {similarSeries.map((series) => (
                <Link
                  key={series?.id}
                  to={`/${series.status}/details/seriesId=${series.id}/mode=view-details`}
                >
                  <div css={styles.similarImg}>
                    <img
                      src={`${API_URL}${series?.poster}`}
                      alt={series?.status}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h4 css={styles.plotSummary}>Plot Summary</h4>
          {readMore ? (
            <p className="mb-0">
              {info?.plot}
              <span
                css={styles.readMore}
                className="ms-2"
                onClick={() => {
                  setReadMore(false);
                }}
              >
                See Less
              </span>
            </p>
          ) : (
            <p className="mb-0">
              {info?.plot?.substring(0, 200)} ...{" "}
              <span
                css={styles.readMore}
                onClick={() => {
                  setReadMore(true);
                }}
              >
                Read More
              </span>
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SeriesDetails;
const styles = {
  mainContainer: css`
    width: 100%;
    height: auto;
    padding: 2em;
    padding-top: 3em;
    color: #fff;
    background-color: #404258;
  `,
  detailContainer: css`
    display: flex;
    justify-content: space-between;
    p,
    span {
      font-size: 1.2em;
    }
  `,
  detailInfo: css`
    display: flex;
    gap: 7em;
    width: 99%;
  `,
  imageCard: css`
    width: 300px;
    height: 450px;
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
  title: css`
    font-size: 1.8em;
    font-weight: 500;
  `,
  similarTitle: css`
    font-size: 1.5em;
    font-weight: 400;
    text-align: center;
    margin-left: 4.5em;
    margin-bottom: 1.5em;
  `,
  castList: css`
    margin-top: 1em;
    padding-left: 1.8em;
    li {
      line-height: 2em;
      font-weight: 500;
      font-size: 1.2em;
    }
  `,
  similarSeries: css`
    display: flex;
    gap: 2em;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: flex-end;
  `,
  similarImg: css`
    width: 120px;
    height: 180px;
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
    &:hover {
      border: 2px solid #486af5;
    }
  `,
  actionBtn: css`
    border: 1px solid #fff;
    outline: none;
    background-color: transparent;
    color: #fff;
    padding: 1em 2em;
    border-radius: 8px;
    width: 100%;
    font-size: 1.1em;
    font-weight: 500;
  `,
  plotSummary: css`
    font-size: 1.5em;
    font-weight: 400;
    margin-top: 1em;
    margin-bottom: 1em;
  `,
  readMore: css`
    font-size: 0.8em;
    font-weight: 700;
    cursor: pointer;
  `,
};
