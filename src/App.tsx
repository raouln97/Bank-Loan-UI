import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserApplications } from './pages/UserApplications';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserApplications context={{isAdmin: false}}/>} />
        <Route path="/bank" element={<UserApplications context={{isAdmin: true}}/>} />
        {/* <Route path="/banks" element={<Ticket />} />
        <Route path="/submit" element={<SubmitTicket />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
