import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import axios from "axios";

const AuthHandler = () => {
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      axios
        .post("https://eventura-7.onrender.com/auth", {
          sub: user.sub,
          name: user.name,
          email: user.email,
          picture: user.picture
        })
        .then((res) => console.log("User saved:", res.data))
        .catch((err) => console.error("Error saving user:", err));
    }
  }, [isAuthenticated, user]);

  return null; // This component only handles authentication logic
};

export default AuthHandler;
