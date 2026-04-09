import React, { useEffect } from "react";
import { CircleArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import { useDispatch } from "react-redux";
import { setMyOrders, updateRealTimeOrderStaus } from "../redux/userSlice";

function MyOrders() {
  const navigate = useNavigate();
  const { myOrders, userData, socket } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on("newOrder", (data) => {
      if (data?.restaurantOrders?.owner?._id == userData?.user?._id) {
        dispatch(setMyOrders([data, ...myOrders]));
      }
    });

    socket?.on("orderStatus", ({ orderId, restaurantId, status, userId }) => {
      if (userId == userData?.user?._id) {
        dispatch(updateRealTimeOrderStaus({ restaurantId, orderId, status }));
      }
    });

    socket?.on(
      "orderDelivered",
      ({ orderId, restaurantId, status, userId }) => {
        if (userId == userData?.user?._id) {
          dispatch(
            updateRealTimeOrderStaus({
              restaurantId,
              orderId,
              status,
            }),
          );
        }
      },
    );

    return () => {
      socket?.off("newOrder");
      socket?.off("orderStatus");
      socket?.off("orderDelivered");
    };
  }, [socket]);

  return (
    <div className="w-full min-h-screen bg-[#f7fff6] flex justify-center px-4 pt-20">
      <div className="w-full max-w-[700px] p-4 ">
        <div className="flex items-center gap-4 mb-6">
          <button className="cursor-pointer" onClick={() => navigate("/")}>
            <CircleArrowLeftIcon size={25} color={"#83e34e"} />
          </button>
          <h1 className="text-2xl font-semibold text-start">My Orders</h1>
        </div>
        <div className="space-y-6">
          {myOrders?.map((order, index) => {
            if (userData?.user?.role === "Customer") {
              return <UserOrderCard key={index} data={order} />;
            } else if (userData?.user?.role === "Owner") {
              return <OwnerOrderCard key={index} data={order} />;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
