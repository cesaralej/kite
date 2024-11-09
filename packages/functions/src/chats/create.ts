import * as uuid from "uuid";
import { Resource } from "sst";
import { Util } from "@kite/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  let data: {
    chatName?: string;
    isGroup?: string;
  } = {};

  if (event.body != null) {
    // Attempt to parse the body
    data = JSON.parse(event.body);
  }

  const params = {
    TableName: Resource.Chats.name,
    Item: {
      chatId: uuid.v1(), // A unique uuid

      // Group Chat Information
      chatName: data.chatName,
      isGroup: data.isGroup, // Initially false, changes to true when group chat is created

      // Messaging Information
      lastMessage: "Start chatting!",
      lastMessageTimestamp: new Date().toISOString(),
      unread: 0,

      // Metadata
      favorite: false,
      createdAt: new Date().toISOString(),
    },
  };

  console.log("Creating chat with data:", params.Item);

  await dynamoDb.send(new PutCommand(params));

  return JSON.stringify(params.Item);
});
