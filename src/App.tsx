
import Card from './components/Card';
import Table from './components/Table';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from './pages/Main';
import SimplePoker from './components/SimplePoker';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "HoldemPoker",
        element: <Table />,
      },
      {
        path: "SimplePoker",
        element: <SimplePoker />,
      },
    ],
  },
]);

function App() {
  return(
  <div className='bg-green-800'>
    <RouterProvider router={router} />;
    </div>
  )
}

export default App;
