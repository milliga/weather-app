import SearchIcon from '@mui/icons-material/Search';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react';
import "./Search.scss";

export const Search = () => {
    const[searchText, setSearchText] = useState("");

    return (
        <>
        <div className='search-container'>
            <form className='search'>
                <TextField 
                    className='search-bar'
                    onInput={(e) => {
                        setSearchText(e.target.value);
                    }}
                    label='Search a location'
                    variant='filled'
                    type='search'
                    sx={{ input: { color: 'black', background: 'white' } }}
                /> 
            </form>
            <div className='location'>
                <div className='location-icon'>
                    <span style={{ width: '100%', fontSize: 'large' }}>Get location</span>
                    <GpsFixedIcon style={{ paddingBottom: '20px' }} fontSize='large' />
                </div>
            </div>
        </div>
        </>
    )
}
