import "./style/App.css"
import {
  createHashRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";
import {CardPage} from "./pages/CardPage.tsx";
import {HomePage} from "./pages/HomePage.tsx";
import {CustomCardPage2} from "./pages/CustomCardPage2.tsx";
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
  const router = createHashRouter(([
    {
      path: "/",
      element: <Layout/>,
      children: [
        {
          index: true,
          element: <HomePage/>,
        },
        {
          path: "card/:cardName",
          element: <CardPage/>,
        },
        {
          path: "card/custom/:cardName",
          element: <CustomCardPage2/>,
        },
        {
          path: "archetypes/:archetype",
          element: <ArchetypePage/>,
        },
      ],
    },
  ]));
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
