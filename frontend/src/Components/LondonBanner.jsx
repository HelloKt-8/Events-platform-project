import React, { useState, useEffect } from "react";

const LondonBanner = () => {
  const [slideIndex, setSlideIndex] = useState(1);
  const [direction, setDirection] = useState(1);  // 1 means forward, -1 means backward

  // Slide data
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

  // Function to change slides
  const showSlides = (n) => {
    if (n > slides.length) setSlideIndex(1);   // loop back to first slide
    if (n < 1) setSlideIndex(slides.length);  // loop back to last slide
    setSlideIndex(n);
  };

  // Function to move to the next/previous slide
  const plusSlides = (n) => {
    showSlides(slideIndex + n);
  };

  // Function to set the slide directly
  const currentSlide = (n) => {
    showSlides(n);
  };

  // Set an interval to automatically rotate slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      plusSlides(direction);  // Move forward or backward depending on direction
    }, 5000); // 5000ms (5 seconds)

    // Cleanup timer when component unmounts
    return () => clearInterval(timer);
  }, [slideIndex, direction]); // The effect depends on the slideIndex and direction

  // Change direction when reaching the first or last slide
  useEffect(() => {
    if (slideIndex === slides.length || slideIndex === 1) {
      setDirection(direction * -1); // Reverse direction
    }
  }, [slideIndex]);

  return (
    <div className="slideshow-container">
      {slides.map((slide, index) => (
        <div
          className="mySlides"
          style={{ display: slideIndex === index + 1 ? "block" : "none" }}
          key={index}
        >
          <img src={slide.img} alt={slide.caption} style={{ maxWidth: "100%", maxHeight:"100%" }} />
          <div className="text">{slide.caption}</div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button onClick={() => plusSlides(-1)}>&#10094;</button>
      <button onClick={() => plusSlides(1)}>&#10095;</button>

      {/* Dots Navigation */}
      <div style={{ textAlign: "center" }}>
        {slides.map((_, index) => (
          <span
            className={`dot ${slideIndex === index + 1 ? "active" : ""}`}
            onClick={() => currentSlide(index + 1)}
            key={index}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default LondonBanner;
