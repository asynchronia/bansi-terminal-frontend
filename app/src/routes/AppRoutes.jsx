import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home/Home'
import CreateProducts from '../pages/Products/CreateProducts'

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path='/products' element={<CreateProducts/>}></Route>
      </Routes>
    </div>
  )
}

export default AppRoutes
