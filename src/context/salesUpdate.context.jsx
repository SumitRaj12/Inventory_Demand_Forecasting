import { createContext, useState } from "react";

const SalesContext = createContext(null);

const SalesContextProvider = ({ children }) => {
  const [sales, setSales] = useState(false);
  const [role,setRole] = useState(false);

  const updateRole = (flag)=>{
    setRole(flag);
  }
  const update = (flag) => {
    setSales(flag);
  };

  return (
    <SalesContext.Provider value={{ sales, update , role, updateRole }}>
      {children}
    </SalesContext.Provider>
  );
};

export { SalesContext, SalesContextProvider };
