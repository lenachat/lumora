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
    <NavigationMenu>
      <NavigationMenuList>
        {!user ? (
          <>
            {location.pathname === '/signup' ? (
              <NavigationMenuItem>
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <Link to="/signup">
                  <Button>Signup</Button>
                </Link>
              </NavigationMenuItem>
            )
            }
          </>
        ) : (
          <NavigationMenuItem>
            <Button onClick={handleLogout}>
              Logout
            </Button>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Navigation;