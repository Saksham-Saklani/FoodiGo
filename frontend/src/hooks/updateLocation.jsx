import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useSelector } from "react-redux";

export const useUpdateLocation = () => {
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      try {
        const result = await axios.post(
          `${serverUrl}/api/user/update-location`,
          { lat, lon },
          { withCredentials: true },
        );
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    navigator.geolocation.watchPosition((pos) => {
      updateLocation(pos.coords.latitude, pos.coords.longitude);
    });
  }, [userData]);
};
