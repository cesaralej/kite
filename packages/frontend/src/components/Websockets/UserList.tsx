import { User } from "../../types/User";
import { List, ListItem, ListItemText, Typography, Grid } from "@mui/material";
import { FiCircle, FiClock } from "react-icons/fi";

interface UserListProps {
  users: User[];
  selectedUserId: string | null;
  handleSelect: (userId: string, userConn: string) => void;
  isLoading: boolean;
}

const UserList = ({
  users,
  selectedUserId,
  handleSelect,
  isLoading,
}: UserListProps) => {
  const getBackgroundColor = (connectionId: string) =>
    selectedUserId === connectionId ? "#d3d3d3" : "white";

  return isLoading ? (
    <Typography variant="body1" align="center">
      Loading chats...
    </Typography>
  ) : (
    <List>
      {users.map((user) => (
        <ListItem
          key={user.userId}
          button
          onClick={() => handleSelect(user.userId, user.webSocketConnectionId)}
          sx={{
            backgroundColor: getBackgroundColor(user.userId),
            borderRadius: "8px",
            mb: 1,
            "&:hover": {
              backgroundColor: "#e0f7fa", // Change on hover
            },
          }}
        >
          <Grid container alignItems="center">
            <Grid item xs={2}>
              {/* Online status icon */}
              {user.onlineStatus ? (
                <FiCircle color="green" />
              ) : (
                <FiClock color="gray" />
              )}
            </Grid>
            <Grid item xs={10}>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight:
                        selectedUserId === user.userId ? "bold" : "normal",
                    }}
                  >
                    {user.userId}
                  </Typography>
                }
                secondary={
                  user.onlineStatus ? (
                    <Typography variant="body2" color="green">
                      Online
                    </Typography>
                  ) : (
                    <>
                      {user.lastSeen && (
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ display: "block", fontStyle: "italic" }}
                        >
                          Last seen: {new Date(user.lastSeen).toLocaleString()}
                        </Typography>
                      )}
                    </>
                  )
                }
              />
            </Grid>
          </Grid>
        </ListItem>
      ))}
    </List>
  );
};

export default UserList;
