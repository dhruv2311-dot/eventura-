import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);
  const [team, setTeam] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get("https://eventura-2.onrender.com/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));

    axios.get("https://eventura-2.onrender.com/venues")
      .then(res => setVenues(res.data))
      .catch(err => console.error("Error fetching venues:", err));

    axios.get("https://eventura-2.onrender.com/team")
      .then(res => setTeam(res.data))
      .catch(err => console.error("Error fetching team:", err));

    axios.get("https://eventura-2.onrender.com/reviews")
      .then(res => setReviews(res.data.slice(0, 8)))
      .catch(err => console.error("Error fetching reviews:", err));
  }, []);

  return (
    <DataContext.Provider value={{ categories, venues, team, reviews }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
