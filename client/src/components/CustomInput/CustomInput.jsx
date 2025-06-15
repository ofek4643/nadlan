import React from 'react'

const CustomInput = ({type , style ,name, placeholder , onChange , value , className , min , max ,step}) => {
  return (
        <input type={type} style={style} name={name} placeholder={placeholder} onChange = {onChange} value={value} className={className} min={min} max={max} step ={step}  />
  )
}

export default CustomInput