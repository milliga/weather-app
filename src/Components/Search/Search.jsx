import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import TextField from '@mui/material/TextField';
import { useContext, useState } from 'react';
import { SearchContext } from '../../Contexts/SearchContext';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import "./Search.scss";

export const Search = () => {
    const[changeAnimationStyle, setChangeAnimationStyle] = useState("sun");

    const { setSearchText, setHasLocation, setUsingCoords, declinedLocation } = useContext(SearchContext);

    const setLocation = () => {
        setHasLocation(true);
    }
    
    const useCoords = () => {
        if(declinedLocation) { return; }
        setUsingCoords(true);
        setHasLocation(true);
    }

    const changeAnimation = (animationStyle) => {
        setChangeAnimationStyle(animationStyle);
    }

    return (
        <>
            <div className='search-container'>
                <div className='icon-container'>
                    <CloudQueueIcon className="cloud-icon" sx={{ fontSize: '10em', color: '#F5F5F5' }}/>
                </div>
                <form className='search' onSubmit={setLocation}>
                    <TextField 
                        className='search-bar'
                        onInput={(e) => {
                            setSearchText(e.target.value);
                        }}
                        label='Search a location'
                        variant='filled'
                        type='search'
                        placeholder='New York, NY'
                        sx={{ input: { color: 'black', background: 'white' } }}
                    /> 
                </form>
                {declinedLocation ? (
                    <div className='declined-location'>
                        <span>Please refresh or reset location permissions to use location.</span>
                    </div>
                ) : (
                    <div className='search-location zoom' onClick={useCoords}>
                        <div className='location-icon'>
                            <span style={{ width: '100%', fontSize: 'large' }}>Get location</span>
                            <GpsFixedIcon style={{ paddingBottom: '20px' }} fontSize='large' />
                        </div>
                    </div>
                )}
                
            </div>
        </>
    )
}
