import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/LoginPage";
import Home from "./pages/HomePage";
import ChatsPage from "./pages/ChatsPage";
import ChatPage, { chatLoader } from "./pages/ChatPage";
import ProfilePage, { profileLoader } from "./pages/ProfilePage";
import TasksPage from "./pages/TasksPage.tsx";
import { UsersProvider } from "./context/UsersContext";
import NewTaskPage from "./pages/NewTaskPage";
import FilesPage from "./pages/FilesPage";
import DirectoryPage from "./pages/DirectoryPage";
import LearningResourcesPage from "./pages/LearningResourcesPage";
import NotFoundPage from "./pages/NotFoundPage";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useEffect } from "react";
import { AppContext, AppContextType } from "./lib/contextLib";
import { Auth } from "aws-amplify";
import { onError } from "./lib/errorLib";

const App: React.FC = () => {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (error) {
      if (error !== "No current user") {
        onError(error);
      }
    }

    setIsAuthenticating(false);
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <UsersProvider>
                <MainLayout />
              </UsersProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="chats" element={<ChatsPage />} />
          <Route
            path="chats/:chatId"
            element={<ChatPage />}
            loader={chatLoader}
          />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="tasks/new" element={<NewTaskPage />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="directory" element={<DirectoryPage />} />
          <Route
            path="directory/:userId"
            element={<ProfilePage />}
            loader={profileLoader}
          />
          <Route path="learn" element={<LearningResourcesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </>
    )
  );

  return (
    !isAuthenticating && (
      <AppContext.Provider
        value={{ isAuthenticated, userHasAuthenticated } as AppContextType}
      >
        <RouterProvider router={router} />
      </AppContext.Provider>
    )
  );
};

export default App;
