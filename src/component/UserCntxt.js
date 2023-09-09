import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const updateUser = (newUserId) => {
    setUserId(newUserId);
  };
  const updateRole = (newUserRole) => {
    setUserRole(newUserRole);
  };

  return (
    <UserContext.Provider value={{ userId, updateUser,userRole,updateRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
