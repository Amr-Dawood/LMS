import { Outlet } from 'react-router-dom'
import Navbar from '../../educator/Navbar'
import Sidebar from '../../educator/Sidebar'
import Footer from '../../educator/Footer'

const Educator = () => {
  return (
    <div className='text-default min-h-screen bg-white'>
      <Navbar />
        <div className='flex'>
          <Sidebar/>
          <div className='flex-1'>
            {<Outlet/>}
          </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Educator