import React from "react";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaCheck } from "react-icons/fa";

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

// Define the props interface
interface MessageCardProps {
  sender: string;
  content: string;
  timestamp: string;
  isRead?: boolean;
  fromCurrentUser?: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({
  sender,
  content,
  timestamp,
  isRead = false,
  fromCurrentUser = false,
}) => {
  const isSenderYou = sender === "You";
  const formattedTimestamp = dayjs(timestamp).fromNow();

  return (
    <Box
      sx={{
        maxWidth: "70%",
        padding: "8px 12px",
        borderRadius: 3,
        backgroundColor: fromCurrentUser ? "#DCF8C6" : "#E5E5EA",
        color: "black",
        wordWrap: "break-word",
        boxShadow: 1,
      }}
    >
      <Typography variant="body1">{content}</Typography>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          textAlign: isSenderYou ? "right" : "left",
          marginTop: 0.5,
          color: "#999",
        }}
      >
        {formattedTimestamp}
        {isRead && (
          <FaCheck style={{ fontSize: "12px", marginLeft: "0.5em" }} />
        )}
      </Typography>
    </Box>
  );
};

export default MessageCard;
