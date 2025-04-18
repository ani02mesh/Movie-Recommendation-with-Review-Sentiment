import React from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaImdb, FaClock } from "react-icons/fa";
import Review from "../components/Review";
import HorizontalCard from "../components/HorizontalCard";

const DetailPage = () => {
  const movie_id = useParams();
  const [movieData, setMovieData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [recommendData, setRecommendData] = useState([]);

  const user = require("../assets/user.png");
  const no_image = require("../assets/error.jpg");

  useEffect(() => {
    const sendId = async () => {
      // Ensure queryValue is not null before making the request
      if (movie_id) {
        // Send data as query parameter in the URL
        const response = await fetch(
          `http://127.0.0.1:8000/selected_movie/?id=${movie_id.id}`,
          {
            method: "GET", // Use GET method to include query params in the URL
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMovieData(data.selected_movie);
          setReviewData(data.selected_reviews);
          setRecommendData(data.recommended);
        }
      }
    };

    sendId();
  }, [movie_id.id]);
  return (
    <div>
      {movieData.length > 0 ? (
        movieData.map((movie, index) => (
          <div className="bg-gray-900 text-white p-6 min-h-screen">
            <div className="flex justify-start items-center">
              {/* Movie Section */}
              <div className="flex gap-6 max-w-full">
                <img
                  src={`/assets/poster/${movie.poster}`}
                  alt="Movie Poster"
                  className="rounded-lg w-72 h-auto object-cover"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop in case fallback image also fails
                    e.target.src = no_image; // Path to the fallback image
                  }}
                />

                <div className=" flex flex-col max-w-98 min-w-96">
                  <h2 className="text-3xl font-bold">{movie.title}</h2>
                  <div className="flex gap-3 mt-9">
                    {movie.genre.map((genres, index) => (
                      <span className="bg-gray-700 px-6 py-1 rounded-lg text-base">
                        {genres}
                      </span>
                    ))}
                  </div>

                  {/* Ratings and Duration */}
                  <div className="flex items-center gap-10 mt-3 text-gray-300">
                    <div className="flex items-center gap-2">
                      <FaImdb className="text-yellow-500 text-4xl -p-1" />
                      <div className="flex flex-col items-start space-y-0">
                        <span className="text-lg font-semibold text-white mt-2">
                          {movie.rating}/10
                        </span>
                        <span className="text-sm text-gray-400">
                          {movie.vote_count}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-300 text-xl" />
                      <span>{movie.duration}</span>
                    </div>
                  </div>

                  <p className="mt-7 text-gray-300">{movie.desc}</p>
                  <p className="mt-7 text-gray-300 border-t border-gray-700 pt-1">
                    <span className="text-blue-300 font-bold">Tagline - </span>
                    {movie.tagline}
                  </p>
                  <div className="flex flex-row gap-40 border-t border-gray-700 mt-7">
                    <div className="text-gray-300 pt-1 flex flex-col">
                      <span className="text-blue-300 font-bold">Budget</span>
                      {movie.budget?.length
                        ? `${movie.budget} (Estimated)`
                        : "-"}
                    </div>
                    <div className="text-gray-300 pt-1 flex flex-col">
                      <span className="text-blue-300 font-bold">Gross</span>
                      {movie.Gross?.length ? `${movie.Gross} (Estimated)` : "-"}
                    </div>
                  </div>
                </div>

                <div className="mt-5 min-w-80 flex flex-col">
                  <h3 className="font-semibold border-t border-gray-700 pt-1 text-blue-300">
                    Director
                  </h3>
                  <p className="pb-5 text-gray-300">
                    {movie.Director.join(" • ")}
                  </p>

                  <h3 className="font-semibold mt-5 border-t border-gray-700 pt-1 text-blue-300">
                    Spoken Language
                  </h3>
                  <p className="pb-5 text-gray-300">
                    {movie.spoken_language.join(" • ")}
                  </p>

                  <h3 className="font-semibold mt-5 border-t border-gray-700 pt-1 text-blue-300">
                    Release_date
                  </h3>
                  <p className="pb-5 text-gray-300">
                    {moment(movie.release_date, "YYYY-MM-DD").format(
                      "MMMM Do YYYY"
                    )}
                  </p>

                  <h3 className="font-semibold mt-5 border-t border-gray-700 pt-1 text-blue-300">
                    Production Company
                  </h3>
                  <p className="pb-5 text-gray-300">
                    {movie.production_company?.length
                      ? movie.production_company.join(" • ")
                      : "-"}
                  </p>

                  <h3 className="font-semibold mt-5 border-t border-gray-700 pt-1 text-blue-300">
                    Origin Country
                  </h3>
                  <p className="pb-5 text-gray-300">{movie.origin_country}</p>
                </div>
              </div>
            </div>
            <div className="mt-9 ml-[310px] border-t border-gray-700 pt-1 text-blue-300 flex flex-col">
              <h3 className="font-semibold">Cast</h3>
              <div className="flex flex-wrap w-full gap-5 gap-y-7 mt-3">
                {movie.Cast?.length
                  ? movie.Cast.map((cast, index) => (
                      <div className="flex flex-col items-center">
                        <img
                          className="rounded-full h-[116px] w-[110px]"
                          src={user}
                          alt="img"
                          onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop in case fallback image also fails
                            e.target.src = user; // Path to the fallback image
                          }}
                        />
                        <span className="text-white font-semibold">
                          {cast.actor}
                        </span>
                        <span className="text-sm text-gray-500">
                          {cast.character}
                        </span>
                      </div>
                    ))
                  : "No Information Available"}
              </div>
            </div>
            <Review data={reviewData} key={movie_id.id} />
            <div>
              <HorizontalCard
                data={recommendData}
                heading={"Similar Movies"}
                flash={false}
              />
            </div>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DetailPage;
