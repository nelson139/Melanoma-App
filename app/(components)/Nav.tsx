import React from 'react'
import Logo from "./Logo"

function Nav() {
  return (
    <div className="flex place-content-around items-center h-20 bg-nav-color">
        <h1 className='text-white text-3xl'>Melanoma Predicter</h1>
        <h1 className='text-2xl text-gray-200'><span className='hidden min-[900px]:inline-block'>powered by <span className='text-white'>python</span> and <span className='text-white'>next.js&nbsp;</span></span><span className='hidden min-[1200px]:inline-block'>- data stored by <span className='text-white'>prisma DB</span></span></h1>
        <Logo />
    </div>
  )
}

export default Nav