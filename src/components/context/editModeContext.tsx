import React, {createContext, ReactNode, useContext, useState} from 'react';

interface IProps {
    children: ReactNode,
    init?: boolean,
}

const defaultValue = {
    state: false,
    setState: (state: boolean) => {}
}

const EditModeContext = createContext(defaultValue);

export const useEditModeContext= () => useContext(EditModeContext);

export const EditModeProvider = ({children}:IProps) => {
    const [ state, setState ] = useState(defaultValue.state);

    return (
        <EditModeContext.Provider value={{state, setState}}>
            {children}
        </EditModeContext.Provider>
    )
}
