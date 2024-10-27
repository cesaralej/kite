import { Box, Typography } from "@mui/material";
import WebSocketTest from "../components/Websockets/WebSocketTest";

const ChatsPage: React.FC = () => {
  return (
    <Box sx={{ position: "relative", paddingBottom: "80px" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Chats
      </Typography>
      <WebSocketTest />
    </Box>
  );
};

export default ChatsPage;
