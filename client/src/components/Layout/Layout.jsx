import React from 'react'
import Header from '../Header/Header.jsx'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer.jsx'

const Layout = () => {
  const mainStyle = {
      padding: "40px 0px",
      margin : "0 auto",
      maxWidth: "1500px"
  }
  const footerStyle = {
  }
  return (
    <div>
        <Header/>
        <div style = {mainStyle}>
            <Outlet />
        </div>
        <div style={footerStyle}>
          <Footer/>
        </div>
    </div>

  )
}

export default Layout