import React from 'react'

function Button({
    children,
    type = 'button',
    bgColor = 'bg-orange-400',
    textColor='text-white',
    className="",
    ...props

}) {
  return (
    <button className={`px-4 w-full mt-5 py-2 rounded-lg ${bgColor} ${textColor} ${className}`} {...props}>
        {children}
    </button>
  )
}

export default Button