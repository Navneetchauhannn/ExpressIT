import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInSide from './components/signInSide';
import SignUp from './components/singUp';
import Dashboard from './components/AdminPanel/Dashboard';
import Home from './components/HomePageComponents/Home';
import Archives from './components/ArchivesFolder/Archives';
import Contact from './components/ContactUs/Contact';
import AdminSignUp from './components/AdminPanel/AdminSignUp';
import Form from './components/Forms/Form';
import NewAppbar from './components/NewAppbar';
import MyProfile from './components/HomePageComponents/MyProfile';
import Footer from './components/HomePageComponents/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <NewAppbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/adminpanel" element={<Dashboard />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/adminsignup" element={<AdminSignUp />} />
          <Route exact path="/archives" element={<Archives />} />
          <Route exact path="/signUp" element={<SignUp />} />
          <Route exact path="/signIn" element={<SignInSide />} />
          <Route exact path="/addactivity" element={<Form />} />
          <Route exact path="/myprofile" element={<MyProfile />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
