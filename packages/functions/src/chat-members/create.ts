import * as uuid from "uuid";
import { Resource } from "sst";
import { Util } from "@kite/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  let data: {
    chatId?: string;
    userId?: string;
  } = {};

  if (event.body != null) {
    // Attempt to parse the body
    data = JSON.parse(event.body);
  }

  const params = {
    TableName: Resource.ChatMembers.name,
    Item: {
      chatId: data.chatId,
      userId: data.userId,
      joinedAt: new Date().toISOString(),
    },
  };

  console.log("Creating member with data:", params.Item.userId);

  await dynamoDb.send(new PutCommand(params));

  return JSON.stringify(params.Item);
});
