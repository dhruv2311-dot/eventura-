import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Homepage from './homepage';
import Venue from './venue';
import Navbar from './navbar';
import Blogs from './blogs'
import Events from './events'
import Contactus from './contactus'
import Projects from './projects'
function App() {

  return (
    <>
      <Router>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='/venue' element={<Venue/>}/>
      <Route path='/events' element={<Events/>}/>
      <Route path='/projects' element={<Projects/>}/>
      <Route path='/blogs' element={<Blogs/>}/>
      <Route path='/contectus' element={<Contactus/>}/>
      

      
    </Routes>
      </Router>
    </>
  )
}

export default App
