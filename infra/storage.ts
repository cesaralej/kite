// Create an S3 bucket
export const bucket = new sst.aws.Bucket("Uploads");

// Create the DynamoDB table for Messages
export const messagesTable = new sst.aws.Dynamo("Messages", {
  fields: {
    userId: "string",
    messageId: "string",
  },
  primaryIndex: { hashKey: "userId", rangeKey: "messageId" },
});

// TODO Global secondary index for connections instead of a separate table
export const usersTable = new sst.aws.Dynamo("Users", {
  fields: {
    userId: "string",
  },
  primaryIndex: { hashKey: "userId" },
});

export const conversationsTable = new sst.aws.Dynamo("Conversations", {
  fields: {
    conversationId: "string",
    userId: "string",
  },
  primaryIndex: { hashKey: "conversationId", rangeKey: "userId" },
});

export const connectionsTable = new sst.aws.Dynamo("Connections", {
  fields: {
    connectionId: "string",
  },
  primaryIndex: { hashKey: "connectionId" },
});

export const chatsTable = new sst.aws.Dynamo("Chats", {
  fields: {
    chatId: "string",
  },
  primaryIndex: { hashKey: "chatId" },
});

export const chatMembersTable = new sst.aws.Dynamo("ChatMembers", {
  fields: {
    chatId: "string",
    userId: "string",
  },
  primaryIndex: { hashKey: "chatId", rangeKey: "userId" },
});
