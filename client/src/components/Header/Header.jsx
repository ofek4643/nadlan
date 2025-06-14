import styles from "./Header.module.css"
import { Link } from 'react-router-dom'
const Header = () => {
  return (
    <header className = {styles.header}>
      <div className = {styles.container}>
        <Link to= "/">
          <h2 className = {styles.logo}>נדל"ן ישראלי</h2>
        </Link>
        <ul className= {styles.navList}>
          <Link to="/" >דף הבית</Link>
          <Link to="properties" >חיפוש נכסים</Link>
          <Link to="mortgage-calculator" >מחשבון משכנתא</Link>
        </ul>
        <div className= {styles.authButtons}>
          <Link to="login">
                <button className={styles.LoginBtn}>התחברות</button>
          </Link>
          <Link to="register">
                <button className={styles.RegisterBtn}>הרשמה</button>
          </Link>
        </div>
      </div>
    </header>
  )
}
export default Header