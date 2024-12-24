import React, { createContext, useState, ReactNode } from 'react'

type AsideContextType = {
  openMember: boolean
  setOpenMember: React.Dispatch<React.SetStateAction<boolean>>
  openSettings: boolean
  setOpenSettings: React.Dispatch<React.SetStateAction<boolean>>
};

export const AsideContext = createContext<AsideContextType | undefined>(undefined);

export const AsideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [openMember, setOpenMember] = useState<boolean>(false)
  const [openSettings, setOpenSettings] = useState<boolean>(false)

  return (
    <AsideContext.Provider value={{ openMember, setOpenMember, openSettings, setOpenSettings }}>
      {children}
    </AsideContext.Provider>
  );
};