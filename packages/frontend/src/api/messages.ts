import { API } from "aws-amplify";

export const fetchMessages = async () => {
  console.log("Fetching messages");
  return API.get("connections", "/messages", {});
};
