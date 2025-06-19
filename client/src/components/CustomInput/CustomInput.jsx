import React from 'react'

const CustomInput = ({type , ...rest}) => {
  return (
        <input type={type} {...rest} />
  )
}

export default CustomInput