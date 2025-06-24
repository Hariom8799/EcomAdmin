import React, { useEffect, useState } from 'react';
import { Button, Select, MenuItem, OutlinedInput, Checkbox, ListItemText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDataFromApi, postData, editData, editFormData, postFormData } from '../../utils/api';
import { AiOutlineFilePdf, AiOutlineFileWord, AiOutlineEye, AiOutlineClose } from "react-icons/ai";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const ProductFileForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [form, setForm] = useState({
        product: '',
        users: [],
        file: [],
    });

    const [productOptions, setProductOptions] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch products
        fetchDataFromApi('/api/product/getAllProducts').then((res) => {
            if (res?.products) setProductOptions(res.products);
        });

        // Fetch users
        fetchDataFromApi('/api/user/getAllUsers').then((res) => {
            if (res?.totalUsers) setUserOptions(res.totalUsers);
        });

        // If editing
        if (isEditMode) {
            fetchDataFromApi(`/api/productFile/${id}`).then((res) => {
                console.log("im res here ",res)
                if (res?.data) {
                    setForm({
                        product: res.data.product?._id || '',
                        users: res.data.users?.map(u => u._id) || [],
                        file: res.data.fileUrls || [],
                    });
                }
            });
        }
    }, [id]);

    const getFileType = (nameOrUrl) => {
        const ext = nameOrUrl.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
        if (ext === 'pdf') return 'pdf';
        if (ext === 'doc' || ext === 'docx') return 'word';
        return 'other';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUserSelect = (e) => {
        setForm(prev => ({ ...prev, users: e.target.value }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setForm(prev => ({ ...prev, file: [...prev.file, ...files] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('product', form.product);
            form.users.forEach(u => formData.append('users', u));

            // Only append actual File objects, not URL strings
            form.file.forEach((f) => {
                if (f instanceof File) {
                    formData.append('file', f);
                }
            });

            if (isEditMode) {
                await editFormData(`/api/productFile/${id}`, formData, true);
            } else {
                await postFormData('/api/productFile', formData, true);
            }

            navigate('/product-file');
        } catch (error) {
            console.error('Submission failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileDelete = async (fileIndex) => {
        const fileToDelete = form.file[fileIndex];
        const isServerFile = typeof fileToDelete === 'string'; // Server files are URLs (strings)

        try {
            if (isServerFile) {
                // Delete from server
                await axios.delete(`${apiUrl}/api/delete-file`, {
                    data: { fileUrl: fileToDelete }
                });
            }
            // For local files (File objects), we don't need to make API call

            // Remove file from local state
            setForm(prev => ({
                ...prev,
                file: prev.file.filter((_, idx) => idx !== fileIndex)
            }));

        } catch (error) {
            console.error('Error deleting file:', error);
            // You might want to show a toast notification here
            alert('Failed to delete file. Please try again.');
        }
    };

    return (
        <div className="p-5 bg-white rounded-md">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-[20px] font-[600]">{isEditMode ? 'Edit' : 'Create'} Product File</h1>
                <Button variant="outlined" onClick={() => navigate('/product-file')}>
                    Back to List
                </Button>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="card w-full p-4 flex flex-col gap-4">

                    {/* Product Select */}
                    <div className="col_">
                        <label className="mb-2 block font-[500] text-gray-600 text-[14px]">Product*</label>
                        <select
                            name="product"
                            value={form.product}
                            onChange={handleChange}
                            className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] rounded-md px-3 bg-gray-100 outline-none focus:border-gray-600"
                            required
                        >
                            <option value="">Select product</option>
                            {productOptions.map(prod => (
                                <option key={prod._id} value={prod._id}>{prod.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Users Multi-select */}
                    <div className="col_">
                        <label className="mb-2 block font-[500] text-gray-600 text-[14px]">Users</label>
                        <Select
                            multiple
                            value={form.users}
                            onChange={handleUserSelect}
                            input={<OutlinedInput />}
                            renderValue={(selected) => {
                                return selected
                                    .map(id => userOptions.find(u => u._id === id)?.name)
                                    .filter(Boolean)
                                    .join(', ');
                            }}
                            className="bg-gray-100 rounded-md"
                            fullWidth
                        >
                            {userOptions.map((user) => (
                                <MenuItem key={user._id} value={user._id}>
                                    <Checkbox checked={form.users.includes(user._id)} />
                                    <ListItemText primary={user.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </div>

                    {/* File Upload */}
                    <div className="col_">
                        <label className="mb-2 block font-[500] text-gray-600 text-[14px]">Upload Files*</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="w-full border rounded-md bg-gray-100 px-3 py-2"
                            required={!isEditMode && form.file.length === 0}
                        />
                        {form.file.length > 0 && (
                            <div className="mt-2 flex gap-3 flex-wrap">
                                {form.file.map((f, idx) => {
                                    const isFileObject = f instanceof File;
                                    const url = isFileObject ? URL.createObjectURL(f) : f;
                                    const fileName = isFileObject ? f.name : f.split('/').pop();
                                    const fileType = getFileType(fileName);

                                    return (
                                        <div
                                            key={idx}
                                            className="relative w-[50px] h-[50px] border rounded bg-gray-100 overflow-hidden flex items-center justify-center"
                                        >
                                            {/* Preview */}
                                            {fileType === 'image' ? (
                                                <img src={url} alt="preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <a href={url} target="_blank" rel="noopener noreferrer" title="Preview File">
                                                    {fileType === 'pdf' && <AiOutlineFilePdf size={24} color="red" />}
                                                    {fileType === 'word' && <AiOutlineFileWord size={24} color="#2B579A" />}
                                                    {fileType === 'other' && <AiOutlineEye size={24} />}
                                                </a>
                                            )}

                                            {/* Delete Icon */}
                                            <button
                                                type="button"
                                                onClick={() => handleFileDelete(idx)}
                                                className="absolute top-[-6px] right-[-6px] bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
                                                title="Remove File"
                                            >
                                                <AiOutlineClose size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-5">
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            {loading ? 'Saving...' : isEditMode ? 'Update File' : 'Create File'}
                        </Button>
                        <Button type="button" variant="outlined" onClick={() => navigate('/product-file')}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductFileForm;