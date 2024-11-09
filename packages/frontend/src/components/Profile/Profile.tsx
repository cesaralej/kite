import { User } from "../../types";
import { Box, Typography, Divider, Button } from "@mui/material";
import { FaPhoneAlt, FaEnvelope, FaVideo, FaLinkedin } from "react-icons/fa";
import { HiUserCircle } from "react-icons/hi";

interface ProfileProps {
  user: User;
  onChat: () => void;
  onRequestMeeting: () => void;
  onAssignTask: () => void;
  onViewLinkedProfiles: () => void;
  onShareProfile: () => void;
  onSendFeedback: () => void;
}
const Profile: React.FC<ProfileProps> = ({
  user,
  onChat,
  onRequestMeeting,
  onAssignTask,
  onViewLinkedProfiles,
  onShareProfile,
  onSendFeedback,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        backgroundColor: "#f4f4f4",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.history.back()} // Navigate back to the previous page
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      {/* Profile Picture */}
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid #ccc",
          mb: 2,
        }}
      >
        <img
          src={user.profilePicture}
          alt="Profile"
          style={{ width: "100%", height: "100%" }}
        />
      </Box>

      {/* Basic Information */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        {user.name}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        <FaEnvelope style={{ marginRight: 4 }} />
        {user.email}
      </Typography>

      {/* Job Details */}
      <Divider sx={{ my: 2, width: "100%" }} />
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        <strong>Job Title:</strong> {user.jobTitle}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        <strong>Department:</strong> {user.department}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        <strong>Location:</strong> {user.location}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        <strong>Years at Company:</strong> {user.yearsAtCompany}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        <strong>Manager:</strong> {user.manager.name} -{" "}
        <a href={`mailto:${user.manager.email}`}>{user.manager.email}</a>
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        <strong>Status:</strong> {user.status}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        <strong>Working Hours:</strong> {user.workingHours}
      </Typography>

      {/* Interests and Hobbies */}
      {user.interests && (
        <>
          <Divider sx={{ my: 2, width: "100%" }} />
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            <strong>Interests:</strong> {user.interests.join(", ")}
          </Typography>
        </>
      )}

      {/* Actions */}
      <Divider sx={{ my: 2, width: "100%" }} />
      <Box sx={{ width: "100%" }}>
        <Button
          fullWidth
          variant="outlined"
          sx={{ mb: 1 }}
          onClick={onChat}
          startIcon={<FaPhoneAlt />}
        >
          Start Chat
        </Button>
        <Button
          fullWidth
          variant="outlined"
          sx={{ mb: 1 }}
          onClick={onRequestMeeting}
          startIcon={<FaVideo />}
        >
          Request Meeting
        </Button>
        <Button
          fullWidth
          variant="outlined"
          sx={{ mb: 1 }}
          onClick={onAssignTask}
          startIcon={<HiUserCircle />}
        >
          Send Follow-Up Task
        </Button>
        <Button
          fullWidth
          variant="outlined"
          sx={{ mb: 1 }}
          onClick={onViewLinkedProfiles}
          startIcon={<FaLinkedin />}
        >
          View Linked Profiles
        </Button>
        <Button
          fullWidth
          variant="outlined"
          sx={{ mb: 1 }}
          onClick={onShareProfile}
        >
          Share Profile
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={onSendFeedback}
          startIcon={<FaLinkedin />}
        >
          Send Feedback
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
