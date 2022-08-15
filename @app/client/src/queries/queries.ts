import gql from "graphql-tag";

// Example Query:
export const USERS = gql`
  query User($id: UUID!) {
    user(id: $id) {
      createdAt
      email
      id
      updatedAt
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      clientMutationId
    }
  }
`;
