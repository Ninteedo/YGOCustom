import './App.css'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration
} from 'react-router-dom';
import {CardPage} from "./pages/CardPage.tsx";
import {HomePage} from "./pages/HomePage.tsx";
import {CustomCardPage} from "./pages/CustomCardPage.tsx";
import ArchetypePage from "./pages/ArchetypePage.tsx";

function Layout() {
  return (
    <>
      <ScrollRestoration/>
      <Outlet/>
    </>
  );
}

function App() {
  const router = createBrowserRouter(([
    {
      path: "/",
      element: <Layout/>,
      children: [
        {
          index: true,
          element: <HomePage/>
        },
        {
          path: "card/:cardName",
          element: <CardPage/>
        },
        {
          path: "card/custom/:cardName",
          element: <CustomCardPage/>
        },
        {
          path: "archetypes/:archetype",
          element: <ArchetypePage/>
        }
      ]
    }
  ]));
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
