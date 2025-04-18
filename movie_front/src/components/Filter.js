import React from "react";
import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useDispatch } from "react-redux";
import { setFilteredMovieData } from "../store/cineSlice";

export default function Filter({ onClose, showFilter }) {
  const dispatch = useDispatch();

  const [rating, setRating] = useState([0, 10]);
  const [year, setYear] = useState([1921, 2025]);
  const [genre, setGenre] = useState([]);
  const [country, setCountry] = useState([]);

  const countries = [
    "India",
    "Denmark",
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Australia",
    "South Korea",
    "Hong Kong",
    "Japan",
    "Italy",
    "Ireland",
    "Spain",
    "China",
    "other",
  ];
  const genres = [
    "Comedy",
    "Action",
    "Crime",
    "Drama",
    "Thriller",
    "Biography",
    "Musical",
    "Romance",
    "History",
    "War",
    "Family",
    "Sport",
    "Mystery",
    "Sci-Fi",
    "Adventure",
    "Music",
    "Fantasy",
    "Animation",
    "Science Fiction",
    "Western",
    "Horror",
    "Film-Noir",
    "Documentary",
    "Foreign",
  ];

  const [chipData, setChipData] = React.useState([]);

  useEffect(() => {
    const updatedChips = [
      { key: 0, label: `Min Rating : ${rating[0]}` },
      { key: 1, label: `Max Rating : ${rating[1]}` },
      { key: 2, label: `From : ${year[0]}` },
      { key: 3, label: `To : ${year[1]}` },
    ];
    setChipData(updatedChips);
  }, [rating, year]);

  const handleRatingSliderChange = (event, newValue) => {
    setRating(newValue); // Update rating
  };

  const handleYearSliderChange = (event, newValue) => {
    setYear(newValue); // Update Year
  };

  const handleGenreCheckboxChange = (event) => {
    const { value, checked } = event.target;
    // Update selectedGenres based on whether the checkbox was checked or unchecked
    setGenre((prevGenres) =>
      checked
        ? [...prevGenres, value]
        : prevGenres.filter((genre) => genre !== value)
    );
  };

  const handleCountryCheckboxChange = (event) => {
    const { value, checked } = event.target;
    // Update selectedGenres based on whether the checkbox was checked or unchecked
    setCountry((prevCountry) =>
      checked
        ? [...prevCountry, value]
        : prevCountry.filter((country) => country !== value)
    );
  };

  const resetFilter = (event) => {
    setRating([0, 10]);
    setYear([1921, 2025]);
    setGenre([]);
    setCountry([]);
  };

  const fetchFilterMovies = async (url) => {
    try {
      const response = await fetch(url);

      // Check if both responses are ok
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      // Parse both responses
      const result = await response.json();

      // Dispatch actions to store data in Redux state
      console.log("executing dispatch");
      console.log(result);
      dispatch(setFilteredMovieData(result.filter_movies));
      console.log("dispatched");
    } catch (error) {
      console.log("error", error);
    }
  };

  const applyFilter = (event) => {
    const genreQueryString =
      genre.length > 0
        ? genre.map((g) => `filter_genre=${encodeURIComponent(g)}`).join("&")
        : "";
    const countryQueryString =
      country.length > 0
        ? country
            .map((g) => `filter_country=${encodeURIComponent(g)}`)
            .join("&")
        : "";
    const url = `http://127.0.0.1:8000/filter/?min_rating=${rating[0]}&max_rating=${rating[1]}&min_year=${year[0]}&max_year=${year[1]}`;
    const finalUrl = `${url}${genreQueryString ? "&" + genreQueryString : ""}${
      countryQueryString ? "&" + countryQueryString : ""
    }`;
    fetchFilterMovies(finalUrl);
    showFilter();
    onClose();
    console.log(finalUrl);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md"></div>

      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="p-6 bg-gray-700 rounded-lg shadow-lg w-[800px] relative">
          <div className="flex flex-row gap-10 items-center justify-between">
            <h2 className="font-bold mb-4 text-lg">Filter</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-500 text-2xl"
            >
              <MdClose />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <Box sx={{ width: 600 }}>
              <div className="flex flex-row gap-3">
                {genre.map((data) => {
                  return <Chip color="primary" label={data} />;
                })}
              </div>
            </Box>

            <Box sx={{ width: 600 }}>
              <div className="flex flex-row gap-3">
                {country.map((data) => {
                  return <Chip color="primary" label={data} />;
                })}
              </div>
            </Box>

            <div className="flex flex-row gap-[110px] mt-2 items-center border-t border-blue-950">
              <h3>Movie Ratings</h3>
              <Box sx={{ width: 300 }}>
                <h3>Rating</h3>
                <Slider
                  min={0}
                  max={10}
                  value={rating}
                  onChange={handleRatingSliderChange}
                  valueLabelDisplay="auto"
                />
              </Box>
            </div>

            <div className="flex flex-row gap-[100px] items-center">
              <h3>Releasing Years</h3>
              <Box sx={{ width: 300 }}>
                <h3>Released Year</h3>
                <Slider
                  min={1921}
                  max={2025}
                  value={year}
                  onChange={handleYearSliderChange}
                  valueLabelDisplay="auto"
                />
              </Box>
            </div>

            <div className="flex flex-row gap-20 items-center mt-2 border-t border-blue-950">
              <h3 className="w-10">Genres</h3>
              <Box sx={{ width: 800 }}>
                <div className="flex flex-wrap gap-0 text-black">
                  {genres.map((gen, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          value={gen}
                          checked={genre.includes(gen)}
                          onChange={handleGenreCheckboxChange}
                        />
                      }
                      label={gen}
                      labelPlacement="end"
                    />
                  ))}
                </div>
              </Box>
            </div>

            <div className="flex flex-row gap-20 items-center mt-2 border-t border-blue-950">
              <h3 className="w-10">Country</h3>
              <Box sx={{ width: 800 }}>
                <div className="flex flex-wrap gap-0 text-black">
                  {countries.map((countr, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          value={countr}
                          checked={country.includes(countr)}
                          onChange={handleCountryCheckboxChange}
                        />
                      }
                      label={countr}
                      labelPlacement="end"
                    />
                  ))}
                </div>
              </Box>
            </div>
          </div>

          <div className="flex flex-row justify-between mt-2">
            <Button variant="outlined" onClick={resetFilter}>
              Reset
            </Button>
            <Button variant="contained" onClick={applyFilter}>
              Apply
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
