import "./Weather.scss";
import "./../../GlobalStyles.scss";
import { getDailyWeather } from '../../api/index';
import { useEffect, useState } from "react";

export const Weather = () => {
    const[currentWeather, setCurrentWeather] = useState({});
    const[isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const data = await getDailyWeather(40.0, 74.0);
            setCurrentWeather(data);
            setIsLoading(false)
            console.log(data);
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
                        <span className="location">Placeholder, USA</span>
                        <span className="temperature">
                            {parseInt(currentWeather.hourly.temperature_2m[0])}°F
                        </span>
                        <span className="high-low">
                            <span style={{ display: 'block' }}>High & Low</span>
                            {parseInt(currentWeather.daily.temperature_2m_max[0])}°F • {parseInt(currentWeather.daily.temperature_2m_min[0])}°F
                            <span style={{ float: 'right', paddingRight: '1em' }}>Chance of precipitation: {currentWeather.hourly.precipitation[0]}%</span>
                        </span>
                        
                    </div>
                </div>
                <div className="three-day-weather-container">
                    <div className="three-day-weather border-shadow">
                        <h2 className="weather-title">Three Day Weather</h2>
                        <span className="location">Placeholder, USA</span>
                        <div className="weather-days">
                            <div className="three-day">
                                <span className="day-title">Today</span>
                                <div className="three-day-info">
                                    <span>High {parseInt(currentWeather.daily.temperature_2m_max[0])}°F</span>
                                    <span>Low {parseInt(currentWeather.daily.temperature_2m_min[0])}°F</span>
                                </div>
                            </div>
                            <div className="vertical-divider"></div>
                            <div className="three-day">
                                <span className="day-title">Tomorrow</span>
                                <div className="three-day-info">
                                    <span>High {parseInt(currentWeather.daily.temperature_2m_max[1])}°F</span>
                                    <span>Low {parseInt(currentWeather.daily.temperature_2m_min[1])}°F</span>
                                </div>
                            </div>
                            <div className="vertical-divider"></div>
                            <div className="three-day">
                                <span className="day-title">Day After Tomorrow</span>
                                <div className="three-day-info">
                                    <span>High {parseInt(currentWeather.daily.temperature_2m_max[2])}°F</span>
                                    <span>Low {parseInt(currentWeather.daily.temperature_2m_min[2])}°F</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="seven-day-weather-container">
                    <div className="seven-day-weather border-shadow">
                        <h2 className="weather-title">Seven Day Weather</h2>
                        <span className="location">Placeholder, USA</span>
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