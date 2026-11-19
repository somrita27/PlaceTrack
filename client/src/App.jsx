
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiBriefcase,
  FiPlusCircle,
  FiBell,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiX
} from "react-icons/fi";

import AddApplication from "./components/AddApplication";
import "./App.css";

const API_URL = "http://localhost:5000/api";

// Sidebar Component

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <h2 className="logo">PlaceTrack<span>.</span></h2>

      <p className="menu-label">MENU</p>

      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          <FiGrid /> Dashboard
        </Link>

        <Link
          to="/applications"
          className={`nav-link ${
            location.pathname === "/applications" ? "active" : ""
          }`}
        >
          <FiBriefcase /> Applications
        </Link>
      </nav>

      <div className="sidebar-bottom">
        <div className="profile">
          <div className="profile-avatar">S</div>
          <div>
            <h4>Student</h4>
            <p>Job Seeker</p>
          </div>
        </div>
      </div>
    </aside>
  );
}


// Header Component
function Header({ title = "Dashboard" }) {
  return (
    <header className="top-header">
      <div>
        <h2>{title}</h2>
        <p>Track and manage your job applications</p>
      </div>

      <div className="header-actions">
        <button className="icon-button" aria-label="Notifications">
          <FiBell />
        </button>

        <div className="header-avatar">S</div>
      </div>
    </header>
  );
}


// Statistics Card
function StatCard({ title, value, icon, color }) {
  return (
    <div className="stat-card">
      <div>
        <p className="stat-title">{title}</p>
        <h2>{value}</h2>
      </div>

      <div className={`stat-icon ${color}`}>
        {icon}
      </div>
    </div>
  );
}

// Status Badge
function StatusBadge({ status }) {
  const statusClass = status
    .toLowerCase()
    .replaceAll(" ", "-");

  return (
    <span className={`status-badge ${statusClass}`}>
      {status}
    </span>
  );
}

// Format Date
function formatDate(date) {
  if (!date) return "Not specified";

  const dateObject = new Date(date);

  if (Number.isNaN(dateObject.getTime())) {
    return "Not specified";
  }

  return dateObject.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });
}

