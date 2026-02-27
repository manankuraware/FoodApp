import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
} from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

export default function useGetCity() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (positon) => {
      // console.log(positon);
      const latitude = positon.coords.latitude;
      const longitude = positon.coords.longitude;
      dispatch(setLocation({ lat: latitude, lon: longitude }));
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`,
      );
      // console.log(result.data.results[0].city);
      dispatch(
        setCurrentCity(
          result?.data?.results[0].city || result?.data?.results[0].county,
        ),
      );
      dispatch(setCurrentState(result?.data?.results[0].state));
      dispatch(
        setCurrentAddress(
          result?.data?.results[0].address_line1 ||
            result?.data?.results[0].address_line2,
        ),
      );
      dispatch(setAddress(result?.data?.results[0].address_line2));
    });
  }, [userData, dispatch, apiKey]);
}
