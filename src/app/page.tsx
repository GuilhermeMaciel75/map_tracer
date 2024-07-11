'use client';

import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

type Ponto = {
  label: string,
  lat: number,
  lng: number,
}

const containerStyle = {
  width: '100%',
  height: '100vh'
};


const Home = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: '',
  });

  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);

  const addressList: Ponto[] = [
    { label: 'Marco Zero', lat: -8.286327710633456, lng: -35.969615054939815 },
    { label: 'Catedral de Nossa Senhora das Dores', lat: -8.28526685113777, lng: -35.970694086617485 },
    { label: 'Estação Ferroviária', lat: -8.282883153950799, lng: -35.96936787628003 },
    { label: 'Pátio do Forró', lat: -8.282106440528898, lng: -35.96622827604729 },
  ];

  const center = {
    lat: addressList[0].lat,
    lng: addressList[0].lng
  };
  

  useEffect(() => {
    if (isLoaded) {
      const fetchDirections = () => {
        if (addressList.length < 2) {
          return;
        }

        const waypoints = addressList.slice(1, -1).map(ponto => ({
          location: new google.maps.LatLng(ponto.lat, ponto.lng),
          stopover: true
        }));

        const origin = addressList[0];
        const destination = addressList[addressList.length - 1];

        const DirectionsService = new google.maps.DirectionsService();
        DirectionsService.route({
          origin: new google.maps.LatLng(origin.lat, origin.lng),
          destination: new google.maps.LatLng(destination.lat, destination.lng),
          waypoints: waypoints,
          travelMode: google.maps.TravelMode.WALKING,
        }, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        });
      };

      fetchDirections();
    }
  }, [isLoaded, addressList]);

  return (
    <div className='map'>
      {loadError && <div>Erro ao carregar o mapa. Por favor, tente novamente mais tarde.</div>}
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
        >
          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              options={{ suppressMarkers: true }}  // This hides default A, B markers
            />
          )}
          {addressList.map((ponto) => (
            <Marker
              key={ponto.label}
              position={{ lat: ponto.lat, lng: ponto.lng }}
              label={{
                text: ponto.label,
                className: 'map-point'
              }}
            />
          ))}
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default React.memo(Home);
