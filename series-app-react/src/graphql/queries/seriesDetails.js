import { gql } from "@apollo/client";

export const GET_SERIES_DETAILS = gql`
  query getSeriesDetail {
    seriesDetails {
      data {
        id
        attributes {
          title
          genre
          casts {
            data {
              id
              attributes {
                castName
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SERIES_BY_ID = gql`
  query getSeriesDetailById($id: ID!) {
    seriesDetail(id: $id) {
      data {
        id
        attributes {
          title
          Rating
          Year
          genre
          status
          totalEpisodes
          posterUrl {
            data {
              id
              attributes {
                name
                url
              }
            }
          }
          plotSummary
          casts {
            data {
              id
              attributes {
                castName
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SIMILAR_SERIES = gql`
  query getSimilarSeries($pageSize: Int, $status: String!, $id: ID) {
    seriesDetails(
      filters: { status: { eq: $status }, id: { ne: $id } }
      pagination: { pageSize: $pageSize }
    ) {
      data {
        id
        attributes {
          status
          plotSummary
          genre
          posterUrl {
            data {
              id
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_SERIES = gql`
  query getAllSeries(
    $pageSize: Int
    $page: Int
    $filters: SeriesDetailFiltersInput
    $data: [String]
  ) {
    seriesDetails(
      pagination: { pageSize: $pageSize, page: $page }
      filters: $filters
      sort: $data
    ) {
      data {
        id
        attributes {
          title
          status
          Rating
          genre
          posterUrl {
            data {
              id
              attributes {
                name
                url
              }
            }
          }
        }
      }
      meta {
        pagination {
          total
          pageCount
          page
        }
      }
    }
  }
`;

export const GET_SERIES_BY_TITLE = gql`
  query getSeriesDetailById($id: ID!) {
    seriesDetail(id: $id) {
      data {
        id
        attributes {
          title
          Rating
          Year
          genre
          status
          totalEpisodes
          posterUrl {
            data {
              id
              attributes {
                name
                url
              }
            }
          }
          plotSummary
          casts {
            data {
              id
              attributes {
                castName
              }
            }
          }
        }
      }
    }
  }
`;
