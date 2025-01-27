import React from "react";

const Categories = () => {
  const categories = [
    { name: "Sport", img: "https://img.icons8.com/?size=100&id=9820&format=png&color=000000" },
    { name: "Comedy", img: "https://img.icons8.com/?size=100&id=598&format=png&color=000000" },
    { name: "Party", img: "https://img.icons8.com/?size=100&id=33902&format=png&color=000000" },
    { name: "Music", img: "https://img.icons8.com/?size=100&id=EKc45bPQKzyu&format=png&color=000000" },
    { name: "Holidays", img: "https://img.icons8.com/?size=100&id=31799&format=png&color=000000" },
    { name: "Games", img: "https://img.icons8.com/?size=100&id=51F0o6bWwYMt&format=png&color=000000" },
    { name: "Food", img: "https://img.icons8.com/?size=100&id=7613&format=png&color=000000" },
    { name: "Networking", img: "https://img.icons8.com/?size=100&id=62135&format=png&color=000000" },
  ];

  return (
    <div className="scrollmenu">
      {categories.map((category, index) => (
        <div key={index} className="category-item">
          <a href={`#${category.name}`}>
            <img src={category.img} alt={category.name} />
            <p>{category.name}</p>
          </a>
        </div>
      ))}
    </div>
  );
};

export default Categories;
