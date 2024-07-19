import React from 'react'
import { useId } from 'react'
const Input=React.forwardRef(function Input({
    label,
    type='text',
    className="",
    ...props
},ref){
    const id=useId()
    return (
        <div className='w-full mt-[20px]'>
            {label && <p
            className='' htmlFor={id}>
                {label}
                </p>
            }
            <input type={type}
            className={`bg-transparent border border-white w-full rounded-md px-3 py-2 text-white`} 

            ref={ref} {...props} id={id}
            />

        </div>
    )
})

export default Input