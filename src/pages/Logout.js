import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Logout() {

	const { setUser, unsetUser } = useContext(UserContext);

	useEffect(() => {
		unsetUser();
		setUser({
			id: null,
			username: null,
			email: null,
			isAdmin: null
		});
	}, [setUser, unsetUser]);

	return (
		<Navigate to="/login" />
	)
}
