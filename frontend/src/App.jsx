import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import MenuPage from './pages/MenuPage'
import ProtectedRoute from './components/ProtectedRoute'
import CategoriaPage from './pages/CategoriaPage'

const route = createBrowserRouter([
  {path:'/', element:<LoginPage />},
  {path:'/menu', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_USER"]}><MenuPage/></ProtectedRoute>},
  {path:'/categoria', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_USER"]}><CategoriaPage/></ProtectedRoute>},
  {path:'/no-autorizado', element:<h3>No tienes permisos para acceder a esta página</h3>}

])
function App() {

  return <RouterProvider router={route} />
}

export default App
