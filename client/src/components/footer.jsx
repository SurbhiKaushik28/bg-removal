import React from 'react'
import { assets } from '../assets/assets'

const footer = () => {
  return (
    <div className='flex items-center justify-between gap-4 px-4 lg:px-44 py-3'>
        <img width={150} src={assets.logo}/>
        <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden '>Copyright @bgRemoval | All right reserved.</p>
        <div className='flex gap-1'>
            <img width={40} src={assets.facebook_icon} />
            <img width={40} src={assets.twitter_icon} />
            <img width={40} src={assets.google_plus_icon} />
        </div>
    </div>
  )
}

export default footer