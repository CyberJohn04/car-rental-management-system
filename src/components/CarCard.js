import React from 'react';
import { Link } from 'react-router-dom';

const CarCard = ({ car, onRent }) => {
  const {
    id,
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
    features
  } = car;

  const handleRentClick = () => {
    if (onRent) {
      onRent(car);
    }
  };

  // Format price with Philippine Peso symbol
  const formattedPrice = price ? `₱${price.toLocaleString()}/day` : '₱0/day';
  const isAvailable = availability !== false;

  return (
    <div className={`car-card-landing ${!isAvailable ? 'unavailable' : ''}`}>
      <div className="car-image-landing">
        <img 
          src={image || '/assets/images/car1.jpg'} 
          alt={`${brand} ${name}`}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Car+Image';
          }}
        />
      </div>

      <h3 className="car-name-landing">{name}</h3>

      <p className="price-landing">{formattedPrice}</p>

      <button 
        className="btn-view-details" 
        onClick={handleRentClick}
      >
        {isAvailable ? 'View Details' : 'Not Available'}
      </button>
    </div>
  );
};

export default CarCard;

