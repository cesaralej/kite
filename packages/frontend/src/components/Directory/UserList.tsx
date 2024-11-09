import { User } from "../../types/User";
import {
  Box,
  List,
  ListItem,
  Avatar,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface UserListProps {
  users: User[];
}

const UserList = ({ users }: UserListProps) => {
  const navigate = useNavigate();

  // Navigate to employee profile
  const handleEmployeeClick = (idString: string) => {
    navigate(`/directory/${idString}`);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <List>
        {users.map((user) => (
          <div key={user.userId}>
            <ListItem
              button
              onClick={() => handleEmployeeClick(user.userId)}
              sx={{
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  transition: "background-color 0.3s ease",
                },
              }}
            >
              <Avatar
                src={user.profilePicture}
                alt={user.name}
                sx={{ marginRight: 2 }}
              >
                {user.name.charAt(0)}
              </Avatar>
              <ListItemText
                primary={user.name}
                secondary={`${user.role} - ${user.department}`}
              />
              <Chip
                label={
                  user.onlineStatus === "online"
                    ? "Online"
                    : user.onlineStatus === "away"
                    ? "Away"
                    : "Offline"
                }
                color={
                  user.onlineStatus === "online"
                    ? "success"
                    : user.onlineStatus === "away"
                    ? "warning"
                    : "default"
                }
                sx={{ marginLeft: "auto" }}
              />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </Box>
  );
};

export default UserList;
