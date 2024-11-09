import { Resource } from "sst";
import { Util } from "@kite/core/util";
import { DynamoDBClient, ReturnValue } from "@aws-sdk/client-dynamodb";
import {
  UpdateCommand,
  DeleteCommand,
  GetCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  // Log the disconnect event
  // console.log("Disconnect event", event);

  const connectionId = event.requestContext.connectionId;
  console.log(`Disonnecting: ${connectionId}`);

  // Retrieve the userId associated with the connectionId
  const params = {
    TableName: Resource.Connections.name,
    Key: {
      connectionId: connectionId, // Assuming you are using connectionId as the key
    },
  };

  let userId;

  const result = await dynamoDb.send(new GetCommand(params));
  if (!result.Item) {
    console.error(`No entry found for connectionId: ${connectionId}`);
  }
  if (result.Item) {
    userId = result.Item.userId;
  } else {
    console.error(`No entry found for connectionId: ${connectionId}`);
  }

  //console.log(`Disconnecting user: ${userId}`);

  const updateParams = {
    TableName: Resource.Users.name,
    Key: {
      userId: userId,
    },
    UpdateExpression:
      "SET onlineStatus = :onlineStatus, webSocketConnectionId = :webSocketConnectionId, lastSeen = :lastSeen",
    ExpressionAttributeValues: {
      ":onlineStatus": false, // Set onlineStatus to false
      ":webSocketConnectionId": "", // Clear the WebSocket connection ID
      ":lastSeen": Date.now(), // Update the lastSeen timestamp
    },
    ReturnValues: ReturnValue.UPDATED_NEW, // Optionally return the updated values
  };

  await dynamoDb.send(new UpdateCommand(updateParams));
  //console.log(`Connection offline for user: ${userId}`);

  const deleteParams = {
    TableName: Resource.Connections.name,
    Key: {
      connectionId: connectionId,
    },
  };
  await dynamoDb.send(new DeleteCommand(deleteParams));
  //console.log(`Deleted connection entry for connectionId: ${connectionId}`);

  return JSON.stringify(updateParams.ExpressionAttributeValues);
});
