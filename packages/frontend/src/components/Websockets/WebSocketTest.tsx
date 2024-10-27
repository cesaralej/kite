import { useState, useEffect, useCallback } from "react";
import { Auth } from "aws-amplify";
import { loadUsers } from "../../api/users";
import { fetchMessages } from "../../api/messages";
import { useWebSocket } from "../../hooks/useWebSocket";
import { User } from "../../types/User";
import { Message } from "../../types/Message";
import WebSocketControls from "./WebSocketControls";
import UserList from "./UserList";
import MessageInput from "../Chats/MessageInput";
import MessageList from "./MessageList";
import { Button } from "@mui/material";

const filterMessages = (
  receivedMessages: Message[],
  userId: string,
  currentUserName: string | null
) => {
  return receivedMessages.filter(
    (msg) =>
      (msg.userId === userId && msg.toUserId === currentUserName) || // Messages from selected user to current user
      (msg.toUserId === userId && msg.userId === currentUserName) // Messages from current user to selected user
  );
};

const WebSocketTest = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserConn, setSelectedUserConn] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [showWebSocketControls, setShowWebSocketControls] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);

  const onMessageReceived = (message: string, type: string) => {
    console.log("Received message");
    //console.log("Received message:", typeof message);
    const data = JSON.parse(message);
    //console.log("Parsed data:", data);
    const receivedMessage: Message = {
      userId: data.userId,
      toUserId: data.toUserId,
      content: data.content,
      createdAt: data.createdAt,
      messageId: data.messageId,
      connectionId: "",
      toConnectionId: "",
    };

    setReceivedMessages((prevMessages) => [...prevMessages, receivedMessage]);
    if (type === "userConnected" || type === "userDisconnected") {
      loadUsers().then(setUsers);
    }
  };

  const onConnectionStatusChange = useCallback((status: string) => {
    if (status === "Connected" || status === "Disconnected") {
      loadUsers().then(setUsers);
    }
    console.log("Connection status changed:", status);
    //send a websocket message to all users to update their user list
    const allConnections = users.map((user) => user.webSocketConnectionId);
    console.log("All connections:", allConnections);
    //sendMessage("updateUsers", "", "", allConnections);
  }, []);

  const {
    connectWebSocket,
    disconnectWebSocket,
    sendMessage,
    connectionStatus,
    messages,
  } = useWebSocket();

  useEffect(() => {
    onConnectionStatusChange(connectionStatus);
  }, [connectionStatus, onConnectionStatusChange]);

  useEffect(() => {
    if (messages.length > 0) {
      const message = messages[messages.length - 1];
      onMessageReceived(message, "message");
    }
  }, [messages]);

  const loadInitialData = async () => {
    setIsLoading(true);
    const [messages, users] = await Promise.all([fetchMessages(), loadUsers()]);
    const sortedMessages = [...messages].sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    setReceivedMessages(sortedMessages);
    setUsers(users);
    setIsLoading(false);
    try {
      const user = await Auth.currentAuthenticatedUser();
      const userName = user.attributes["name"];
      setName(userName);
    } catch (error) {
      console.error("Error fetching user attributes:", error);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      setFilteredMessages(
        filterMessages(receivedMessages, selectedUserId, name)
      );
    }
  }, [receivedMessages, selectedUserId, name]);

  const handleSelect = (userId: string, userConn: string) => {
    setSelectedUserId(userId);
    setSelectedUserConn(userConn);
    setIsChatActive(true);
  };

  const handleSendMessage = () => {
    if (
      !selectedUserId ||
      !selectedUserConn ||
      !customMessage.trim() ||
      !name
    ) {
      console.error("Missing required fields for sending message");
      return;
    }

    console.log("userID:", name);
    console.log("toUserID:", selectedUserId);

    const sentMessage: Message = {
      content: customMessage.trim(),
      userId: name,
      toUserId: selectedUserId,
      createdAt: new Date().toISOString(),
      messageId: "",
      connectionId: "",
      toConnectionId: selectedUserConn,
    };

    const sentMessageString = JSON.stringify(sentMessage);

    try {
      sendMessage(
        "sendMessage",
        sentMessageString,
        selectedUserId,
        selectedUserConn
      );
      setReceivedMessages((prevMessages) => [...prevMessages, sentMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setCustomMessage("");
    }
  };

  const handleRefreshUsers = async () => {
    //console.log("Handle refresh users");
    setIsLoading(true); // Show loading spinner while fetching
    const updatedUsers = await loadUsers();
    const updatedMessages = await fetchMessages();
    setReceivedMessages(updatedMessages);
    setUsers(updatedUsers);
    setIsLoading(false); // Hide loading spinner after fetching
  };

  const handleBackToUserList = () => {
    setIsChatActive(false);
    setSelectedUserId(null);
    setSelectedUserConn(null);
  };

  const toggleWebSocketControls = () => {
    setShowWebSocketControls((prev) => !prev); // Toggle visibility
  };

  return (
    <>
      {isChatActive ? (
        <>
          <Button
            onClick={handleBackToUserList}
            variant="outlined"
            style={{ marginBottom: "1rem" }}
          >
            Back to User List
          </Button>

          <MessageList
            receivedMessages={filteredMessages}
            currentUser={name || ""}
          />
          <MessageInput
            message={customMessage}
            setMessage={setCustomMessage}
            handleSendMessage={handleSendMessage}
          />
        </>
      ) : (
        <>
          <Button onClick={toggleWebSocketControls} variant="outlined">
            {showWebSocketControls
              ? "Hide WebSocket Controls"
              : "Show WebSocket Controls"}
          </Button>

          {showWebSocketControls && (
            <WebSocketControls
              connectionStatus={connectionStatus}
              connectWebSocket={connectWebSocket}
              disconnectWebSocket={disconnectWebSocket}
              handleRefreshUsers={handleRefreshUsers}
              isLoading={isLoading}
            />
          )}
          <UserList
            users={users}
            selectedUserId={selectedUserId}
            handleSelect={handleSelect}
            isLoading={isLoading}
          />
        </>
      )}
    </>
  );
};

export default WebSocketTest;
