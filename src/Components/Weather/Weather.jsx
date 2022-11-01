import './Weather.scss';
import './../../GlobalStyles.scss';
import { getWeather, getLocationFromCoords, getGeocodeResults } from '../../api/index';
import { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet, faSpinner } from '@fortawesome/free-solid-svg-icons';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Moment from 'react-moment';
import { SearchContext } from '../../Contexts/SearchContext';

export const Weather = () => {
    const[allWeather, setallWeather] = useState({});
    const[dailyWeather, setDailyWeather] = useState({});
    const[isLoading, setIsLoading] = useState(true);
    const[locationFromCoords, setLocationFromCoords] = useState({});
    const[time, setTime] = useState(12);
    const[precipitationAveragePerDay, setPrecipitationAveragePerDay] = useState([]);
    const[daysOfWeek, setDaysOfWeek] = useState([]);

    const { searchText, setSearchText, setHasLocation, usingCoords, setUsingCoords, setDeclinedLocation } = useContext(SearchContext);
    const delay = ms => new Promise(res => setTimeout(res, ms));

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
        const fetchWeatherFromSearch = async (todayDateFormatted, nextWeekDate) => {
            const locationWeatherObject = {};
            locationWeatherObject.location = await getGeocodeResults(searchText);
            locationWeatherObject.weather = await getWeather(locationWeatherObject.location[0].lat, locationWeatherObject.location[0].lon, todayDateFormatted, todayDateFormatted);
            locationWeatherObject.weatherAll = await getWeather(locationWeatherObject.location[0].lat, locationWeatherObject.location[0].lon, todayDateFormatted, nextWeekDate);
            await delay(1005);
            locationWeatherObject.locationName = await getLocationFromCoords(locationWeatherObject.location[0].lat, locationWeatherObject.location[0].lon);
            
            return locationWeatherObject;
        }
        const fetchWeatherFromCoords = async (todayDateFormatted, nextWeekDate) => {
            const locationWeatherObject = {};
            try {
                locationWeatherObject.location = await getLocation();
            }
            catch (error) {
                setDeclinedLocation(true);
                setUsingCoords(false);
                setHasLocation(false);
            }
            locationWeatherObject.weather = await getWeather(locationWeatherObject.location.coords.latitude, locationWeatherObject.location.coords.longitude, todayDateFormatted, todayDateFormatted);
            locationWeatherObject.weatherAll = await getWeather(locationWeatherObject.location.coords.latitude, locationWeatherObject.location.coords.longitude, todayDateFormatted, nextWeekDate);
            await delay(1005);
            locationWeatherObject.locationName = await getLocationFromCoords(locationWeatherObject.location.coords.latitude, locationWeatherObject.location.coords.longitude);
            return locationWeatherObject;
        }
        const setData = async (todayDateFormatted, nextWeekDate) => {
            if(usingCoords) {
                const weatherDetails = await fetchWeatherFromCoords(todayDateFormatted, nextWeekDate);
                setDailyWeather(weatherDetails.weather);
                setallWeather(weatherDetails.weatherAll);
                setLocationFromCoords(weatherDetails.locationName);
                getPrecipAverage(weatherDetails.weatherAll);
            }
            else {
                const weatherDetails = await fetchWeatherFromSearch(todayDateFormatted, nextWeekDate);
                setDailyWeather(weatherDetails.weather);
                setallWeather(weatherDetails.weatherAll);
                setLocationFromCoords(weatherDetails.locationName);
                getPrecipAverage(weatherDetails.weatherAll);
            }
            
        }
        const fetchData = async () => {
            setPrecipitationAveragePerDay([]);
            const todayDate = new Date();
            const todayDateFormatted = todayDate.toJSON().slice(0, 10).replace(/-/g, '-');
            const nextWeekDate = new Date(todayDate.getTime() + 7 * 24 * 60 * 60 * 1000).toJSON().slice(0, 10).replace(/-/g, '-');
            const timeNow = todayDate.getHours() - 1;
            setTime(timeNow)
            try {
                /* const todayData = await getWeather(locationDetails.lat, locationDetails.lon, todayDateFormatted, todayDateFormatted);
                const allData = await getWeather(locationDetails.lat, locationDetails.lon, todayDateFormatted, nextWeekDate)
                const locationName = await getLocationFromCoords(locationDetails.lat, locationDetails.lon); */
                await setData(todayDateFormatted, nextWeekDate);
                setIsLoading(false);
            } catch (dataError) {
                //console.log(dataError);
            }
        }
        fetchData();
    }, [])

    const getPrecipAverage = async (weather) => { 
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

    const goBack = async () => {
        setHasLocation(false);
        setSearchText("");
        setUsingCoords(false);
        setDailyWeather({});
        setallWeather({});
        setLocationFromCoords({});
    }

    return (
        <>
            {isLoading ? (
                <>
                    <div className="loading">
                        <FontAwesomeIcon className="loading-icon" icon={faSpinner} color="white"/>
                    </div>
                </>

            ) : (
                <div className="weather-container background">
                    <div className="back-arrow">
                        <ArrowBackIcon className="back-arrow-icon" sx={{ fontSize: '3em' }} onClick={goBack}/>
                    </div>
                    <div className="current-weather-container">
                        <div className="current-weather border-shadow">
                            <h2 className="weather-title">Current Weather</h2>
                            <span className="location">{locationFromCoords.address.city ? 
                                locationFromCoords.address.city : locationFromCoords.address.town}, {locationFromCoords.address.state}
                            </span>
                            <span className="temperature">{parseInt(dailyWeather.hourly.temperature_2m[time])}°F</span>
                            <div className="high-low">
                                <span style={{ width: '100%' }}>High & Low</span>
                                <span className="daily-temp">{parseInt(dailyWeather.daily.temperature_2m_max[0])}°F • {parseInt(dailyWeather.daily.temperature_2m_min[0])}°F</span>
                                <div className="current-rain">
                                    <FontAwesomeIcon icon={faDroplet} style={{ paddingRight: '14px' }}/> 
                                    {dailyWeather.hourly.precipitation[time].toString().match('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?')[0]} inches
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="three-day-weather-container">
                        <div className="three-day-weather border-shadow">
                            <h2 className="weather-title">Three Day Weather</h2>
                            <span className="location">{locationFromCoords.address.city ? 
                                locationFromCoords.address.city : locationFromCoords.address.town}, {locationFromCoords.address.state}
                            </span>
                            <div className="three-day-weather-list">
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
                                <div className="three-day-horizontal-divider"></div>
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
                                <div className="three-day-horizontal-divider"></div>
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
                            <span className="location">{locationFromCoords.address.city ? 
                                locationFromCoords.address.city : locationFromCoords.address.town}, {locationFromCoords.address.state}
                            </span>
                            <div className="seven-day-weather-list">
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <Moment className="date" date={daysOfWeek[0]} format="MM/DD/YYYY"></Moment>
                                    <span className="seven-day-high">High  {parseInt(allWeather.daily.temperature_2m_max[0])}°F</span>
                                    <span className="seven-day-low">Low  {parseInt(allWeather.daily.temperature_2m_max[0])}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon className="seven-day-droplet" icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay.length >= 6 ? precipitationAveragePerDay[0] : <span>Loading...</span>} inches</span>
                                    </div>
 
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <Moment className="date" date={daysOfWeek[1]} format="MM/DD/YYYY"></Moment>
                                    <span className="seven-day-high">High  {parseInt(allWeather.daily.temperature_2m_max[1])}°F</span>
                                    <span className="seven-day-low">Low  {parseInt(allWeather.daily.temperature_2m_max[1])}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon className="seven-day-droplet" icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay.length >= 6 ? precipitationAveragePerDay[1] : <span>Loading...</span>} inches</span>
                                    </div>
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <Moment className="date" date={daysOfWeek[2]} format="MM/DD/YYYY"></Moment>
                                    <span className="seven-day-high">High  {parseInt(allWeather.daily.temperature_2m_max[2])}°F</span>
                                    <span className="seven-day-low">Low  {parseInt(allWeather.daily.temperature_2m_max[2])}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon className="seven-day-droplet" icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay.length >= 6 ? precipitationAveragePerDay[2] : <span>Loading...</span>} inches</span>
                                    </div>
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <Moment className="date" date={daysOfWeek[3]} format="MM/DD/YYYY"></Moment>
                                    <span className="seven-day-high">High  {parseInt(allWeather.daily.temperature_2m_max[3])}°F</span>
                                    <span className="seven-day-low">Low  {parseInt(allWeather.daily.temperature_2m_max[3])}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon className="seven-day-droplet" icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay.length >= 6 ? precipitationAveragePerDay[3] : <span>Loading...</span>} inches</span>
                                    </div>
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <Moment className="date" date={daysOfWeek[4]} format="MM/DD/YYYY"></Moment>
                                    <span className="seven-day-high">High  {parseInt(allWeather.daily.temperature_2m_max[4])}°F</span>
                                    <span className="seven-day-low">Low  {parseInt(allWeather.daily.temperature_2m_max[4])}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon className="seven-day-droplet" icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay.length >= 6 ? precipitationAveragePerDay[4] : <span>Loading...</span>} inches</span>
                                    </div>
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <Moment className="date" date={daysOfWeek[5]} format="MM/DD/YYYY"></Moment>
                                    <span className="seven-day-high">High  {parseInt(allWeather.daily.temperature_2m_max[5])}°F</span>
                                    <span className="seven-day-low">Low  {parseInt(allWeather.daily.temperature_2m_max[5])}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon className="seven-day-droplet" icon={faDroplet}/>
                                        <span style={{ paddingLeft: '10px' }}>{precipitationAveragePerDay.length >= 6 ? precipitationAveragePerDay[5] : <span>Loading...</span>} inches</span>
                                    </div>
                                </div>
                                <div className="horizontal-divider"></div>
                                <div className="seven-day">
                                    <Moment className="date" date={daysOfWeek[6]} format="MM/DD/YYYY"></Moment>
                                    <span className="seven-day-high">High  {parseInt(allWeather.daily.temperature_2m_max[6])}°F</span>
                                    <span className="seven-day-low">Low  {parseInt(allWeather.daily.temperature_2m_max[6])}°F</span>
                                    <div className="seven-day-precip">
                                        <FontAwesomeIcon className="seven-day-droplet" icon={faDroplet}/>
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