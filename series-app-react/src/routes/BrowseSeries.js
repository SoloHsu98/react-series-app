/** @jsxImportSource @emotion/react */
import _ from "lodash";
import Footer from "src/components/Footer";
import NavBar from "src/components/NavBar";
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import apolloClient from "src/lib/apolloClient";
import { GET_ALL_SERIES } from "src/graphql/queries/seriesDetails";
import { API_URL } from "src/config";
import { Link } from "react-router-dom";
import Pagination from "src/components/Pagination";
import { AiFillStar } from "react-icons/ai";
const BrowseSeries = () => {
  const [allSeries, setAllSeries] = useState([]);
  const [query, setQuery] = useState({
    page: 1,
    sizePerPage: 10,
    keywords: "",
  });

  const [pageCount, setPageCount] = useState(0);
  const [filter, setFilter] = useState([]);
  const [filterItems, setFilterItems] = useState({
    genre: "",
    rating: "",
    year: "",
    orderBy: "",
  });
  const filterData = {
    genre: ["WuXia", "XianXia"],
    rating: ["1+", "2+", "3+", "4+", "5+", "6+", "7+", "8+", "9+"],
    year: [
      "2022",
      "2021",
      "2020",
      "2019",
      "2015 - 2018",
      "2010 - 2014",
      "2000 - 2009",
      "1997 - 1999",
    ],
    orderBy: ["Rating", "Year"],
  };

  const handleFilterChange = (e) => {
    setFilterItems({ ...filterItems, [e.target.name]: e.target.value });
  };
  const handleFilters = (e) => {
    //setFilter(filterItems);
    if (filterItems.genre == "All") {
      setFilterItems({ ...filterItems, genre: "" });
    } else if (filterItems.rating == "All") {
      setFilterItems({ ...filterItems, rating: "" });
    } else if (filterItems.year == "All") {
      setFilterItems({ ...filterItems, year: "" });
    } else if (filterItems.orderBy == "All") {
      setFilterItems({ ...filterItems, orderBy: "" });
    } else {
      setFilter(filterItems);
    }
    e.preventDefault();
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFilterItems({
      genre: "",
      rating: "",
      year: "",
      orderBy: "",
    });
    setFilter({
      genre: "",
      rating: "",
      year: "",
      orderBy: "",
    });
  };
  const handlePageChange = (page) => {
    setQuery({ ...query, page: page });
  };

  useEffect(() => {
    getAllSeries();
  }, [query, filter]);

  const getAllSeries = async () => {
    let filters = { and: [] };

    filters = {
      and: [
        {
          or: [
            { title: { containsi: query.keywords } },
            { casts: { castName: { containsi: query.keywords } } },
            { Rating: { containsi: parseFloat(query.keywords) } },
          ],
        },
      ],
    };

    if (filter?.genre?.length > 0) {
      filters.and = _.concat(filters.and, {
        genre: { eq: filter.genre },
      });
    }
    if (filter?.rating?.length > 0) {
      filters.and = _.concat(filters.and, {
        Rating: { gte: parseFloat(filter?.rating?.charAt(0)) },
      });
    }
    if (filter?.year?.length > 0) {
      filters.and = _.concat(filters.and, {
        Year: { in: filter?.year.split(" - ") },
      });
    }

    //console.log("filters", filters);
    const {
      data: { seriesDetails },
    } = await apolloClient.query({
      fetchPolicy: "network-only",
      query: GET_ALL_SERIES,
      variables: {
        page: query.page,
        pageSize: query.sizePerPage,
        filters: filters,
        data: filter?.orderBy?.length > 0 ? filter?.orderBy : null,
      },
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

    setPageCount(seriesDetails?.meta?.pagination?.pageCount);
    setAllSeries(seriesInfo);
  };
  const handleSearch = (e) => {
    setQuery({ ...query, keywords: e.target.value });
  };
  return (
    <div>
      <NavBar />
      <div css={styles.mainContainer}>
        <form>
          <div css={styles.searchContainer}>
            <div className="form-group">
              <label htmlFor="search" css={styles.label}>
                Search Term :
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by Series Title, Cast or Rating"
                name="search"
                css={styles.inputStyle}
                onChange={handleSearch}
              />
            </div>
            <div className="d-flex justify-content-between">
              <div
                className="input-group mb-3 d-flex flex-column"
                css={styles.filteBox}
              >
                <label>Genre :</label>
                <select
                  className="custom-select"
                  name="genre"
                  value={filterItems.genre}
                  onChange={handleFilterChange}
                >
                  <option>All</option>
                  {filterData.genre.map((data) => (
                    <option value={data}>{data}</option>
                  ))}
                </select>
              </div>
              <div
                className="input-group mb-3 d-flex flex-column"
                css={styles.filteBox}
              >
                <label>Rating :</label>
                <select
                  className="custom-select"
                  name="rating"
                  value={filterItems?.rating}
                  onChange={handleFilterChange}
                >
                  <option>All</option>
                  {filterData.rating.map((data) => (
                    <option value={data}>{data}</option>
                  ))}
                </select>
              </div>
              <div
                className="input-group mb-3 d-flex flex-column"
                css={styles.filteBox}
              >
                <label>Year :</label>
                <select
                  className="custom-select"
                  name="year"
                  value={filterItems?.year}
                  onChange={handleFilterChange}
                >
                  <option>All</option>
                  {filterData.year.map((data) => (
                    <option value={data}>{data}</option>
                  ))}
                </select>
              </div>
              <div
                className="input-group mb-3 d-flex flex-column"
                css={styles.filteBox}
              >
                <label>OrderBy :</label>
                <select
                  className="custom-select"
                  name="orderBy"
                  value={filterItems?.orderBy}
                  onChange={handleFilterChange}
                >
                  <option>All</option>
                  {filterData.orderBy.map((data) => (
                    <option value={data}>{data}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-center mt-4 gap-4">
              <button css={styles.searchBtn} onClick={handleReset}>
                Reset
              </button>
              <button css={styles.searchBtn} onClick={handleFilters}>
                Filter
              </button>
            </div>
          </div>
        </form>
        <div css={styles.pagination}>
          {allSeries.length > 0 && (
            <Pagination
              {...query}
              pageCount={pageCount}
              handlePageChange={handlePageChange}
            />
          )}
        </div>
        <div>
          <h3 className="text-center my-5">All Series</h3>
          <div css={styles.allSeriesContainer}>
            {allSeries.map((seriesCard) => (
              <div key={seriesCard.id}>
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
        <div css={styles.pagination}>
          {allSeries.length > 0 && (
            <Pagination
              {...query}
              pageCount={pageCount}
              handlePageChange={handlePageChange}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BrowseSeries;
const styles = {
  mainContainer: css`
    width: 100%;
    height: auto;
    padding: 2em;
    padding-top: 3em;
    color: #fff;
    background-color: #404258;
  `,
  pagination: css`
    margin-top: 3em;
    margin-bottom: 0.5em;
  `,
  searchBtn: css`
    border: none;
    padding: 1em 3em;
    border-radius: 12px;
    color: #fff;
    background: rgba(0, 0, 0, 0.28);
  `,

  searchContainer: css`
    .form-control {
      color: #fff;
      font-weight: 500;
      padding: 2em;
    }
    .custom-select {
      width: 100%;
      height: auto;
      padding: 1em;
      background: rgba(0, 0, 0, 0.28)
        url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 4 5'%3E%3Cpath fill='%23ffffff' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")
        no-repeat right 0.75rem center;
      border: none;
      color: #fff;
      &:focus,
      &:hover {
        border: none;
        outline: none;
        background: rgba(0, 0, 0, 0.28)
          url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 4 5'%3E%3Cpath fill='%23ffffff' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")
          no-repeat right 0.75rem center;
        box-shadow: none;
      }
    }
  `,
  allSeriesContainer: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 2em 4em;
  `,
  searchInput: css``,
  label: css`
    font-weight: 500;
  `,
  inputStyle: css`
    background: rgba(0, 0, 0, 0.28);
    border: none;

    &:focus,
    &:hover {
      border: none;
      outline: none;
      background: rgba(0, 0, 0, 0.28);
      box-shadow: none;
    }
  `,
  filteBox: css`
    width: 20%;
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
};
