// useWebSocket.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { Auth } from "aws-amplify";
import config from "../config.ts";

interface WebSocketMessage {
  action: string;
  data: {
    message: string;
    userId: string;
    userConn: string;
  };
}

type ConnectionStatus =
  | "Not connected"
  | "Connected"
  | "Error"
  | "Disconnected";

export const useWebSocket = (reconnectInterval = 3000) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("Not connected");
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const updateConnectionStatus = useCallback((status: ConnectionStatus) => {
    setConnectionStatus(status);
  }, []);

  const connectWebSocket = useCallback(async () => {
    try {
      // Clear any existing reconnection attempts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      const credentials = await Auth.currentAuthenticatedUser();
      const name = credentials.attributes["name"];

      if (!name) {
        throw new Error("User identity not found");
      }

      // TODO: Replace the WebSocket URL with a dynamic one
      const websocket = new WebSocket(
        `${config.WebSocketAPI.URL}?identityId=${name}`
      );

      websocket.onopen = () => {
        updateConnectionStatus("Connected");
      };

      websocket.onerror = (error) => {
        updateConnectionStatus("Error");
        console.error("WebSocket error:", error);
      };

      websocket.onmessage = (event) => {
        //Im not using event.type anymore
        setMessages((prevMessages) => [...prevMessages, event.data]);
        //onMessageReceived(event.data, event.type);
      };

      websocket.onclose = () => {
        updateConnectionStatus("Disconnected");
        // Only attempt reconnection if the component is still mounted
        reconnectTimeoutRef.current = setTimeout(
          connectWebSocket,
          reconnectInterval
        );
      };

      setWs(websocket);
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
      updateConnectionStatus("Error");
      // Attempt to reconnect on connection error
      reconnectTimeoutRef.current = setTimeout(
        connectWebSocket,
        reconnectInterval
      );
    }
  }, []);

  const disconnectWebSocket = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (ws) {
      ws.close();
      setWs(null);
    }
  };

  const sendMessage = (
    action: string,
    message: string,
    userId: string,
    userConn: string
  ) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not connected, unable to send message");
      return false;
    }

    try {
      const msg: WebSocketMessage = {
        action,
        data: { message, userId, userConn },
      };
      ws.send(JSON.stringify(msg));
      return true;
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
      return false;
    }
  };

  useEffect(() => {
    connectWebSocket();

    // Clean up on component unmount or logout
    return () => {
      disconnectWebSocket();
    };
  }, []);

  return {
    connectWebSocket,
    disconnectWebSocket,
    sendMessage,
    connectionStatus,
    messages,
  };
};
