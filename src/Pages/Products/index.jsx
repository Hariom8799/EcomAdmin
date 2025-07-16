import React, { useContext, useEffect, useState } from 'react';
import { Button, useTheme } from "@mui/material";
import { IoMdAdd } from "react-icons/io";
import Rating from '@mui/material/Rating';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Progress from "../../Components/ProgressBar";
import { AiOutlineEdit } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import SearchBox from '../../Components/SearchBox';
import { MyContext } from '../../App';
import { fetchDataFromApi, deleteData, deleteMultipleData } from '../../utils/api';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import CircularProgress from '@mui/material/CircularProgress';
import { FiDownload } from 'react-icons/fi';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { FaCloudUploadAlt } from "react-icons/fa";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import { FiUpload, FiFile } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';

const apiUrl = import.meta.env.VITE_API_URL;


const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
    { id: "product", label: "PRODUCT", minWidth: 150 },
    { id: "category", label: "CATEGORY", minWidth: 100 },
    {
        id: "subcategory",
        label: "SUB CATEGORY",
        minWidth: 150,
    },
    {
        id: "thirdsubCat",
        label: "THIRD LEVEL CATEGORY",
        minWidth: 150,
    },
    {
        id: "price",
        label: "PRICE",
        minWidth: 130,
    },
    {
        id: "sales",
        label: "SALES",
        minWidth: 100,
    },
    {
        id: "stock",
        label: "STOCK",
        minWidth: 100,
    },
    {
        id: "rating",
        label: "RATING",
        minWidth: 100,
    },
    {
        id: "action",
        label: "ACTION",
        minWidth: 120,
    },
];

