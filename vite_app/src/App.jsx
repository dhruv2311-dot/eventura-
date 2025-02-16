import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './homepage';
import Venue from './venue';
import Navbar from './Navbar';
import Blogs from './Blogs';
import Events from './events';
import Contactus from './Contactus';
import Projects from './projects';
import Profile from './profilepage';
import Landingpage from './landingpage';
import ProtectedRoute from './ProtecedRoute';

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
      <Route path='/' element={<Landingpage/>}/>
        <Route path='/home' element={<ProtectedRoute component={Homepage} />} />
        <Route path='/venue' element={<ProtectedRoute component={Venue} />} />
        <Route path='/events' element={<ProtectedRoute component={Events} />} />
        <Route path='/projects' element={<ProtectedRoute component={Projects} />} />
        <Route path='/blogs' element={<ProtectedRoute component={Blogs} />} />
        <Route path='/contactus' element={<ProtectedRoute component={Contactus} />} />
        <Route path='/profile' element={<ProtectedRoute component={Profile} />} />
      </Routes>
    </Router>
  );
}

export default App;
