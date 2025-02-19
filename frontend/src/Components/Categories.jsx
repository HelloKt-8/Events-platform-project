import React from "react";

const Categories = () => {
  const categories = [
    { name: "sport", img: "https://img.icons8.com/?size=100&id=9820&format=png&color=000000"},
    { name: "comedy", img: "https://img.icons8.com/?size=100&id=598&format=png&color=000000" },
    { name: "party", img: "https://img.icons8.com/?size=100&id=33902&format=png&color=000000" },
    { name: "music", img: "https://img.icons8.com/?size=100&id=EKc45bPQKzyu&format=png&color=000000" },
    { name: "holidays", img: "https://img.icons8.com/?size=100&id=31799&format=png&color=000000" },
    { name: "games", img: "https://img.icons8.com/?size=100&id=51F0o6bWwYMt&format=png&color=000000" },
    { name: "food", img: "https://img.icons8.com/?size=100&id=7613&format=png&color=000000" },
    { name: "networking", img: "https://img.icons8.com/?size=100&id=62135&format=png&color=000000" },
  ];

  return (
    <div className="scrollmenu">
      {categories.map((category, index) => (
        <div key={index} className="category-item">
          <a href={`#${category.name}`} className="category-link">
            <img src={category.img} alt={category.name} />
            <p>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</p>
          </a>
        </div>
      ))}
    </div>
  );
};

export default Categories;
