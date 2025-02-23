import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DetailsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`https://eventura-2.onrender.com/categories/${id}`)
      .then(res => setData(res.data))
      .catch(err => console.error("Error fetching details:", err));
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="details-container">
      <h1>{data.name}</h1>
      <img src={data.image_url} alt={data.name} className="details-image" />
      <p>{data.description}</p>
    </div>
  );
};

export default DetailsPage;
