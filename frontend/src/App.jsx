import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import { useCurrentUser } from "./hooks/currentUser";
import Home from "./pages/home";
import { useSelector, useDispatch } from "react-redux";
import { useCurrentCity } from "./hooks/city";
import UserDashboard from "./components/UserDashboard";
import OwnerDashboard from "./components/OwnerDashboard";
import { useMyRestaurant } from "./hooks/myRestaurant";
import CreateEditRestaurant from "./pages/CreateEditRestaurant";
import AddItem from "./pages/AddItem";
import { useMyCityRestaurants } from "./hooks/myCityRestaurants";
import EditItem from "./pages/EditItem";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import OrderPlaced from "./pages/OrderPlaced";
import { useMyOrders } from "./hooks/getMyOrders";
import { useUpdateLocation } from "./hooks/updateLocation";
import TrackOrder from "./pages/TrackOrder";
import Restaurant from "./pages/Restaurant";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { setSocket } from "./redux/userSlice";
export const serverUrl = "https://foodigo-ng8z.onrender.com";

function App() {
  useCurrentUser();
  useCurrentCity();
  useMyRestaurant();
  useMyCityRestaurants();
  useMyOrders();
  useUpdateLocation();

  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const socketInstance = io(serverUrl, { withCredentials: true });
    dispatch(setSocket(socketInstance));

    socketInstance.on("connect", () => {
      if (userData) {
        socketInstance.emit("identity", { userId: userData.user._id });
      }
    })
    
    return () => {
      socketInstance.disconnect()
    }
  }, [userData?.user?._id]);

  return (
    <>
      <Routes>
        <Route path="/register" element={!userData ? <Register /> : <Home />} />
        <Route path="/login" element={!userData ? <Login /> : <Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/user-dashboard"
          element={!userData ? <Login /> : <UserDashboard />}
        />
        <Route path="/" element={!userData ? <Login /> : <Home />} />
        <Route
          path="/create-edit-restaurant"
          element={<CreateEditRestaurant />}
        />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/edit-item/:itemId" element={<EditItem />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-placed" element={<OrderPlaced />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/track-order/:orderId" element={<TrackOrder />} />
        <Route path="/restaurant/:restaurantId" element={<Restaurant />} />
      </Routes>
    </>
  );
}

export default App;
