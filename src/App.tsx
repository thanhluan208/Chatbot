import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import DefaultLayout from "./Components/DefaultLayout";
import { ListRoutes } from "./Constants/routes";
import useRoutes from "./Constants/routes";
import { useAuth } from "./Providers/AuthenticationProvider";
import { lazy, Suspense } from "react";
import CommonStyles from "./Components/CommonStyles";
import { QueryClient, QueryClientProvider } from "react-query";

import "./App.css"

const KnowledgeDetail = lazy(() => import("./Pages/KnowledgeDetail"));
const Login = lazy(() => import("./Pages/Login"));
const SignUp = lazy(() => import("./Pages/SignUp"));
const KnowledgeUpload = lazy(() => import("./Pages/KnowledgeUpload"));
const BotStore = lazy(() => import("./Pages/BotStore"));
const UserProfile = lazy(() => import("./Pages/UserProfile"));
const KnowledgeStore = lazy(() => import("./Pages/KnowledgeStore"));

const ChatBot = lazy(() => import("./Pages/ChatBot"));
const Users = lazy(() => import("./Pages/Users"));
const ChatbotConfigure = lazy(() => import("./Pages/ChatbotConfigure"));
const Workflow = lazy(() => import("./Pages/Workflow"));
const WorkflowDetail = lazy(() => import("./Pages/WorkflowDetail"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

function App() {
  //! State
  const { userId } = useAuth();
  const Routes = useRoutes();
  const router = createBrowserRouter([
    {
      element: <DefaultLayout />,
      children: [
        {
          path: "*",
          element: <BotStore />,
          loader: () => {
            if (!userId) return redirect("/login");

            return null;
          },
        },
        {
          path: Routes.common.PERSONAL.path,
          element: <Users />,
          loader: () => {
            if (!userId) return redirect("/login");

            return null;
          },
        },
        {
          path: ListRoutes.userProfile,
          element: <UserProfile />,
          loader: () => {
            if (!userId) return redirect("/login");

            return null;
          },
        },
        {
          path: ListRoutes.knowledgeStore,
          element: <KnowledgeStore />,
          loader: () => {
            if (!userId) return redirect("/login");

            return null;
          },
        },
        {
          path: ListRoutes.workflow,
          element: <Workflow />,
          loader: () => {
            if (!userId) return redirect("/login");
    
            return null;
          },
        },
      ],
    },
    {
      path: ListRoutes.workspace,
      element: <ChatbotConfigure />,
      loader: () => {
        if (!userId) return redirect("/login");

        return null;
      },
    },
    {
      path: ListRoutes.workflowDetail(),
      element: <WorkflowDetail />,
      loader: () => {
        if (!userId) return redirect("/login");

        return null;
      },
    },
    {
      path: ListRoutes.knowledgeDetail,
      element: <KnowledgeDetail />,
      loader: () => {
        if (!userId) return redirect("/login");

        return null;
      },
    },
    {
      path: ListRoutes.knowledgeDetailFromPersonal,
      element: <KnowledgeDetail />,
      loader: () => {
        if (!userId) return redirect("/login");

        return null;
      },
    },
    {
      path: ListRoutes.knowledgeDetailFromStore,
      element: <KnowledgeDetail />,
      loader: () => {
        if (!userId) return redirect("/login");

        return null;
      },
    },
    {
      path: ListRoutes.knowledgeUpload,
      element: <KnowledgeUpload />,
      loader: () => {
        if (!userId) return redirect("/login");

        return null;
      },
    },
    {
      path: ListRoutes.chatBot,
      element: <ChatBot />,
      loader: () => {
        if (!userId) return redirect("/login");

        return null;
      },
    },
    {
      path: ListRoutes.login,
      element: <Login />,
      loader: () => {
        if (userId) return redirect("/");

        return null;
      },
    },
    {
      path: ListRoutes.signup,
      element: <SignUp />,
      loader: () => {
        if (userId) return redirect("/");

        return null;
      },
    },
   
  ]);

  //! Function

  //! Render
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<CommonStyles.LoadingOverlay isLoading />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
