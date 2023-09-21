import React, { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
export const Header = ({images, handleImage}) => {
    const {logout} = useAuth0();

    const matchSearch  = (url,query)=>{
        const urlString = url
        // Split the URL by '/' to get an array of path segments
        const pathSegments = urlString.split('/');
        
        // Get the last segment, which contains the filename
        const filename = pathSegments[pathSegments.length - 1];
        console.log(filename)
        const regex = new RegExp(query, 'ig'); // 'i' flag for case-insensitive search
        return regex.test(filename)
    }
    const handleSearch = (e)=>{
        if(e.target.value === '' || e.target.value === undefined || e.target.value === null){
            handleImage('')
            return;
        }
        console.log(images)
        const text = e.target.value
        const data = images.filter((url) =>{
           console.log(url)
            return matchSearch(url, text)
        } );
        console.log(data)
      handleImage(data)
    }
  return (
    <div className='header'>
        <div className='logo'>
            People gallery
        </div>
        <div className='search-wrapper'>
        <input type='text' className='search' onChange={handleSearch}/>
        </div>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className='logout-btn home-btn'>
            logout
        </button>
    </div>
  )
}
