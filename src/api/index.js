import axios from "axios";

export const getDailyWeather = async (latitude, longitude) => {
    try {
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${longitude}longitude=${longitude}&hourly=temperature_2m,precipitation&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FNew_York`)
        return response.data;
    } catch (error) {
        console.log(error);
    }
}