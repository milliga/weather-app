import axios from "axios";

export const getWeather = async (latitude, longitude, startDate, endDate) => {
    try {
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FNew_York&start_date=${startDate}&end_date=${endDate}&precipitation_unit=inch`);
        return response.data;
    } catch (error) {
        //console.log(error);
    }
}

export const getLocationFromCoords = async (latitude, longitude) => {
    try {
        const response = await axios.get(`https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse`, {
            params: {
                lat: latitude,
                lon: longitude,
            },
            headers: {
                'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
            }
        });
        return response.data;
    } catch (error) {
        //console.log(error);
    }
}