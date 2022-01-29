import gql from "graphql-tag";

// Example Query:
export const USERS = gql`
  query User($id: UUID!) {
    user(id: $id) {
      createdAt
      email
      id
      password
      updatedAt
      username
    }
  }
`;
