import { useState, type MouseEventHandler } from "react"


function App() {
  const [uid, setUid] = useState<string>("")


  const uidHandler = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setUid(e.target.value)
  }
  
  return (
    <div>
      <h1>File collaborator</h1>
      
      <input type="text" onChange={uidHandler} placeholder="userId"/>
      <input type="text" placeholder="fileName" />
      <input type="text" placeholder="fileId" />
      
      <button onClick={()=>console.log(uid)}>create file</button>
      <button>join file</button>
    </div>
  )
}

export default App
