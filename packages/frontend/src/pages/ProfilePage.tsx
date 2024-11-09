import React from "react";
import { useLoaderData } from "react-router-dom";
import { LoaderFunctionArgs } from "react-router-dom";
import { User } from "../types";
import { useUsers } from "../context/UsersContext";
import Profile from "../components/Profile/Profile";
import { startOrGetChat } from "../api/chats";
//import { useNavigate } from "react-router-dom";

type ProfileParams = {
  userId: string;
};

const UserProfilePage: React.FC = () => {
  const { getUserById } = useUsers();
  //const navigate = useNavigate();
  const loaderUserID = useLoaderData() as string | null;
  if (!loaderUserID) {
    return <p>Error: User data not found.</p>;
  }

  const data = getUserById(loaderUserID);

  if (!data) {
    return <p>Error: User not found.</p>;
  }

  //TODO: Add more user data to the actual database. This is placeholder
  const user = {
    ...data,
    manager: {
      name: "John Doe",
      email: "",
    },
    status: "Active",
    workingHours: "9-5",
    interests: ["Reading", "Hiking", "Cooking"],
    yearsAtCompany: 3,
    location: "New York, NY",
    jobTitle: "Software Engineer",
  } as User;

  const handleRequestMeeting = () => console.log("Requesting meeting...");
  const handleAssignTask = () => console.log("Assigning task...");
  const handleViewLinkedProfiles = () =>
    console.log("Viewing linked profiles...");
  const handleShareProfile = () => console.log("Sharing profile...");
  const handleSendFeedback = () => console.log("Sending feedback...");

  const handleStartChat = async () => {
    try {
      // Call API to get existing chat or create a new one
      //const chat = await startOrGetChat(user.userId);
      startOrGetChat(user.userId);

      /* if (chat && chat.chatId) {
        // Redirect to chat page with the chatId
        navigate(`/chats/${chat.chatId}`);
      } */
    } catch (error) {
      console.error("Failed to start or retrieve chat:", error);
      alert("Failed to start chat. Please try again later.");
    }
  };

  return (
    <Profile
      user={user}
      onRequestMeeting={handleRequestMeeting}
      onAssignTask={handleAssignTask}
      onViewLinkedProfiles={handleViewLinkedProfiles}
      onShareProfile={handleShareProfile}
      onSendFeedback={handleSendFeedback}
      onChat={handleStartChat}
    />
  );
};

// This function is kind of redundant because Im not actually loading data because I cant use the context within it.
const profileLoader = async ({
  params,
}: LoaderFunctionArgs<ProfileParams>): Promise<string | null> => {
  try {
    const userIdString = params.userId;

    // Check if userId is defined
    if (!userIdString) {
      console.error("User ID is undefined");
      return null;
    }

    const userId = userIdString;

    return userId;
  } catch (error) {
    console.error("Error loading user: ", error);
    return null;
  }
};

export { UserProfilePage as default, profileLoader };
