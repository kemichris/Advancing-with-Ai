import axios from 'axios';

export const getShipmentStatus = async (trackingNumber) => {
    const url = `${process.env.SHIPMENT_API_URL}/shipment/status/${trackingNumber}`;

    console.log('Calling Shipment API:', url);

    const response = await axios.get(url);

   const shipment = response.data.data;

    return {
        trackingNumber: shipment.trackingNumber,
        status: shipment.status,
        currentLocation: shipment.currentLocation,
        estimatedDeliveryDate: shipment.estimatedDeliveryDate,
        trackingEvents: shipment.trackingEvents
    };
};