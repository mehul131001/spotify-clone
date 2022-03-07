import { ChevronDownIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import {shuffle}  from "lodash";

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
]

function Center() {
  const { data: session } = useSession();
  const [color, setColor]  =useState(null);
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [])
  return (
    <div className=" flex-grow  ">
      <header className=' absolute top-5 right-8'>
        <div className=" item-center bg-red-400  p-1 pr-2 flex cursor-pointer space-x-3 rounded-full bg-black opacity-90 hover:opacity-80">
          <img
            className=" h-10 w-10 rounded-full"
            src={session?.user.image}
            alt=""
          />
          <h2 className=' mt-1.5'>{session?.user.name}</h2>
          <ChevronDownIcon className=" mt-1.5 h-5 w-5" />
        </div>
      </header>
      <section className={` flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
          {/* <img src="" alt="" /> */}
          hhhhh
      </section>
    </div>
  )
}

export default Center
