
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Profile = ({ user,handleLogout }) => {
    const [isOpen, setIsopen] = useState(false)
    const navigate = useNavigate();

    return (
        <div className="relative flex items-center space-x-2">
            <div onClick={() => setIsopen(prev => !prev)} className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
            </div>
            {
                isOpen &&
                <div className='px-8 py-8 bg-gray-100 rounded absolute z-10 top-14 shadow-sm right-3 '>
                    <div className='flex flex-col gap-2 items-center'>
                        <div>
                            <div className="w-14 h-14 bg-blue-600 flex items-center justify-center text-white font-bold rounded-full">{user?.name?.slice(0, 1).toUpperCase()}</div>
                        </div>
                        <p>{user?.name}</p>
                        <p className='text-sm text-gray-600'>{user?.email}</p>
                        <button onClick ={handleLogout} type='button' className='px-7 py-2 rounded bg-red-600 hover:bg-red-700 cursor-pointer mt-4 text-white text-sm'>Logout</button>
                    </div>
                </div>
            }

        </div>
    )
}

export default Profile

