import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import MenuPage from './pages/MenuPage'
import ProtectedRoute from './components/ProtectedRoute'
import CategoriaPage from './pages/CategoriaPage'
import DashbdPage from './pages/DashbdPage/DashbdPage'
import CitasPage from './pages/CitasPage/CitasPage'
import DuenosPage from './pages/DuenosPage/DuenosPage'
import MascotasPage from './pages/MascotasPage/MascotasPage'
import UserPage from './pages/UserPage/UserPage'
import TratamientosPage from './pages/TratamientosPage/TratamientosPage'
import LoginPage from './pages/LoginPage/LoginPage'

const route = createBrowserRouter([
  {path:'/', element:<LoginPage />},
  {path:'/menu', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_USER"]}><DashbdPage/></ProtectedRoute>},
  {path:'/dashboard', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_USER"]}><DashbdPage/></ProtectedRoute>},
  {path:'/citas', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_USER"]}><CitasPage/></ProtectedRoute>},
  {path:'/duenos', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_USER"]}><DuenosPage/></ProtectedRoute>},
  {path:'/mascotas', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_USER"]}><MascotasPage/></ProtectedRoute>},
  {path:'/usuarios', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN"]}><UserPage/></ProtectedRoute>},
  {path:'/tratamientos', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN"]}><TratamientosPage/></ProtectedRoute>},
  {path:'/no-autorizado', element:<h3>No tienes permisos para acceder a esta página</h3>}

])
function App() {

  return <RouterProvider router={route} />
}

export default App
