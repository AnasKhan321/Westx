import React, { createContext, useContext, useState, ReactNode } from 'react';




interface ActivityContextType {
    contextlikes : string[]
    setcontextlikes : (contextlikes : string[]) => void
    contextreposts : string[]
    setcontextreposts : (contextreposts : string[]) => void
    contextbookmarks : string[]
    setcontextbookmarks : (contextbookmarks : string[]) => void , 
    removecontextlikes : string[]
    setremovecontextlikes : (removecontextlikes : string[]) => void
    removecontextbookmarks : string[]
    setremovecontextbookmarks : (removecontextbookmarks : string[]) => void
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const ActivityProvider: React.FC<AppProviderProps> = ({ children }) => {


    const [contextlikes ,setcontextlikes]  = useState<string[]>([])
    const [contextreposts ,setcontextreposts]  = useState<string[]>([])
    const [contextbookmarks ,setcontextbookmarks]  = useState<string[]>([])
    const [removecontextbookmarks ,setremovecontextbookmarks] = useState<string[]>([])

    const [removecontextlikes ,setremovecontextlikes] = useState<string[]>([])


    const value = {
      contextlikes , removecontextbookmarks , setremovecontextbookmarks,  setcontextlikes , contextreposts , setcontextreposts , contextbookmarks , setcontextbookmarks  , removecontextlikes , setremovecontextlikes 
    }



    return (
        <ActivityContext.Provider value={value}>
            {children}
        </ActivityContext.Provider>
    );
};

// Create a custom hook to use the context
export const useApp = () => {
    const context = useContext(ActivityContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};


