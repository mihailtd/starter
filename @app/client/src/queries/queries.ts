import gql from "graphql-tag";

// Example Query:
export const USERS = gql`
  query User {
    user(id: "") {
      createdAt
      email
      id
      password
      updatedAt
      username
    }
  }
`;
