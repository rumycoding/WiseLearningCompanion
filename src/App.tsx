import './App.css'
import './styles/lessons.css'
import { Chat } from './pages/chat/chat'
import { ChineseLessons } from './pages/lessons/ChineseLessons'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (renamed from cacheTime)
      retry: 2,
      retryDelay: 1000,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  )
}

export default App;