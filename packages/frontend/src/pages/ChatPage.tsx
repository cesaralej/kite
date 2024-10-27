import React from "react";
import { useLoaderData } from "react-router-dom";
import { LoaderFunctionArgs } from "react-router-dom";
import ChatHeader from "../components/Chats/ChatHeader";
import MessageList from "../components/Chats/MessageList";
//import MessageInput from "../components/Chats/MessageInput";
import mock from "../chats.json";
import { Chat } from "../types";

type ChatParams = {
  chatId: string;
};

const ChatPage: React.FC = () => {
  const chat = useLoaderData() as Chat | null;

  if (!chat) {
    return <p>Error: Chat data not found.</p>;
  }

  return (
    <>
      <ChatHeader person={chat.person} />
      <MessageList messages={chat.messages} />
      {/* <MessageInput /> */}
    </>
  );
};

const chatLoader = async ({
  params,
}: LoaderFunctionArgs<ChatParams>): Promise<Chat | null> => {
  try {
    const chatIdString = params.chatId;

    // Check if chatId is defined
    if (!chatIdString) {
      console.error("Chat ID is undefined");
      return null;
    }

    const chatId = parseInt(chatIdString, 10);
    const chat = mock.mock.find((chat) => chat.id === chatId);

    if (!chat) {
      throw new Error("Chat not found");
    }

    return chat;
  } catch (error) {
    console.error("Error loading chat: ", error);
    return null;
  }
};

export { ChatPage as default, chatLoader };
