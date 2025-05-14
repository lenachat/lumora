import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, useLocation } from 'react-router-dom';
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { logout } from "@/state/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const user = useSelector((state: RootState) => state.user);
  // const user = localStorage.getItem('user');
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    localStorage.removeItem('favoriteAffirmations');
    navigate('/login');
  }

  return (
    <NavigationMenu >
      <NavigationMenuList className="w-[100vw] md:pl-4 md:pr-4">
        <div className="p-4 flex w-full items-center justify-between">
          <div className="pl-4">
            <Link to="/">
              <img src="/lumora-logo-light.png" alt="" className="h-20" />
            </Link>
          </div>

          {!user ? (
            <>
              {location.pathname === '/signup' ? (
                <div className="flex place-items-end">
                  <NavigationMenuItem>
                    <Link to="/login">
                      <Button className="border-none">Login</Button>
                    </Link>
                  </NavigationMenuItem>
                </div>
              ) : (
                <div className="flex place-items-end">
                  <NavigationMenuItem>
                    <Link to="/signup">
                      <Button className="border-none">Signup</Button>
                    </Link>
                  </NavigationMenuItem>
                </div>
              )
              }
            </>
          ) : (
            <div className="flex place-items-end">
              <NavigationMenuItem>
                <Button onClick={handleLogout} className="border-none">
                  <img src="/logout.svg" alt="" className="mt-4 h-8" />
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/profile">
                  <Button className="border-none">
                    <img src="/profile.svg" alt="" className="mt-4 h-8" />
                  </Button>
                </Link>
              </NavigationMenuItem>
            </div>
          )}
        </div >
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Navigation;