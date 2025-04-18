import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

const Card = ({ data, index, flash }) => {
  const posterr = `/assets/poster/${data.poster}`;
  const no_image = require("../assets/error.jpg");
  return (
    <Link
      to={"/movie" + "/" + data.id}
      className="w-full min-w-[220px] max-w-[220px] h-70 overflow-hidden block rounded relative hover:scale-110 transition-all"
    >
      <img
        src={posterr}
        alt="poster"
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop in case fallback image also fails
          e.target.src = no_image; // Path to the fallback image
        }}
      />
      {flash ? (
        <div className="absolute top-3">
          <div className="py-1 px-3 backdrop-blur-3xl rounded-r-full bg-black/60 overflow-hidden">
            #{index} Rated
          </div>
        </div>
      ) : null}
      <div className="absolute bottom-0 h-16 backdrop-blur-3xl w-full bg-black/80 p-2">
        <h2 className="text-ellipsis line-clamp-1 text-l font-semibold">
          {data.title}
        </h2>
        <div className="text-sm text-neutral-400 flex justify-between items-center">
          <p>
            {moment(data.release_date, "YYYY-MM-DD").format("MMMM Do YYYY")}
          </p>
          <p className="bg-black px-1 rounded-full text-xs text-white">
            Rating: {data.rating}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
