import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "../components/Card";

const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryValue = searchParams.get("q");
  const [responseData, setResponseData] = useState([]);

  useEffect(() => {
    const sendData = async () => {
      // Ensure queryValue is not null before making the request
      if (queryValue) {
        // Send data as query parameter in the URL
        const response = await fetch(
          `http://127.0.0.1:8000/receive-data/?name=${queryValue}`,
          {
            method: "GET", // Use GET method to include query params in the URL
          }
        );

        if (response.ok) {
          const data = await response.json();
          setResponseData(data.search_movies);
        }
      }
    };

    sendData();
  }, [queryValue]);

  return (
    <div className="pt-1">
      <div className="container mx-auto">
        <h2 className="capitalize text-lg font-semibold my-3 lg:text-xl">
          Search Results
        </h2>
        {responseData ? (
          <div className="grid grid-cols-[repeat(auto-fit,220px)] gap-6">
            {responseData.map((responseData, index) => {
              return (
                <Card
                  data={responseData}
                  key={responseData.id + "explore" + index}
                />
              );
            })}
          </div>
        ) : (
          <p>No Movies Found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
