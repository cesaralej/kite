export interface User {
  webSocketConnectionId: string;
  userId: string;
  email: string;
  role: string;
  onlineStatus: string;
  lastSeen?: number;
  unreadMessageCount: number;
  conversations: string[];
  name: string;
  profilePicture?: string;
  jobTitle: string;
  department: string;
  location: string;
  yearsAtCompany: number;
  manager: {
    name: string;
    email: string;
  };
  status: string;
  workingHours: string;
  interests?: string[];
}
