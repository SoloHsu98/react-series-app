/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import apolloClient from "src/lib/apolloClient";
import { GET_ALL_SERIES } from "src/graphql/queries/seriesDetails";
import { useNavigate } from "react-router-dom";
const NavBar = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [info, setInfo] = useState([]);
  const handleSearch = (e) => {
    e.preventDefault();
    getAllSeries();
  };

  useEffect(() => {
    if (!!info[0]?.id && !!info[0]?.status) {
      console.log("push", info);
      navigate(
        `/${info[0]?.status}/details/seriesId=${info[0]?.id}/mode=view-details`
      );
    }
  }, [info]);

  const getAllSeries = async () => {
    let filters = { title: { containsi: keyword } };

    //console.log("filters", filters);
    const {
      data: { seriesDetails },
    } = await apolloClient.query({
      fetchPolicy: "network-only",
      query: GET_ALL_SERIES,
      variables: {
        filters: filters,
      },
    });

    const seriesInfo = seriesDetails?.data?.map((series) => {
      return {
        id: series?.id,
        title: series?.attributes?.title,
        status: series?.attributes?.status,
      };
    });
    console.log("info", seriesInfo);
    setInfo(seriesInfo);
  };

  return (
    <div css={styles.navContainer}>
      <div className="d-flex justify-content-between align-items-center">
        <h1 css={styles.header}>WuXia Series</h1>
        <div css={styles.navItems}>
          <div css={styles.searchContainer}>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                css={styles.searchInput}
                placeholder="Quick Search"
                onChange={(e) => setKeyword(e.target.value)}
              />
              <AiOutlineSearch css={styles.searchIcon} />
            </form>
          </div>
          <div css={styles.navLinks}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/trending">Trending</Link>
            </li>
            <li>
              <Link to="/popular">Popular</Link>
            </li>
            <li>
              <Link to="/ongoing">Ongoing</Link>
            </li>
            <li>
              <Link to="/browse-series">Browse Series</Link>
            </li>
          </div>
        </div>
        <button css={styles.signInBtn}>Sign In</button>
      </div>
    </div>
  );
};

export default NavBar;
const styles = {
  navContainer: css`
    width: 100%;
    padding: 1em 2em;
    background-color: #474e68;
    color: #fff;
  `,
  header: css`
    font-size: 1.25em;
  `,
  navItems: css`
    display: flex;
    gap: 3em;
  `,
  searchContainer: css`
    position: relative;
  `,
  searchInput: css`
    padding: 0.3em 1em;
    border: none;
    border-radius: 22px;
    color: #474e68;
    font-weight: 500;
    &:focus {
      outline: none;
      border: 1px solid #fff;
    }
  `,
  searchIcon: css`
    position: absolute;
    right: 18px;
    top: 8px;
    color: #474e68;
  `,
  navLinks: css`
    display: flex;
    list-style: none;
    gap: 3em;
    font-weight: 500;

    li {
      cursor: pointer;
      border-bottom: 1px solid transparent;
      transition: all 0.3s ease 0s;

      &:hover {
        transform: translateY(-3px);
      }
      a {
        color: #fff;
        text-decoration: none;
        &:hover {
          text-decoration: none;
          border-bottom: 1px solid white;
          box-shadow: 0 4px 8px -8px #fff;
        }
      }
    }
  `,
  signInBtn: css`
    align-self: flex-start;
    padding: 0.3em 2em;
    border: 1px solid #fff;
    background-color: transparent;
    color: #fff;
    border-radius: 25px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease 0s;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.3);
    &:hover {
      transform: translateY(-3px);
    }
    &:focus {
      outline: none;
    }
  `,
};
