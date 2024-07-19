import React from 'react'

function ButtonType2({children,props}) {
 
  return (
    <button 
    className="justify-center whitespace-nowrap text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-12 rounded-md group/btn mr-1 flex w-auto items-center gap-x-2 bg-orange-500 px-4 py-2 text-center font-bold text-white shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] hover:text-black hover:bg-white" type="submit" fdprocessedid="e81c7u"
    
    onClick={props}
    >
      {children}

    </button>
  )
}

export default ButtonType2