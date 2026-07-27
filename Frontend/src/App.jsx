import { useCallback, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

import Child from './components/child'

function App() {
  const [count, setCount] = useState(0)
  const func=useCallback(()=>{
    
    console.log("Parent function");
  },[count]
  );
  return (
    <>
    <Child func={func}>

    </Child>
   Hello
   <button onClick={()=>setCount((p)=>p+1)}>{count}</button>   </>
  )
}

export default App
