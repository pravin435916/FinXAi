import React from 'react'
import HomePage from './pages/Homepage';
import LandingPage from './pages/LandingPage';
import { Route,Routes } from 'react-router-dom'
import Navbar from './components/Navbar/page'

const App = () => {
  return (
    <>
      <Navbar />
      <HomePage />
      {/* <LandingPage  /> */}
    </>
  )
}
export default App