export const Products = () => {

    const [folderData, setFolderData] = useState([
        { folderName: '', files: [], previews: [] }
    ]);
    const [fileUploadDialog, setFileUploadDialog] = useState({ open: false, productId: null });
    const [uploadFiles, setUploadFiles] = useState([]);
    const [folderName, setFolderName] = useState('');
    const [uploading, setUploading] = useState(false);

    const [productCat, setProductCat] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);

    const [productData, setProductData] = useState([]);
    const [productTotalData, setProductTotalData] = useState([]);

    const [productSubCat, setProductSubCat] = React.useState('');
    const [productThirdLavelCat, setProductThirdLavelCat] = useState('');
    const [sortedIds, setSortedIds] = useState([]);
    const [isLoading, setIsloading] = useState(false);

    const [pageOrder, setPageOrder] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const [photos, setPhotos] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const context = useContext(MyContext);

    useEffect(() => {
        getProducts(page, rowsPerPage);
    }, [context?.isOpenFullScreenPanel, page, rowsPerPage])



    useEffect(() => {
        // Filter orders based on search query
        if (searchQuery !== "") {
            const filteredOrders = productTotalData?.totalProducts?.filter((product) =>
                product._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product?.catName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product?.subCat?.includes(searchQuery)
            );
            setProductData({
                error: false,
                success: true,
                products: filteredOrders,
                total: filteredOrders?.length,
                page: parseInt(page),
                totalPages: Math.ceil(filteredOrders?.length / rowsPerPage),
                totalCount: productData?.totalCount
            });

        } else {
            getProducts(page, rowsPerPage);
        }

    }, [searchQuery])


    // Handler to toggle all checkboxes
    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;

        // Update all items' checked status
        const updatedItems = productData?.products?.map((item) => ({
            ...item,
            checked: isChecked,
        }));
        setProductData({
            error: false,
            success: true,
            products: updatedItems,
            total: updatedItems?.length,
            page: parseInt(page),
            totalPages: Math.ceil(updatedItems?.length / rowsPerPage),
            totalCount: productData?.totalCount
        });

        // Update the sorted IDs state
        if (isChecked) {
            const ids = updatedItems.map((item) => item._id).sort((a, b) => a - b);
            setSortedIds(ids);
        } else {
            setSortedIds([]);
        }
    };


    // Handler to toggle individual checkboxes
    const handleCheckboxChange = (e, id, index) => {

        const updatedItems = productData?.products?.map((item) =>
            item._id === id ? { ...item, checked: !item.checked } : item
        );
        setProductData({
            error: false,
            success: true,
            products: updatedItems,
            total: updatedItems?.length,
            page: parseInt(page),
            totalPages: Math.ceil(updatedItems?.length / rowsPerPage),
            totalCount: productData?.totalCount
        });



        // Update the sorted IDs state
        const selectedIds = updatedItems
            .filter((item) => item.checked)
            .map((item) => item._id)
            .sort((a, b) => a - b);
        setSortedIds(selectedIds);
    };


    const getProducts = async (page, limit) => {

        setIsloading(true)
        fetchDataFromApi(`/api/product/getAllProducts?page=${page + 1}&limit=${limit}`).then((res) => {
            setProductData(res)

            setProductTotalData(res)
            setIsloading(false)

            let arr = [];

            for (let i = 0; i < res?.products?.length; i++) {
                arr.push({
                    src: res?.products[i]?.images[0]
                })
            }

            setPhotos(arr);

        })
    }

    const applyRemainingFilters = (catValue = productCat, subCatValue = productSubCat, thirdLevelValue = productThirdLavelCat) => {
        // Check which filters are still active using the passed values
        const hasActiveCategory = catValue && catValue !== null && catValue !== '';
        const hasActiveSubCategory = subCatValue && subCatValue !== null && subCatValue !== '';
        const hasActiveThirdLevel = thirdLevelValue && thirdLevelValue !== null && thirdLevelValue !== '';

        // Apply the highest priority active filter
        if (hasActiveThirdLevel) {
            fetchDataFromApi(`/api/product/getAllProductsByThirdLavelCat/${thirdLevelValue}`).then((res) => {
                if (res?.error === false) {
                    setProductData({
                        error: false,
                        success: true,
                        products: res?.products,
                        total: res?.products?.length,
                        page: parseInt(page),
                        totalPages: Math.ceil(res?.products?.length / rowsPerPage),
                        totalCount: res?.products?.length
                    });
                    setTimeout(() => {
                        setIsloading(false);
                    }, 300);
                }
            });
        } else if (hasActiveSubCategory) {
            fetchDataFromApi(`/api/product/getAllProductsBySubCatId/${subCatValue}`).then((res) => {
                if (res?.error === false) {
                    setProductData({
                        error: false,
                        success: true,
                        products: res?.products,
                        total: res?.products?.length,
                        page: parseInt(page),
                        totalPages: Math.ceil(res?.products?.length / rowsPerPage),
                        totalCount: res?.products?.length
                    });
                    setTimeout(() => {
                        setIsloading(false);
                    }, 300);
                }
            });
        } else if (hasActiveCategory) {
            fetchDataFromApi(`/api/product/getAllProductsByCatId/${catValue}`).then((res) => {
                if (res?.error === false) {
                    setProductData({
                        error: false,
                        success: true,
                        products: res?.products,
                        total: res?.products?.length,
                        page: parseInt(page),
                        totalPages: Math.ceil(res?.products?.length / rowsPerPage),
                        totalCount: res?.products?.length
                    });
                    setTimeout(() => {
                        setIsloading(false);
                    }, 300);
                }
            });
        } else {
            // No filters are active, get all products
            getProducts(0, 50);
        }
    };

    // const handleChangeProductCat = (event) => {
    //     if (event.target.value !== null) {
    //         setProductCat(event.target.value);
    //         setProductSubCat(''); // Keep this reset
    //         setProductThirdLavelCat(''); // Keep this reset
    //         setIsloading(true)
    //         fetchDataFromApi(`/api/product/getAllProductsByCatId/${event.target.value}`).then((res) => {
    //             if (res?.error === false) {
    //                 setProductData({
    //                     error: false,
    //                     success: true,
    //                     products: res?.products,
    //                     total: res?.products?.length,
    //                     page: parseInt(page),
    //                     totalPages: Math.ceil(res?.products?.length / rowsPerPage),
    //                     totalCount: res?.products?.length
    //                 });

    //                 setTimeout(() => {
    //                     setIsloading(false)
    //                 }, 300);
    //             }
    //         })
    //     } else {
    //         getProducts(0, 50);
    //         setProductSubCat('');
    //         setProductCat(event.target.value);
    //         setProductThirdLavelCat('');
    //     }
    // };

    // const handleChangeProductSubCat = (event) => {
    //     if (event.target.value !== null) {
    //         setProductSubCat(event.target.value);
    //         // setProductCat('');
    //         setProductThirdLavelCat('');
    //         setIsloading(true)
    //         fetchDataFromApi(`/api/product/getAllProductsBySubCatId/${event.target.value}`).then((res) => {
    //             if (res?.error === false) {
    //                 setProductData({
    //                     error: false,
    //                     success: true,
    //                     products: res?.products,
    //                     total: res?.products?.length,
    //                     page: parseInt(page),
    //                     totalPages: Math.ceil(res?.products?.length / rowsPerPage),
    //                     totalCount: res?.products?.length
    //                 });
    //                 setTimeout(() => {
    //                     setIsloading(false)
    //                 }, 500);
    //             }
    //         })
    //     } else {
    //         setProductSubCat(event.target.value);
    //         getProducts(0, 50);
    //         // setProductCat('');
    //         setProductThirdLavelCat('');
    //     }
    // };

    // const handleChangeProductThirdLavelCat = (event) => {
    //     if (event.target.value !== null) {
    //         setProductThirdLavelCat(event.target.value);
    //         // setProductCat('');
    //         // setProductSubCat('');
    //         setIsloading(true)
    //         fetchDataFromApi(`/api/product/getAllProductsByThirdLavelCat/${event.target.value}`).then((res) => {
    //             console.log(res)
    //             if (res?.error === false) {
    //                 setProductData({
    //                     error: false,
    //                     success: true,
    //                     products: res?.products,
    //                     total: res?.products?.length,
    //                     page: parseInt(page),
    //                     totalPages: Math.ceil(res?.products?.length / rowsPerPage),
    //                     totalCount: res?.products?.length
    //                 });
    //                 setTimeout(() => {
    //                     setIsloading(false)
    //                 }, 300);
    //             }
    //         })
    //     } else {
    //         setProductThirdLavelCat(event.target.value);
    //         getProducts(0, 50);
    //         // setProductCat('');
    //         // setProductSubCat('');
    //     }
    // };

    const handleChangeProductCat = (event) => {
        const newCatValue = event.target.value;
        setProductCat(newCatValue);

        // Reset dependent filters when category changes
        setProductSubCat('');
        setProductThirdLavelCat('');
        setIsloading(true);

        if (newCatValue !== null && newCatValue !== '') {
            // Filter by category
            fetchDataFromApi(`/api/product/getAllProductsByCatId/${newCatValue}`).then((res) => {
                if (res?.error === false) {
                    setProductData({
                        error: false,
                        success: true,
                        products: res?.products,
                        total: res?.products?.length,
                        page: parseInt(page),
                        totalPages: Math.ceil(res?.products?.length / rowsPerPage),
                        totalCount: res?.products?.length
                    });
                    setTimeout(() => {
                        setIsloading(false);
                    }, 300);
                }
            });
        } else {
            // Category is set to None, pass the new values to check remaining filters
            applyRemainingFilters(newCatValue, '', ''); // Pass updated values
        }
    };

    const handleChangeProductSubCat = (event) => {
        const newSubCatValue = event.target.value;
        setProductSubCat(newSubCatValue);

        // Reset dependent filter when subcategory changes
        setProductThirdLavelCat('');
        setIsloading(true);

        if (newSubCatValue !== null && newSubCatValue !== '') {
            // Filter by subcategory
            fetchDataFromApi(`/api/product/getAllProductsBySubCatId/${newSubCatValue}`).then((res) => {
                if (res?.error === false) {
                    setProductData({
                        error: false,
                        success: true,
                        products: res?.products,
                        total: res?.products?.length,
                        page: parseInt(page),
                        totalPages: Math.ceil(res?.products?.length / rowsPerPage),
                        totalCount: res?.products?.length
                    });
                    setTimeout(() => {
                        setIsloading(false);
                    }, 500);
                }
            });
        } else {
            // SubCategory is set to None, pass the updated values to check remaining filters
            applyRemainingFilters(productCat, newSubCatValue, ''); // Pass updated values
        }
    };

    const handleChangeProductThirdLavelCat = (event) => {
        const newThirdLevelValue = event.target.value;
        setProductThirdLavelCat(newThirdLevelValue);
        setIsloading(true);

        if (newThirdLevelValue !== null && newThirdLevelValue !== '') {
            // Filter by third level category
            fetchDataFromApi(`/api/product/getAllProductsByThirdLavelCat/${newThirdLevelValue}`).then((res) => {
                if (res?.error === false) {
                    setProductData({
                        error: false,
                        success: true,
                        products: res?.products,
                        total: res?.products?.length,
                        page: parseInt(page),
                        totalPages: Math.ceil(res?.products?.length / rowsPerPage),
                        totalCount: res?.products?.length
                    });
                    setTimeout(() => {
                        setIsloading(false);
                    }, 300);
                }
            });
        } else {
            // Third level is set to None, pass the updated values to check remaining filters
            applyRemainingFilters(productCat, productSubCat, newThirdLevelValue); // Pass updated values
        }
    };

    const resetFilters = () => {
        setProductCat('');
        setProductSubCat('');
        setProductThirdLavelCat('');
        setSearchQuery('');
        getProducts(0, 50);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const deleteProduct = (id) => {
        if (context?.userData?.role === "ADMIN") {
            deleteData(`/api/product/${id}`).then((res) => {
                getProducts();
                context.alertBox("success", "Product deleted");

            })
        } else {
            context.alertBox("error", "Only admin can delete data");
        }
    }


    const deleteMultipleProduct = () => {

        if (sortedIds.length === 0) {
            context.alertBox('error', 'Please select items to delete.');
            return;
        }


        try {
            deleteMultipleData(`/api/product/deleteMultiple`, {
                data: { ids: sortedIds },
            }).then((res) => {
                getProducts();
                context.alertBox("success", "Product deleted");
                setSortedIds([]);

            })

        } catch (error) {
            context.alertBox('error', 'Error deleting items.');
        }


    }



    const handleChangePage = (event, newPage) => {
        getProducts(page, rowsPerPage);
        setPage(newPage);
    };

    const addFolder = () => {
        setFolderData([...folderData, { folderName: '', files: [], previews: [] }]);
    };

    const removeFolder = (folderIndex) => {
        const newFolderData = folderData.filter((_, index) => index !== folderIndex);
        setFolderData(newFolderData);
    };

    const updateFolderName = (folderIndex, name) => {
        const newFolderData = [...folderData];
        newFolderData[folderIndex].folderName = name;
        setFolderData(newFolderData);
    };

    const handleFileSelection = (event, folderIndex) => {
        const selectedFiles = Array.from(event.target.files);
        const newFolderData = [...folderData];

        // Add new files to existing ones
        newFolderData[folderIndex].files = [...newFolderData[folderIndex].files, ...selectedFiles];

        // Create previews for new files
        const newPreviews = selectedFiles.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            uploadedBy: context?.userData?.name || 'Current User',
            uploadedAt: new Date().toISOString()
        }));

        newFolderData[folderIndex].previews = [...newFolderData[folderIndex].previews, ...newPreviews];
        setFolderData(newFolderData);
    };

    const removeFile = async (folderIndex, fileIndex) => {
        const newFolderData = [...folderData];
        const fileData = newFolderData[folderIndex].previews[fileIndex];

        // If it's an existing file, we need to delete it from the database
        if (fileData.isExisting) {
            try {
                // Show loading state
                setUploading(true);

                // Call API to delete existing file
                const response = await fetch(`${apiUrl}/api/product/products/${fileUploadDialog.productId}/files/${fileData.fileId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();

                if (result.success) {
                    context.alertBox('success', 'File deleted successfully');
                    console.log('Existing file deleted:', fileData.fileId);
                } else {
                    context.alertBox('error', result.message || 'Failed to delete file');
                    setUploading(false);
                    return; // Don't remove from UI if API call failed
                }
            } catch (error) {
                console.error('Error deleting existing file:', error);
                context.alertBox('error', 'Failed to delete file');
                setUploading(false);
                return; // Don't remove from UI if API call failed
            } finally {
                setUploading(false);
            }
        } else {
            // Revoke object URL for new files (not yet uploaded)
            if (fileData.preview && !fileData.isExisting) {
                URL.revokeObjectURL(fileData.preview);
            }
            // Remove from files array for new files
            newFolderData[folderIndex].files.splice(fileIndex, 1);
        }

        // Remove from previews array
        newFolderData[folderIndex].previews.splice(fileIndex, 1);
        setFolderData(newFolderData);
    };

    // const handleFileUpload = async () => {
    //     // Check if any folder has files
    //     const hasFiles = folderData.some(folder => folder.files.length > 0);

    //     if (!hasFiles) {
    //         context.alertBox('error', 'Please select files to upload');
    //         return;
    //     }

    //     setUploading(true);

    //     try {
    //         const formData = new FormData();

    //         // Collect all files and their metadata
    //         const fileNames = [];
    //         const folderNames = [];
    //         const uploadedByArray = [];
    //         const uploadedAtArray = [];
    //         const fileVersionArray = [];

    //         folderData.forEach(folder => {
    //             folder.files.forEach((file, index) => {
    //                 formData.append('files', file);
    //                 fileNames.push(file.name);
    //                 folderNames.push(folder.folderName || 'default');
    //                 uploadedByArray.push(context?.userData?.name || 'Current User');
    //                 uploadedAtArray.push(new Date().toISOString());
    //                 fileVersionArray.push(1);
    //             });
    //         });

    //         // Append metadata arrays
    //         formData.append('fileNames', fileNames);
    //         formData.append('folderNames', folderNames);
    //         formData.append('uploadedBy', uploadedByArray);
    //         formData.append('uploadedAt', uploadedAtArray);
    //         formData.append('fileVersion', fileVersionArray);

    //         const response = await fetch(`${apiUrl}/api/product/products/${fileUploadDialog.productId}/files`, {
    //             method: 'POST',
    //             body: formData,
    //         });

    //         const result = await response.json();
    //         if (result.success) {
    //             getProducts(page, rowsPerPage);
    //             handleCloseFileDialog();
    //             context.alertBox('success', 'Files uploaded successfully');
    //         } else {
    //             context.alertBox('error', result.message || 'Upload failed');
    //         }
    //     } catch (error) {
    //         console.error('Upload error:', error);
    //         context.alertBox('error', 'Upload failed');
    //     } finally {
    //         setUploading(false);
    //     }
    // };

    // const handleCloseFileDialog = () => {
    //     if (!uploading) {
    //         setFileUploadDialog({ open: false, productId: null });
    //         setUploadFiles([]);
    //         setFolderName('');
    //     }
    // };

    const handleFileUpload = async () => {
        // Check if any folder has files
        const hasFiles = folderData.some(folder => folder.files.length > 0);

        if (!hasFiles) {
            context.alertBox('error', 'Please select files to upload');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();

            // Collect all files and their metadata
            const fileNames = [];
            const folderNames = [];
            const uploadedByArray = [];
            const uploadedAtArray = [];
            const fileVersionArray = [];

            folderData.forEach(folder => {
                folder.files.forEach((file, index) => {
                    formData.append('files', file);
                    fileNames.push(file.name);
                    folderNames.push(folder.folderName || 'default');
                    uploadedByArray.push(context?.userData?.name || 'Current User');
                    uploadedAtArray.push(new Date().toISOString());
                    fileVersionArray.push(1);
                });
            });

            // Append each array element individually instead of the whole array
            fileNames.forEach(name => formData.append('fileNames', name));
            folderNames.forEach(name => formData.append('folderNames', name));
            uploadedByArray.forEach(user => formData.append('uploadedBy', user));
            uploadedAtArray.forEach(date => formData.append('uploadedAt', date));
            fileVersionArray.forEach(version => formData.append('fileVersion', version));

            const response = await fetch(`${apiUrl}/api/product/products/${fileUploadDialog.productId}/files`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (result.success) {
                getProducts(page, rowsPerPage);
                handleCloseFileDialog();
                context.alertBox('success', 'Files uploaded successfully');
            } else {
                context.alertBox('error', result.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            context.alertBox('error', 'Upload failed');
        } finally {
            setUploading(false);
        }
    };
    const handleCloseFileDialog = () => {
        if (!uploading) {
            setFileUploadDialog({ open: false, productId: null });
            // Clean up object URLs
            folderData.forEach(folder => {
                folder.previews.forEach(preview => {
                    if (preview.preview) {
                        URL.revokeObjectURL(preview.preview);
                    }
                });
            });
            setFolderData([{ folderName: '', files: [], previews: [] }]);
        }
    };

    const openFileUploadDialog = (productId) => {
        setFileUploadDialog({ open: true, productId });

        // Load existing files for this product
        const currentProduct = productData?.products?.find(p => p._id === productId);
        if (currentProduct?.files && currentProduct.files.length > 0) {
            // Group files by folder
            const folderGroups = {};

            currentProduct.files.forEach(file => {
                const folderName = file.folderName || 'default';
                if (!folderGroups[folderName]) {
                    folderGroups[folderName] = [];
                }
                folderGroups[folderName].push(file);
            });

            // Convert to folderData format
            const existingFolderData = Object.keys(folderGroups).map(folderName => ({
                folderName: folderName === 'default' ? '' : folderName,
                files: [], // Keep empty for new files
                previews: folderGroups[folderName].map(file => ({
                    name: file.fileName,
                    size: 0, // We don't have size info for existing files
                    type: file.fileName.split('.').pop(),
                    preview: file.fileUrl?.includes('image') ? file.fileUrl : null,
                    uploadedBy: file.uploadedBy || 'Unknown User',
                    uploadedAt: file.uploadedAt,
                    isExisting: true, // Flag to identify existing files
                    fileId: file._id // Store the file ID for reference
                }))
            }));

            // If no existing files, add one empty folder
            if (existingFolderData.length === 0) {
                existingFolderData.push({ folderName: '', files: [], previews: [] });
            }

            setFolderData(existingFolderData);
        } else {
            // No existing files, start with empty folder
            setFolderData([{ folderName: '', files: [], previews: [] }]);
        }
    };


    const downloadAllFiles = async (productId) => {
        try {
            const response = await fetch(`${apiUrl}/api/product/download-all-files`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ProductId: productId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                context.alertBox('error', errorData.message || 'Download failed');
                return;
            }

            // Get the filename from the response headers
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : `product_files_${productId}.zip`;

            // Create blob and download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            context.alertBox('success', 'Files downloaded successfully');
        } catch (error) {
            console.error('Download error:', error);
            context.alertBox('error', 'Download failed');
        }
    };

    // Replace the current setOpen function calls with:
    const handleImageClick = (productIndex) => {
        setOpen(true);
        // Calculate the starting index in the photos array
        const startIndex = productIndex; // Since each product contributes one image to photos array
        setPhotos(prevPhotos => {
            // You might want to set a current index state or pass it to lightbox
            return prevPhotos;
        });
    };


    return (
        <>

            <div className="flex items-center justify-between px-2 py-0 mt-3">
                <h2 className="text-[18px] font-[600]">
                    Products{" "}
                    <span className="font-[400] text-[14px]"></span>
                </h2>

                <div className="col w-[75%] ml-auto flex items-center justify-end gap-3">
                    {
                        sortedIds?.length !== 0 && <Button variant="contained" className="btn-sm" size="small" color="error"
                            onClick={deleteMultipleProduct}>Delete</Button>
                    }

                    <Button
                        variant="outlined"
                        className="btn-sm"
                        size="small"
                        onClick={resetFilters}
                        disabled={!productCat && !productSubCat && !productThirdLavelCat && !searchQuery}
                    >
                        Reset Filters
                    </Button>

                    <Button className="btn-blue !text-white btn-sm"
                        onClick={() => context.setIsOpenFullScreenPanel({
                            open: true,
                            model: 'Add Product'
                        })}>Add Product</Button>
                </div>


            </div>


            <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">

                <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-2 lg:grid-cols-4 w-full px-5 justify-beetween gap-4">
                    <div className="col">
                        <h4 className="font-[600] text-[13px] mb-2">Category By</h4>
                        {
                            context?.catData?.length !== 0 &&
                            <Select
                                style={{ zoom: '80%' }}
                                labelId="demo-simple-select-label"
                                id="productCatDrop"
                                size="small"
                                className='w-full'
                                value={productCat}
                                label="Category"
                                onChange={handleChangeProductCat}
                            >
                                <MenuItem value={null}>None</MenuItem>
                                {
                                    context?.catData?.map((cat, index) => {
                                        return (
                                            <MenuItem key={index} value={cat?._id}>{cat?.name}</MenuItem>
                                        )
                                    })
                                }

                            </Select>
                        }
                    </div>


                    <div className="col">
                        <h4 className="font-[600] text-[13px] mb-2">Sub Category By</h4>
                        {
                            context?.catData?.length !== 0 &&
                            <Select
                                style={{ zoom: '80%' }}
                                labelId="demo-simple-select-label"
                                id="productSubCatDrop"
                                size="small"
                                className='w-full'
                                value={productSubCat}
                                label="Sub Category"
                                onChange={handleChangeProductSubCat}
                            >
                                <MenuItem value={null}>None</MenuItem>
                                {
                                    context?.catData?.map((cat, index) => {
                                        // Only show subcategories if no category is selected OR if this category is selected
                                        if (!productCat || cat?._id === productCat) {
                                            return (
                                                cat?.children?.length !== 0 && cat?.children?.map((subCat, index_) => {
                                                    return (
                                                        <MenuItem key={index_} value={subCat?._id}>
                                                            {subCat?.name}
                                                        </MenuItem>
                                                    )
                                                })
                                            )
                                        }
                                        return null;
                                    })
                                }
                            </Select>
                        }
                    </div>


                    <div className="col">
                        <h4 className="font-[600] text-[13px] mb-2">Third Level Sub Category By</h4>
                        {
                            context?.catData?.length !== 0 &&
                            <Select
                                style={{ zoom: '80%' }}
                                labelId="demo-simple-select-label"
                                id="productThirdLevelCatDrop"
                                size="small"
                                className='w-full'
                                value={productThirdLavelCat}
                                label="Third Level Sub Category"
                                onChange={handleChangeProductThirdLavelCat}
                            >
                                <MenuItem value={null}>None</MenuItem>
                                {
                                    context?.catData?.map((cat) => {
                                        return (
                                            cat?.children?.length !== 0 && cat?.children?.map((subCat) => {
                                                // Only show third level categories if no subcategory is selected OR if this subcategory is selected
                                                if (!productSubCat || subCat?._id === productSubCat) {
                                                    return (
                                                        subCat?.children?.length !== 0 && subCat?.children?.map((thirdLavelCat, index) => {
                                                            return <MenuItem value={thirdLavelCat?._id} key={index}
                                                            >{thirdLavelCat?.name}</MenuItem>
                                                        })
                                                    )
                                                }
                                                return null;
                                            })
                                        )
                                    })
                                }
                            </Select>
                        }
                    </div>


                    <div className="col w-full ml-auto flex items-center">
                        <div style={{ alignSelf: 'end' }} className="w-full">
                            <SearchBox
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                setPageOrder={setPageOrder}
                            />
                        </div>
                    </div>

                </div>

                <br />
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Checkbox {...label} size="small"
                                        onChange={handleSelectAll}
                                        checked={productData?.products?.length > 0 ? productData?.products?.every((item) => item.checked) : false}
                                    />
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {
                                isLoading === false ? productData?.products?.length !== 0 && productData?.products?.map((product, index) => {
                                    return (
                                        <TableRow key={index} className={product.checked === true ? '!bg-[#1976d21f]' : ''}>
                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <Checkbox {...label} size="small" checked={product.checked === true ? true : false}
                                                    onChange={(e) => handleCheckboxChange(e, product._id, index)}
                                                />
                                            </TableCell>
                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <div className="flex items-center gap-4 w-[300px]" title={product?.name}>
                                                    <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group cursor-pointer" onClick={() => {
                                                        setCurrentPhotoIndex(index);
                                                        setOpen(true)
                                                    }}
                                                    >
                                                        <LazyLoadImage
                                                            alt={"image"}
                                                            effect="blur"
                                                            src={product?.images[0]}
                                                            className="w-full group-hover:scale-105 transition-all"
                                                        />
                                                    </div>
                                                    <div className="info w-[75%]">
                                                        <h3 className="font-[600] text-[12px] leading-4 hover:text-primary">
                                                            <Link to={`/product/${product?._id}`}>
                                                                {product?.name?.substr(0, 50) + '...'}
                                                            </Link>
                                                        </h3>
                                                        <span className="text-[12px]">{product?.brand}</span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                {product?.catName}
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                {product?.subCat}
                                            </TableCell>
                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                {product?.thirdsubCat}
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <div className="flex gap-1 flex-col">
                                                    <span className="oldPrice line-through leading-3 text-gray-500 text-[14px] font-[500]">
                                                        {product?.price?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
                                                    </span>
                                                    <span className="price text-primary text-[14px]  font-[600]">
                                                        {product?.oldPrice?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <p className="text-[14px] w-[70px]">
                                                    <span className="font-[600]">{product?.sale}</span> sale
                                                </p>


                                            </TableCell>


                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <p className="text-[14px] w-[70px]">
                                                    <span className="font-[600] text-primary">{product?.countInStock}</span>
                                                </p>


                                            </TableCell>


                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <p className="text-[14px] w-[100px]">
                                                    <Rating name="half-rating" size="small" defaultValue={product?.rating} readOnly />
                                                </p>


                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <div className="flex items-center gap-1">
                                                    <Button className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px]"
                                                        onClick={() => context.setIsOpenFullScreenPanel({
                                                            open: true,
                                                            model: 'Edit Product',
                                                            id: product?._id
                                                        })}
                                                    >
                                                        <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
                                                    </Button>

                                                    <Link to={`/product/${product?._id}`}>
                                                        <Button className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px]">
                                                            <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                        </Button>
                                                    </Link>

                                                    {/* Show upload button only if no files exist */}
                                                    {(
                                                        <Button
                                                            className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px]"
                                                            onClick={() => openFileUploadDialog(product?._id)}
                                                        >
                                                            <FiUpload className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                        </Button>
                                                    )}

                                                    {/* Show download button only if files exist */}
                                                    {(
                                                        <Button
                                                            className={`!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px] ${!product?.files || product?.files.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                                                }`}
                                                            onClick={() => downloadAllFiles(product?._id)}
                                                            title="Download all files"
                                                            disabled={!product?.files || product?.files.length === 0}
                                                        >
                                                            <FiDownload className="text-[rgba(0,0,0,0.7)] text-[18px]" />
                                                        </Button>
                                                    )}

                                                    <Button className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px]" onClick={() => deleteProduct(product?._id)}>
                                                        <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                    </Button>
                                                </div>
                                            </TableCell>


                                        </TableRow>
                                    )
                                })


                                    :

                                    <>
                                        <TableRow>
                                            <TableCell colspan={8}>
                                                <div className="flex items-center justify-center w-full min-h-[400px]">
                                                    <CircularProgress color="inherit" />
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                    </>
                            }



                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[50, 100, 150, 200]}
                    component="div"
                    count={productData?.totalPages * rowsPerPage}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>


            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={photos}
                index={currentPhotoIndex}
                on={{
                    view: ({ index }) => setCurrentPhotoIndex(index)
                }}
            />

            <Dialog open={fileUploadDialog.open} onClose={handleCloseFileDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Upload Files</Typography>
                        <IconButton onClick={handleCloseFileDialog} disabled={uploading}>
                            <IoMdClose />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <div className='w-full'>
                        <div className='bg-gray-50 p-4 w-full border rounded-md'>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-[700] text-[18px]">Additional Files</h3>
                                <Button
                                    onClick={addFolder}
                                    className="btn-sm bg-green-500 text-white px-3 py-1 rounded"
                                    type="button"
                                    disabled={uploading}
                                >
                                    Add Folder
                                </Button>
                            </div>

                            {folderData.map((folder, folderIndex) => (
                                <div key={folderIndex} className="border rounded-lg p-4 mb-4 bg-white">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-[600] text-[16px]">Folder {folderIndex + 1}</h4>
                                        {folderData.length > 1 && (
                                            <Button
                                                onClick={() => removeFolder(folderIndex)}
                                                className="btn-sm bg-red-500 text-white px-2 py-1 rounded text-xs"
                                                type="button"
                                                disabled={uploading}
                                            >
                                                Remove Folder
                                            </Button>
                                        )}
                                    </div>

                                    {/* Folder Name Input */}
                                    <div className='mb-4'>
                                        <h4 className='text-[14px] font-[500] mb-1 text-black'>Folder Name</h4>
                                        <input
                                            type="text"
                                            className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                                            value={folder.folderName}
                                            onChange={(e) => updateFolderName(folderIndex, e.target.value)}
                                            placeholder="Enter folder name (optional)"
                                            disabled={uploading}
                                        />
                                    </div>

                                    {/* File Upload Input */}
                                    <div className='mb-4'>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={(e) => handleFileSelection(e, folderIndex)}
                                            className='hidden'
                                            id={`fileUpload-${folderIndex}`}
                                            accept="*/*"
                                            disabled={uploading}
                                        />
                                        <label
                                            htmlFor={`fileUpload-${folderIndex}`}
                                            className={`inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <FiUpload className='inline mr-2' />
                                            Choose Files for this Folder
                                        </label>
                                    </div>

                                    {/* File Previews */}
                                    {folder.previews.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {folder.previews.map((fileData, fileIndex) => (
                                                <div key={fileIndex} className={`border rounded-lg p-3 relative ${fileData.isExisting ? 'bg-blue-50' : 'bg-gray-50'}`}>
                                                    <span
                                                        className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer'
                                                        onClick={() => removeFile(folderIndex, fileIndex)}
                                                    >
                                                        <IoMdClose className='text-white text-[12px]' />
                                                    </span>

                                                    {/* Add existing file indicator */}
                                                    {fileData.isExisting && (
                                                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                                            Existing
                                                        </div>
                                                    )}

                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-shrink-0">
                                                            {fileData.type.includes('image') && fileData.preview ? (
                                                                <img
                                                                    src={fileData.preview}
                                                                    alt={fileData.name}
                                                                    className="w-12 h-12 object-cover rounded"
                                                                />
                                                            ) : (
                                                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                                                    <span className="text-xs font-bold text-gray-600">
                                                                        {fileData.name.split('.').pop()?.toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {fileData.name}
                                                            </p>
                                                            {!fileData.isExisting && (
                                                                <p className="text-xs text-gray-500">
                                                                    {(fileData.size / 1024 / 1024).toFixed(2)} MB
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-blue-600 font-medium">
                                                                By: {fileData.uploadedBy || 'Unknown User'}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                {new Date(fileData.uploadedAt).toLocaleDateString()} {new Date(fileData.uploadedAt).toLocaleTimeString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseFileDialog} disabled={uploading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleFileUpload}
                        variant="contained"
                        disabled={uploading}
                        startIcon={<FiUpload />}
                    >
                        {uploading ? 'Uploading...' : 'Upload Files'}
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default Products;
