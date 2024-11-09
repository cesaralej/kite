import { Resource } from "sst";
import { Util } from "@kite/core/util";
import { DynamoDBClient, ReturnValue } from "@aws-sdk/client-dynamodb";
import {
  UpdateCommand,
  PutCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const userId = event.queryStringParameters?.identityId;
  const connectionId = event.requestContext.connectionId;

  console.log(`Connecting: ${userId} - ${connectionId}`);

  const params = {
    TableName: Resource.Users.name, // Table name
    Key: { userId }, // Partition key is the userId
    UpdateExpression: `SET 
      onlineStatus = :onlineStatus, 
      webSocketConnectionId = :webSocketConnectionId, 
      lastSeen = :lastSeen`,
    ExpressionAttributeValues: {
      ":onlineStatus": true, // Set onlineStatus to true (user is online)
      ":webSocketConnectionId": connectionId, // Update WebSocket connection ID
      ":lastSeen": Date.now(), // Update lastSeen with the current timestamp
    },
    ReturnValues: ReturnValue.UPDATED_NEW, // Return only the updated attributes
  };

  const params2 = {
    TableName: Resource.Connections.name, // Table name
    Item: {
      connectionId,
      userId,
    },
  };

  await dynamoDb.send(new UpdateCommand(params));
  /* console.log(
    "Updated User:",
    params.Key.userId,
    params.ExpressionAttributeValues[":webSocketConnectionId"]
  ); */
  await dynamoDb.send(new PutCommand(params2));
  /* console.log(
    "Put Connection:",
    params2.Item.userId,
    params2.Item.connectionId
  ); */

  return JSON.stringify(params.ExpressionAttributeValues);
});
