import React, { useState, useEffect } from "react";

const LondonBanner = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    {
      img: "https://www.chambersstudent.co.uk/media/1198/the_city_london.jpg",
      caption: "LIVE LIFE IN LONDON",
    },
    {
      img: "https://www.thejazzbar.co.uk/wp-content/uploads/2016/10/cropped-Jazz-Bar-Edinburgh-Int-View.jpg",
      caption: "JIVE TO JAZZ",
    },
    {
      img: "https://img.freepik.com/premium-photo/wide-banner-chess-pawns-concepts-challenge-critical-decision-smart-moves_1061852-7968.jpg",
      caption: "LONDON CHESS CHAMPIONSHIP COMPETITION",
    },
  ];

  const nextSlide = () => {
    setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setSlideIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="slideshow-container">
      {slides.map((slide, index) => (
        <div
          className="mySlides"
          style={{ display: slideIndex === index ? "block" : "none" }}
          key={index}
        >
          <img
            src={slide.img}
            alt={slide.caption}
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
          <div className="text">{slide.caption}</div>
        </div>
      ))}

      <button onClick={prevSlide}>&#10094;</button>
      <button onClick={nextSlide}>&#10095;</button>

      <div style={{ textAlign: "center" }}>
        {slides.map((_, index) => (
          <span
            className={`dot ${slideIndex === index ? "active" : ""}`}
            onClick={() => setSlideIndex(index)}
            key={index}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default LondonBanner;
