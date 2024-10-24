import React from 'react';

const CategoryFilter = ({ onCategoryChange }) => {
  const categories = ['Business', 'Stocks', 'Finance', 'International Market'];

  return (
    <div>
      <h3>Filter by Category:</h3>
      {categories.map((category) => (
        <button key={category} onClick={() => onCategoryChange(category)}>
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
