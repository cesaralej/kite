import {
  usersTable,
  messagesTable,
  chatsTable,
  chatMembersTable,
} from "./storage";

// Create the API
export const api = new sst.aws.ApiGatewayV2("Api", {
  transform: {
    route: {
      handler: {
        link: [usersTable, messagesTable, chatsTable, chatMembersTable],
      },
      args: {
        auth: { iam: true },
      },
    },
  },
});

api.route(
  "POST /connections",
  "packages/functions/src/connections/create.main"
);
api.route("GET /connections", "packages/functions/src/connections/list.main");
api.route("GET /messages", "packages/functions/src/messages/list.main");
api.route("POST /messages", "packages/functions/src/messages/create.main");
api.route("GET /chats", "packages/functions/src/chats/list.main");
api.route("POST /chats", "packages/functions/src/chats/create.main");
api.route("GET /chat-members", "packages/functions/src/chat-members/list.main");
api.route(
  "POST /chat-members",
  "packages/functions/src/chat-members/create.main"
);
