import "./Weather.scss";
import "./../../GlobalStyles.scss";
import { getWeather, getLocationFromCoords } from '../../api/index';
import { useEffect, useState } from "react";

export const Weather = () => {
    const[allWeather, setallWeather] = useState({});
    const[dailyWeather, setDailyWeather] = useState({});
    const[isLoading, setIsLoading] = useState(true);
    const[locationFromCoords, setLocationFromCoords] = useState({});
    const[time, setTime] = useState(12);

    useEffect(() => {
        const getLocation = () => {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            })
        }
        const fetchData = async () => {
            const todayDate = new Date();
            const todayDateFormatted = todayDate.toJSON().slice(0, 10).replace(/-/g, '-');
            const nextWeekDate = new Date(todayDate.getTime() + 7 * 24 * 60 * 60 * 1000).toJSON().slice(0, 10).replace(/-/g, '-');
            const timeNow = todayDate.getHours();
            setTime(timeNow)
            setIsLoading(true);
            const loc = await getLocation();
            const todayData = await getWeather(loc.coords.latitude, loc.coords.longitude, todayDateFormatted, todayDateFormatted);
            const allData = await getWeather(loc.coords.latitude, loc.coords.longitude, todayDateFormatted, nextWeekDate)
            const locationName = await getLocationFromCoords(loc.coords.latitude, loc.coords.longitude);
            setDailyWeather(todayData);
            setallWeather(allData);
            setLocationFromCoords(locationName);
            setIsLoading(false)
        }
        fetchData();
    }, [])

    return (
        <>
            {isLoading ? (<></>) : (
                <div className="weather-container">
                <div className="current-weather-container">
                    <div className="current-weather border-shadow">
                        <h2 className="weather-title">Current Weather</h2>
                        <span className="location">{locationFromCoords.address.city}, {locationFromCoords.address.state}</span>
                        <span className="temperature">
                            {parseInt(dailyWeather.hourly.temperature_2m[time])}°F
                        </span>
                        <div className="high-low">
                            <span style={{ display: 'block' }}>High & Low</span>
                            <span>{parseInt(allWeather.daily.temperature_2m_max[0])}°F • {parseInt(dailyWeather.daily.temperature_2m_min[0])}°F</span>
                            <span style={{ float: 'right', paddingRight: '1em' }}>Chance of precipitation: {dailyWeather.hourly.precipitation[0]}%</span>
                        </div>
                    </div>
                </div>
                <div className="three-day-weather-container">
                    <div className="three-day-weather border-shadow">
                        <h2 className="weather-title">Three Day Weather</h2>
                        <span className="location">{locationFromCoords.address.city}, {locationFromCoords.address.state}</span>
                        <div className="weather-days">
                            <div className="three-day">
                                <span className="day-title">Today</span>
                                <div className="three-day-info">
                                    <span>High {parseInt(allWeather.daily.temperature_2m_max[0])}°F</span>
                                    <span>Low {parseInt(allWeather.daily.temperature_2m_min[0])}°F</span>
                                </div>
                            </div>
                            <div className="vertical-divider"></div>
                            <div className="three-day">
                                <span className="day-title">Tomorrow</span>
                                <div className="three-day-info">
                                    <span>High {parseInt(allWeather.daily.temperature_2m_max[1])}°F</span>
                                    <span>Low {parseInt(allWeather.daily.temperature_2m_min[1])}°F</span>
                                </div>
                            </div>
                            <div className="vertical-divider"></div>
                            <div className="three-day">
                                <span className="day-title">Day After Tomorrow</span>
                                <div className="three-day-info">
                                    <span>High {parseInt(allWeather.daily.temperature_2m_max[2])}°F</span>
                                    <span>Low {parseInt(allWeather.daily.temperature_2m_min[2])}°F</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="seven-day-weather-container">
                    <div className="seven-day-weather border-shadow">
                        <h2 className="weather-title">Seven Day Weather</h2>
                        <span className="location">{locationFromCoords.address.city}, {locationFromCoords.address.state}</span>
                        <div className="seven-day-weather-list">
                            <div className="horizontal-divider"></div>
                            <div className="seven-day">
                                <span>High 70F</span>
                                <span>Low 50F</span>
                                <span>Hi</span>
                            </div>
                            <div className="horizontal-divider"></div>
                            <div className="seven-day">
                                <span>High 70F</span>
                                <span>Low 50F</span>
                                <span>Hi</span>
                            </div>
                            <div className="horizontal-divider"></div>
                            <div className="seven-day">
                                <span>High 70F</span>
                                <span>Low 50F</span>
                                <span>Hi</span>
                            </div>
                            <div className="horizontal-divider"></div>
                            <div className="seven-day">
                            <span>High 70F</span>
                                <span>Low 50F</span>
                                <span>Hi</span>
                            </div>
                            <div className="horizontal-divider"></div>
                            <div className="seven-day">
                                <span>High 70F</span>
                                <span>Low 50F</span>
                                <span>Hi</span>
                            </div>
                            <div className="horizontal-divider"></div>
                            <div className="seven-day">
                                <span>High 70F</span>
                                <span>Low 50F</span>
                                <span>Hi</span>
                            </div>
                            <div className="horizontal-divider"></div>
                            <div className="seven-day">
                                <span>High 70F</span>
                                <span>Low 50F</span>
                                <span>Hi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>

    )
}