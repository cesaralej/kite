import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import { FaPaperclip, FaCalendarAlt, FaTasks } from "react-icons/fa";

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
}

const MessageInput = ({
  message,
  setMessage,
  handleSendMessage,
}: MessageInputProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openTaskDialog, setOpenTaskDialog] = useState<boolean>(false);
  const [openMeetingDialog, setOpenMeetingDialog] = useState<boolean>(false);
  const [taskDetails, setTaskDetails] = useState<{
    title: string;
    dueDate: string;
  }>({
    title: "",
    dueDate: "",
  });
  const [meetingDetails, setMeetingDetails] = useState<{
    title: string;
    date: string;
    time: string;
  }>({
    title: "",
    date: "",
    time: "",
  });

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSendTask = () => {
    // Handle sending the task to the chat and task management system
    setOpenTaskDialog(false);
    handleCloseMenu();
    // Clear task details after sending
    setTaskDetails({ title: "", dueDate: "" });
  };

  const handleSendMeeting = () => {
    // Handle sending the meeting invite to the chat and scheduling system
    setOpenMeetingDialog(false);
    handleCloseMenu();
    // Clear meeting details after sending
    setMeetingDetails({ title: "", date: "", time: "" });
  };

  return (
    <Box
      sx={{
        display: "flex",
        padding: 2,
        borderTop: "1px solid #ddd",
        position: "fixed",
        bottom: 56, // Adjust this value to be the height of your bottom navigation
        left: 0,
        right: 0,
        backgroundColor: "#fff", // Ensure it has a background color
        zIndex: 1000,
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your message..."
        value={message.trim()}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ marginRight: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleOpenMenu}>
                <FaPaperclip />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={() => setOpenTaskDialog(true)}>
                  <FaTasks style={{ marginRight: 8 }} />
                  Send Task
                </MenuItem>
                <MenuItem onClick={() => setOpenMeetingDialog(true)}>
                  <FaCalendarAlt style={{ marginRight: 8 }} />
                  Schedule Meeting
                </MenuItem>
                <MenuItem>
                  <FaPaperclip style={{ marginRight: 8 }} />
                  Attach File
                </MenuItem>
              </Menu>
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendMessage}
        disabled={!message.trim()} // Adjust as needed for tasks/meetings
      >
        Send
      </Button>

      {/* Task Dialog */}
      <Dialog open={openTaskDialog} onClose={() => setOpenTaskDialog(false)}>
        <DialogTitle>Send Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            variant="outlined"
            value={taskDetails.title}
            onChange={(e) =>
              setTaskDetails({ ...taskDetails, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            value={taskDetails.dueDate}
            onChange={(e) =>
              setTaskDetails({ ...taskDetails, dueDate: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTaskDialog(false)}>Cancel</Button>
          <Button onClick={handleSendTask} color="primary" variant="contained">
            Send Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Meeting Dialog */}
      <Dialog
        open={openMeetingDialog}
        onClose={() => setOpenMeetingDialog(false)}
      >
        <DialogTitle>Schedule Meeting</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Meeting Title"
            fullWidth
            variant="outlined"
            value={meetingDetails.title}
            onChange={(e) =>
              setMeetingDetails({ ...meetingDetails, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            value={meetingDetails.date}
            onChange={(e) =>
              setMeetingDetails({ ...meetingDetails, date: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Time"
            type="time"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            value={meetingDetails.time}
            onChange={(e) =>
              setMeetingDetails({ ...meetingDetails, time: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMeetingDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSendMeeting}
            color="primary"
            variant="contained"
          >
            Schedule Meeting
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MessageInput;
