import { gql } from "@apollo/client";
export const GET_POPULAR_SERIES = gql`
  query getPopularSeries($pageSize: Int) {
    seriesDetails(
      pagination: { pageSize: $pageSize }
      filters: { status: { eq: "popular" } }
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
      meta {
        pagination {
          total
        }
      }
    }
  }
`;
