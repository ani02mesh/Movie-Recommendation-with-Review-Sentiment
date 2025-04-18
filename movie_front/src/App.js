import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAllMovieData, setCardData } from "./store/cineSlice";

function App() {
  const dispatch = useDispatch();

  //const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both APIs in parallel using Promise.all
        const [response, response1] = await Promise.all([
          fetch("http://127.0.0.1:8000/?movie_count=19"),
          fetch("http://127.0.0.1:8000/all"),
        ]);

        // Check if both responses are ok
        if (!response.ok || !response1.ok) {
          throw new Error("Failed to fetch data");
        }

        // Parse both responses
        const result = await response.json();
        const result1 = await response1.json();

        // Dispatch actions to store data in Redux state
        console.log("executing dispatch");
        dispatch(setCardData(result));
        dispatch(setAllMovieData(result1));
        console.log("dispatched");
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <main className="pb-4">
      <Header />
      <div className="pt-16">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}

export default App;
