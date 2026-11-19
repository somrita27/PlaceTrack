

import { useState } from "react";
import { FiX, FiSave } from "react-icons/fi";

function formatDateForInput(date) {
  if (!date) return "";

  if (typeof date === "string") {
    return date.slice(0, 10);
  }

  return new Date(date).toISOString().slice(0, 10);
}

function AddApplication({
  onClose,
  onSubmit,
  saving,
  initialData = null
}) {
  const [formData, setFormData] = useState({
    company_name: initialData?.company_name || "",
    job_role: initialData?.job_role || "",
    location: initialData?.location || "",
    salary: initialData?.salary || "",
    application_date: formatDateForInput(
      initialData?.application_date
    ) || new Date().toISOString().slice(0, 10),
    status: initialData?.status || "Applied",
    interview_date: formatDateForInput(
      initialData?.interview_date
    ),
    job_description: initialData?.job_description || ""
  });

  const isEditing = Boolean(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="application-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>
              {isEditing ? "Edit Application" : "Add New Application"}
            </h2>
            <p>
              {isEditing
                ? "Update your job application details."
                : "Enter the details of your job application."}
            </p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
            aria-label="Close form"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="company_name"
                placeholder="e.g. Google"
                value={formData.company_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Job Role *</label>
              <input
                type="text"
                name="job_role"
                placeholder="e.g. Software Developer"
                value={formData.job_role}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Kolkata / Remote"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Salary / CTC</label>
              <input
                type="text"
                name="salary"
                placeholder="e.g. 6 LPA"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Application Date *</label>
              <input
                type="date"
                name="application_date"
                value={formData.application_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Application Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Applied">Applied</option>
                <option value="Online Assessment">Online Assessment</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Interview Date (if applicable)</label>
              <input
                type="date"
                name="interview_date"
                value={formData.interview_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Job Description / Notes</label>
              <textarea
                name="job_description"
                placeholder="Add job details, requirements, or interview notes..."
                value={formData.job_description}
                onChange={handleChange}
                rows="4"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
              disabled={saving}
            >
              <FiSave />
              {saving
                ? "Saving..."
                : isEditing
                  ? "Update Application"
                  : "Save Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddApplication;
