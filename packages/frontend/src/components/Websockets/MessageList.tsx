import { Message } from "../../types/Message";
import { useEffect, useRef } from "react";
import { Box, List, ListItem } from "@mui/material";
import MessageCard from "./MessageCard";

interface MessageListProps {
  receivedMessages: Message[];
  currentUser: string;
}

const MessageList = ({ receivedMessages, currentUser }: MessageListProps) => {
  function ScrollToBottom() {
    const elementRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (elementRef.current) {
        elementRef.current.scrollIntoView();
      }
    });
    return <div ref={elementRef} />;
  }

  return (
    <Box
      style={{
        marginTop: "20px",
        padding: "10px",
        border: "1px solid #ccc",
        height: "400px",
        overflowY: "auto",
      }}
    >
      {receivedMessages.length > 0 ? (
        receivedMessages.map((msg, index) => (
          <List sx={{ paddingBottom: 2 }}>
            <ListItem
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  msg.userId == currentUser ? "flex-end" : "flex-start",
                padding: 0,
                marginBottom: 1.5,
              }}
            >
              <MessageCard
                sender={msg.userId}
                content={msg.content}
                timestamp={msg.createdAt}
                fromCurrentUser={msg.userId == currentUser}
                isRead={true} // Assuming all messages are read for this example
              />
            </ListItem>
          </List>
        ))
      ) : (
        <p>No messages received yet.</p>
      )}
      <ScrollToBottom />
    </Box>
  );
};

export default MessageList;
