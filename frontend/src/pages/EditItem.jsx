import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaUtensils } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import axios from "axios";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";

function EditItem() {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const [currentItem, setCurrentItem] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState(null);
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = ["Snacks", "Main Course", "Desserts", "Pizza", "Burger"];

  const dispatch = useDispatch();
  const handleImage = (e) => {
    const file = e.target.files[0];
    // console.log("Selected file:", file);
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("foodType", foodType);
      formData.append("price", price);

      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/item/edit-item/${itemId}`,
        formData,
        { withCredentials: true }
      );
      dispatch(setMyShopData(result.data));
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleGetItemById = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/item/get-by-id/${itemId}`,
          { withCredentials: true }
        );
        setCurrentItem(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    handleGetItemById();
  }, [itemId]);

  useEffect(() => {
    setName(currentItem?.name || "");
    setPrice(currentItem?.price || 0);
    setCategory(currentItem?.category || "");
    setFoodType(currentItem?.foodType || "");
    setFrontendImage(currentItem?.image || "");
  }, [currentItem]);
  return (
    <div className="flex justify-center items-center flex-col p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen">
      <div
        className="absolute top-[20px] left-[20px] z-[10] mb-[10]"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack size={35} className="text-[#ff422d]" />
      </div>
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <FaUtensils className="text-[#ff4d2d] w-16 h-16" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">Edit Food</div>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="addedshopname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="addedshopname"
              type="text"
              placeholder="Enter Item Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div>
            <label
              htmlFor="addedshopfile"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Food Image
            </label>
            <input
              id="addedshopfile"
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500"
              onChange={handleImage}
            />
            {frontendImage && (
              <div className="mt-4">
                <img
                  src={frontendImage}
                  alt="item image"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="addedshopprice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price
            </label>
            <input
              id="addedshopprice"
              type="number"
              placeholder="0"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </div>

          <div>
            <label
              htmlFor="addedshopcategory"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Category
            </label>
            <select
              name="foodCategory"
              id="addedshopcategory"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="">Select Category</option>
              {categories.map((cate, index) => (
                <option value={cate} key={index}>
                  {cate}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="addedshopfoodtype"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Food Type
            </label>
            <select
              name="foodType"
              id="addedshopfoodtype"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setFoodType(e.target.value)}
              value={foodType}
            >
              <option value="veg">Veg</option>
              <option value="non veg">Non-Veg</option>
            </select>
          </div>

          <button
            className="w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditItem;
