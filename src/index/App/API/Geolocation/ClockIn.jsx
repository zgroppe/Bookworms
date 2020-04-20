import React from "react";
import { geolocated, geoPropTypes } from "react-geolocated";

const getDirection = (degrees, isLongitude) =>
    degrees > 0 ? (isLongitude ? "E" : "N") : isLongitude ? "W" : "S";
const formatDegrees = (degrees, isLongitude) =>
    `${0 | degrees}° ${0 |
        (((degrees < 0 ? (degrees = -degrees) : degrees) % 1) * 60)}' ${0 |
        (((degrees * 60) % 1) * 60)}" ${getDirection(degrees, isLongitude)}`;

        let TestLat = 29.0000000
        let TestLong = -98.0000000
        let LatTopBound = 27.714021
        let LatBotBound = 27.713137
        let LongTopBound = 97.325228
        let LongBotBound = 97.324256
        
const checkLocation = (Latitude, Longitude) =>
{
    if (Latitude > TestLat && Longitude < TestLong)
    {
        window.alert("Clock In Accepted")
    }
        else
        {
            window.alert("Clock In not Accepted")
        }
        
}
const ClockIn = props => (

    <div
        style={{
            fontSize: "large",
            fontWeight: "bold",
            margin: "2rem",
        }}
    >
        {!props.isGeolocationAvailable ? (
            <div>Your Current browser does not seem to support Geolocation.</div>
        ) : !props.isGeolocationEnabled ? (
            <div>Geolocation has not enabled on this browser.</div>
        ) : props.coords ? (
            
            <div>

                You are currently at{" "}
                <span className="coordinate">
                    {formatDegrees(props.coords.latitude, false)}
                    {console.log(props.coords.latitude)}
                    {console.log(props.coords.longitude)}
                </span>
                ,{" "}
                <span className="coordinate">
                    {formatDegrees(props.coords.longitude, true)}
                    {checkLocation(props.coords.latitude, props.coords.longitude)}
                </span>
                   
                
                .
            </div>

        
        ) : (
            <div>Currently Getting location data&hellip;</div>
        )}
        {!!props.positionError && (
            <div>
                <br />
                Last position error:
                <pre>{JSON.stringify(props.positionError)}</pre>
            </div>
        )}
    </div>
);


ClockIn.propTypes = { ...ClockIn.propTypes, ...geoPropTypes };

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(ClockIn);