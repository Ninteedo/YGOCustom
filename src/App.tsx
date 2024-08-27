import "./style/App.css"
import {createBrowserRouter, Outlet, RouterProvider, ScrollRestoration} from "react-router-dom";
import {CardPage} from "./pages/CardPage.tsx";
import {CustomCardPage2} from "./pages/CustomCardPage2.tsx";
import ArchetypePage from "./pages/ArchetypePage.tsx";
import NavBar from "./components/NavBar.tsx";
import CardSearchPage from "./pages/CardSearchPage.tsx";
import {CardDbProvider} from "./components/card/abstract/parse/CardDb.tsx";
import SettingsProvider from "./components/settings/SettingsProvider.tsx";

function Layout() {
  return (
    <>
      <SettingsProvider>
        <CardDbProvider>
          <NavBar/>
          <ScrollRestoration/>
          <div id={"content"}>
            <Outlet/>
          </div>
        </CardDbProvider>
      </SettingsProvider>
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
          element: <CardSearchPage/>,
        },
        {
          path: "card/official/:cardId",
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
