import React, { useRef } from "react";
import Card from "../components/Card";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const HorizontalCard = ({ data = [], heading, flash }) => {
  const containerRef = useRef();

  const handleNext = () => {
    containerRef.current.scrollLeft += 300;
  };

  const handlePrev = () => {
    containerRef.current.scrollLeft -= 300;
  };

  return (
    <div className="container mx-auto px-3 my-6">
      <h2 className="text-xl font-bold mb-2 text-white">{heading}</h2>

      <div className="relative">
        <div
          ref={containerRef}
          className="grid grid-cols-[repeat(auto-fit,220px)] grid-flow-col gap-6 overflow-hidden relative z-10 overflow-x-scroll scroll-smooth transition-all scrollbar-none"
        >
          {data.map((data, index) => {
            return (
              <Card
                key={data.id + "top" + index}
                data={data}
                index={index + 1}
                flash={flash}
              />
            );
          })}
        </div>

        <div className="absolute top-0 flex justify-between w-full h-full items-center pointer-events-none">
          <button
            onClick={handlePrev}
            className="bg-white p-1 text-black rounded-full -ml-2 z-10 pointer-events-auto"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={handleNext}
            className="bg-white p-1 text-black rounded-full -mr-2 z-10 pointer-events-auto"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalCard;
