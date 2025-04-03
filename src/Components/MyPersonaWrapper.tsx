
import { useAuth } from '../Context/AuthContext'
import AuthRequired from '../ReusableComponents/Authrequired'
import ManagePersonas from './ManagePersonas'
const MyPersonaWrapper = () => {
    const {isAuthenticated} = useAuth()
  return (
    <div>   
        {isAuthenticated ? <ManagePersonas /> :  <AuthRequired/>  }

        

      
    </div>
  )
}

export default MyPersonaWrapper
