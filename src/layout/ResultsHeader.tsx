import React from 'react'
import { Config } from '../utils/Config'
import { Navbar } from '../components/Navbar'
import { Authbar } from '../components/Authbar'

type IResultsHeaderProps = {
  type?: string
}

const ResultsHeader: React.FC<IResultsHeaderProps> = (props) => {
  return (
    <header className="p-4 border-b border-gray-300">
      <Authbar />
      <div className="pl-5 pt-12 pb-8">
        <div className="text-center font-semibold text-6xl text-gray-900">VÝSLEDKY {Config.title}</div>
      </div>
      <Navbar />
    </header>
  )
}

export default ResultsHeader