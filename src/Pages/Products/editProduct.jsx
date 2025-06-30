import React, { useContext, useEffect, useState } from 'react'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import UploadBox from '../../Components/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from "react-icons/io";
import { Button } from '@mui/material';
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from '../../App';
import { deleteImages, editData, editFormData, fetchDataFromApi, postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

import Switch from '@mui/material/Switch';
const apiUrl = import.meta.env.VITE_API_URL;

const label = { inputProps: { 'aria-label': 'Switch demo' } };



const EditProduct = () => {

    const [formFields, setFormFields] = useState({
        name: "",
        description: "",
        images: [],
        brand: "",
        price: "",
        oldPrice: "",
        category: "",
        catName: "",
        catId: "",
        subCatId: "",
        subCat: "",
        thirdsubCat: "",
        thirdsubCatId: "",
        countInStock: "",
        rating: "",
        isFeatured: false,
        discount: "",
        productRam: [],
        size: [],
        productWeight: [],
        bannerTitleName: '',
        bannerimages: [],
        isDisplayOnHomeBanner: false,
        files: [],
        folderName: '',

    })

    const [filePreviews, setFilePreviews] = useState([]);
    // const [selectedFiles, setSelectedFiles] = useState([]);
    const [folderData, setFolderData] = useState([
            {
                folderName: '',
                files: [],
                previews: []
            }
        ]);
    const [productCat, setProductCat] = React.useState('');
    const [productSubCat, setProductSubCat] = React.useState('');
    const [productFeatured, setProductFeatured] = React.useState('');
    const [productRams, setProductRams] = React.useState([]);
    const [productRamsData, setProductRamsData] = React.useState([]);
    const [productWeight, setProductWeight] = React.useState([]);
    const [productWeightData, setProductWeightData] = React.useState([]);
    const [productSize, setProductSize] = React.useState([]);
    const [productSizeData, setProductSizeData] = React.useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [productThirdLavelCat, setProductThirdLavelCat] = useState('');

    const [previews, setPreviews] = useState([]);
    const [bannerPreviews, setBannerPreviews] = useState([]);

    const [checkedSwitch, setCheckedSwitch] = useState(false);

    const history = useNavigate();

    const context = useContext(MyContext);


    useEffect(() => {

        fetchDataFromApi("/api/product/productRAMS/get").then((res) => {
            if (res?.error === false) {
                setProductRamsData(res?.data);
            }
        })

        fetchDataFromApi("/api/product/productWeight/get").then((res) => {
            if (res?.error === false) {
                setProductWeightData(res?.data);
            }
        })

        fetchDataFromApi("/api/product/productSize/get").then((res) => {
            if (res?.error === false) {
                setProductSizeData(res?.data);
            }
        })


        fetchDataFromApi(`/api/product/${context?.isOpenFullScreenPanel?.id}`).then((res) => {

            setFormFields({
                name: res?.product?.name,
                description: res?.product?.description,
                images: res?.product?.images,
                brand: res?.product?.brand,
                price: res?.product?.price,
                oldPrice: res?.product?.oldPrice,
                category: res?.product?.category,
                catName: res?.product?.catName,
                catId: res?.product?.catId,
                subCatId: res?.product?.subCatId,
                subCat: res?.product?.subCat,
                thirdsubCat: res?.product?.thirdsubCat,
                thirdsubCatId: res?.product?.thirdsubCatId,
                countInStock: res?.product?.countInStock,
                rating: res?.product?.rating,
                isFeatured: res?.product?.isFeatured,
                discount: res?.product?.discount,
                productRam: res?.product?.productRam,
                size: res?.product?.size,
                productWeight: res?.product?.productWeight,
                bannerTitleName: res?.product?.bannerTitleName,
                bannerimages: res?.product?.bannerimages,
                isDisplayOnHomeBanner: res?.product?.isDisplayOnHomeBanner,
                // files : res?.product?.files,
                // folderName: res?.product?.files?.[0]?.folderName || '',
                files: res?.product?.files || [],
                folderName: res?.product?.files?.[0]?.folderName || ''

            })
            
            const existingFiles = res?.product?.files || [];
            // const filePreviews = existingFiles.map(file => ({
            //     preview: file.fileUrl,
            //     name: file.fileName,
            //     type: "", // Mark as existing file
            //     isExisting: true, // Add flag to identify existing files
            //     fileUrl: file.fileUrl,
            //     fileName: file.fileName,
            //     folderName: file.folderName
            // }));
            const groupedFiles = existingFiles.reduce((acc, file) => {
                const folderName = file.folderName || 'Default';
                if (!acc[folderName]) {
                    acc[folderName] = {
                        folderName: folderName,
                        files: [],
                        previews: []
                    };
                }

                // Add to previews for display
                acc[folderName].previews.push({
                    preview: file.fileUrl,
                    name: file.fileName,
                    type: "",
                    isExisting: true,
                    fileUrl: file.fileUrl,
                    fileName: file.fileName,
                    folderName: file.folderName,
                    size: 0 // Size not available for existing files
                });

                return acc;
            }, {});
            const initialFolderData = Object.values(groupedFiles);

            // If no existing files, start with one empty folder
            if (initialFolderData.length === 0) {
                initialFolderData.push({
                    folderName: '',
                    files: [],
                    previews: []
                });
            }

            setFolderData(initialFolderData);

            // Also set filePreviews for backward compatibility
            const allFilePreviews = existingFiles.map(file => ({
                preview: file.fileUrl,
                name: file.fileName,
                type: "",
                isExisting: true,
                fileUrl: file.fileUrl,
                fileName: file.fileName,
                folderName: file.folderName
            }));
            setFilePreviews(allFilePreviews);
            // setFilePreviews(filePreviews);
            setProductCat(res?.product?.catId);
            setProductSubCat(res?.product?.subCatId);
            setProductThirdLavelCat(res?.product?.thirdsubCatId);
            setProductFeatured(res?.product?.isFeatured)
            setProductRams(res?.product?.productRam)
            setProductSize(res?.product?.size)
            setProductWeight(res?.product?.productWeight);
            setCheckedSwitch(res?.product?.isDisplayOnHomeBanner)

            setPreviews(res?.product?.images);
            setBannerPreviews(res?.product?.bannerimages);


        })
    }, []);


    const handleChangeProductCat = (event) => {
        setProductCat(event.target.value);
        formFields.catId = event.target.value
        formFields.category = event.target.value

    };

    const selectCatByName = (name) => {
        formFields.catName = name
    }

    const handleChangeProductSubCat = (event) => {
        setProductSubCat(event.target.value);
        formFields.subCatId = event.target.value
    };

    const selectSubCatByName = (name) => {
        formFields.subCat = name
    }

    const handleChangeProductThirdLavelCat = (event) => {
        setProductThirdLavelCat(event.target.value);
        formFields.thirdsubCatId = event.target.value
    };

    const selectSubCatByThirdLavel = (name) => {
        formFields.thirdsubCat = name
    }


    const handleChangeProductFeatured = (event) => {
        setProductFeatured(event.target.value);
        formFields.isFeatured = event.target.value
    };

    const handleChangeProductRams = (event) => {
        const {
            target: { value },
        } = event;
        setProductRams(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );

        formFields.productRam = value;

    };

    const handleChangeProductWeight = (event) => {

        const {
            target: { value },
        } = event;
        setProductWeight(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );

        formFields.productWeight = value;
    };

    const handleChangeProductSize = (event) => {

        const {
            target: { value },
        } = event;
        setProductSize(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );

        formFields.size = value;
    };


    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(() => {
            return {
                ...formFields,
                [name]: value
            }
        })
    }

    const onChangeRating = (e) => {
        setFormFields((formFields) => (
            {
                ...formFields,
                rating: e.target.value
            }
        ))
    }


    const setPreviewsFun = (previewsArr) => {
        const imgArr = previews;
        for (let i = 0; i < previewsArr.length; i++) {
            imgArr.push(previewsArr[i])
        }

        setPreviews([])
        setTimeout(() => {
            setPreviews(imgArr)
            formFields.images = imgArr
        }, 10);
    }

    const removeImg = (image, index) => {
        var imageArr = [];
        imageArr = previews;
        deleteImages(`/api/category/deteleImage?img=${image}`).then((res) => {
            imageArr.splice(index, 1);

            setPreviews([]);
            setTimeout(() => {
                setPreviews(imageArr);
                formFields.images = imageArr
            }, 100);

        })
    }


    const setBannerImagesFun = (previewsArr) => {
        const imgArr = bannerPreviews;
        for (let i = 0; i < previewsArr.length; i++) {
            imgArr.push(previewsArr[i])
        }

        setBannerPreviews([])
        setTimeout(() => {
            setBannerPreviews(imgArr)
            formFields.bannerimages = imgArr
        }, 10);
    }

    const handleFileSelection = (e, folderIndex) => {
        const files = Array.from(e.target.files);

        const readFiles = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    resolve({
                        file,
                        preview: event.target.result,
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        isExisting: false // Mark as new file
                    });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readFiles).then(newPreviews => {
            setFolderData(prev => {
                return prev.map((folder, index) => {
                    if (index === folderIndex) {
                        return {
                            ...folder,
                            files: [...folder.files, ...files],
                            previews: [...folder.previews, ...newPreviews]
                        };
                    }
                    return folder;
                });
            });

            // Update filePreviews for backward compatibility
            setFilePreviews(prev => {
                const allPreviews = [];
                folderData.forEach(folder => {
                    allPreviews.push(...folder.previews);
                });
                allPreviews.push(...newPreviews);
                return allPreviews;
            });

            // Clear input value
            e.target.value = '';
        });
    };

    // Replace removeFile function
    const removeFile = (folderIndex, fileIndex) => {
        setFolderData(prev => {
            const updated = [...prev];
            const fileToRemove = updated[folderIndex].previews[fileIndex];

            // If it's an existing file, we might want to call delete API
            if (fileToRemove.isExisting) {
                // Optionally delete from server
                deleteImages(`/api/category/deteleImage?img=${fileToRemove.fileUrl}`).then((res) => {
                    console.log('File deleted from server');
                }).catch(err => {
                    console.error('Error deleting file:', err);
                });
            }

            updated[folderIndex].files.splice(fileIndex, 1);
            updated[folderIndex].previews.splice(fileIndex, 1);
            return updated;
        });

        // Also update filePreviews for backward compatibility
        setFilePreviews(prev => {
            const allPreviews = [];
            folderData.forEach((folder, fIndex) => {
                folder.previews.forEach((preview, pIndex) => {
                    if (!(fIndex === folderIndex && pIndex === fileIndex)) {
                        allPreviews.push(preview);
                    }
                });
            });
            return allPreviews;
        });
    };

    // Add new functions for folder management
    const addFolder = () => {
        setFolderData(prev => [...prev, {
            folderName: '',
            files: [],
            previews: []
        }]);
    };

    const removeFolder = (folderIndex) => {
        if (folderData.length > 1) {
            setFolderData(prev => prev.filter((_, index) => index !== folderIndex));
        }
    };

    const updateFolderName = (folderIndex, name) => {
        setFolderData(prev => {
            const updated = [...prev];
            updated[folderIndex].folderName = name;

            // If this is the first folder, also update formFields.folderName for backward compatibility
            if (folderIndex === 0) {
                setFormFields(prevFields => ({
                    ...prevFields,
                    folderName: name
                }));
            }

            return updated;
        });
    };


    const removeBannerImg = (image, index) => {
        var imageArr = [];
        imageArr = bannerPreviews;
        deleteImages(`/api/category/deteleImage?img=${image}`).then((res) => {
            imageArr.splice(index, 1);

            setBannerPreviews([]);
            setTimeout(() => {
                setBannerPreviews(imageArr);
                formFields.bannerimages = imageArr
            }, 100);

        })
    }



    const handleChangeSwitch = (event) => {
        setCheckedSwitch(event.target.checked);
        formFields.isDisplayOnHomeBanner = event.target.checked;
    }

    const handleSubmitg = (e) => {
        e.preventDefault(0);


        if (formFields.name === "") {
            context.alertBox("error", "Please enter product name");
            return false;
        }

        if (formFields.description === "") {
            context.alertBox("error", "Please enter product description");
            return false;
        }



        if (formFields?.catId === "") {
            context.alertBox("error", "Please select product category");
            return false;
        }



        if (formFields?.price === "") {
            context.alertBox("error", "Please enter product price");
            return false;
        }


        if (formFields?.oldPrice === "") {
            context.alertBox("error", "Please enter product old Price");
            return false;
        }


        if (formFields?.countInStock === "") {
            context.alertBox("error", "Please enter  product stock");
            return false;
        }


        if (formFields?.brand === "") {
            context.alertBox("error", "Please enter product brand");
            return false;
        }


        if (formFields?.discount === "") {
            context.alertBox("error", "Please enter product discount");
            return false;
        }




        if (formFields?.rating === "") {
            context.alertBox("error", "Please enter  product rating");
            return false;
        }


        if (previews?.length === 0) {
            context.alertBox("error", "Please select product images");
            return false;
        }

        const allExistingFiles = [];
        const allNewFiles = [];

        folderData.forEach(folder => {
            folder.previews.forEach(preview => {
                if (preview.isExisting) {
                    allExistingFiles.push({
                        fileUrl: preview.fileUrl,
                        fileName: preview.fileName,
                        folderName: preview.folderName || folder.folderName
                    });
                } else {
                    allNewFiles.push({
                        file: preview.file,
                        folderName: folder.folderName || 'Default'
                    });
                }
            });
        });
    

        // const existingFiles = filePreviews
        //     .filter(file => file.isExisting)
        //     .map(file => ({
        //         fileUrl: file.fileUrl,
        //         fileName: file.fileName,
        //         folderName: file.folderName || formFields.folderName
        //     }));

        // const newFiles = filePreviews
        //     .filter(file => !file.isExisting)
        //     .map(file => file.file); // These are the actual File objects

        // Create FormData for submission
        const formData = new FormData();

        // Add all form fields
        Object.keys(formFields).forEach(key => {
            if (key !== 'files' && key !== 'folderName') {
                if (Array.isArray(formFields[key]) && formFields[key].length <= 0) {
                    //skip this field if it's an empty array

                } else {
                    if(key === 'category'){
                        formData.append(key, formFields[key]._id)
                    }else{
                        formData.append(key, formFields[key]);
                    }
                }
            }
        });

        // Add existing files info
        formData.append('existingFiles', JSON.stringify(allExistingFiles));

        // Add new files
        allNewFiles.forEach((fileData, index) => {
            formData.append('files', fileData.file);
            formData.append(`folderNames`, fileData.folderName);
        });

        // Add folder name for new files
        formData.append('folderStructure', JSON.stringify(
            folderData.map(folder => ({
                folderName: folder.folderName || 'Default',
                fileCount: folder.files.length
            }))
        ));

        setIsLoading(true);

        console.log('Form Data:', formData);

        editFormData(`/api/product/updateProduct/${context?.isOpenFullScreenPanel?.id}`, formData).then((res) => {

            console.log(res)
            if (res?.error === false) {
                context.alertBox("success", res?.message);
                setTimeout(() => {
                    setIsLoading(false);
                    context.setIsOpenFullScreenPanel({
                        open: false,
                    })
                    history("/products");
                }, 1000);
            } else {
                setIsLoading(false);
                context.alertBox("error", res?.message);
            }
        }).catch((error) => {
            setIsLoading(false);
            context.alertBox("error", "Failed to update product");
            console.error('Update error:', error);
        });
    }

    return (
        <section className='p-5 bg-gray-50'>
            <form className='form py-1 p-1 md:p-8 md:py-1' onSubmit={handleSubmitg}>
                <div className='scroll max-h-[72vh] overflow-y-scroll pr-4'>

                    <div className='grid grid-cols-1 mb-3'>
                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Name</h3>
                            <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm' name="name" value={formFields.name} onChange={onChangeInput} />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 mb-3'>
                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Description</h3>
                            <textarea type="text" className='w-full h-[140px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm' name="description" value={formFields.description} onChange={onChangeInput} />
                        </div>
                    </div>



                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-3 gap-4'>
                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Category</h3>

                            {
                                context?.catData?.length !== 0 &&
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="productCatDrop"
                                    size="small"
                                    className='w-full'
                                    value={productCat}
                                    label="Category"
                                    onChange={handleChangeProductCat}
                                >
                                    {
                                        context?.catData?.map((cat, index) => {
                                            return (
                                                <MenuItem value={cat?._id} key={index}
                                                    onClick={() => selectCatByName(cat?.name)}>{cat?.name}</MenuItem>
                                            )
                                        })
                                    }

                                </Select>
                            }


                        </div>

                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Sub Category</h3>

                            {
                                context?.catData?.length !== 0 &&
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="productCatDrop"
                                    size="small"
                                    className='w-full'
                                    value={productSubCat}
                                    label="Sub Category"
                                    onChange={handleChangeProductSubCat}
                                >
                                    {
                                        context?.catData?.map((cat, index) => {
                                            return (
                                                cat?.children?.length !== 0 && cat?.children?.map((subCat, index_) => {
                                                    return (
                                                        <MenuItem value={subCat?._id} key={index}
                                                            onClick={() => selectSubCatByName(subCat?.name)}
                                                        >
                                                            {subCat?.name}</MenuItem>
                                                    )
                                                })

                                            )
                                        })
                                    }

                                </Select>
                            }



                        </div>


                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Third Lavel Category</h3>

                            {
                                context?.catData?.length !== 0 &&
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="productCatDrop"
                                    size="small"
                                    className='w-full'
                                    value={productThirdLavelCat}
                                    label="Sub Category"
                                    onChange={handleChangeProductThirdLavelCat}
                                >
                                    {
                                        context?.catData?.map((cat) => {
                                            return (
                                                cat?.children?.length !== 0 && cat?.children?.map((subCat) => {
                                                    return (
                                                        subCat?.children?.length !== 0 && subCat?.children?.map((thirdLavelCat, index) => {
                                                            return <MenuItem value={thirdLavelCat?._id} key={index}
                                                                onClick={() => selectSubCatByThirdLavel(thirdLavelCat?.name)}>{thirdLavelCat?.name}</MenuItem>
                                                        })

                                                    )
                                                })

                                            )
                                        })
                                    }

                                </Select>
                            }



                        </div>


                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Price</h3>
                            <input type="number" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' name="price" value={formFields.price} onChange={onChangeInput} />
                        </div>


                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1  text-black'>Product Old Price</h3>
                            <input type="number" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' name="oldPrice" value={formFields.oldPrice} onChange={onChangeInput} />
                        </div>

                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Is Featured?</h3>
                            <Select
                                labelId="demo-simple-select-label"
                                id="productCatDrop"
                                size="small"
                                className='w-full'
                                value={productFeatured}
                                label="Category"
                                onChange={handleChangeProductFeatured}
                            >
                                <MenuItem value={true}>True</MenuItem>
                                <MenuItem value={false}>False</MenuItem>
                            </Select>
                        </div>


                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Stock</h3>
                            <input type="number" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' name="countInStock" value={formFields.countInStock} onChange={onChangeInput} />
                        </div>


                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Brand</h3>
                            <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' name="brand" value={formFields.brand} onChange={onChangeInput} />
                        </div>


                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Discount</h3>
                            <input type="number" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' name="discount" value={formFields.discount} onChange={onChangeInput} />
                        </div>


                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product RAMS</h3>
                            {
                                productRamsData?.length !== 0 &&
                                <Select
                                    multiple
                                    labelId="demo-simple-select-label"
                                    id="productCatDrop"
                                    size="small"
                                    className='w-full'
                                    value={productRams}
                                    label="Category"
                                    onChange={handleChangeProductRams}
                                >
                                    {
                                        productRamsData?.map((item, index) => {
                                            return <MenuItem key={index} value={item?.name}>{item.name}</MenuItem>
                                        })
                                    }


                                </Select>
                            }
                        </div>

                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Weight</h3>
                            {
                                productWeightData?.length !== 0 &&
                                <Select
                                    multiple
                                    labelId="demo-simple-select-label"
                                    id="productCatDrop"
                                    size="small"
                                    className='w-full'
                                    value={productWeight}
                                    label="Category"
                                    onChange={handleChangeProductWeight}
                                >

                                    {
                                        productWeightData?.map((item, index) => {
                                            return <MenuItem key={index} value={item?.name}>{item?.name}</MenuItem>
                                        })
                                    }

                                </Select>
                            }
                        </div>


                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Size</h3>
                            {
                                productSizeData?.length !== 0 &&
                                <Select
                                    multiple
                                    labelId="demo-simple-select-label"
                                    id="productCatDrop"
                                    size="small"
                                    className='w-full'
                                    value={productSize}
                                    label="Category"
                                    onChange={handleChangeProductSize}
                                >

                                    {
                                        productSizeData?.map((item, index) => {
                                            return <MenuItem key={index} value={item?.name}>{item?.name}</MenuItem>
                                        })
                                    }
                                </Select>
                            }
                        </div>




                    </div>




                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-3 gap-4'>


                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1  text-black'>Product Rating </h3>
                            <Rating name="rating" value={formFields.rating} onChange={onChangeRating} />
                        </div>


                    </div>




                    <div className='col w-full p-5 px-0'>
                        <h3 className="font-[700] text-[18px] mb-3">Media & Images</h3>

                        <div className="grid grid-cols-2  sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {
                                previews?.length !== 0 && previews?.map((image, index) => {
                                    return (
                                        <div className="uploadBoxWrapper relative" key={index}>

                                            <span className='absolute w-[20px] h-[20px] rounded-full  overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer' onClick={() => removeImg(image, index)}><IoMdClose className='text-white text-[17px]' /></span>


                                            <div className='uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>

                                                <img src={image} className='w-100' />
                                            </div>
                                        </div>
                                    )
                                })
                            }


                            <UploadBox multiple={true} name="images" url="/api/product/uploadImages" setPreviewsFun={setPreviewsFun} />
                        </div>

                    </div>




                    <div className='col w-full p-5 px-0'>

                        <div className='bg-gray-100 p-4 w-full'>
                            <div className="flex items-center gap-8">
                                <h3 className="font-[700] text-[18px] mb-3">Banner Images</h3>
                                <Switch {...label} onChange={handleChangeSwitch} checked={checkedSwitch} />
                            </div>
                            <div className="grid grid-cols-2  sm:grid-cols-4 md:grid-cols-5 gap-4">


                                {
                                    bannerPreviews?.length !== 0 && bannerPreviews?.map((image, index) => {
                                        return (
                                            <div className="uploadBoxWrapper relative" key={index}>

                                                <span className='absolute w-[20px] h-[20px] rounded-full  overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer' onClick={() => removeBannerImg(image, index)}><IoMdClose className='text-white text-[17px]' /></span>


                                                <div className='uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>

                                                    <img src={image} className='w-100' />
                                                </div>
                                            </div>
                                        )
                                    })
                                }


                                <UploadBox multiple={true} name="bannerimages" url="/api/product/uploadBannerImages" setPreviewsFun={setBannerImagesFun} />
                            </div>


                            <br />

                            <h3 className="font-[700] text-[18px] mb-3">Banner Title</h3>
                            <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm' name="bannerTitleName" value={formFields.bannerTitleName} onChange={onChangeInput} />
                        </div>



                    </div>

                    <div className='col w-full p-5 px-0'>
                                            <div className='bg-gray-50 p-4 w-full border rounded-md'>
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="font-[700] text-[18px]">Additional Files (Optional)</h3>
                                                    <Button
                                                        onClick={addFolder}
                                                        className="btn-sm bg-green-500 text-white px-3 py-1 rounded"
                                                        type="button"
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
                                                            />
                                                            <label
                                                                htmlFor={`fileUpload-${folderIndex}`}
                                                                className='inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors'
                                                            >
                                                                <FaCloudUploadAlt className='inline mr-2' />
                                                                Choose Files for this Folder
                                                            </label>
                                                        </div>
                    
                                                        {/* File Previews */}
                                                        {folder.previews.length > 0 && (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                {folder.previews.map((fileData, fileIndex) => (
                                                                    <div key={fileIndex} className="border rounded-lg p-3 bg-gray-50 relative">
                                                                        <span
                                                                            className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer'
                                                                            onClick={() => removeFile(folderIndex, fileIndex)}
                                                                        >
                                                                            <IoMdClose className='text-white text-[12px]' />
                                                                        </span>
                    
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className="flex-shrink-0">
                                                                                {fileData.type.startsWith('image/') ? (
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
                                                                                <p className="text-xs text-gray-500">
                                                                                    {(fileData.size / 1024 / 1024).toFixed(2)} MB
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

                </div>



                <hr />
                <br />
                <Button type="submit" className="btn-blue btn-lg w-full flex gap-2">

                    {
                        isLoading === true ? <CircularProgress color="inherit" />
                            :
                            <>
                                <FaCloudUploadAlt className='text-[25px] text-white' />
                                Publish and View
                            </>
                    }
                </Button>

            </form>
        </section>
    )
}

export default EditProduct;
