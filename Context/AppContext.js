import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

function AppProvider({ children }) {
	const [post, setPost] = useState({});
	const [user, setUser] = useState({});
	return (
		<AppContext.Provider value={{ post, setPost, user, setUser }}>
			{children}
		</AppContext.Provider>
	);
}

function useAppContext() {
	const context = useContext(AppContext);
	if (!context)
		throw new Error('useAppContext must be used within a AppProvider');
	return context;
}

export { useAppContext, AppProvider };
