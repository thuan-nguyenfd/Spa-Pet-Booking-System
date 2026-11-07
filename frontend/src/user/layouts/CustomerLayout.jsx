import { Outlet } from 'react-router-dom'
import UserFooter from './components/UserFooter.jsx'
import UserHeader from './components/UserHeader.jsx'

export default function CustomerLayout() {
  return (
    <div className="meomeo-home">
      <UserHeader />
      <main><Outlet /></main>
      <UserFooter />
    </div>
  )
}
