import React, { useContext, useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { IoMdAdd } from "react-icons/io";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import SearchBox from "../../Components/SearchBox";
import { MyContext } from "../../App";
import { deleteData, deleteMultipleData, fetchDataFromApi } from "../../utils/api";
import { AiOutlineFilePdf, AiOutlineFileWord, AiOutlineEye } from "react-icons/ai";


const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
    { id: "product", label: "PRODUCT", minWidth: 150 },
    { id: "user", label: "USER", minWidth: 150 },
    { id: "file", label: "FILES", minWidth: 150 },
    { id: "created", label: "CREATED", minWidth: 100 },
    { id: "action", label: "ACTION", minWidth: 130 },
];

const ProductFiles = () => {
    const context = useContext(MyContext);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [fileData, setFileData] = useState([]);
    const [fileTotalData, setFileTotalData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortedIds, setSortedIds] = useState([]);

    useEffect(() => {
        fetchFiles(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const fetchFiles = (page, limit) => {
        setIsLoading(true);
        fetchDataFromApi(`/api/productFile?page=${page + 1}&limit=${limit}`).then((res) => {
            setFileData(res);
            console.log(res);
            setFileTotalData(res);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        if (searchQuery !== "") {
            const filtered = fileTotalData?.data?.filter((item) =>
                item?.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFileData({
                ...fileData,
                data: filtered,
                total: filtered.length,
            });
        } else {
            fetchFiles(page, rowsPerPage);
        }
    }, [searchQuery]);

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        const updated = fileData?.data?.map((item) => ({ ...item, checked: isChecked }));
        setFileData({ ...fileData, data: updated });

        setSortedIds(isChecked ? updated.map((item) => item._id) : []);
    };

    const handleCheckboxChange = (e, id) => {
        const updated = fileData?.data?.map((item) =>
            item._id === id ? { ...item, checked: !item.checked } : item
        );
        setFileData({ ...fileData, data: updated });

        const selected = updated.filter((item) => item.checked).map((item) => item._id);
        setSortedIds(selected);
    };

    const deleteMultiple = () => {
        // if (context?.userData?.role !== "ADMIN") {
        //     return context.alertBox("error", "Only admin can delete data");
        // }

        if (sortedIds.length === 0) {
            return context.alertBox("error", "Select items to delete");
        }

        deleteMultipleData("/api/productFile/deleteMultiple", {
            data: { ids: sortedIds },
        }).then(() => {
            context.alertBox("success", "Product files deleted");
            setSortedIds([]);
            fetchFiles(page, rowsPerPage);
        });
    };

    const deleteFile = (id) => {
        if (context?.userData?.role !== "ADMIN") {
            return context.alertBox("error", "Only admin can delete data");
        }

        deleteData(`/api/productFile/${id}`).then(() => {
            context.alertBox("success", "Product file deleted");
            fetchFiles(page, rowsPerPage);
        });
    };

    const handleChangePage = (e, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    const getFileType = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
        if (['pdf'].includes(extension)) return 'pdf';
        if (['doc', 'docx'].includes(extension)) return 'word';
        return 'other';
    };

    return (
        <div className="card my-2 pt-5 shadow-md sm:rounded-lg bg-white">
            <div className="flex items-center w-full px-5 pb-4 justify-between">
                <h2 className="text-[18px] font-[600]">Product Files</h2>
                <div className="flex gap-3 items-center">
                    {sortedIds.length > 0 && (
                        <Button variant="contained" color="error" size="small" onClick={deleteMultiple}>
                            Delete
                        </Button>
                    )}
                    <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <Link to="/product-file/add">
                        <Button variant="contained" color="primary" size="small" startIcon={<IoMdAdd />}>
                            Add File
                        </Button>
                    </Link>
                </div>
            </div>

            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Checkbox {...label} checked={fileData?.data?.every((i) => i.checked)} onChange={handleSelectAll} />
                            </TableCell>
                            {columns.map((column) => (
                                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!isLoading ? (
                            fileData?.data?.map((file, index) => (
                                <TableRow key={index} className={file.checked ? "!bg-[#1976d21f]" : ""}>
                                    <TableCell>
                                        <Checkbox checked={file.checked || false} onChange={(e) => handleCheckboxChange(e, file._id)} />
                                    </TableCell>
                                    <TableCell>{file?.product?.name || "N/A"}</TableCell>
                                    <TableCell>{file?.users?.map((u) => u.name).join(", ")}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 flex-wrap">
                                            {file?.fileUrls?.map((url, i) => {
                                                const fileType = getFileType(url);

                                                return (
                                                    <div key={i} className="w-[40px] h-[40px] flex items-center justify-center border rounded overflow-hidden bg-gray-100">
                                                        {fileType === 'image' ? (
                                                            <img src={url} alt="file" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <a href={url} target="_blank" rel="noopener noreferrer" title="Preview File">
                                                                {fileType === 'pdf' && <AiOutlineFilePdf size={24} color="red" />}
                                                                {fileType === 'word' && <AiOutlineFileWord size={24} color="#2B579A" />}
                                                                {fileType === 'other' && <AiOutlineEye size={24} />}
                                                            </a>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                        </div>
                                    </TableCell>
                                    <TableCell>{file?.createdAt?.split("T")[0]}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Link to={`/product-file/edit/${file._id}`}>
                                            <Button variant="outlined" size="small">Edit</Button>
                                        </Link>
                                        <Button variant="outlined" size="small" color="error" onClick={() => deleteFile(file._id)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <div className="flex justify-center items-center h-[300px]">
                                        <CircularProgress />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[25, 50, 100]}
                component="div"
                count={fileData?.total || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default ProductFiles;
