
import { useAuth } from '../Context/AuthContext';
import AddPersona from './AddPersona';
import AuthRequired from '../ReusableComponents/Authrequired';

const AddPersonaWrapper = () => {

    const {isAuthenticated}  = useAuth();
  return (
    <div>
      {isAuthenticated ? (
        <AddPersona />
      ) : (
        <AuthRequired  description='Please log in to add a persona and see your favorite people on WestX.'/>
      )}

    </div>
  )
}

export default AddPersonaWrapper
