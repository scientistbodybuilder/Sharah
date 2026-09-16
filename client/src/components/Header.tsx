// import { Bell, Download, Moon } from "lucide-react";
// import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="site-header">
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
      <div className="header-actions">
        {/* <Button
          variant="outline"
          size="icon"
          aria-label="Toggle theme"
          className="header-icon-button"
        >
          <Moon />
        </Button> */}
        {/* <Button variant="outline" size="sm" className="export-button cursor-pointer">
          <Download /> Export Report
        </Button> */}
        {/* <Button
          variant="outline"
          size="icon"
          aria-label="Notifications"
          className="header-icon-button notification-button cursor-pointer"
        >
          <Bell />
          <i />
        </Button> */}
      </div>
    </header>
  );
};

export default Header;
