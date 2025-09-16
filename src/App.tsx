import './App.css'
import './styles/lessons.css'
import { Chat } from './pages/chat/chat'
import { ChineseLessons } from './pages/lessons/ChineseLessons'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <div className="w-full h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <Routes>
              <Route path="/" element={<Chat />} />
              <Route path="/lessons" element={<ChineseLessons />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App;