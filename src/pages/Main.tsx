import { Link, Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="flex w-full h-full flex-col justify-center items-center bg-green-800">
      <nav className="w-full flex justify-between list-none p-5">
        <li>
          <Link to="/HoldemPoker">Holdem Poker</Link>
        </li>
        <li>
          <Link to="/SimplePoker">Simple Poker</Link>
        </li>
      </nav>
      <Outlet />
    </div>
  );
};

export default Main; 
