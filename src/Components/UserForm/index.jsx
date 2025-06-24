import React, { useState, useEffect } from 'react';
import {
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Checkbox,
    ListItemText,
    OutlinedInput
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDataFromApi, postData, editData } from '../../utils/api';

const roles = ['USER', 'ADMIN'];
const statuses = ['Active', 'Inactive', 'Suspended'];

const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        mobile: '',
        role: 'USER',
        modules: [],
        status: 'Active',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchDataFromApi(`/api/user/user-details/${id}`).then((res) => {
                if (res?.data) {
                    setForm({
                        name: res.data.name || '',
                        email: res.data.email || '',
                        password: '',
                        mobile: res.data.mobile || '',
                        role: res.data.role || 'USER',
                        modules: res.data.modules || [],
                        status: res.data.status || 'Active',
                    });
                }
            });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleModulesChange = (e) => {
        setForm(prev => ({ ...prev, modules: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode) {
                await editData(`/api/user/admin/users/${id}`, form);
            } else {
                await postData('/api/user/admin/users', form);
            }
            navigate('/users');
        } catch (error) {
            console.error('Failed to submit form:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 bg-white rounded-md">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-[20px] font-[600]">{isEditMode ? 'Edit' : 'Create'} User</h1>
                <Button variant="outlined" className="btn-border" onClick={() => navigate('/users')}>
                    Back to List
                </Button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="card dark:bg-themeDark w-full p-4 dark:border-[rgba(255,255,255,0.1)] flex flex-col gap-4">

                    {/* Name */}
                    <div className="col_">
                        <label className="mb-2 block font-[500] text-gray-600 text-[14px]">Name*</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] outline-none focus:border-[rgba(0,0,0,0.6)] rounded-md px-3 bg-gray-100"
                            placeholder="Enter name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="col_">
                        <label className="mb-2 block font-[500] text-gray-600 text-[14px]">Email*</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] outline-none focus:border-[rgba(0,0,0,0.6)] rounded-md px-3 bg-gray-100"
                            placeholder="Enter email"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="col_">
                        <label className="mb-2 block font-[500] text-gray-600 text-[14px]">
                            {isEditMode ? 'Password (leave blank to keep unchanged)' : 'Password*'}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] outline-none focus:border-[rgba(0,0,0,0.6)] rounded-md px-3 bg-gray-100"
                                placeholder="Enter password"
                                required={!isEditMode}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="col_">
                        <label className="mb-2 block font-[500] text-gray-600 text-[14px]">Mobile</label>
                        <input
                            type="text"
                            name="mobile"
                            value={form.mobile}
                            onChange={handleChange}
                            className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] outline-none focus:border-[rgba(0,0,0,0.6)] rounded-md px-3 bg-gray-100"
                            placeholder="Enter mobile"
                        />
                    </div>

                    {/* Role */}
                    <div className="col_">
                        <label className="mb-2 block font-[500] text-gray-600 text-[14px]">Role*</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] outline-none focus:border-[rgba(0,0,0,0.6)] rounded-md px-3 bg-gray-100"
                            required
                        >
                            {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    {/* Modules */}
                    <div className="col_">
                        <label className="mb-2 block font-[500] text-gray-600 text-[14px]">Modules</label>
                        <Select
                            multiple
                            name="modules"
                            value={form.modules}
                            onChange={handleModulesChange}
                            fullWidth
                            displayEmpty
                            input={<OutlinedInput />}
                            renderValue={(selected) => selected.length ? selected.join(', ') : "Select modules"}
                            className="bg-gray-100 rounded-md"
                        >
                            {['Dashboard', 'Home Slides', 'Products', 'Category', 'Users', 'Orders', 'Banners', 'Blogs', 'Logo'].map(mod => (
                                <MenuItem key={mod} value={mod}>
                                    <Checkbox checked={form.modules.indexOf(mod) > -1} />
                                    <ListItemText primary={mod} />
                                </MenuItem>
                            ))}
                        </Select>
                    </div>

                    {/* Status */}
                    <div className="col_">
                        <label className="mb-2 block font-[500] text-gray-600 text-[14px]">Status*</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] outline-none focus:border-[rgba(0,0,0,0.6)] rounded-md px-3 bg-gray-100"
                            required
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-5">
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            {loading ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}
                        </Button>
                        <Button type="button" variant="outlined" onClick={() => navigate('/users')}>
                            Cancel
                        </Button>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default UserForm;
