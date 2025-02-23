import React from 'react'
import HomePage from './pages/Homepage';
import LandingPage from './pages/LandingPage';
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import Navbar from './components/Navbar/page'
import ExpenseTracker from './pages/ExpenseTracking';
import StockSentiment from './components/sentiment/page';
import StockAnalysis from './components/financialAnalysis/page';

const App = () => {
  return (
    <>
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/expense-tracker' element={<ExpenseTracker/>}/>
        <Route path='/sentiment' element={<StockSentiment/>}/>
        <Route path='/financial-analysis' element={<StockAnalysis/>}/>
        {/* <Route path='/financial-analysis' element={<StockAnalysis/>}} */}
      </Routes>
      {/* <HomePage /> */}
      {/* <LandingPage  />
      <ExpenseTracker/> */}
      </BrowserRouter>
    </>
  )
}
export default App
