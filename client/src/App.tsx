import { useState } from 'react'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const size_options = [
  {value:"2",label:"2x2"},
  {value:"3",label:"3x3"},
  {value:"4",label:"4x4"},
  {value:"5",label:"5x5"}
]

const time_options = [
  {value:"7",label:"7 days"},
  {value:"1",label:"1 month"},
  {value:"3",label:"3 months"}
]

function App() {
  const [params, setParams] = useState({user:'',size:'',time:''})
  const [image, setImage] = useState('')


  console.log(image)

  const handleUserChange = (event) => {
    setParams((prevData) => ({...prevData, user:event.target.value}))
  }
  
  const handleSizeChange = (option) => {
    setParams((prevData) => ({...prevData, size:option.value}))
  }
  
  const handleTimeChange = (option) => {
    setParams((prevData) => ({...prevData, time:option.value}))
  }

  const handleSave = async () => {
    const res = await fetch(`http://localhost:4000/collage?user=${params.user}&size=${params.size}&time=${params.time}`)
    const txt = await res.text()
    setImage(txt.slice(10,-4))
    window.open(`${image}`, '_blank', 'noopener')
  }

  return (
    <div className='font-sans'>
      <div className='flex flex-col items-center justify-center mt-12'> 
        <h1 className='text-4xl'><span className='font-medium'>Letterbox</span> Collage Generator</h1>
      </div>
      
      <div className='flex flex-row justify-center items-center mt-36'>
        <input 
          value={params.user}
          onChange={handleUserChange}
          className='bg-neutral-500 hover:bg-neutral-600 active:bg-neutral-700 focus:outline-none focus:ring-1 focus:ring-sky-500 p-2 mr-8' 
          placeholder="Letterboxd username">
        </input>
        <Dropdown 
          value={params.size}
          onChange={handleSizeChange}
          options={size_options}
          className='mr-8' 
          placeholder="size">
        </Dropdown>
        <Dropdown 
          value={params.time}
          onChange={handleTimeChange}
          options={time_options}
          className='mr-8' 
          placeholder="time">
        </Dropdown>

        <input 
          type="checkbox"
          className='mr-8'
        ></input>
        <button 
          onClick={handleSave}
          className='bg-green-500 p-2 px-4 text-white hover:bg-green-600 ease-in-out transition active:bg-green-800'>
            Submit
        </button>
      </div>
      <img src={image} alt="collage" />
    </div>
  )
}

export default App
