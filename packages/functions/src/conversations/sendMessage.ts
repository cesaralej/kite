import { Resource } from "sst";
import * as uuid from "uuid";
import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  PutCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

//TODO this is not using the handler
export const main: APIGatewayProxyHandler = async (event) => {
  // Parse the incoming WebSocket message
  const body = JSON.parse(event.body || "{}");
  //console.log("Body:", body.data);
  const data = JSON.parse(body.data.message);
  //console.log("Parsed data:", data);

  // How do I deal with multiple connection IDs for status updates? I think it does not matter to leave the toUserId null
  const messageContent = data.content;
  const toUserId = data.toUserId;
  const toConnectionId = data.toConnectionId;
  const userId = data.userId;
  const connectionId = event.requestContext.connectionId;

  if (!messageContent) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Message content is required" }),
    };
  }

  try {
    // Parameters for DynamoDB PutCommand
    const putParams = {
      TableName: Resource.Messages.name, // Table linked to the "Messages" resource
      Item: {
        messageId: uuid.v1(), // Use a unique ID (timestamp in this case)
        userId: userId, // From the incoming request
        connectionId: connectionId, // From the incoming request
        toUserId: toUserId, // The recipient's user ID
        toConnectionId: toConnectionId, // The recipient's connection ID
        content: messageContent, // The actual message content from WebSocket
        createdAt: Date.now(), // Current Unix timestamp
      },
    };

    // Store the message in DynamoDB
    await dynamoDb.send(new PutCommand(putParams));

    const apigwManagementApi = new ApiGatewayManagementApiClient({
      apiVersion: "2018-11-29",
      endpoint:
        "https://" +
        event.requestContext.domainName +
        "/" +
        event.requestContext.stage,
    });

    const postParams = {
      ConnectionId: toConnectionId,
      Data: JSON.stringify(putParams.Item),
    };

    await apigwManagementApi.send(new PostToConnectionCommand(postParams));
    //console.log("Message sent:", messageContent);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "Message stored successfully" }),
    };
  } catch (error) {
    console.error("Error storing message:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to store message" }),
    };
  }
};
