import "./Weather.scss";
import "./../../GlobalStyles.scss";
import { getWeather, getLocationFromCoords } from '../../api/index';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDroplet, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";

export const Weather = () => {
    const[allWeather, setallWeather] = useState({});
    const[dailyWeather, setDailyWeather] = useState({});
    const[isLoading, setIsLoading] = useState(true);
    const[locationFromCoords, setLocationFromCoords] = useState({});
    const[time, setTime] = useState(12);
    const[precipitationAveragePerDay, setPrecipitationAveragePerDay] = useState([]);
    const[daysOfWeek, setDaysOfWeek] = useState([]);
    const[hasLocation, setHasLocation] = useState(false);

    useEffect(() => {
        setDaysOfWeek([]);
        let tempDays = [];
        let tempDate = new Date();
        for(let i = 0; i < 7; i++) {
            let date = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() + i);
            tempDays.push(date);
        }
        setDaysOfWeek(tempDays);
        const getLocation = () => {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            })
        }
        const fetchData = async () => {
            setPrecipitationAveragePerDay([]);
            const todayDate = new Date();
            const todayDateFormatted = todayDate.toJSON().slice(0, 10).replace(/-/g, '-');
            const nextWeekDate = new Date(todayDate.getTime() + 7 * 24 * 60 * 60 * 1000).toJSON().slice(0, 10).replace(/-/g, '-');
            const timeNow = todayDate.getHours() - 1;
            setTime(timeNow)
            let loc = {};
            try {
                loc = await getLocation();
                setHasLocation(true);
            } catch (locError) {
                setHasLocation(false);
                //console.log(locError);
            }
            try {
                const todayData = await getWeather(loc.coords.latitude, loc.coords.longitude, todayDateFormatted, todayDateFormatted);
                const allData = await getWeather(loc.coords.latitude, loc.coords.longitude, todayDateFormatted, nextWeekDate)
                const locationName = await getLocationFromCoords(loc.coords.latitude, loc.coords.longitude);
                setDailyWeather(todayData);
                setallWeather(allData);
                setLocationFromCoords(locationName);
                getPrecipAverage(allData);
                setIsLoading(false);
            } catch (dataError) {
                //console.log(dataError);
            }
        }
        fetchData();
    }, [])

    const getPrecipAverage = (weather) => { 
        let tempData = [];
        let dayPrecipMax = 0;
        for(let i = 0; i < 161; i++) {
            if(i % 23 === 0) {
                let dayMaxUpdated = dayPrecipMax * 10;
                let dayMaxString = dayMaxUpdated.toString().match('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?')[0];
                tempData.push(dayMaxString);
                dayPrecipMax = 0;
            }
            dayPrecipMax = Math.max(dayPrecipMax, weather.hourly.precipitation[i]);
        }
        setPrecipitationAveragePerDay(tempData);
    }

    return (
        <>
            {isLoading ? (
                <>
                    {hasLocation ? (
                        <div className="loading">
                            <FontAwesomeIcon className="loading-icon" icon={faSpinner} color="white"/>
                        </div>
                    ) : (
                        <div className="location-permission">
                            <span className="location-permission-text">Please allow location permissions.</span>
                        </div>
                    )}
                </>

            ) : (
                <div className="weather-container background">
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
                                <span style={{ float: 'right', paddingRight: '1em' }}><FontAwesomeIcon icon={faDroplet} style={{ paddingRight: '1em' }}/> 
                                    {dailyWeather.hourly.precipitation[time].toString().match('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?')[0]} inches
                                </span>
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
                                        <span className="three-day-low">{parseInt(allWeather.daily.temperature_2m_min[0])}°F</span>
                                        <div className="three-day-precip">
                                            <FontAwesomeIcon icon={faDroplet}/>
                                            <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay.length >= 6 ? precipitationAveragePerDay[0] : <span>Loading...</span>} inches</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="vertical-divider"></div>
                                <div className="three-day">
                                    <span className="day-title">Tomorrow</span>
                                    <div className="three-day-info">
                                        <span className="three-day-high">{parseInt(allWeather.daily.temperature_2m_max[1])}°F</span>
                                        <span className="three-day-low">{parseInt(allWeather.daily.temperature_2m_min[1])}°F</span>
                                        <div className="three-day-precip">
                                            <FontAwesomeIcon icon={faDroplet}/>
                                            <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay.length >= 6 ? precipitationAveragePerDay[1] : <span>Loading...</span>} inches</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="vertical-divider"></div>
                                <div className="three-day">
                                    <span className="day-title">Day After Tomorrow</span>
                                    <div className="three-day-info">
                                        <span className="three-day-high">{parseInt(allWeather.daily.temperature_2m_max[2])}°F</span>
                                        <span className="three-day-low">{parseInt(allWeather.daily.temperature_2m_min[2])}°F</span>
                                        <div className="three-day-precip">
                                            <FontAwesomeIcon icon={faDroplet}/>
                                            <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay.length >= 6 ? precipitationAveragePerDay[2] : <span>Loading...</span>} inches</span>
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
                                    <Moment date={daysOfWeek[0]} format="MM/DD/YYYY" style={{ paddingRight: '10%' }}></Moment>
                                    <span>High  {parseInt(allWeather.daily.temperature_2m_max[0])}°F</span>
                                    <span className="seven-day-low">Low  {parseInt(allWeather.daily.temperature_2m_max[0])}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay.length >= 6 ? precipitationAveragePerDay[0] : <span>Loading...</span>} inches</span>
                                    </div>
 
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <Moment date={daysOfWeek[1]} format="MM/DD/YYYY" style={{ paddingRight: '10%' }}></Moment>
                                    <span>High  {parseInt(allWeather.daily.temperature_2m_max[1])}°F</span>
                                    <span className="seven-day-low">Low  {parseInt(allWeather.daily.temperature_2m_max[1])}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay.length >= 6 ? precipitationAveragePerDay[1] : <span>Loading...</span>} inches</span>
                                    </div>
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <Moment date={daysOfWeek[2]} format="MM/DD/YYYY" style={{ paddingRight: '10%' }}></Moment>
                                    <span>High  {parseInt(allWeather.daily.temperature_2m_max[2])}°F</span>
                                    <span className="seven-day-low">Low  {parseInt(allWeather.daily.temperature_2m_max[2])}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay.length >= 6 ? precipitationAveragePerDay[2] : <span>Loading...</span>} inches</span>
                                    </div>
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <Moment date={daysOfWeek[3]} format="MM/DD/YYYY" style={{ paddingRight: '10%' }}></Moment>
                                    <span>High  {parseInt(allWeather.daily.temperature_2m_max[3])}°F</span>
                                    <span className="seven-day-low">Low  {parseInt(allWeather.daily.temperature_2m_max[3])}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay.length >= 6 ? precipitationAveragePerDay[3] : <span>Loading...</span>} inches</span>
                                    </div>
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <Moment date={daysOfWeek[4]} format="MM/DD/YYYY" style={{ paddingRight: '10%' }}></Moment>
                                    <span>High  {parseInt(allWeather.daily.temperature_2m_max[4])}°F</span>
                                    <span className="seven-day-low">Low  {parseInt(allWeather.daily.temperature_2m_max[4])}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay.length >= 6 ? precipitationAveragePerDay[4] : <span>Loading...</span>} inches</span>
                                    </div>
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <Moment date={daysOfWeek[5]} format="MM/DD/YYYY" style={{ paddingRight: '10%' }}></Moment>
                                    <span>High  {parseInt(allWeather.daily.temperature_2m_max[5])}°F</span>
                                    <span className="seven-day-low">Low  {parseInt(allWeather.daily.temperature_2m_max[5])}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay.length >= 6 ? precipitationAveragePerDay[5] : <span>Loading...</span>} inches</span>
                                    </div>
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <Moment date={daysOfWeek[6]} format="MM/DD/YYYY" style={{ paddingRight: '10%' }}></Moment>
                                    <span>High  {parseInt(allWeather.daily.temperature_2m_max[6])}°F</span>
                                    <span className="seven-day-low">Low  {parseInt(allWeather.daily.temperature_2m_max[6])}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay.length >= 6 ? precipitationAveragePerDay[6] : <span>Loading...</span>} inches</span>
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