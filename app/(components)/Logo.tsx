import React from 'react'

function Logo() {
  return (
    <>
    <div className='hidden grid-cols-1 min-[500px]:grid'>
    <div className="row-start-1 col-start-1 w-8 h-8 rounded-full ml-[1.75rem] mt-[1rem] bg-blue2"></div>
    <div className="row-start-1 col-start-1 w-8 h-8 rounded-full ml-[1rem] z-[1] bg-blue3"></div>
    <div className="row-start-1 col-start-1 w-8 h-8 rounded-full ml-[0.25rem] mt-[1rem] bg-blue4"></div>
    </div>
    </>
  )
}

export default Logo