import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const updateUser = (newUserId) => {
    setUserId(newUserId);
  };
  const updateRole = (newUserRole) => {
    setUserRole(newUserRole);
  };
  const updateName = (newUserRole) => {
    setUserName(newUserRole);
  };

  return (
    <UserContext.Provider value={{ userId, updateUser,userRole,updateRole,userName,updateName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
