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

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string;
}

export interface Chat {
  id: number;
  person: string;
  messages: Message[];
}

//ID is optional bc mock data does not have ir
export interface Message {
  id?: number;
  content: string;
  time: string;
  sender: string;
}

export interface File {
  id: number;
  name: string;
  person: string;
  date: string;
  type: string;
}
