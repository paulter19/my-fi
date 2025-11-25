import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AccountDetails } from './pages/AccountDetails'
import { Accounts } from './pages/Accounts'
import { Dashboard } from './pages/Dashboard'
import { Settings } from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="account/:id" element={<AccountDetails />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
