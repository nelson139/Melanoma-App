import React, { useState } from 'react'

function Main() {
    const [prediction, setPrediction] = useState("undetermined")

async function submitData(e: any) {
    // save to github
    
    e.preventDefault() // stops form from refreshing page
    setPrediction('computing...')

    // defining inputs
    const radius = document.getElementById('radius') as HTMLInputElement
    const texture = document.getElementById('texture') as HTMLInputElement
    const perimeter = document.getElementById('perimeter') as HTMLInputElement
    const area = document.getElementById('area') as HTMLInputElement
    const smoothness = document.getElementById('smoothness') as HTMLInputElement
    
    //let dataText  = `${area?.value},${perimeter?.value}` // data sent to the server
    let dataText = '' // data sent to the server
    let pred; // the returned prediction value from the flask server will be stored here
    let inputsFilled = 0; // shows the number of inputs filled
    let emptyFields = '' // shows which inputs are empty

    // finds which inputs are empty
    if (radius?.value == '') {
        emptyFields+='1,'
    }
    if (texture?.value == '') {
        emptyFields+='2,'
    }
    if (perimeter?.value == '') {
        emptyFields+='3,'
    }
    if (area?.value == '') {
        emptyFields+='4,'
    }
    if (smoothness?.value == '') {
        emptyFields+='5,'
    }

    emptyFields = emptyFields.slice(0, -1)

    if (radius?.value == '' && texture?.value == '' && perimeter?.value == '' && area?.value == '' && smoothness?.value == '') { 
        setPrediction('no data was inputted')
        return('data was not inputted')
    }

    dataText = `${radius?.value}, ${texture?.value}, ${perimeter?.value}, ${area?.value}, ${smoothness?.value}`.replaceAll(' ,', '').trim().replaceAll(' ', ''); // removes lone commas and whitespace when not all of the inputs are filled
    if (dataText.slice(-1) == ',') { // checks if last character from the string is a comma
       dataText = dataText.slice(0, -1) // removes last character from the string
    }
    
    inputsFilled = dataText.split(',').length

    let dataPacket = {
        text: dataText, 
        amount: inputsFilled,
        empty: emptyFields
    }

    const response = await fetch("http://localhost:8080/api", {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(dataPacket)
    })
    .then( response => response.json() )
    .then( data => { 
        pred = data 
        setPrediction(pred) 
    })
}

  return (
    <>
    <div className='flex justify-center mt-24'>
    <div className='grid grid-cols-1 min-[1200px]:grid-cols-2'>
        <div className='w-[32rem] h-[32rem] row-start-1 col-start-1 z-[1] rounded-full bg-blue0 hidden min-[1200px]:inline-block'>
            <h1 className='mt-36 text-5xl text-white text-center'>Data Input</h1>
            <h1 className='mt-16 text-2xl text-white text-center'>Leaving some inputs empty is fine, but the<br></br> more data you input, the more accurate<br></br> the prediction will be since it means the<br></br> model has more to use.</h1>
        </div>
    <form onSubmit={submitData}>
    <div className='input-header mt-[0.5rem]'>radius mean (mm)</div>
    <input className='input' placeholder='enter here' type='number' step={0.01} name='radius' id='radius' />
    <div className='input-header mt-[1rem]'>texture mean (dimensionless)</div>
    <input className='input' placeholder='enter here' type='number' step={0.01} name='texture' id='texture' />
    <div className='input-header mt-[1rem]'>perimeter mean (mm)</div>
    <input className='input' placeholder='enter here' type='number' step={0.01} name='perimeter' id='perimeter' />
    <div className='input-header mt-[1rem]'>area mean (mm)</div>
    <input className='input' placeholder='enter here' type='number' step={0.01} name='area' id='area' />
    <div className='input-header mt-[1rem]'>smoothness mean (mm)</div>
    <input className='input' placeholder='enter here' type='number' step={0.01} name='smoothness' id='smoothness' />
    <button className='block w-[50vw] h-14 mt-[1rem] row-start-1 col-start-2 text-center text-4xl leading-[1.5em] text-white bg-blue3 hover:bg-blue4 outline-none min-[1200px]:w-[145%] min-[1200px]:-ml-48' type='submit'>Submit</button>
    </form>
    </div>
    </div>
    <div className='flex justify-center mt-[4rem]'>
    <div className='w-[85%] h-16 bg-white text-center text-4xl font-semibold text-blue3 leading-[4rem]'>diagnosis: {prediction}</div>
    </div>
    </>
    )
}

export default Main