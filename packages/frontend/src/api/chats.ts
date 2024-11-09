import { API } from "aws-amplify";

export const loadChats = async () => {
  console.log("Fetching chats");
  return API.get("chats", "/chats", {});
};

export const startOrGetChat = async (targetUserId: string) => {
  console.log("Starting or getting chat: ", targetUserId);
  /* return API.post("chats", "/chats", {
    body: options,
  }); */
};
