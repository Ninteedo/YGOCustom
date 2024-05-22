import './App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {CardPage} from "./pages/CardPage.tsx";
import {HomePage} from "./pages/HomePage.tsx";
import {CustomCardPage} from "./pages/CustomCardPage.tsx";
import ArchetypePage from "./pages/ArchetypePage.tsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage/>
    },
    {
      path: "/card/:cardName",
      element: <CardPage/>
    },
    {
      path: "/card/custom/:cardName",
      element: <CustomCardPage/>
    },
    {
      path: "/archetypes/:archetype",
      element: <ArchetypePage/>
    }
  ]);
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
