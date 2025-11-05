import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import { Toaster } from "react-hot-toast";


const App = () => {
  return (
    <>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Dashboard />} />
    </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default App