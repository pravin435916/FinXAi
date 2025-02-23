import Navbar from './components/Navbar/page'
import FinanceNewsSection from './components/NewsSection/page'
import StockChart from './components/chart/page'
import ROICalculator from './components/ROI/page'
const App = () => {
  return (
    <div>
      <Navbar />
      <StockChart />
      <FinanceNewsSection/>
      <ROICalculator/>
    </div>
  )   
}

export default App
