import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);
  const [team, setTeam] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, venuesRes, teamRes, reviewsRes] = await Promise.all([
          axios.get("https://eventura-2.onrender.com/categories"),
          axios.get("https://eventura-2.onrender.com/venues"),
          axios.get("https://eventura-2.onrender.com/team"),
          axios.get("https://eventura-2.onrender.com/reviews"),
        ]);

        setCategories(categoriesRes.data);
        setVenues(venuesRes.data);
        setTeam(teamRes.data);
        setReviews(reviewsRes.data.slice(0, 8)); // Show only 8 reviews
        setLoading(false);
      } catch (err) {
        console.error("🔴 Error fetching data:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ categories, venues, team, reviews, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

