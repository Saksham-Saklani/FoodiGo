import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { CircleArrowLeftIcon } from "lucide-react";
import DeliveryTracking from "../components/DeliveryTracking";
import { useSelector } from "react-redux";

function TrackOrder() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState(null);
  const { socket } = useSelector((state) => state.user);
  const [liveLocation, setLiveLocation] = useState({});

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true },
      );
      setCurrentOrder(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  useEffect(() => {
    socket?.on(
      "deliveryLocation",
      ({ deliveryPartnerId, latitude, longitude }) => {
        setLiveLocation(prev => ({
          ...prev,
          [deliveryPartnerId]: { lat: latitude, lon: longitude },
        }));
      },
    );
  }, [socket]);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div
        className="relative top-6 left-6 z-10 cursor-pointer mb-[10px] flex items-center gap-2"
        onClick={() => navigate("/")}
      >
        <CircleArrowLeftIcon size={25} color={"#83e34e"} />
        <h2 className="font-bold text-2xl md:text-center">Track Order</h2>
      </div>
      {currentOrder?.order?.restaurantOrders?.map((order, index) => (
        <div
          className="border border-green-50 shadow-md space-y-4 rounded-2xl bg-white p-4 "
          key={index}
        >
          <div>
            <p className="font-bold text-lg mb-2 text-[#83e34e] ">
              {order?.restaurant?.name}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold text-black ">Items: </span>
              {order?.orderItems?.map((item) => item.name).join(",")}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold text-black ">Subtotal: </span>₹
              {order?.subtotal}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold text-black ">
                Delivery Address:{" "}
              </span>
              {currentOrder?.order?.deliveryAddress?.text}
            </p>
          </div>
          {order?.status !== "Delivered" ? (
            <>
              {order?.assignedDeliveryPartner ? (
                <>
                  <div className="text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">
                        Delivery Partner Name:{" "}
                      </span>
                      {order?.assignedDeliveryPartner?.fullname}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Delivery Partner Contact:{" "}
                      </span>
                      {order?.assignedDeliveryPartner?.mobile}
                    </p>
                  </div>
                  <div>
                    {console.log('live',{liveLocation})}
                    <DeliveryTracking
                      data={{
                        deliveryPartnerLocation: liveLocation[
                          order?.assignedDeliveryPartner?._id
                        ] || {
                          lat: order?.assignedDeliveryPartner?.location
                            ?.coordinates[1],
                          lon: order?.assignedDeliveryPartner?.location
                            ?.coordinates[0],
                        },
                        customerLocation: {
                          lat: currentOrder?.order?.deliveryAddress?.latitude,
                          lon: currentOrder?.order?.deliveryAddress?.longitude,
                        },
                      }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-700">
                  No delivery partner is assigned yet
                </p>
              )}
            </>
          ) : (
            <p className="text-[#83e34e] text-lg font-semibold">
              Order Delivered
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default TrackOrder;
