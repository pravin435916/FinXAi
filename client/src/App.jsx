import { Route,Routes } from 'react-router-dom'
import Navbar from './components/Navbar/page'
import StockChart from './components/chart/page'
const App = () => {
  return (
    <div>
      <Navbar />
      <StockChart />
    </div>
  )   
}

export default App
