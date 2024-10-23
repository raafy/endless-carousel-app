"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const totalImages = 5; // Change this to control the number of images

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  const previousImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      nextImage();
    } else if (e.key === "ArrowLeft") {
      previousImage();
    }
  };

  useEffect(() => {
    const handleKeyboardEvents = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener("keydown", handleKeyboardEvents);

    return () => {
      window.removeEventListener("keydown", handleKeyboardEvents);
    };
  });

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(nextImage, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const distanceX = touchStartX.current - touchEndX.current;

    if (distanceX > 50) {
      nextImage();
    } else if (distanceX < -50) {
      previousImage();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const toggleAutoplay = () => {
    setIsPlaying((prev) => !prev);
  };

  const images = Array.from(
    { length: totalImages },
    (_, index) => `https://picsum.photos/600/300?random=${index + 1}`
  );

  return (
    <div
      className="relative max-w-lg mx-auto overflow-hidden rounded-md"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-300"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="flex-shrink-0 w-full">
            <Image
              src={image}
              alt={`Random Image ${index + 1}`}
              width={600}
              height={300}
              className="object-cover rounded-md"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      <div className="absolute top-1/2 left-5 transform -translate-y-1/2">
        <button
          onClick={previousImage}
          className="p-4 font-extrabold bg-black bg-opacity-30 backdrop-blur-lg text-white rounded-lg"
        >
          &lt;
        </button>
      </div>
      <div className="absolute top-1/2 right-5 transform -translate-y-1/2">
        <button
          onClick={nextImage}
          className="p-4 font-extrabold bg-black bg-opacity-30 backdrop-blur-lg text-white rounded-lg"
        >
          &gt;
        </button>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${
              currentIndex === index ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
      <button
        onClick={toggleAutoplay}
        className="absolute bottom-0 right-0 m-4 p-2 bg-black bg-opacity-30 backdrop-blur-lg text-white rounded"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}
