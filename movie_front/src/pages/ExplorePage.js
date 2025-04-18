import React from "react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import { IoFilter } from "react-icons/io5";
import Filter from "../components/Filter";
import Button from "@mui/material/Button";

const ExplorePage = () => {
  const allMovieData = useSelector((state) => state.cineData.allMovieData);
  const filteredData = useSelector((state) => state.cineData.filteredMovieData);
  const [isVisible, setIsVisible] = useState(false);
  const [showFilterData, setShowFilterData] = useState(false);

  //console.log(allMovieData);
  return (
    <div className="pt-1">
      <div className="container mx-auto">
        <div className="flex flex-row justify-between items-center">
          <h2 className="capitalize text-lg font-semibold my-3 lg:text-xl ml-9">
            Popular Movies
          </h2>
          {showFilterData ? (
            <div className="flex flex-row gap-3 items-center">
              <Button
                variant="outlined"
                onClick={() => setShowFilterData(false)}
              >
                Clear Filter
              </Button>
              <button onClick={() => setIsVisible(true)}>
                <IoFilter className="text-3xl mr-[50px] cursor-pointer" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsVisible(true)}>
              <IoFilter className="text-3xl mr-[50px] cursor-pointer" />
            </button>
          )}
        </div>
        {showFilterData ? (
          <div className="grid grid-cols-[repeat(auto-fit,220px)] gap-6 ml-9">
            {filteredData.map((allMovieData, index) => {
              return (
                <Card
                  data={allMovieData}
                  key={allMovieData.id + "explore" + index}
                />
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,220px)] gap-6 ml-9">
            {allMovieData.all.map((allMovieData, index) => {
              return (
                <Card
                  data={allMovieData}
                  key={allMovieData.id + "explore" + index}
                />
              );
            })}
          </div>
        )}
      </div>
      {isVisible && (
        <Filter
          onClose={() => setIsVisible(false)}
          showFilter={() => setShowFilterData(true)}
        />
      )}
    </div>
  );
};

export default ExplorePage;
