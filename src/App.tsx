import "./style/App.css"
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";
import {CardPage} from "./pages/CardPage.tsx";
import {HomePage} from "./pages/HomePage.tsx";
import {CustomCardPage2} from "./pages/CustomCardPage2.tsx";
import ArchetypePage from "./pages/ArchetypePage.tsx";
import NavBar from "./components/NavBar.tsx";
import CardSearchPage from "./pages/CardSearchPage.tsx";
import {CardDbProvider} from "./components/card/abstract/parse/CardDb.tsx";

function Layout() {
  return (
    <>
      <CardDbProvider>
        <NavBar/>
        <ScrollRestoration/>
        <div id={"content"}>
          <Outlet/>
        </div>
      </CardDbProvider>
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
          element: <HomePage/>,
        },
        {
          path: "card/official/:cardName",
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
        {
          path: "search",
          element: <CardSearchPage/>,
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
