
import { Search, Bell, ChevronDown } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search anything..."
        />
        <span className="search-shortcut">Ctrl K</span>
      </div>

      <div className="topbar-actions">
        <button className="icon-button" aria-label="Notifications">
          <Bell size={19} />
          <span className="notification-dot"></span>
        </button>

        <div className="topbar-user">
          <div className="profile-avatar">AD</div>
          <span>Admin</span>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}
