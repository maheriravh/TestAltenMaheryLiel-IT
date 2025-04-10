import { User } from '@/models/user-model';
import { DeleteUser, GetAllUser, UpdateUser } from '@/services/user-service';
import React, { useEffect, useState } from 'react';
import '@/styles/style.css';
import { useRouter } from 'next/router';

const UserPage: React.FC = () => {

    const router = useRouter();

    const [listUser, setListUser] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userRole, setUserRole] = useState<string>("");
    const [userLogin, setUserLogin] = useState<string>("");
    const [userToken, setUserToken] = useState<string>("");
    const [isShowConfirmDelete, setIsShowConfirmDelete] = useState<boolean>(false);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isShowError, setIsShowError] = useState<boolean>(false);
    const [msgError, setMsgError] = useState<string>("");

    useEffect(() => {
        const role = localStorage.getItem("role");
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!role || !token || !user) {
            router.push("/auths/login");
            return;
        }
        setUserRole(role || "");
        setUserLogin(user || "");
        setUserToken(token || "");
    }, [userRole, userLogin]);

    useEffect(() => {
        if (!userToken) return;

        GetAllUser(userToken)
            .then((data) => {
                setListUser(data.result);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });
    }, [userToken]);

    useEffect(() => {
        if (isShowError) {
            const timeout = setTimeout(() => {
                setIsShowError(false);
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [isShowError]);

    const handleEdit = (id: number, login: string) => {
        if (userLogin === login) {
            setMsgError("Vous ne pouvez pas modifier votre propre rôle !");
            setIsShowError(true);
            return;
        }
        setCurrentUser(listUser.find((u) => u.id_user === id) || null);
        setIsShowModal(true);
    }

    const handleDelete = (id: number, login: string) => {
        if (userLogin === login) {
            setMsgError("Vous ne pouvez pas supprimer votre compte !");
            setIsShowError(true);
            return;
        }
        setCurrentUser(listUser.find((u) => u.id_user === id) || null);

        setIsShowConfirmDelete(true);
    };

    const handleSave = async () => {
        if (!currentUser)
            return;

        const res = await UpdateUser(currentUser, userToken);
        if (res.success) {
            GetAllUser(userToken).then((data) => {
                setListUser(data.result);
                setIsShowModal(false);
            });
        } else {
            return;
        }
    };

    const handleConfirmDelete = async (id?: number) => {
        setIsShowConfirmDelete(false);
        if (!id) return;

        const res = await DeleteUser(id, userToken);
        if (res.success) {
            GetAllUser(userToken).then((data) => {
                setListUser(data.result);
                setIsShowModal(false);
            });
        }
        else {
            return;
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/auths/login");
    }

    const closeModal = () => {
        setIsShowModal(false);
        setCurrentUser(null);
    };

    return (
        <div>
            <div className="login-links">
                <a href="/products/product" className="nav-link">Retour</a>
                <button className="nav-link logout-link" onClick={() => handleLogout()}>Se déconnecter</button>
            </div>
            <h1>{"Bienvenue " + userLogin + " ( " + (userRole === "User" ? "Utilisateur" : "Administrateur") + " ) "}</h1>
            <h1>Liste des utilisateurs</h1>

            <div className="modal-header">
                {isShowError && (
                    <div className="error-box">
                        <p>{msgError}</p>
                        {/* <button className="btn-cancel" onClick={closeModal}>Fermer</button> */}
                    </div>
                )}
            </div>


            <br />
            <br />
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Login</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>

                    {listUser && listUser.length > 0 ? (
                        listUser.map((u) => (
                            <tr key={u.id_user}>
                                <td data-label="ID">{u.id_user}</td>
                                <td data-label="Login">{u.login}</td>
                                <td data-label="Role">{u.role_user === 'User' ? 'Utilisateur' : 'Administrateur'}</td>
                                <td data-label="Actions">
                                    <button className='btn-edit' onClick={() => handleEdit(u.id_user, u.login)}>Modifier</button>
                                    &nbsp;
                                    <button className='btn-delete' onClick={() => handleDelete(u.id_user, u.login)}>Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>Aucun utilisateur trouvé.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {isShowConfirmDelete && currentUser && (
                <div className="confirm-overlay">
                    <div className="confirm-box">
                        <p>Voulez-vous vraiment supprimer l'utilisateur {currentUser?.id_user} - {currentUser?.login} ? </p>
                        <div className="confirm-actions">
                            <button className="btn-delete" onClick={() => handleConfirmDelete(currentUser?.id_user)}>
                                Supprimer
                            </button>
                            <button className="btn-cancel" onClick={() => setIsShowConfirmDelete(false)}>
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isShowModal && currentUser && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{"Modification du rôle de l'utilisateur " + currentUser?.login}</h3>

                        <div>
                            <label>Rôle :</label>
                            <select
                                id="role_user"
                                value={currentUser?.role_user}
                                onChange={(e) => {
                                    if (!currentUser) return;
                                    setCurrentUser({
                                        ...currentUser,
                                        role_user: e.target.value,
                                    });
                                    return;
                                }}
                            >
                                <option value="User">Utilisateur</option>
                                <option value="Admin">Administrateur</option>
                            </select>
                        </div>
                        <br />
                        <button className="btn-save" onClick={handleSave}>Enregistrer</button>
                        &nbsp;
                        <button className="btn-cancel" onClick={closeModal}>Annuler</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserPage;