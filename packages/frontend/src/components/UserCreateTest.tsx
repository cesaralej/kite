import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

// Function to create a user in Cognito and store additional data in DynamoDB
export async function createUserInCognitoAndDynamo(
  email: string,
  name: string,
  department: string,
  role: string
) {
  const cognito = new CognitoIdentityProviderClient({ region: "us-east-1" });
  const dynamoClient = new DynamoDBClient({ region: "us-east-1" });

  // Step 1: Create user in Cognito
  const createUserParams = {
    UserPoolId: "your_user_pool_id",
    Username: email,
    TemporaryPassword: "TemporaryPassword123!",
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "name", Value: name },
    ],
  };

  await cognito.send(new AdminCreateUserCommand(createUserParams));

  // Step 2: Store additional user info in DynamoDB
  const dynamoParams = {
    TableName: "YourUsersTable",
    Item: {
      email: { S: email },
      name: { S: name },
      department: { S: department },
      role: { S: role },
      createdAt: { S: new Date().toISOString() },
    },
  };

  await dynamoClient.send(new PutItemCommand(dynamoParams));
}
