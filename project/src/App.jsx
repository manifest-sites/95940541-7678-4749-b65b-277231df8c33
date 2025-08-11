import { useState, useEffect } from 'react'
import Monetization from './components/monetization/Monetization'
import MortgageCalculator from './components/MortgageCalculator'

function App() {

  return (
    <Monetization>
      <MortgageCalculator />
    </Monetization>
  )
}

export default App