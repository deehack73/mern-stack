
const modules = [
  'Dashboard',
  'Customer Management',
  'Lead Management',
  'Opportunity Management',
  'Activity Management',
  'Business Analytics'
];

const technologies = [
  { name: 'React.js', purpose: 'Frontend user interface' },
  { name: 'Vite', purpose: 'Frontend development and build tool' },
  { name: 'Tailwind CSS', purpose: 'Styling and layout' },
  { name: 'Node.js', purpose: 'JavaScript runtime for the backend' },
  { name: 'Express.js', purpose: 'REST API development' },
  { name: 'MongoDB', purpose: 'Database management' },
  { name: 'Mongoose', purpose: 'MongoDB object modeling' },
  { name: 'Recharts', purpose: 'Charts and data visualization' },
  { name: 'Axios', purpose: 'Frontend API communication' }
];

export default function Settings() {
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>Settings</h1>
          <p>Application information and system configuration.</p>
        </div>
      </div>

      <section className="dashboard-panel">
        <div className="panel-heading">
          <h2>Application Information</h2>
        </div>
        <div className="settings-info">
          <p><strong>Application:</strong> InsightCRM</p>
          <p><strong>Category:</strong> Customer Relationship Management System</p>
          <p><strong>Architecture:</strong> MERN Stack</p>
          <p><strong>Frontend:</strong> React.js with Vite</p>
          <p><strong>Backend:</strong> Node.js and Express.js</p>
          <p><strong>Database:</strong> MongoDB</p>
          <p><strong>API Architecture:</strong> REST API</p>
          <p><strong>Database:</strong> Local MongoDB instance</p>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-heading">
          <h2>Technology Stack</h2>
        </div>
        <div className="customer-table-container">
          <table className="customer-table">
            <thead>
              <tr>
                <th>Technology</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {technologies.map(item => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{item.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-heading">
          <h2>Available Modules</h2>
        </div>
        <div className="settings-modules">
          {modules.map(module => (
            <div className="settings-module" key={module}>
              <span className="settings-check">✓</span>
              {module}
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-heading">
          <h2>Database Configuration</h2>
        </div>
        <div className="settings-info">
          <p><strong>Database Name:</strong> insightcrm</p>
          <p><strong>Database Type:</strong> MongoDB</p>
          <p><strong>Connection:</strong> Localhost</p>
          <p><strong>Backend Port:</strong> 5000</p>
          <p><strong>Frontend Port:</strong> 5173</p>
        </div>
      </section>

      <p className="settings-footer">
        InsightCRM — Customer Relationship Management System
      </p>
    </div>
  );
}
