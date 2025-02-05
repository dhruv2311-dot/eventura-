import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './homepage';
import Venue from './venue';
import Navbar from './Navbar';
import Blogs from './Blogs';
import Events from './Events';
import Contactus from './Contactus';
import Projects from './Projects';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/venue' element={<Venue />} />
        <Route path='/events' element={<Events />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/contactus' element={<Contactus />} />
      </Routes>
    </Router>
  );
}

export default App;
