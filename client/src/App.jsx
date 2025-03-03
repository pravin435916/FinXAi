import React from 'react'
import HomePage from './pages/Homepage';
import LandingPage from './pages/LandingPage';
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import Navbar from './components/Navbar/page'
import FinanceNewsSection from './components/NewsSection/page'
import StockChart from './components/chart/page'
import ExpenseTracker from './pages/ExpenseTracking';
import StockSentiment from './components/sentiment/page';
import StockAnalysisS from './components/financialAnalysis/page';

import ROICalculator from './components/ROI/page'
import StockAnalysis from './pages/StockAnalysis';
import Chatbot from './pages/Chatbot';
const App = () => {
  return (
    <>
      <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/expense-tracker' element={<ExpenseTracker/>}/>
        <Route path='/stock-analysis' element={<StockAnalysis/>}/>
        <Route path='/roi-calculator' element={<ROICalculator/>}/>
        <Route path='/chatbot' element={<Chatbot/>}/>
        <Route path='/sentiment' element={<StockSentiment/>}/>
        <Route path='/financial-analysis' element={<StockAnalysisS/>}/>
        {/* <Route path='/financial-analysis' element={<StockAnalysis/>}} */}
      </Routes>
      {/* <ROICalculator/> */}
      {/* <HomePage /> */}
      {/* <LandingPage  />
      <ExpenseTracker/> */}
      </BrowserRouter>
    </>
  )
      // <StockChart />
      // <FinanceNewsSection/>
      // <ROICalculator/>
}
export default App
