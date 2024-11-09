import React, { createContext, useContext, useState, useEffect } from "react";
import { loadUsers } from "../api/users";
import { User } from "../types/User";
import { Auth } from "aws-amplify";

interface UsersContextProps {
  users: User[];
  isLoading: boolean;
  error: string | null;
  reloadUsers: () => void;
  getUserById: (userId: string) => User | undefined;
}

const UsersContext = createContext<UsersContextProps | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInitialData = async () => {
    //check if user is authenticated
    try {
      await Auth.currentSession();
    } catch (error) {
      setError("You need to be authenticated to view this page");
      return;
    }

    if (!Auth.currentUserInfo) {
      setError("User not found");
      return;
    }

    try {
      setIsLoading(true);
      const [fetchedUsers] = await Promise.all([loadUsers()]);
      setUsers(fetchedUsers);
    } catch (error) {
      setError("Failed to load users: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const reloadUsers = () => loadInitialData();
  const getUserById = (userId: string) =>
    users.find((user) => user.userId === userId);

  return (
    <UsersContext.Provider
      value={{ users, isLoading, error, reloadUsers, getUserById }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};
