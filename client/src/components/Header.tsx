// import { Bell, Download, Moon } from "lucide-react";
// import { Button } from "./ui/button";
import { HashLink } from 'react-router-hash-link'
import { useLocation } from 'react-router-dom'
import MobileNavigation from './MobileNavigation'
import { Button } from '@/components/ui/button'
const Header = () => {
  const location = useLocation();
  console.log('location: ', location.pathname)
  return (
    <header className="site-header relative">
      <div className="brand-lockup">
        <img src="/sharah-logo.png" alt="Sharah Logo" className="brand-mark" />
        <div>
          <div className="brand-name text-sm">
            Sharah <span className="text-xs bg-(--background-dark)">v1.0</span>
          </div>
          <div className="brand-tagline">
            AI Islamic Finance Compliance Checker
          </div>
        </div>
      </div>
      <div className="md:flex items-center gap-4 hidden">
          <HashLink className={`text-xs sm:text-sm font-medium rounded-xl px-3 py-1 text-(--accent-color) cursor-pointer hover:text-(--accent-light) ${location.pathname === '/' ? 'bg-(--accent-color)/15' : ''}`} smooth to="/">
            Home
          </HashLink>

          <HashLink className={`text-xs sm:text-sm font-medium rounded-xl px-3 py-1 text-(--accent-color) cursor-pointer hover:text-(--accent-light) ${location.pathname === '/analyze' ? 'bg-(--accent-color)/15' : ''}`} smooth to="/analyze">
            Analyze
          </HashLink>
      </div>
      <MobileNavigation />
      <Button className="hidden md:block text-white text-xs sm:text-sm bg-(--accent-color)/80 rounded-[36px] py-1! px-3! hover:bg-(--accent-color)/70 cursor-pointer">
        Sign In
      </Button>
    </header>
  );
};

export default Header;
