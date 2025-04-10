import { defaultProduct, Product, ProductError } from '@/models/product-model';
import { DeleteProduct, GetAllProduct, SaveProduct } from '@/services/product-service';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import '@/styles/style.css';


const ProductPage: React.FC = () => {
    const router = useRouter();

    const [listProduct, setListProduct] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [isShowError, setIsShowError] = useState<boolean>(false);
    const [isShowConfirmDelete, setIsShowConfirmDelete] = useState<boolean>(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

    const [userRole, setUserRole] = useState<string>("");
    const [userLogin, setUserLogin] = useState<string>("");
    const [userToken, setUserToken] = useState<string>("");
    const [msgError, setMsgError] = useState<string>("");

    const [errors, setErrors] = useState<Partial<ProductError>>({});

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
    }, [userRole]);

    useEffect(() => {
        if (!userToken) return;

        GetAllProduct(userToken)
            .then((data) => {
                setListProduct(data.result);
                setLoading(false);
            })
            .catch((error) => {
                setMsgError(error);
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

    const closeModal = () => {
        setIsShowModal(false);
        setCurrentProduct(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!currentProduct) return;
        setCurrentProduct({
            ...currentProduct,
            [e.target.name]: e.target.value,
        });
    };

    const handleAdd = () => {
        setCurrentProduct(defaultProduct);
        const newErrors: Partial<ProductError> = {};
        setErrors(newErrors);
        setIsShowModal(true);
    };

    const handleEdit = (id: number) => {
        setCurrentProduct(listProduct.find((p) => p.id_product === id) || null);
        const newErrors: Partial<ProductError> = {};
        setErrors(newErrors);
        setIsShowModal(true);
    };

    const validate = (): boolean => {
        const newErrors: Partial<ProductError> = {};
        if (!currentProduct?.label.trim()) {
            newErrors.label = 'Le libellé est obligatoire.';
        }
        if (isNaN(currentProduct?.price!) || currentProduct?.price! <= 0) {
            newErrors.price = 'Le prix est obligatoire.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!currentProduct)
            return;

        if (validate()) {
            const res = await SaveProduct(currentProduct, userToken);
            if (res.success) {
                GetAllProduct(userToken).then((data) => {
                    setListProduct(data.result);
                    setIsShowModal(false);
                });
            } else {
                return;
            }
        }
    };

    const handleDelete = (id: number) => {
        setCurrentProduct(listProduct.find((p) => p.id_product === id) || null);
        setIsShowConfirmDelete(true);
    }

    const handleConfirmDelete = async (id?: number) => {
        setIsShowConfirmDelete(false);
        if (!id) return;

        const res = await DeleteProduct(id, userToken);
        if (res.success) {
            GetAllProduct(userToken).then((data) => {
                setListProduct(data.result);
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

    if (loading) return <p>Chargement...</p>;

    return (
        <div>
            <div className="login-links">
                <div className="link-group">
                    {userRole === "Admin" && (
                        <a href="/users/user" className="nav-link">Gestion des utilisateurs</a>
                    )}
                </div>
                <button className="nav-link logout-link" onClick={() => handleLogout()}>Se déconnecter</button>
            </div>

            <h1>{"Bienvenue " + userLogin + " ( " + (userRole === "User" ? "Utilisateur" : "Administrateur") + " ) "}</h1>
            <h1>Liste des produits</h1>

            <div className="modal-header">
                {isShowError && (
                    <div className="error-box">
                        <p>{msgError}</p>
                    </div>
                )}
            </div>

            {userRole === "Admin" && (
                <button className="btn-add" onClick={() => handleAdd()}>Ajouter</button>
            )}

            <br />
            <br />

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Libellé</th>
                        <th>Description</th>
                        <th>Prix</th>
                        {userRole === "Admin" && (
                            <th>Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody>

                    {listProduct && listProduct.length > 0 ? (
                        listProduct.map((p) => (
                            <tr key={p.id_product}>
                                <td data-label="ID">{p.id_product}</td>
                                <td data-label="Libellé">{p.label}</td>
                                <td data-label="Description">{p.description}</td>
                                <td data-label="Prix">{p.price} Eur</td>
                                {userRole === "Admin" && (
                                    <td data-label="Actions">
                                        <button className="btn-edit" onClick={() => handleEdit(p.id_product)}>Modifier</button>
                                        &nbsp;
                                        <button className="btn-delete" onClick={() => handleDelete(p.id_product)}>Supprimer</button>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>Aucun produit trouvé.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {isShowConfirmDelete && currentProduct && (
                <div className="confirm-overlay">
                    <div className="confirm-box">
                        <p>Voulez-vous vraiment supprimer le produit {currentProduct?.id_product} - {currentProduct?.label} ? </p>
                        <div className="confirm-actions">
                            <button className="btn-delete" onClick={() => handleConfirmDelete(currentProduct?.id_product)}>
                                Supprimer
                            </button>
                            <button className="btn-cancel" onClick={() => setIsShowConfirmDelete(false)}>
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>

            )}

            {isShowModal && currentProduct && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Saisie</h3>
                        <div>
                            <label>Libellé :</label>
                            <input
                                type="text"
                                name="label"
                                placeholder="Libellé du produit"
                                value={currentProduct.label}
                                onChange={handleInputChange}
                            />
                            {errors.label && <p className="text-red-500">{errors.label}</p>}
                        </div>
                        <div>
                            <label>Description :</label>
                            <input
                                type="text"
                                name="description"
                                placeholder="Description du produit"
                                value={currentProduct.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Prix :</label>
                            <input
                                type="number"
                                name="price"
                                placeholder="Prix du produit"
                                value={currentProduct.price}
                                onChange={handleInputChange}
                            />
                            {errors.price && <p className="text-red-500">{errors.price}</p>}
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
export default ProductPage;