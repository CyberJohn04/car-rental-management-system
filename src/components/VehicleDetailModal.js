import React from 'react';

const VehicleDetailModal = ({ vehicle, isOpen, onClose, onBooking }) => {
  if (!isOpen || !vehicle) {
    return null;
  }

  const {
    name,
    brand,
    model,
    year,
    price,
    image,
    category,
    seats,
    fuelType,
    transmission,
    availability,
    color,
    description,
    features,
    plateNumber,
    location,
    deposit,
    insuranceIncluded
  } = vehicle;

  const isAvailable = availability !== false;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="vehicle-modal-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="vehicleModalTitle"
    >
      <div className="vehicle-modal-content">
        {/* Close Button */}
        <button
          className="vehicle-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Vehicle Image */}
        <div className="vehicle-modal-image">
          <img
            src={image || 'https://via.placeholder.com/400x300?text=Vehicle+Image'}
            alt={`${brand} ${name}`}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Vehicle+Image';
            }}
          />
          {!isAvailable && <div className="availability-badge unavailable">Not Available</div>}
          {isAvailable && <div className="availability-badge available">Available</div>}
        </div>

        {/* Vehicle Details */}
        <div className="vehicle-modal-details">
          <h2 id="vehicleModalTitle" className="vehicle-modal-title">
            {brand} {model}
          </h2>
          <p className="vehicle-modal-name">{name}</p>

          {/* Price and Category */}
          <div className="vehicle-info-section">
            <div className="info-item">
              <span className="info-label">Price per Day:</span>
              <span className="info-value price-highlight">₱{price?.toLocaleString() || '0'}/day</span>
            </div>
            <div className="info-item">
              <span className="info-label">Category:</span>
              <span className="info-value">{category}</span>
            </div>
          </div>

          {/* Basic Information */}
          <div className="vehicle-info-section">
            <div className="info-row">
              <div className="info-item">
                <span className="info-label">Year:</span>
                <span className="info-value">{year}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Color:</span>
                <span className="info-value">{color || 'N/A'}</span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-item">
                <span className="info-label">Seats:</span>
                <span className="info-value">{seats || '5'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Transmission:</span>
                <span className="info-value">{transmission || 'Automatic'}</span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-item">
                <span className="info-label">Fuel Type:</span>
                <span className="info-value">{fuelType || 'Gasoline'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Plate Number:</span>
                <span className="info-value">{plateNumber || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="vehicle-info-section">
            <div className="info-item">
              <span className="info-label">Location:</span>
              <span className="info-value">{location || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Security Deposit:</span>
              <span className="info-value">₱{deposit?.toLocaleString() || '0'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Insurance Included:</span>
              <span className="info-value">{insuranceIncluded ? 'Yes' : 'No'}</span>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="vehicle-info-section">
              <p className="info-label">Description:</p>
              <p className="vehicle-description">{description}</p>
            </div>
          )}

          {/* Features */}
          {features && features.length > 0 && (
            <div className="vehicle-info-section">
              <p className="info-label">Features:</p>
              <div className="features-list">
                {features.map((feature, index) => (
                  <span key={index} className="feature-tag">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="vehicle-modal-actions">
            {isAvailable ? (
              <button
                className="btn-book-now"
                onClick={() => {
                  if (onBooking) {
                    onBooking(vehicle);
                  }
                }}
              >
                Book Now
              </button>
            ) : (
              <button className="btn-unavailable" disabled>
                Currently Not Available
              </button>
            )}
            <button className="btn-close-modal" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailModal;
