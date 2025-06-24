import type { AppDispatch, RootState } from "@/redux/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [showLogout, setShowLogout] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogout(!showLogout)
    navigate("/");
    dispatch(logout());
  };

  console.log(showLogout);
  return (
    <section className="py-1 px-4 sticky top-0 z-1 bg-white/30 backdrop-blur-sm shadow-md">
      <div className="">
        <nav className="justify-between min-h-10 flex">
          <span className="text-lg font-semibold tracking-tighter">
            TeamTask
          </span>
          <div>
            {user && (
              <div className="relative">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowLogout(!showLogout)}
                >
                  <div>
                    <img
                      className="h-8 w-8 rounded-lg"
                      src="../../public/userImage.png"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>

                {showLogout && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </section>
  );
}
