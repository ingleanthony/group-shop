import { gql } from "@apollo/client";

//======= General Actions =======//
export const REGISTER = gql`
  mutation register(
    $name: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      info: {
        screen_name: $name
        email: $email
        password: $password
        confirm_password: $confirmPassword
      }
    ) {
      id
      email
      screen_name
      lists {
        id
        list_name
        owned
        members {
          id
          screen_name
        }
      }
    }
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      screen_name
      lists {
        id
        list_name
        owned
        members {
          id
          screen_name
        }
      }
    }
  }
`;

export const CREATE_TEMP_USER = gql`
  mutation create_temp_user($name: String!) {
    create_temp_user(screen_name: $name) {
      id
      email
      screen_name
      lists {
        id
        list_name
        owned
        members {
          id
          screen_name
        }
      }
    }
  }
`;

export const GET_USER = gql`
  query get_user($userID: ID!) {
    get_user(userID: $userID) {
      id
      email
      password
      screen_name
      lists {
        id
        list_name
        owned
        members {
          id
          screen_name
        }
      }
      join_date
    }
  }
`;

export const GET_USER_LISTS = gql`
  query get_user_lists($userID: ID!) {
    get_user_lists(userID: $userID) {
      id
      list_name
      owned
      members {
        id
        screen_name
      }
    }
  }
`;

export const JOIN_LIST = gql`
  mutation join_list($code: String!, $userID: ID!) {
    join_list(code: $code, userID: $userID) {
      id
      owner
      list_name
      code
      members {
        id
        screen_name
      }
      created
      last_modified
    }
  }
`;

export const CREATE_LIST = gql`
  mutation create_list($listName: String!, $userID: ID!) {
    create_list(list_name: $listName, userID: $userID) {
      id
      owner
      list_name
      code
      members {
        id
        screen_name
      }
      created
      last_modified
    }
  }
`;

//======= List Actions =======//

export const GET_LIST = gql`
  query get_list($listID: ID!) {
    get_list(listID: $listID) {
      id
      owner
      list_name
      code
      members {
        id
        screen_name
      }
      items {
        id
        name
        member
        purchased
      }
    }
  }
`;

export const ADD_ITEM = gql`
  mutation add_item($name: String!, $listID: ID!, $userID: ID!) {
    add_item(name: $name, listID: $listID, userID: $userID) {
      id
      name
      member
      purchased
    }
  }
`;

export const PURCHASE_ITEM = gql`
  mutation purchase_item(
    $listID: ID!
    $itemID: ID!
    $userID: ID!
    $method: String!
  ) {
    purchase_item(
      listID: $listID
      itemID: $itemID
      userID: $userID
      method: $method
    ) {
      id
      name
      member
      purchased
    }
  }
`;

export const REMOVE_ITEM = gql`
  mutation remove_item($listID: ID!, $itemID: ID!, $userID: ID!) {
    remove_item(listID: $listID, itemID: $itemID, userID: $userID) {
      id
      name
      member
      purchased
    }
  }
`;

export const CLAIM_ITEM = gql`
  mutation claim_item(
    $listID: ID!
    $itemID: ID!
    $userID: ID!
    $method: String!
  ) {
    claim_item(
      listID: $listID
      itemID: $itemID
      userID: $userID
      method: $method
    ) {
      id
      name
      member
      purchased
    }
  }
`;

export const ITEM_UPDATES = gql`
  subscription item_updates($code: String!) {
    item_updates(code: $code) {
      type
      affector
      item {
        id
        name
        member
        purchased
      }
    }
  }
`;
