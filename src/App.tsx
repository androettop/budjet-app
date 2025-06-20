import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from "./components/Layout/Layout";
import { pages } from "./helpers/pages";
import { useAuthChange } from "./hooks/useAuthChange";
import { UserProvider } from "./hooks/useUserData";

const router = createBrowserRouter([
  {
    Component: Layout,
    children: pages.map((page) => ({
      index: page.index,
      path: page.path,
      Component: page.Component,
    })),
  },
]);

const App = () => {
  const { user, isLoading } = useAuthChange();
  return (
    <UserProvider value={{ user, isLoading }}>
      <RouterProvider router={router} />
    </UserProvider>
  );
};

export default App;
