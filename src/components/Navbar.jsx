

function Navbar() {
  return (
    <nav className='flex justify-between bg-slate-300 items-center px-4 w-[100%]'>
      <div className='logo'>
        <span className='font-bold text-5xl'>iTask</span>

      </div>
        <ul className='flex gap-11 font-bold text-white '>
            <li className=' hover:text-gray-500 cursor-pointer '>Home</li>
            <li className=' hover:text-gray-500 cursor-pointer'>Your Tasks</li>
        </ul>
    </nav>
  )
}

export default Navbar