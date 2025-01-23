// import { useOutletContext } from "@remix-run/react";

import { useContext } from "react"
import UserContext from "~/context/userContext"

export default function Test() {
    const {setUser, user} = useContext(UserContext);
    
    setUser({
        firstName: 'test',
        lastName: 'test',
        email: 'test@test.com'
    });
  
  return (
    <div>
        {JSON.stringify(user)}
    </div>
  )
}
