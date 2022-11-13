import { gql } from "@apollo/client";
export const GET_TRENDING_SERIES = gql`
  query getTrendingSeries($pageSize: Int) {
    seriesDetails(
      pagination: { pageSize: $pageSize }
      filters: { status: { eq: "trending" } }
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
