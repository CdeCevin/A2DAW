import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import MenuPage from './pages/MenuPage'
import ProtectedRoute from './components/ProtectedRoute'
import CategoriaPage from './pages/CategoriaPage'
import DashbdPage from './pages/DashbdPage/DashbdPage'
import CitasPage from './pages/CitasPage/CitasPage'
import DuenosPage from './pages/DuenosPage/DuenosPage'
import MascotasPage from './pages/MascotasPage/MascotasPage'
import VetPage from './pages/VetPage/VetPage'
import TratamientosPage from './pages/TratamientosPage/TratamientosPage'

const route = createBrowserRouter([
  {path:'/', element:<LoginPage />},
  {path:'/menu', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_USER"]}><MenuPage/></ProtectedRoute>},
  {path:'/dashboard', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_USER"]}><DashbdPage/></ProtectedRoute>},
  {path:'/citas', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_USER"]}><CitasPage/></ProtectedRoute>},
  {path:'/duenos', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_USER"]}><DuenosPage/></ProtectedRoute>},
  {path:'/mascotas', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_USER"]}><MascotasPage/></ProtectedRoute>},
  {path:'/veterinarios', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN"]}><VetPage/></ProtectedRoute>},
  {path:'/tratamientos', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN"]}><TratamientosPage/></ProtectedRoute>},
  {path:'/no-autorizado', element:<h3>No tienes permisos para acceder a esta página</h3>}

])
function App() {

  return <RouterProvider router={route} />
}

export default App
