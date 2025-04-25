import React from 'react';
import './DoctorList.css';

const parseExperience = (expString) => {
  if (!expString) return null;
  const match = expString.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

const parseFee = (feeString) => {
  if (!feeString) return null;
  const cleanedString = feeString.replace(/[^\d.]/g, '');
  return cleanedString ? parseFloat(cleanedString) : null;
};

function DoctorCard({ doctor }) {
  const getDisplayValue = (value, defaultValue = 'N/A') => {
    if (value === null || value === undefined || value === '') return defaultValue;
    if (Array.isArray(value)) return value.join(', ');
    return value;
  };

  const name = getDisplayValue(doctor.name);
  const photoUrl = doctor.photo;
  const specialtyDisplay = Array.isArray(doctor.specialities) && doctor.specialities.length > 0
    ? doctor.specialities[0].name
    : 'N/A';
  const qualifications = getDisplayValue(doctor.qualifications, null);
  const experienceYears = parseExperience(doctor.experience);
  const fee = parseFee(doctor.fees);
  const clinicName = getDisplayValue(doctor.clinic?.name);
  const location = getDisplayValue(doctor.clinic?.address?.locality || doctor.clinic?.address?.city);

  return (
    <div className="doctor-card">
      <div className="doctor-card-image-section">
        {photoUrl ? (
          <img src={photoUrl} alt={`Photo of ${name}`} className="doctor-photo" />
        ) : (
          <div className="image-placeholder"></div>
        )}
      </div>

      <div className="doctor-card-details-section">
        <h3 className="doctor-name">{name}</h3>
        <p className="doctor-specialty">{specialtyDisplay}</p>
        {qualifications && <p className="doctor-qualifications">{qualifications}</p>}
        {experienceYears !== null && <p className="doctor-experience">{experienceYears} yrs exp.</p>}
        <p className="clinic-info">
          <span className="icon-clinic">&#127970;</span>
          {clinicName}
        </p>
        <p className="location-info">
          <span className="icon-location">&#128205;</span>
          {location}
        </p>
      </div>

      <div className="doctor-card-actions-section">
        {fee !== null && <p className="doctor-fee">₹{fee}</p>}
        <button className="book-appointment-btn">Book Appointment</button>
      </div>
    </div>
  );
}


function DoctorList({ doctors }) {
  if (!doctors) {
    return <p>Loading doctors...</p>;
  }

  if (doctors.length === 0) {
    return <p className="no-doctors-message">No doctors found matching your criteria.</p>;
  }

  return (
    <section className="doctor-list-section">
      <div className="doctor-grid">
        {doctors.map((doctor, index) => (
          <DoctorCard key={doctor.id || `doc-${index}`} doctor={doctor} />
        ))}
      </div>
    </section>
  );
}

export default DoctorList;
