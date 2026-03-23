import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";
import axios from "axios";
import { MapPin } from "lucide-react";

function DeliveryPartnerDashBoard() {
  const { userData } = useSelector((state) => state.user);
  const { currentAddress } = useSelector((state) => state.user);

  const [availableAssignments, setAvailableAssignments] = useState([]);

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

  const acceptOrders = async(assignmentId) => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`,{
        withCredentials: true,
      })
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getOrders();
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
                    <h2 className="font-semibold text-sm text-gray-600">{a?.restaurant}</h2>
                    <p className="text-xs text-gray-500"><span className="font-semibold">Delivery Address: </span>{a?.deliveryAddress?.text}</p>
                    <p className="text-xs text-gray-500">
                      {a?.items?.length} items | ₹{a?.subtotal}
                    </p>
                  </div>

                  <button className="bg-[#83e34e] text-white px-2 py-1 rounded-lg text-sm"
                  onClick={() => acceptOrders(a?.assignmentId)}
                  >Accept</button>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500">
                No available orders
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryPartnerDashBoard;
