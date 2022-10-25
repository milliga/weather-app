import './App.css';
import { Weather } from './Components/Weather/Weather';
import { Search } from "./Components/Search/Search";
import { SearchContext } from './Contexts/SearchContext';
import { useEffect, useState } from 'react';

function App() {
    const[searchText, setSearchText] = useState("");
    const[hasLocation, setHasLocation] = useState(false);
    const[usingCoords, setUsingCoords] = useState(false);    

    return (
        <SearchContext.Provider value={{ searchText, setSearchText, hasLocation, setHasLocation, usingCoords, setUsingCoords }}>
            <div className='background'>
                {hasLocation ? (
                    <Weather />
                ) : (
                    <Search />
                )}
            </div>
        </SearchContext.Provider>
    )
}

export default App;
