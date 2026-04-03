import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";
import axios from "axios";
import { MapPin, Box } from "lucide-react";
import DeliveryTracking from "./DeliveryTracking";

function DeliveryPartnerDashBoard() {
  const { userData } = useSelector((state) => state.user);
  const { currentAddress } = useSelector((state) => state.user);

  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [otpInput, setOtpInput] = useState(false);
  const [otp, setOtp] = useState("");

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        {
          withCredentials: true,
        },
      );
      console.log(result.data);
      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrders = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-orders`, {
        withCredentials: true,
      });
      setAvailableAssignments(result.data.assignments);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptOrders = async (assignmentId) => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        {
          withCredentials: true,
        },
      );
      await getCurrentOrder();
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendOtp = async () => {
    setOtpInput(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,
        {
          orderId: currentOrder?._id,
          restaurantOrderId: currentOrder?.restaurantOrder?._id,
        },
        { withCredentials: true },
      );
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleVerifyOtp = async () => {
    setOtpInput(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder?._id,
          restaurantOrderId: currentOrder?.restaurantOrder?._id,
          otp,
        },
        { withCredentials: true },
      );
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
    getCurrentOrder();
  }, [userData]);
  return (
    <div className="bg-[#f7fff6] flex flex-col items-center min-h-screen w-screen gap-5 pt-[80px] overflow-y-auto">
      <Navbar />
      <div className="w-full max-w-[800px] flex-col flex items-center gap-5">
        <div className="w-[90%] bg-white rounded-2xl border border-green-100 shadow-md p-5 flex flex-col justify-between items-center">
          <h1 className="text-xl  font-bold text-[#83e34e]">
            Welcome, {userData?.user?.fullname}
          </h1>
          <div className="flex items-center gap-2 text-md text-[#83e34e] ">
            <MapPin />
            Current Location: {currentAddress}
          </div>
        </div>

        {!currentOrder && (
          <div className="w-[90%] bg-white rounded-2xl border border-green-100 shadow-md p-5">
            <h1 className="text-lg mb-4 flex items-center gap-2 font-bold text-[#83e34e]">
              Available Orders:
            </h1>
            <div className="space-y-4">
              {availableAssignments?.length > 0 ? (
                availableAssignments?.map((a, index) => (
                  <div
                    className="border flex items-center justify-between p-4 rounded-lg"
                    key={index}
                  >
                    <div>
                      <h2 className="font-semibold text-sm text-gray-600">
                        {a?.restaurant}
                      </h2>
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">
                          Delivery Address:{" "}
                        </span>
                        {a?.deliveryAddress?.text}
                      </p>
                      <p className="text-xs text-gray-500">
                        {a?.items?.length} items | ₹{a?.subtotal}
                      </p>
                    </div>

                    <button
                      className="bg-[#83e34e] text-white px-2 py-1 rounded-lg text-sm"
                      onClick={() => acceptOrders(a?.assignmentId)}
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-gray-500">
                  No available orders
                </p>
              )}
            </div>
          </div>
        )}

        {currentOrder && (
          <div className="w-[90%] max-w-[800px] bg-white rounded-2xl border-green-100 shadow-md p-5">
            <div className="flex items-center gap-2 mb-3">
              <Box />
              <h2 className="font-bold text-lg">CurrentOrder</h2>
            </div>
            <div className="space-y-2 border rounded-lg p-4 mb-3">
              <p className="text-sm font-semibold text-gray-700">
                {currentOrder.restaurant?.name}
              </p>
              <p className="text-xs text-gray-500">
                <span className="font-semibold">Delivery Address: </span>
                {currentOrder.deliveryAddress?.text}
              </p>
              <p className="text-xs text-gray-500">
                {currentOrder.restaurantOrder?.orderItems?.length} items | ₹
                {currentOrder.restaurantOrder?.subtotal}
              </p>
            </div>

            <DeliveryTracking data={currentOrder} />

            {!otpInput ? (
              <button
                onClick={handleSendOtp}
                className="w-full bg-[#83e34e] shadow-md text-white font-semibold rounded-xl px-4 py-2 mt-4 hover:bg-[#62c23a] active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Mark as Delivered
              </button>
            ) : (
              <div className="mt-4 p-4 border bg-gray-50 rounded-xl">
                <p className="text-sm font-semibold text-gray-400">
                  Enter Customer OTP sent to{" "}
                  <span className="text-[#83e34e]">
                    {currentOrder?.user?.fullname}
                  </span>
                </p>
                <input
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-xl mt-2"
                  placeholder="Enter OTP"
                />
                <button
                  onClick={handleVerifyOtp}
                  className="w-full py-2 px-2 rounded-xl shadow-md bg-[#83e34e] text-white font-semibold hover:bg-[#62c23a] active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  Submit OTP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryPartnerDashBoard;
