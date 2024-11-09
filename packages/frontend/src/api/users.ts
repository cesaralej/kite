import { API } from "aws-amplify";

export const loadUsers = async () => {
  console.log("Fetching users");
  return API.get("connections", "/connections", {});
};
