// import { Bell, Download, Moon } from "lucide-react";
// import { Button } from "./ui/button";
// import { HashLink } from 'react-router-hash-link'
import { 
  // useLocation, 
  useNavigate 
} from 'react-router-dom'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
// import MobileNavigation from './MobileNavigation'
import { Button } from '@/components/ui/button'
import { useUser } from '@/context';
const Header = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, login } = useUser();
  console.log('user: ', user)

  const auth = async () => {
    if (user?.uid) {
      await logout();
      navigate('/')
    } else {
      await login();
      navigate('/analyze');
    }
  };
  return (
    <header className="site-header relative">
      <div className="brand-lockup">
        <img src="/sharah-logo.png" alt="Sharah Logo" className="brand-mark" />
        <div className="hidden sm:block">
          <div className="brand-name text-sm">
            Sharah <span className="text-xs bg-(--background-dark)">v1.0</span>
          </div>
          <div className="brand-tagline">
            AI Islamic Finance Compliance Checker
          </div>
        </div>
      </div>
      {/* <div className="md:flex items-center gap-4 hidden">
          <HashLink className={`text-xs sm:text-sm font-medium rounded-xl px-3 py-1 text-(--accent-color) cursor-pointer hover:text-(--accent-light) ${location.pathname === '/' ? 'bg-(--accent-color)/15' : ''}`} smooth to="/">
            Home
          </HashLink>

          <HashLink className={`text-xs sm:text-sm font-medium rounded-xl px-3 py-1 text-(--accent-color) cursor-pointer hover:text-(--accent-light) ${location.pathname === '/analyze' ? 'bg-(--accent-color)/15' : ''}`} smooth to="/analyze">
            Analyze
          </HashLink>
      </div>
      <MobileNavigation /> */}
      <div className="flex items-center gap-2">
        {user?.uid && user?.credits && (
          <p className="text-xs m-0 text-(--acccent-color)">Daily Credits Remaining: <span className="text-sm font-bold text-(--accent-light)">{user?.credits || 0}</span></p>
        )}


        <Button className={`${user?.uid ? 'hidden' : ''} text-white text-xs bg-(--accent-color)/80 rounded-[36px] px-3! hover:bg-(--accent-color)/70 cursor-pointer`} onClick={() => auth()}>
          {user?.uid ? 'Sign Out' : 'Sign In'}
        </Button>


        {user?.uid && user?.picture && (
          <HoverCard>
            <HoverCardTrigger delay={10} closeDelay={100}
              render={<img src={user?.picture} alt="User Picture" className="w-8 h-8 rounded-full cursor-pointer" />}
            />
            <HoverCardContent className="w-48 rounded-sm flex flex-col gap-1">
              <p className="text-sm font-medium m-0">{user?.name}</p>
              <p className="text-xs text-muted-foreground m-0">{user?.email}</p>
              <Button className={`text-white text-xs bg-(--accent-color)/80 rounded-[54px] hover:bg-(--accent-color)/70 cursor-pointer`} onClick={() => auth()}>
                {user?.uid ? 'Sign Out' : 'Sign In'}
              </Button>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
      
    </header>
  );
};

export default Header;
