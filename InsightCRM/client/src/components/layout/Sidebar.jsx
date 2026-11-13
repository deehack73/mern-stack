
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BriefcaseBusiness,
  CalendarCheck,
  ChartNoAxesCombined,
  Settings,
  ChartColumnIncreasing
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Leads', path: '/leads', icon: UserPlus },
  { name: 'Opportunities', path: '/opportunities', icon: BriefcaseBusiness },
  { name: 'Activities', path: '/activities', icon: CalendarCheck },
  { name: 'Analytics', path: '/analytics', icon: ChartNoAxesCombined },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <ChartColumnIncreasing size={23} />
        </div>
        <div>
          <h2>InsightCRM</h2>
          <span>Business Intelligence</span>
        </div>
      </div>

      <div className="nav-section">
        <p className="nav-heading">WORKSPACE</p>

        <nav>
          {navigation.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={19} />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <NavLink to="/settings" className="nav-link">
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>

        <div className="sidebar-profile">
          <div className="profile-avatar">AD</div>
          <div>
            <strong>Admin User</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
