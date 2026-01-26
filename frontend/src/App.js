import logo from './logo.svg';
import './App.css';
import Login from './pages/Login'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className='d-flex flex-column min-vh-100'>
        <Routes>
          <Route path="/login" element={<Login />} > </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
