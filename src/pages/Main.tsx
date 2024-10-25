import { Link, Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="flex w-full h-full flex-col justify-center items-center bg-green-800">
      <nav className="w-full flex justify-between list-none p-5">
        <li>
          <Link to="/HoldemPocker">Holdem Pocker</Link>
        </li>
        <li>
          <Link to="/SimplePocker">Simple Pocker</Link>
        </li>
      </nav>
      <Outlet />
    </div>
  );
};

export default Main; 