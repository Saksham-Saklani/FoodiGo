import React from "react";
import L from "leaflet";
import deliveryIcon from "../assets/delivery-man.png";
import homeIcon from "../assets/home.png";
import {
  Popup,
  Marker,
  Polyline,
  MapContainer,
  TileLayer,
} from "react-leaflet";

const deliveryPartnerIcon = L.icon({
  iconUrl: deliveryIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = L.icon({
  iconUrl: homeIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function DeliveryTracking({ data }) {
  const deliveryPartnerLat = data?.deliveryPartnerLocation?.lat;
  const deliveryPartnerLon = data?.deliveryPartnerLocation?.lon;

  const customerLat = data?.customerLocation?.lat;
  const customerLon = data?.customerLocation?.lon;

  const path = [
    [deliveryPartnerLat, deliveryPartnerLon],
    [customerLat, customerLon],
  ];
  return (
    <div className="w-full h-[400px] mt-3 shadow-md rounded-xl overflow-hidden ">
      <MapContainer
        className={"w-full h-full"}
        zoom={16}
        center={[deliveryPartnerLat, deliveryPartnerLon]}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker
          position={[deliveryPartnerLat, deliveryPartnerLon]}
          icon={deliveryPartnerIcon}
        >
          <Popup>Delivery Partner</Popup>
        </Marker>
        <Marker position={[customerLat, customerLon]} icon={customerIcon}>
          <Popup>Customer</Popup>
        </Marker>

        <Polyline positions={path} weight={4} color="blue" />
      </MapContainer>
    </div>
  );
}

export default DeliveryTracking;
