import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { UserHeader } from '../components/usersComponents/UserHeader';
import MetaData from '../components/ui/MetaData/MetaData';
import './AdminProfile.css';
import AdminNav from '../components/adminComponents/AdminNav';
import AdminProductsList from '../components/adminComponents/AdminProductsList';

export const AdminProfile = () => {
	const navigate = useNavigate();
	// estado mínimo en este layout, los formularios están en admincomponents/

	const [isAuthorized, setIsAuthorized] = useState(false);

	useEffect(() => {
		// Require auth token to access admin panel
				const userStored = sessionStorage.getItem('authUser');
				if (!userStored) {
					navigate('/login');
					return;
				}
				
				const user = JSON.parse(userStored);

				// Verificación extra de seguridad en el front
				if (user.role !== 'admin') {
					navigate('/'); // O a una página de "No autorizado"
					return;
				}

				setIsAuthorized(true);
				// No cargamos datos aquí: cada subcomponente carga lo que necesite
	}, [navigate]);

		// Los subformularios realizan sus propias llamadas

	if (!isAuthorized) return null;	
	return (
		<>
			<MetaData title="Perfil de administrador" />
			<UserHeader />
			<main className="profile-page-admin">
				<div className="profile-admin-container">
					<h1 className="profile-title-admin">Panel de Admin</h1>
					<AdminNav />
					<div style={{ marginTop: 8 }}>
						{/* Outlet para subrutas: insert / update / delete */}
						<Outlet />
					</div>
				</div>
			</main>
		</>
	);
};

export default AdminProfile;