// Recent Applications
function RecentApplications({ applications, loading }) {
  if (loading) {
    return (
      <div className="empty-state">
        <h3>Loading applications...</h3>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <FiBriefcase />
        </div>

        <h3>No applications yet</h3>

        <p>
          Start tracking your job search by adding your first application.
        </p>
      </div>
    );
  }

  return (
    <div className="applications-table-wrapper">
      <table className="applications-table">
        <thead>
          <tr>
            <th>Company & Role</th>
            <th>Location</th>
            <th>Applied Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td>
                <div className="company-info">
                  <div className="company-avatar">
                    {application.company_name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <strong>{application.company_name}</strong>
                    <p>{application.job_role}</p>
                  </div>
                </div>
              </td>

              <td>
                <span className="location-info">
                  <FiMapPin />
                  {application.location || "Not specified"}
                </span>
              </td>

              <td>
                <span className="date-info">
                  <FiCalendar />
                  {formatDate(application.application_date)}
                </span>
              </td>

              <td>
                <StatusBadge status={application.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Dashboard Component

function Dashboard() {
  const location = useLocation();
  const [stats, setStats] = useState({
    total_applications: 0,
    applied: 0,
    online_assessment: 0,
    interviews: 0,
    selected: 0,
    rejected: 0
  });

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [statsResponse, applicationsResponse] = await Promise.all([
          fetch(`${API_URL}/applications/stats`),
          fetch(`${API_URL}/applications`)
        ]);

        if (!statsResponse.ok || !applicationsResponse.ok) {
          throw new Error("Unable to load dashboard data.");
        }

        const statsResult = await statsResponse.json();
        const applicationsResult = await applicationsResponse.json();

        if (!statsResult.success || !applicationsResult.success) {
          throw new Error("Could not retrieve dashboard information.");
        }

        setStats(statsResult.data);

        // Display only the five latest applications
        const sortedApplications = [...applicationsResult.data].sort(
          (a, b) =>
            new Date(b.application_date) - new Date(a.application_date)
        );

        setApplications(sortedApplications.slice(0, 5));
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [location.key]);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <>
      <Header />

      <main className="dashboard-content">
        <div className="welcome-section">
          <div>
            <h1>Welcome back! 👋</h1>
            <p>Here's an overview of your job search journey.</p>
          </div>

          <button
            className="add-button"
            onClick={() => window.location.href = "/applications"}
          >
            <FiPlusCircle /> Add Application
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        
<section className="stats-grid">
  <StatCard
    title="Total Applications"
    value={loading ? "..." : stats.total_applications}
    icon={<FiBriefcase />}
    color="blue"
  />

  <StatCard
    title="Applied"
    value={loading ? "..." : stats.applied}
    icon={<FiGrid />}
    color="purple"
  />

  <StatCard
    title="Online Assessments"
    value={loading ? "..." : stats.online_assessment}
    icon={<FiCalendar />}
    color="orange"
  />

  <StatCard
    title="Interviews"
    value={loading ? "..." : stats.interviews}
    icon={<FiUser />}
    color="orange"
  />

  <StatCard
    title="Selected"
    value={loading ? "..." : stats.selected}
    icon={<FiBriefcase />}
    color="green"
  />

  <StatCard
    title="Rejected"
    value={loading ? "..." : stats.rejected}
    icon={<FiX />}
    color="red"
  />
</section>


        <section className="recent-section">
          <div className="section-heading">
            <div>
              <h2>Recent Applications</h2>
              <p>Your latest job application activities</p>
            </div>

            <a href="/applications" className="view-all-button">
              View All
            </a>
          </div>

          {loading ? (
            <div className="empty-state">
              <h3>Loading applications...</h3>
            </div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FiBriefcase />
              </div>

              <h3>No applications yet</h3>
              <p>
                Start tracking your job search by adding your first application.
              </p>
            </div>
          ) : (
            <div className="applications-table-wrapper">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Company & Role</th>
                    <th>Location</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td>
                        <div className="company-info">
                          <div className="company-avatar">
                            {application.company_name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>{application.company_name}</strong>
                            <p>{application.job_role}</p>
                          </div>
                        </div>
                      </td>

                      <td>{application.location || "Not specified"}</td>

                      <td>{formatDate(application.application_date)}</td>

                      <td>
                        <span className={`status-badge ${application.status
                          ?.toLowerCase()
                          .replaceAll(" ", "-")}`}>
                          {application.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}


// Applications Page (we will build this fully next)
function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch Applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (status) {
        params.append("status", status);
      }

      const response = await fetch(
        `${API_URL}/applications?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch applications.");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Could not load applications.");
      }

      setApplications(result.data);
    } catch (err) {
      console.error("Applications error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when search or status changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, status]);

  // Open Edit Form
  const handleEdit = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const handleAddApplication = async (formData) => {
  try {
    setSaving(true);
    setError("");

    const response = await fetch(`${API_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...formData,
        interview_date: formData.interview_date || null
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to add application.");
    }

    setShowModal(false);
    await fetchApplications();

    alert("Application added successfully!");
  } catch (err) {
    console.error("Add application error:", err);
    setError(err.message || "Something went wrong.");
  } finally {
    setSaving(false);
  }
};

  // Update Application
  const handleUpdateApplication = async (formData) => {
    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${API_URL}/applications/${selectedApplication.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...formData,
            interview_date: formData.interview_date || null
          })
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update application.");
      }

      setShowModal(false);
      setSelectedApplication(null);

      await fetchApplications();

      alert("Application updated successfully!");
    } catch (err) {
      console.error("Update application error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Application
  const handleDelete = async (application) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the application for ${application.company_name}?`
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/applications/${application.id}`,
        {
          method: "DELETE"
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete application.");
      }

      await fetchApplications();

      alert("Application deleted successfully!");
    } catch (err) {
      console.error("Delete application error:", err);
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <>
      <Header title="My Applications" />

      <main className="dashboard-content">

        {/* Page Heading */}
        <div className="welcome-section">
  <div>
    <h1>My Applications</h1>
    <p>Manage and track all your job applications.</p>
  </div>

  <div className="applications-heading-actions">
    <div className="application-count">
      {applications.length} Applications
    </div>

    <button
      className="add-button"
      onClick={() => {
        setSelectedApplication(null);
        setShowModal(true);
      }}
    >
      <FiPlusCircle /> Add Application
    </button>
  </div>
</div>

        {/* Search and Filter */}
        <section className="applications-toolbar">
          <div className="search-box">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search company or job role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Online Assessment">Online Assessment</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </section>

        {/* Error Message */}
        {error && (
          <p className="error-message">{error}</p>
        )}

        {/* Applications Table */}
        <section className="recent-section applications-page-table">

          {loading ? (
            <div className="empty-state">
              <h3>Loading applications...</h3>
            </div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FiBriefcase />
              </div>

              <h3>No applications found</h3>

              <p>
                {search || status
                  ? "Try changing your search or status filter."
                  : "Your saved applications will appear here."}
              </p>
            </div>
          ) : (
            <div className="applications-table-wrapper">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Company & Role</th>
                    <th>Location</th>
                    <th>Salary / CTC</th>
                    <th>Applied Date</th>
                    <th>Interview Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td>
                        <div className="company-info">
                          <div className="company-avatar">
                            {application.company_name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>{application.company_name}</strong>
                            <p>{application.job_role}</p>
                          </div>
                        </div>
                      </td>

                      <td>
                        {application.location || "Not specified"}
                      </td>

                      <td>
                        {application.salary || "Not specified"}
                      </td>

                      <td>
                        {formatDate(application.application_date)}
                      </td>

                      <td>
                        {formatDate(application.interview_date)}
                      </td>

                      <td>
                        <StatusBadge status={application.status} />
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="edit-action"
                            title="Edit Application"
                            aria-label="Edit application"
                            onClick={() => handleEdit(application)}
                          >
                            <FiEdit2 />
                          </button>

                          <button
                            type="button"
                            className="delete-action"
                            title="Delete Application"
                            aria-label="Delete application"
                            onClick={() => handleDelete(application)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Add / Edit Application Modal */}
        {showModal && (
  <AddApplication
    onClose={() => {
      setShowModal(false);
      setSelectedApplication(null);
    }}
    onSubmit={
      selectedApplication
        ? handleUpdateApplication
        : handleAddApplication
    }
    saving={saving}
    initialData={selectedApplication}
  />
)}

      </main>
    </>
  );
}

// Main Layout
function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
        </Routes>
      </div>
    </div>
  );
}

// Main App
function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
