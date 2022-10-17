import "./Weather.scss";
import "./../../GlobalStyles.scss";
import { getWeather, getLocationFromCoords } from '../../api/index';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDroplet } from "@fortawesome/free-solid-svg-icons";

export const Weather = () => {
    const[allWeather, setallWeather] = useState({});
    const[dailyWeather, setDailyWeather] = useState({});
    const[isLoading, setIsLoading] = useState(true);
    const[locationFromCoords, setLocationFromCoords] = useState({});
    const[time, setTime] = useState(12);
    const[precipitationAveragePerDay, setPrecipitationAveragePerDay] = useState([]);

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
            const timeNow = todayDate.getHours() - 1;
            setTime(timeNow)
            setIsLoading(true);
            const loc = await getLocation();
            const todayData = await getWeather(loc.coords.latitude, loc.coords.longitude, todayDateFormatted, todayDateFormatted);
            const allData = await getWeather(loc.coords.latitude, loc.coords.longitude, todayDateFormatted, nextWeekDate)
            const locationName = await getLocationFromCoords(loc.coords.latitude, loc.coords.longitude);
            getPrecipAverage(allData);
            setDailyWeather(todayData);
            setallWeather(allData);
            setLocationFromCoords(locationName);
            setIsLoading(false);
        }
        fetchData();
    }, [])

    const getPrecipAverage = async (weather) => { 
        setPrecipitationAveragePerDay([]);
        let day = 0;
        for(let i = 0; i < 168; i++) {
            if(i % 24 === 0) {
                let dayString = day.toString().match('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?')[0];
                console.log(dayString + " currently on " + i);
                //TODO
                //Page is loading before state has finished updating OR state is not updating properly, currently only adding the last day to the array
                setPrecipitationAveragePerDay([...precipitationAveragePerDay, dayString]);
                day = 0;
            }
            day += weather.hourly.precipitation[i];
        }
    }

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
                                <span>{parseInt(dailyWeather.daily.temperature_2m_max[0])}°F • {parseInt(dailyWeather.daily.temperature_2m_min[0])}°F</span>
                                <span style={{ float: 'right', paddingRight: '1em' }}><FontAwesomeIcon icon={faDroplet}/> {dailyWeather.hourly.precipitation[time]} inches</span>
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
                                        <span className="three-day-high">{parseInt(allWeather.daily.temperature_2m_max[0])}°F</span>
                                        <span className="three-day-low">{parseInt(allWeather.daily.temperature_2m_min[1])}°F</span>
                                        <div className="three-day-precip">
                                            <FontAwesomeIcon icon={faDroplet}/>
                                            <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay[0]} inches</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="vertical-divider"></div>
                                <div className="three-day">
                                    <span className="day-title">Tomorrow</span>
                                    <div className="three-day-info">
                                        <span className="three-day-high">{parseInt(allWeather.daily.temperature_2m_max[1])}°F</span>
                                        <span className="three-day-low">{parseInt(allWeather.daily.temperature_2m_min[2])}°F</span>
                                        <div className="three-day-precip">
                                            <FontAwesomeIcon icon={faDroplet}/>
                                            <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay[1]} inches</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="vertical-divider"></div>
                                <div className="three-day">
                                    <span className="day-title">Day After Tomorrow</span>
                                    <div className="three-day-info">
                                        <span className="three-day-high">{parseInt(allWeather.daily.temperature_2m_max[2])}°F</span>
                                        <span className="three-day-low">{parseInt(allWeather.daily.temperature_2m_min[3])}°F</span>
                                        <div className="three-day-precip">
                                            <FontAwesomeIcon icon={faDroplet}/>
                                            <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay[2]} inches</span>
                                        </div>
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
                                    <span></span>
                                    <span>High  {allWeather.daily.temperature_2m_max[0]}°F</span>
                                    <span className="seven-day-low">Low  {allWeather.daily.temperature_2m_max[1]}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay[0]} inches</span>
                                    </div>
 
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <span>High  {allWeather.daily.temperature_2m_max[1]}°F</span>
                                    <span className="seven-day-low">Low  {allWeather.daily.temperature_2m_max[2]}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay[1]} inches</span>
                                    </div>
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <span>High  {allWeather.daily.temperature_2m_max[2]}°F</span>
                                    <span className="seven-day-low">Low  {allWeather.daily.temperature_2m_max[3]}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay[2]} inches</span>
                                    </div>
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <span>High  {allWeather.daily.temperature_2m_max[3]}°F</span>
                                    <span className="seven-day-low">Low  {allWeather.daily.temperature_2m_max[4]}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay[3]} inches</span>
                                    </div>
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <span>High  {allWeather.daily.temperature_2m_max[4]}°F</span>
                                    <span className="seven-day-low">Low  {allWeather.daily.temperature_2m_max[5]}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay[4]} inches</span>
                                    </div>
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <span>High  {allWeather.daily.temperature_2m_max[5]}°F</span>
                                    <span className="seven-day-low">Low  {allWeather.daily.temperature_2m_max[6]}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay[5]} inches</span>
                                    </div>
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <span>High  {allWeather.daily.temperature_2m_max[6]}°F</span>
                                    <span className="seven-day-low">Low  {allWeather.daily.temperature_2m_max[7]}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay[6]} inches</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>

    )
}