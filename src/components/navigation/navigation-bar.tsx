import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, useLocation } from 'react-router-dom';
import { Button } from "../ui/button";

const Navigation = () => {
  const user = localStorage.getItem('user');
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('favoriteAffirmations');
    window.location.reload();
  }

  return (
    <NavigationMenu >
      <NavigationMenuList className="w-[100vw] pl-4 pr-4">
        <div className="p-4 flex w-full items-center justify-between">
          <div className="">
            <Link to="/">
              <img src="../../../files/lumora-logo-light.png" alt="" className="h-20" />
            </Link>
          </div>

          {!user ? (
            <>
              {location.pathname === '/signup' ? (
                <div className="w-32 flex-1 place-items-end">
                  <NavigationMenuItem>
                    <Link to="/login">
                      <Button>Login</Button>
                    </Link>
                  </NavigationMenuItem>
                </div>
              ) : (
                <div className="w-32 flex-1 place-items-end">
                  <NavigationMenuItem>
                    <Link to="/signup">
                      <Button>Signup</Button>
                    </Link>
                  </NavigationMenuItem>
                </div>
              )
              }
            </>
          ) : (
            <div className="flex place-items-end">
              <NavigationMenuItem>
                <Button onClick={handleLogout}>
                  <img src="/../../../files/logout.svg" alt="" className="mt-4 h-8" />
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/profile">
                  <Button>
                    <img src="/../../../files/profile.svg" alt="" className="mt-4 h-8" />
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