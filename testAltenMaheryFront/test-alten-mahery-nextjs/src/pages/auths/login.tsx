import { useEffect, useState } from "react";
import '@/styles/login-style.css';
import '@/styles/style.css';

import { Authenticate } from "@/services/auth-service";
import { useRouter } from "next/router";
import { SaveUser } from "@/services/user-service";
import { defaultUser, User, UserError } from "@/models/user-model";

const LoginPage = () => {
    const router = useRouter();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [isShowError, setIsShowError] = useState(false);
    const [msgError, setMsgError] = useState("");
    const [isShowModal, setIsShowModal] = useState(false);
    const [newUser, setNewUser] = useState<User>(defaultUser);

    const [errors, setErrors] = useState<Partial<UserError>>({});

    useEffect(() => {
        if (isShowError) {
            const timeout = setTimeout(() => {
                setIsShowError(false);
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [isShowError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (login === null || login === "") {
            setMsgError("Le login est obligatoire");
            setIsShowError(true);
            return;
        }

        if (password === null || password === "") {
            setMsgError("Le mot de passe est obligatoire");
            setIsShowError(true);
            return;
        }
        const res = await Authenticate(login, password);
        const { user, token, role } = res;
        if (user === null || user === undefined || user === '') {
            setMsgError("Login ou mot de passe incorrect");
            setIsShowError(true);
            return;
        }

        localStorage.setItem('role', role);
        localStorage.setItem('user', user);
        localStorage.setItem('token', token);
        router.push('/products/product');
    };

    const handleInputUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!newUser) return;
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value,
        });
        return;
    };

    const handleOpenInscription = async () => {
        setNewUser(defaultUser);
        const newErrors: Partial<UserError> = {};
        setErrors(newErrors);
        setIsShowModal(true);
    };

    const closeModal = () => {
        setLogin("");
        setPassword("");
        setIsShowModal(false);
    };

    const validateInscription = (): boolean => {
        const newErrors: Partial<UserError> = {};
        if (!newUser?.login.trim()) {
            newErrors.login = 'Le libellé est obligatoire.';
        }
        if (!newUser?.password.trim()) {
            newErrors.password = 'Le mot de passe est obligatoire.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveInscription = async () => {
        if (validateInscription()) {
            const res = await SaveUser(newUser);
            if (!res.success) {
                setMsgError(res.message);
                setIsShowError(true);
                return;
            } else {
                setLogin("");
                setPassword("");
                setIsShowModal(false);
            }
        }
    }

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit}>
                <h1>S'authentifier</h1>
                <div>
                    <label htmlFor="login">Login</label>
                    <input
                        type="text"
                        id="login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Se connecter</button>
            </form>
            <div>
                <button className="btn-save" onClick={handleOpenInscription}>S'inscrire</button>
            </div>

            {isShowError && (
                <div className="error-message">
                    <p>{msgError}</p>
                </div>
            )}

            {isShowModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Inscription du nouvel utilisateur</h3>
                        <div>
                            <label>Login :</label>
                            <input
                                type="text"
                                name="login"
                                value={newUser?.login}
                                onChange={handleInputUserChange}
                            />
                            {errors.login && <p className="text-red-500">{errors.login}</p>}
                        </div>
                        <div>
                            <label>Mot de passe :</label>
                            <input
                                type="password"
                                name="password"
                                value={newUser?.password}
                                onChange={handleInputUserChange}
                            />
                            {errors.password && <p className="text-red-500">{errors.password}</p>}
                        </div>
                        <br />
                        <button className="btn-save" onClick={handleSaveInscription}>Enregistrer</button>
                        &nbsp;
                        <button className="btn-cancel" onClick={closeModal}>Annuler</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;