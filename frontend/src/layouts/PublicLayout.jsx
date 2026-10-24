import { Outlet } from 'react-router-dom'
import UserFooter from '../components/layout/user/UserFooter.jsx'
import UserHeader from '../components/layout/user/UserHeader.jsx'

export default function PublicLayout() {
  return (
    <div className="meomeo-home">
      <UserHeader />
      <main>
        <Outlet />
      </main>
      <UserFooter />
    </div>
  )
}
