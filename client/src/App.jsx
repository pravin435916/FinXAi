import React from 'react'
import HomePage from './pages/Homepage';
import LandingPage from './pages/LandingPage';
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import Navbar from './components/Navbar/page'
import StockChart from './components/chart/page'
import ExpenseTracker from './pages/ExpenseTracking';

const App = () => {
  return (
    <>
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/expense-tracker' element={<ExpenseTracker/>}/>
      </Routes>
      {/* <HomePage /> */}
      {/* <LandingPage  />
      <ExpenseTracker/> */}
      </BrowserRouter>
    </>
  )
}
export default App
