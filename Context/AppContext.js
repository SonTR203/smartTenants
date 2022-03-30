import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

function AppProvider({ children }) {
	const [post, setPost] = useState({});
	const [currentUser, setCurrentUser] = useState({});
	const [notifications, setNotifications] = useState({});
	return (
		<AppContext.Provider
			value={{
				post,
				setPost,
				currentUser,
				setCurrentUser,
				notifications,
				setNotifications,
			}}
		>
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
