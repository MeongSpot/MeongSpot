package com.ottogi.be.walking.util;

import com.google.maps.internal.PolylineEncoding;
import com.google.maps.model.LatLng;
import com.ottogi.be.walking.dto.PointDto;


import java.util.List;
import java.util.stream.Collectors;

public class PolylineUtils {

    public static String encodePolyline(List<PointDto> gpsCoordinates) {
        List<LatLng> latLngList = gpsCoordinates.stream()
                .map(p -> new LatLng(p.getLat(), p.getLng()))
                .collect(Collectors.toList());

        return PolylineEncoding.encode(latLngList);
    }


    public static List<PointDto> decodePolyline(String polyline) {
        List<LatLng> decodedPoints = PolylineEncoding.decode(polyline);
        return decodedPoints.stream()
                .map(latLng -> new PointDto(latLng.lat, latLng.lng))
                .collect(Collectors.toList());
    }
}
