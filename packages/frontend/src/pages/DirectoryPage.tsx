import React, { useState } from "react";
import {
  Box,
  Toolbar,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import { FaSearch, FaFilter } from "react-icons/fa";
import { User } from "../types/User";
import { useUsers } from "../context/UsersContext";
import UserList from "../components/Directory/UserList";

const EmployeeDirectory: React.FC = () => {
  const { users, isLoading, error } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [sortOption, setSortOption] = useState<string>("alphabetical");

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle opening filter menu
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  // Handle closing filter menu
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Handle sorting or filtering
  const applyFilterOrSort = (option: string) => {
    setSortOption(option);
    handleFilterClose();
  };

  // Filter and sort employees based on the search term and selected options
  const displayedUsers = users
    .filter(
      (user: User) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: User, b: User) => {
      if (sortOption === "alphabetical") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Directory
      </Typography>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by name, role, department..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <FaSearch />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            marginRight: 2,
            backgroundColor: "white",
            borderRadius: 1,
            flexGrow: 1,
          }}
        />
        <IconButton
          color="inherit"
          onClick={handleFilterClick}
          sx={{ position: "sticky", right: 0 }}
        >
          <FaFilter />
        </IconButton>
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
        >
          <MenuItem onClick={() => applyFilterOrSort("alphabetical")}>
            Sort Alphabetically
          </MenuItem>
          <MenuItem onClick={() => applyFilterOrSort("department")}>
            Sort by Department
          </MenuItem>
          {/* Add more filter or sort options as needed */}
        </Menu>
      </Toolbar>

      {/* Main Content Area */}
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <UserList users={displayedUsers} />
      )}
    </Box>
  );
};

export default EmployeeDirectory;
