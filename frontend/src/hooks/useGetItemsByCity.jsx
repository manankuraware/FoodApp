import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setIemsInMyCity } from "../redux/userSlice";

export default function useGetItemsByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/item/get-by-city/${currentCity}`,
          {
            withCredentials: true,
          }
        );
        // console.log(result);
        dispatch(setIemsInMyCity(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchItems();
  }, [currentCity]);
}
