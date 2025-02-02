import React, { useState, useEffect } from "react";

const LondonBanner = () => {
  const [slideIndex, setSlideIndex] = useState(1);
  const [direction, setDirection] = useState(1); 

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

  const showSlides = (n) => {
    if (n > slides.length) setSlideIndex(1);   
    if (n < 1) setSlideIndex(slides.length);  
    setSlideIndex(n);
  };

  const plusSlides = (n) => {
    showSlides(slideIndex + n);
  };

  const currentSlide = (n) => {
    showSlides(n);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      plusSlides(direction);  
    }, 5000); 

    return () => clearInterval(timer);
  }, [slideIndex, direction]); 

  useEffect(() => {
    if (slideIndex === slides.length || slideIndex === 1) {
      setDirection(direction * -1); 
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

      <button onClick={() => plusSlides(-1)}>&#10094;</button>
      <button onClick={() => plusSlides(1)}>&#10095;</button>

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
