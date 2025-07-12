// // import React, { useState, useEffect } from 'react';
// // import { Button } from "@mui/material";
// // import { FaAngleDown } from "react-icons/fa6";
// // import Badge from "../../Components/Badge";
// // import SearchBox from '../../Components/SearchBox';
// // import { FaAngleUp } from "react-icons/fa6";
// // import { deleteData, editData, fetchDataFromApi } from '../../utils/api';
// // import Pagination from "@mui/material/Pagination";

// // import MenuItem from '@mui/material/MenuItem';
// // import Select from '@mui/material/Select';
// // import { useContext } from 'react';

// // import { MyContext } from "../../App.jsx";

// // export const Orders = () => {

// //   const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
// //   const [orderStatus, setOrderStatus] = useState('');

// //   const [ordersData, setOrdersData] = useState([]);
// //   const [orders, setOrders] = useState([]);
// //   const [pageOrder, setPageOrder] = useState(1);
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [totalOrdersData, setTotalOrdersData] = useState([]);

// //   const context = useContext(MyContext);


// //   const isShowOrderdProduct = (index) => {
// //     if (isOpenOrderdProduct === index) {
// //       setIsOpenOrderdProduct(null);
// //     } else {
// //       setIsOpenOrderdProduct(index);
// //     }
// //   };


// //   const handleChange = (event, id) => {
// //     setOrderStatus(event.target.value);

// //     const obj = {
// //       id: id,
// //       order_status: event.target.value
// //     }

// //     editData(`/api/order/order-status/${id}`, obj).then((res) => {
// //       if (res?.data?.error === false) {
// //         context.alertBox("success", res?.data?.message);
// //       }
// //     })

// //   };


// //   useEffect(() => {
// //     context?.setProgress(50);
// //     fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
// //       if (res?.error === false) {
// //         setOrdersData(res?.data)
// //         context?.setProgress(100);
// //       }
// //     })
// //     fetchDataFromApi(`/api/order/order-list`).then((res) => {
// //       if (res?.error === false) {
// //         setTotalOrdersData(res)
// //       }
// //     })
// //   }, [orderStatus, pageOrder])


// //   useEffect(() => {

// //     // Filter orders based on search query
// //     if (searchQuery !== "") {
// //       const filteredOrders = totalOrdersData?.data?.filter((order) =>
// //         order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //         order?.userId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //         order?.userId?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //         order?.createdAt.includes(searchQuery)
// //       );
// //       setOrdersData(filteredOrders)
// //     } else {
// //       fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
// //         if (res?.error === false) {
// //           setOrders(res)
// //           setOrdersData(res?.data)
// //         }
// //       })
// //     }

// //   }, [searchQuery])


// //     const deleteOrder = (id) => {
// //           if (context?.userData?.role === "ADMIN") {
// //               deleteData(`/api/order/deleteOrder/${id}`).then((res) => {
// //                 fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
// //                   if (res?.error === false) {
// //                     setOrdersData(res?.data)
// //                     context?.setProgress(100);
// //                     context.alertBox("success", "Order Delete successfully!");
// //                   }
// //                 })

// //                 fetchDataFromApi(`/api/order/order-list`).then((res) => {
// //                   if (res?.error === false) {
// //                     setTotalOrdersData(res)
// //                   }
// //                 })

// //               })
// //           } else {
// //               context.alertBox("error", "Only admin can delete data");
// //           }
// //       }


// //   return (
// //     <div className="card my-2 md:mt-4 shadow-md sm:rounded-lg bg-white">
// //       <div className="grid grid-cols-1 lg:grid-cols-2 px-5 py-5 flex-col sm:flex-row">
// //         <h2 className="text-[18px] font-[600] text-left mb-2 lg:mb-0">Recent Orders</h2>
// //         <div className="ml-auto w-full">
// //           <SearchBox
// //             searchQuery={searchQuery}
// //             setSearchQuery={setSearchQuery}
// //             setPageOrder={setPageOrder}
// //           />
// //         </div>
// //       </div>

// //       <div className="relative overflow-x-auto">
// //         <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
// //           <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
// //             <tr>
// //               <th scope="col" className="px-6 py-3">
// //                 &nbsp;
// //               </th>
// //               <th scope="col" className="px-6 py-3 whitespace-nowrap">
// //                 Order Id
// //               </th>
// //               <th scope="col" className="px-6 py-3 whitespace-nowrap">
// //                 Paymant Id
// //               </th>
// //               <th scope="col" className="px-6 py-3 whitespace-nowrap">
// //                 Name
// //               </th>
// //               <th scope="col" className="px-6 py-3 whitespace-nowrap">
// //                 Phone Number
// //               </th>
// //               <th scope="col" className="px-6 py-3 whitespace-nowrap">
// //                 Address
// //               </th>
// //               <th scope="col" className="px-6 py-3 whitespace-nowrap">
// //                 Pincode
// //               </th>
// //               <th scope="col" className="px-6 py-3 whitespace-nowrap">
// //                 Total Amount
// //               </th>
// //               <th scope="col" className="px-6 py-3 whitespace-nowrap">
// //                 Email
// //               </th>
// //               <th scope="col" className="px-6 py-3 whitespace-nowrap">
// //                 User Id
// //               </th>
// //               <th scope="col" className="px-6 py-3 whitespace-nowrap">
// //                 Order Status
// //               </th>
// //               <th scope="col" className="px-6 py-3 whitespace-nowrap">
// //                 Date
// //               </th>
// //               <th scope="col" className="px-6 py-3 whitespace-nowrap">
// //                 Action
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody>

// //             {
// //               ordersData?.length !== 0 && ordersData?.map((order, index) => {
// //                 return (
// //                   <>
// //                     <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
// //                       <td className="px-6 py-4 font-[500]">
// //                         <Button
// //                           className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]"
// //                           onClick={() => isShowOrderdProduct(index)}
// //                         >
// //                           {
// //                             isOpenOrderdProduct === index ? <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.7)]" /> : <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.7)]" />
// //                           }

// //                         </Button>
// //                       </td>
// //                       <td className="px-6 py-4 font-[500]">
// //                         <span className="text-primary">
// //                           {order?._id}
// //                         </span>
// //                       </td>

// //                       <td className="px-6 py-4 font-[500]">
// //                         <span className="text-primary whitespace-nowrap text-[13px]">{order?.paymentId ? order?.paymentId : 'CASH ON DELIVERY'}</span>
// //                       </td>

// //                       <td className="px-6 py-4 font-[500] whitespace-nowrap">
// //                         {order?.userId?.name}
// //                       </td>

// //                       <td className="px-6 py-4 font-[500]">{order?.delivery_address?.mobile}</td>

// //                       <td className="px-6 py-4 font-[500]">
// //                         <span className='inline-block text-[13px] font-[500] p-1 bg-[#f1f1f1] rounded-md'>{order?.delivery_address?.addressType}</span>
// //                         <span className="block w-[400px]">
// //                           {order?.delivery_address?.
// //                             address_line1 + " " +
// //                             order?.delivery_address?.city + " " +
// //                             order?.delivery_address?.landmark + " " +
// //                             order?.delivery_address?.state + " " +
// //                             order?.delivery_address?.country
// //                           }
// //                         </span>
// //                       </td>

// //                       <td className="px-6 py-4 font-[500]">{order?.delivery_address?.pincode}</td>

// //                       <td className="px-6 py-4 font-[500]">{order?.totalAmt}</td>

// //                       <td className="px-6 py-4 font-[500]">
// //                         {order?.userId?.email}
// //                       </td>

// //                       <td className="px-6 py-4 font-[500]">
// //                         <span className="text-primary">
// //                           {order?.userId?._id}
// //                         </span>
// //                       </td>

// //                       <td className="px-6 py-4 font-[500]">
// //                         <Select
// //                           labelId="demo-simple-select-helper-label"
// //                           id="demo-simple-select-helper"
// //                           value={order?.order_status !== null ? order?.order_status : orderStatus}
// //                           label="Status"
// //                           size="small"
// //                           style={{ zoom: '80%' }}
// //                           className="w-full"
// //                           onChange={(e) => handleChange(e, order?._id)}
// //                         >
// //                           <MenuItem value={'pending'}>Pending</MenuItem>
// //                           <MenuItem value={'confirm'}>Confirm</MenuItem>
// //                           <MenuItem value={'delivered'}>Delivered</MenuItem>
// //                         </Select>
// //                       </td>
// //                       <td className="px-6 py-4 font-[500] whitespace-nowrap">
// //                         {order?.createdAt?.split("T")[0]}
// //                       </td>
// //                       <td className="px-6 py-4 font-[500] whitespace-nowrap">
// //                         <Button onClick={() => deleteOrder(order?._id)} variant="outlined" color="error" size="small">Delete</Button>
// //                       </td>
// //                     </tr>

// //                     {isOpenOrderdProduct === index && (
// //                       <tr>
// //                         <td className="pl-20" colSpan="6">
// //                           <div className="relative overflow-x-auto">
// //                             <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
// //                               <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
// //                                 <tr>
// //                                   <th
// //                                     scope="col"
// //                                     className="px-6 py-3 whitespace-nowrap"
// //                                   >
// //                                     Product Id
// //                                   </th>
// //                                   <th
// //                                     scope="col"
// //                                     className="px-6 py-3 whitespace-nowrap"
// //                                   >
// //                                     Product Title
// //                                   </th>
// //                                   <th
// //                                     scope="col"
// //                                     className="px-6 py-3 whitespace-nowrap"
// //                                   >
// //                                     Image
// //                                   </th>
// //                                   <th
// //                                     scope="col"
// //                                     className="px-6 py-3 whitespace-nowrap"
// //                                   >
// //                                     Quantity
// //                                   </th>
// //                                   <th
// //                                     scope="col"
// //                                     className="px-6 py-3 whitespace-nowrap"
// //                                   >
// //                                     Price
// //                                   </th>
// //                                   <th
// //                                     scope="col"
// //                                     className="px-6 py-3 whitespace-nowrap"
// //                                   >
// //                                     Sub Total
// //                                   </th>
// //                                 </tr>
// //                               </thead>
// //                               <tbody>
// //                                 {
// //                                   order?.products?.map((item, index) => {
// //                                     return (
// //                                       <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
// //                                         <td className="px-6 py-4 font-[500]">
// //                                           <span className="text-gray-600">
// //                                             {item?._id}
// //                                           </span>
// //                                         </td>
// //                                         <td className="px-6 py-4 font-[500]">
// //                                           <div className="w-[200px]">
// //                                             {item?.productTitle}
// //                                           </div>
// //                                         </td>

// //                                         <td className="px-6 py-4 font-[500]">
// //                                           <img
// //                                             src={item?.image}
// //                                             className="w-[40px] h-[40px] object-cover rounded-md"
// //                                           />
// //                                         </td>

// //                                         <td className="px-6 py-4 font-[500] whitespace-nowrap">
// //                                           {item?.quantity}
// //                                         </td>

// //                                         <td className="px-6 py-4 font-[500]">{item?.price?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</td>

// //                                         <td className="px-6 py-4 font-[500]">{(item?.price * item?.quantity)?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</td>
// //                                       </tr>
// //                                     )
// //                                   })
// //                                 }


// //                                 <tr>
// //                                   <td
// //                                     className="bg-[#f1f1f1]"
// //                                     colSpan="12"
// //                                   ></td>
// //                                 </tr>
// //                               </tbody>
// //                             </table>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     )}
// //                   </>
// //                 )
// //               })

// //             }






// //           </tbody>
// //         </table>
// //       </div>


// //       {
// //         orders?.totalPages > 1 &&
// //         <div className="flex items-center justify-center mt-10 pb-5">
// //           <Pagination
// //             showFirstButton showLastButton
// //             count={orders?.totalPages}
// //             page={pageOrder}
// //             onChange={(e, value) => setPageOrder(value)}
// //           />
// //         </div>
// //       }
// //     </div>
// //   )
// // }


// // export default Orders;
// import React, { useState, useEffect, useContext } from "react";
// import { Button, Modal, Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
// import { FaAngleDown, FaAngleUp, FaTrash } from "react-icons/fa6";
// import Pagination from "@mui/material/Pagination";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
// import Badge from "../../Components/Badge";
// import SearchBox from "../../Components/SearchBox";
// import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
// import { MyContext } from "../../App.jsx";
// const apiUrl = import.meta.env.VITE_API_URL;

// const Orders = () => {
//   const context = useContext(MyContext);

//   const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
//   const [orderStatus, setOrderStatus] = useState("");
//   const [ordersData, setOrdersData] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [pageOrder, setPageOrder] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [totalOrdersData, setTotalOrdersData] = useState([]);

//   // Modal and file upload states
//   const [fileModalOpen, setFileModalOpen] = useState(false);
//   const [selectedOrderForFiles, setSelectedOrderForFiles] = useState(null);
//   const [userFiles, setUserFiles] = useState([]);
//   const [adminFiles, setAdminFiles] = useState([]);
//   const [filesToUpload, setFilesToUpload] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const isShowOrderdProduct = (index) => {
//     if (isOpenOrderdProduct === index) {
//       setIsOpenOrderdProduct(null);
//     } else {
//       setIsOpenOrderdProduct(index);
//     }
//   };

//   const handleChange = (event, id) => {
//     setOrderStatus(event.target.value);

//     const obj = {
//       id: id,
//       order_status: event.target.value,
//     };

//     editData(`/api/order/order-status/${id}`, obj).then((res) => {
//       if (res?.data?.error === false) {
//         context.alertBox("success", res?.data?.message);
//       }
//     });
//   };

//   useEffect(() => {
//     context?.setProgress(50);
//     fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
//       if (res?.error === false) {
//         setOrdersData(res?.data);
//         setOrders(res);
//         context?.setProgress(100);
//       }
//     });
//     fetchDataFromApi(`/api/order/order-list`).then((res) => {
//       if (res?.error === false) {
//         setTotalOrdersData(res);
//       }
//     });
//   }, [orderStatus, pageOrder]);

//   useEffect(() => {
//     // Filter orders based on search query
//     if (searchQuery !== "") {
//       const filteredOrders = totalOrdersData?.data?.filter(
//         (order) =>
//           order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           order?.userId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           order?.userId?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           order?.createdAt.includes(searchQuery)
//       );
//       setOrdersData(filteredOrders);
//     } else {
//       fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
//         if (res?.error === false) {
//           setOrders(res);
//           setOrdersData(res?.data);
//         }
//       });
//     }
//   }, [searchQuery]);

//   const deleteOrder = (id) => {
//     if (context?.userData?.role === "ADMIN") {
//       deleteData(`/api/order/deleteOrder/${id}`).then((res) => {
//         fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
//           if (res?.error === false) {
//             setOrdersData(res?.data);
//             context?.setProgress(100);
//             context.alertBox("success", "Order deleted successfully!");
//           }
//         });

//         fetchDataFromApi(`/api/order/order-list`).then((res) => {
//           if (res?.error === false) {
//             setTotalOrdersData(res);
//           }
//         });
//       });
//     } else {
//       context.alertBox("error", "Only admin can delete data");
//     }
//   };

//   // --- FILE UPLOAD HANDLERS ---

//   // Open modal and set files for a given order
//   const openFileModal = (order) => {
//     setSelectedOrderForFiles(order);
//     setUserFiles(order.userFiles || []);
//     setAdminFiles(order.adminFiles || []);
//     setFilesToUpload([]);
//     setFileModalOpen(true);
//   };

//   const closeFileModal = () => {
//     setFileModalOpen(false);
//     setSelectedOrderForFiles(null);
//     setUserFiles([]);
//     setAdminFiles([]);
//     setFilesToUpload([]);
//   };

//   // Handle new file selection
//   const onFilesSelected = (e) => {
//     setFilesToUpload(Array.from(e.target.files));
//   };

//   // Upload new files to backend
//   const uploadFiles = async () => {
//     if (!selectedOrderForFiles || filesToUpload.length === 0) return;

//     setLoading(true);
//     const formData = new FormData();
//     filesToUpload.forEach(file => formData.append("files", file));
//     formData.append("orderId", selectedOrderForFiles._id);
//     formData.append("uploaderType", "admin");

//     try {
//       const res = await fetch(`${apiUrl}/api/order/upload-order-files`, {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       if (data.success) {
//         context.alertBox("success", "Files uploaded successfully");
//         // Update local state with new files
//         setAdminFiles(data.order.adminFiles || []);
//         // Update main orders list as well
//         setOrdersData(prevOrders =>
//           prevOrders.map(o => o._id === selectedOrderForFiles._id ? data.order : o)
//         );
//         setFilesToUpload([]);

//         // Also refetch for consistency
//         fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
//           if (res?.error === false) {
//             setOrdersData(res?.data);
//           }
//         });
//         fetchDataFromApi(`/api/order/order-list`).then((res) => {
//           if (res?.error === false) {
//             setTotalOrdersData(res);
//           }
//         });
//       } else {
//         context.alertBox("error", data?.message || "Upload failed");
//       }
//     } catch (error) {
//       context.alertBox("error", "Upload failed: " + error.message);
//     }
//     setLoading(false);
//   };

//   const deleteFile = async (fileUrl, fileType) => {
//     if (context?.userData?.role !== "ADMIN") {
//       context.alertBox("error", "Only admin can delete files");
//       return;
//     }

//     if (!window.confirm("Are you sure you want to delete this file?")) return;

//     try {
//       context.setProgress(50);
//       const res = await fetch(`${apiUrl}/api/order/delete-file`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           fileUrl,
//           fileType,
//           orderId: selectedOrderForFiles?._id,
//         }),
//       });

//       const result = await res.json();

//       if (result.success) {
//         context.alertBox("success", "File deleted successfully");

//         // Update local file states
//         if (fileType === "admin") {
//           setAdminFiles(prev => prev.filter(f => f.fileUrl !== fileUrl));
//         } else {
//           setUserFiles(prev => prev.filter(f => f.fileUrl !== fileUrl));
//         }

//         // Update ordersData
//         setOrdersData(prev =>
//           prev.map(order =>
//             order._id === selectedOrderForFiles._id
//               ? {
//                 ...order,
//                 [`${fileType}Files`]: order[`${fileType}Files`].filter(f => f.fileUrl !== fileUrl),
//               }
//               : order
//           )
//         );

//         // Optionally re-fetch for consistency
//         fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
//           if (res?.error === false) {
//             setOrdersData(res?.data);
//           }
//         });
//       } else {
//         context.alertBox("error", result.message || "File deletion failed");
//       }
//     } catch (error) {
//       context.alertBox("error", "Failed to delete file: " + error.message);
//     } finally {
//       context.setProgress(100);
//     }
//   };


//   return (
//     <div className="card my-2 md:mt-4 shadow-md sm:rounded-lg bg-white">
//       <div className="grid grid-cols-1 lg:grid-cols-2 px-5 py-5 flex-col sm:flex-row">
//         <h2 className="text-[18px] font-[600] text-left mb-2 lg:mb-0">Recent Orders</h2>
//         <div className="ml-auto w-full">
//           <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} setPageOrder={setPageOrder} />
//         </div>
//       </div>

//       <div className="relative overflow-x-auto">
//         <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//           <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//             <tr>
//               <th scope="col" className="px-6 py-3">
//                 &nbsp;
//               </th>
//               <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                 Order Id
//               </th>
//               <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                 Payment Id
//               </th>
//               <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                 Name
//               </th>
//               <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                 Phone Number
//               </th>
//               <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                 Address
//               </th>
//               <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                 Pincode
//               </th>
//               <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                 Total Amount
//               </th>
//               <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                 Email
//               </th>
//               <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                 User Id
//               </th>
//               <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                 Order Status
//               </th>
//               <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                 Date
//               </th>
//               <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                 Files
//               </th>
//               <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {ordersData?.length !== 0 &&
//               ordersData?.map((order, index) => {
//                 return (
//                   <React.Fragment key={order._id}>
//                     <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
//                       <td className="px-6 py-4 font-[500]">
//                         <Button
//                           className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]"
//                           onClick={() => isShowOrderdProduct(index)}
//                         >
//                           {isOpenOrderdProduct === index ? (
//                             <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.7)]" />
//                           ) : (
//                             <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.7)]" />
//                           )}
//                         </Button>
//                       </td>
//                       <td className="px-6 py-4 font-[500]">
//                         <span className="text-primary">{order?._id}</span>
//                       </td>

//                       <td className="px-6 py-4 font-[500]">
//                         <span className="text-primary whitespace-nowrap text-[13px]">
//                           {order?.paymentId ? order?.paymentId : "CASH ON DELIVERY"}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4 font-[500] whitespace-nowrap">{order?.userId?.name}</td>

//                       <td className="px-6 py-4 font-[500]">{order?.delivery_address?.mobile}</td>

//                       <td className="px-6 py-4 font-[500]">
//                         <span className="inline-block text-[13px] font-[500] p-1 bg-[#f1f1f1] rounded-md">
//                           {order?.delivery_address?.addressType}
//                         </span>
//                         <span className="block w-[400px]">
//                           {order?.delivery_address?.address_line1 +
//                             " " +
//                             order?.delivery_address?.city +
//                             " " +
//                             order?.delivery_address?.landmark +
//                             " " +
//                             order?.delivery_address?.state +
//                             " " +
//                             order?.delivery_address?.country}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4 font-[500]">{order?.delivery_address?.pincode}</td>

//                       <td className="px-6 py-4 font-[500]">{order?.totalAmt}</td>

//                       <td className="px-6 py-4 font-[500]">{order?.userId?.email}</td>

//                       <td className="px-6 py-4 font-[500]">
//                         <span className="text-primary">{order?.userId?._id}</span>
//                       </td>

//                       <td className="px-6 py-4 font-[500]">
//                         <Select
//                           labelId="demo-simple-select-helper-label"
//                           id="demo-simple-select-helper"
//                           value={order?.order_status !== null ? order?.order_status : orderStatus}
//                           label="Status"
//                           size="small"
//                           style={{ zoom: "80%" }}
//                           className="w-full"
//                           onChange={(e) => handleChange(e, order?._id)}
//                         >
//                           <MenuItem value={"pending"}>Pending</MenuItem>
//                           <MenuItem value={"confirm"}>Confirm</MenuItem>
//                           <MenuItem value={"delivered"}>Delivered</MenuItem>
//                         </Select>
//                       </td>
//                       <td className="px-6 py-4 font-[500] whitespace-nowrap">{order?.createdAt?.split("T")[0]}</td>

//                       {/* Files column - moved from expandable section */}
//                       <td className="px-6 py-4 font-[500]">
//                         <Button
//                           variant="outlined"
//                           size="small"
//                           onClick={() => openFileModal(order)}
//                         >
//                           {(order.adminFiles?.length > 0 || order.userFiles?.length > 0) ? "Edit Files" : "Upload Files"}
//                         </Button>
//                       </td>

//                       <td className="px-6 py-4 font-[500] whitespace-nowrap">
//                         <Button onClick={() => deleteOrder(order?._id)} variant="outlined" color="error" size="small">
//                           Delete
//                         </Button>
//                       </td>
//                     </tr>

//                     {isOpenOrderdProduct === index && (
//                       <tr>
//                         <td className="pl-20" colSpan="14">
//                           {/* Products Table */}
//                           <div className="relative overflow-x-auto mb-5">
//                             <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//                               <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//                                 <tr>
//                                   <th scope="col" className="px-6 py-3">
//                                     Sr No
//                                   </th>
//                                   <th scope="col" className="px-6 py-3">
//                                     Product Id
//                                   </th>
//                                   <th scope="col" className="px-6 py-3">
//                                     Product Name
//                                   </th>
//                                   <th scope="col" className="px-6 py-3">
//                                     Quantity
//                                   </th>
//                                   <th scope="col" className="px-6 py-3">
//                                     Price
//                                   </th>
//                                   <th scope="col" className="px-6 py-3">
//                                     Image
//                                   </th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {order?.products?.map((product, prodIndex) => (
//                                   <tr
//                                     key={product?._id}
//                                     className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
//                                   >
//                                     <td className="px-6 py-4 font-[500]">{prodIndex + 1}</td>
//                                     <td className="px-6 py-4 font-[500]">{product?._id}</td>
//                                     <td className="px-6 py-4 font-[500]">{product?.name}</td>
//                                     <td className="px-6 py-4 font-[500]">{product?.quantity}</td>
//                                     <td className="px-6 py-4 font-[500]">{product?.price}</td>
//                                     <td className="px-6 py-4 font-[500]">
//                                       <img src={product?.image[0]} alt="" width={50} />
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 );
//               })}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-center my-4">
//         <Pagination
//           count={Math.ceil(totalOrdersData?.data?.length / 5)}
//           page={pageOrder}
//           onChange={(event, value) => setPageOrder(value)}
//         />
//       </div>

//       {/* File Management Modal - Similar to user code */}
//       <Dialog open={fileModalOpen} onClose={closeFileModal} fullWidth maxWidth="md">
//         <DialogTitle>Upload / Edit Files for Order: {selectedOrderForFiles?._id}</DialogTitle>
//         <DialogContent dividers>
//           {/* Show user files (read-only for admin) */}
//           <div>
//             <h4>Client Files (View Only):</h4>
//             {userFiles.length === 0 && <p>No client files uploaded.</p>}
//             <ul>
//               {userFiles.map((file, i) => (
//                 <li key={i}>
//                   <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">
//                     {file.fileName || "File " + (i + 1)}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <hr className="my-4" />

//           {/* Show admin files with delete option */}
//           <div>
//             <h4>Admin Files:</h4>
//             {adminFiles.length === 0 && <p>No admin files uploaded yet.</p>}
//             <ul>
//               {adminFiles.map((file, i) => (
//                 <li key={i} className="flex items-center gap-2">
//                   <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline flex-grow">
//                     {file.fileName || "File " + (i + 1)}
//                   </a>
//                   <IconButton size="small" onClick={() => deleteFile(file.fileUrl, "admin")} color="error" title="Delete File">
//                     <FaTrash />
//                   </IconButton>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <hr className="my-4" />

//           {/* File input for new uploads */}
//           <div>
//             <input type="file" multiple onChange={onFilesSelected} />
//             {filesToUpload.length > 0 && (
//               <div>
//                 <p>Files to upload:</p>
//                 <ul>
//                   {filesToUpload.map((file, i) => <li key={i}>{file.name}</li>)}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={closeFileModal} disabled={loading}>Cancel</Button>
//           <Button onClick={uploadFiles} disabled={loading || filesToUpload.length === 0} variant="contained" color="primary">
//             {loading ? "Uploading..." : "Upload"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default Orders;

//Admin side code
import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Divider,
  Tab,
  Tabs
} from "@mui/material";
import {
  FaAngleDown,
  FaAngleUp,
  FaTrash,
  FaDownload,
  FaFolder,
  FaFile,
  FaPlus,
  FaEye
} from "react-icons/fa6";
import Pagination from "@mui/material/Pagination";
import Badge from "../../Components/Badge";
import SearchBox from "../../Components/SearchBox";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App.jsx";
import { FiDownload } from "react-icons/fi";
const apiUrl = import.meta.env.VITE_API_URL;

const Orders = () => {
  const context = useContext(MyContext);

  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [ordersData, setOrdersData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pageOrder, setPageOrder] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalOrdersData, setTotalOrdersData] = useState([]);

  // Enhanced file management states
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [selectedOrderForFiles, setSelectedOrderForFiles] = useState(null);
  const [userFiles, setUserFiles] = useState([]);
  const [adminFiles, setAdminFiles] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [loading, setLoading] = useState(false);

  // New states for enhanced functionality
  const [selectedFolder, setSelectedFolder] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 for client files, 1 for admin files
  const [availableFolders, setAvailableFolders] = useState([]);

  const isShowOrderdProduct = (index) => {
    if (isOpenOrderdProduct === index) {
      setIsOpenOrderdProduct(null);
    } else {
      setIsOpenOrderdProduct(index);
    }
  };

  const handleChange = (event, id) => {
    setOrderStatus(event.target.value);

    const obj = {
      id: id,
      order_status: event.target.value,
    };

    editData(`/api/order/order-status/${id}`, obj).then((res) => {
      if (res?.data?.error === false) {
        context.alertBox("success", res?.data?.message);
      }
    });
  };

  useEffect(() => {
    context?.setProgress(50);
    fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
      if (res?.error === false) {
        setOrdersData(res?.data);
        setOrders(res);
        context?.setProgress(100);
      }
    });
    fetchDataFromApi(`/api/order/order-list`).then((res) => {
      if (res?.error === false) {
        setTotalOrdersData(res);
      }
    });
  }, [orderStatus, pageOrder]);

  useEffect(() => {
    if (searchQuery !== "") {
      const filteredOrders = totalOrdersData?.data?.filter(
        (order) =>
          order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order?.userId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order?.userId?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order?.createdAt.includes(searchQuery)
      );
      setOrdersData(filteredOrders);
    } else {
      fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
        if (res?.error === false) {
          setOrders(res);
          setOrdersData(res?.data);
        }
      });
    }
  }, [searchQuery]);

  const deleteOrder = (id) => {
    if (context?.userData?.role === "ADMIN") {
      deleteData(`/api/order/deleteOrder/${id}`).then((res) => {
        fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
          if (res?.error === false) {
            setOrdersData(res?.data);
            context?.setProgress(100);
            context.alertBox("success", "Order deleted successfully!");
          }
        });

        fetchDataFromApi(`/api/order/order-list`).then((res) => {
          if (res?.error === false) {
            setTotalOrdersData(res);
          }
        });
      });
    } else {
      context.alertBox("error", "Only admin can delete data");
    }
  };

  // Enhanced file management functions
  const openFileModal = (order) => {
    setSelectedOrderForFiles(order);
    setUserFiles(order.userFiles || []);
    setAdminFiles(order.adminFiles || []);
    setFilesToUpload([]);

    // Extract available folders from existing files
    const allFiles = [...(order.userFiles || []), ...(order.adminFiles || [])];
    const folders = [...new Set(allFiles.map(file => file.folderName).filter(Boolean))];
    setAvailableFolders(folders);

    setFileModalOpen(true);
  };

  const closeFileModal = () => {
    setFileModalOpen(false);
    setSelectedOrderForFiles(null);
    setUserFiles([]);
    setAdminFiles([]);
    setFilesToUpload([]);
    setSelectedFolder("");
    setNewFolderName("");
    setShowNewFolderInput(false);
    setAvailableFolders([]);
    setActiveTab(0);
  };

  const onFilesSelected = (e) => {
    setFilesToUpload(Array.from(e.target.files));
  };

  const createNewFolder = () => {
    if (newFolderName.trim()) {
      setAvailableFolders(prev => [...prev, newFolderName.trim()]);
      setSelectedFolder(newFolderName.trim());
      setNewFolderName("");
      setShowNewFolderInput(false);
    }
  };

  const uploadFiles = async () => {
    if (!selectedOrderForFiles || filesToUpload.length === 0) return;

    if (!selectedFolder && !showNewFolderInput) {
      context.alertBox("error", "Please select a folder or create a new one");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    filesToUpload.forEach(file => formData.append("files", file));
    formData.append("orderId", selectedOrderForFiles._id);
    formData.append("uploaderType", "admin");
    formData.append("folderName", selectedFolder);

    try {
      const res = await fetch(`${apiUrl}/api/order/upload-order-files`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        context.alertBox("success", "Files uploaded successfully");
        setAdminFiles(data.order.adminFiles || []);

        // Update available folders
        const allFiles = [...(data.order.userFiles || []), ...(data.order.adminFiles || [])];
        const folders = [...new Set(allFiles.map(file => file.folderName).filter(Boolean))];
        setAvailableFolders(folders);

        setOrdersData(prevOrders =>
          prevOrders.map(o => o._id === selectedOrderForFiles._id ? data.order : o)
        );
        setFilesToUpload([]);
        setSelectedFolder("");

        // Refetch for consistency
        fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
          if (res?.error === false) {
            setOrdersData(res?.data);
          }
        });
      } else {
        context.alertBox("error", data?.message || "Upload failed");
      }
    } catch (error) {
      context.alertBox("error", "Upload failed: " + error.message);
    }
    setLoading(false);
  };

  const deleteFile = async (fileUrl, fileType) => {
    if (context?.userData?.role !== "ADMIN") {
      context.alertBox("error", "Only admin can delete files");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      context.setProgress(50);
      const res = await fetch(`${apiUrl}/api/order/delete-file`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl,
          fileType,
          orderId: selectedOrderForFiles?._id,
        }),
      });

      const result = await res.json();

      if (result.success) {
        context.alertBox("success", "File deleted successfully");

        if (fileType === "admin") {
          setAdminFiles(prev => prev.filter(f => f.fileUrl !== fileUrl));
        } else {
          setUserFiles(prev => prev.filter(f => f.fileUrl !== fileUrl));
        }

        setOrdersData(prev =>
          prev.map(order =>
            order._id === selectedOrderForFiles._id
              ? {
                ...order,
                [`${fileType}Files`]: order[`${fileType}Files`].filter(f => f.fileUrl !== fileUrl),
              }
              : order
          )
        );

        fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
          if (res?.error === false) {
            setOrdersData(res?.data);
          }
        });
      } else {
        context.alertBox("error", result.message || "File deletion failed");
      }
    } catch (error) {
      context.alertBox("error", "Failed to delete file: " + error.message);
    } finally {
      context.setProgress(100);
    }
  };

  const downloadAllProductFiles = async (productId) => {
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

  const downloadAllFiles = async (fileType) => {
    try {
      const files = fileType === 'user' ? userFiles : adminFiles;
      if (files.length === 0) {
        context.alertBox("warning", `No ${fileType} files to download`);
        return;
      }

      context.setProgress(50);
      const response = await fetch(`${apiUrl}/api/order/download-all-files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrderForFiles._id,
          fileType: fileType
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileType}_files_${selectedOrderForFiles._id}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        context.alertBox("success", `${fileType} files downloaded successfully`);
      } else {
        context.alertBox("error", "Failed to download files");
      }
    } catch (error) {
      context.alertBox("error", "Download failed: " + error.message);
    } finally {
      context.setProgress(100);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupFilesByFolder = (files) => {
    return files.reduce((acc, file) => {
      const folder = file.folderName || 'Uncategorized';
      if (!acc[folder]) {
        acc[folder] = [];
      }
      acc[folder].push(file);
      return acc;
    }, {});
  };

  const renderFileTable = (files, fileType) => {
    const groupedFiles = groupFilesByFolder(files);

    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            {fileType === 'user' ? 'Client Files' : 'Admin Files'} ({files.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<FaDownload />}
            onClick={() => downloadAllFiles(fileType)}
            disabled={files.length === 0}
            size="small"
          >
            Download All
          </Button>
        </Box>

        {Object.keys(groupedFiles).map(folderName => (
          <Box key={folderName} mb={3}>
            <Box display="flex" alignItems="center" mb={1}>
              <FaFolder style={{ marginRight: 8, color: '#1976d2' }} />
              <Typography variant="subtitle1" fontWeight="bold">
                {folderName}
              </Typography>
              <Chip
                label={groupedFiles[folderName].length}
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell>File</TableCell>
                    <TableCell>Uploaded At</TableCell>
                    <TableCell>Uploaded By</TableCell>
                    <TableCell>Version</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedFiles[folderName].map((file, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <FaFile style={{ marginRight: 8, color: '#666' }} />
                          {file.fileName || `File ${index + 1}`}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<FaEye />}
                          onClick={() => window.open(file.fileUrl, '_blank')}
                        >
                          View
                        </Button>
                      </TableCell>
                      <TableCell>
                        {file.uploadedAt ? formatDate(file.uploadedAt) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={file.uploadedBy || 'Unknown'}
                          size="small"
                          color={file.uploadedBy === 'admin' ? 'primary' : 'secondary'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`v${file.fileVersion || 1}`}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            onClick={() => window.open(file.fileUrl, '_blank')}
                          >
                            <FaDownload />
                          </IconButton>
                        </Tooltip>
                        {fileType === 'admin' && (
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => deleteFile(file.fileUrl, fileType)}
                            >
                              <FaTrash />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}

        {files.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography color="textSecondary">
              No {fileType} files uploaded yet
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <div className="card my-2 md:mt-4 shadow-md sm:rounded-lg bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 px-5 py-5 flex-col sm:flex-row">
        <h2 className="text-[18px] font-[600] text-left mb-2 lg:mb-0">Recent Orders</h2>
        <div className="ml-auto w-full">
          <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} setPageOrder={setPageOrder} />
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">&nbsp;</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Order Id</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Payment Id</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Name</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Phone Number</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Address</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Pincode</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Total Amount</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Email</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">User Id</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Order Status</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Date</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Files</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {ordersData?.length !== 0 &&
              ordersData?.map((order, index) => {
                return (
                  <React.Fragment key={order._id}>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-4 font-[500]">
                        <Button
                          className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]"
                          onClick={() => isShowOrderdProduct(index)}
                        >
                          {isOpenOrderdProduct === index ? (
                            <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                          ) : (
                            <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                          )}
                        </Button>
                      </td>
                      <td className="px-6 py-4 font-[500]">
                        <span className="text-primary">{order?._id}</span>
                      </td>
                      <td className="px-6 py-4 font-[500]">
                        <span className="text-primary whitespace-nowrap text-[13px]">
                          {order?.paymentId ? order?.paymentId : "CASH ON DELIVERY"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-[500] whitespace-nowrap">{order?.userId?.name}</td>
                      <td className="px-6 py-4 font-[500]">{order?.delivery_address?.mobile}</td>
                      <td className="px-6 py-4 font-[500]">
                        <span className="inline-block text-[13px] font-[500] p-1 bg-[#f1f1f1] rounded-md">
                          {order?.delivery_address?.addressType}
                        </span>
                        <span className="block w-[400px]">
                          {order?.delivery_address?.address_line1 +
                            " " +
                            order?.delivery_address?.city +
                            " " +
                            order?.delivery_address?.landmark +
                            " " +
                            order?.delivery_address?.state +
                            " " +
                            order?.delivery_address?.country}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-[500]">{order?.delivery_address?.pincode}</td>
                      <td className="px-6 py-4 font-[500]">{order?.totalAmt}</td>
                      <td className="px-6 py-4 font-[500]">{order?.userId?.email}</td>
                      <td className="px-6 py-4 font-[500]">
                        <span className="text-primary">{order?.userId?._id}</span>
                      </td>
                      <td className="px-6 py-4 font-[500]">
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          value={order?.order_status !== null ? order?.order_status : orderStatus}
                          label="Status"
                          size="small"
                          style={{ zoom: "80%" }}
                          className="w-full"
                          onChange={(e) => handleChange(e, order?._id)}
                        >
                          <MenuItem value={"pending"}>Pending</MenuItem>
                          <MenuItem value={"confirm"}>Confirm</MenuItem>
                          <MenuItem value={"delivered"}>Delivered</MenuItem>
                        </Select>
                      </td>
                      <td className="px-6 py-4 font-[500] whitespace-nowrap">{order?.createdAt?.split("T")[0]}</td>
                      <td className="px-6 py-4 font-[500]">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => openFileModal(order)}
                          startIcon={<FaFile />}
                        >
                          Files ({(order.adminFiles?.length || 0) + (order.userFiles?.length || 0)})
                        </Button>
                      </td>
                      <td className="px-6 py-4 font-[500] whitespace-nowrap">
                        <Button onClick={() => deleteOrder(order?._id)} variant="outlined" color="error" size="small">
                          Delete
                        </Button>
                      </td>
                    </tr>

                    {isOpenOrderdProduct === index && (
                      <tr>
                        <td className="pl-20" colSpan="14">
                          <div className="relative overflow-x-auto mb-5">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                  <th scope="col" className="px-6 py-3">Sr No</th>
                                  <th scope="col" className="px-6 py-3">Product Id</th>
                                  <th scope="col" className="px-6 py-3">Product Name</th>
                                  <th scope="col" className="px-6 py-3">Quantity</th>
                                  <th scope="col" className="px-6 py-3">Price</th>
                                  <th scope="col" className="px-6 py-3">Image</th>
                                  <th scope="col" className="px-6 py-3">Files</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order?.products?.map((product, prodIndex) => (
                                  <tr
                                    key={product?._id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                  >
                                    <td className="px-6 py-4 font-[500]">{prodIndex + 1}</td>
                                    <td className="px-6 py-4 font-[500]">{product?.productId}</td>
                                    <td className="px-6 py-4 font-[500]">{product?.productTitle}</td>
                                    <td className="px-6 py-4 font-[500]">{product?.quantity}</td>
                                    <td className="px-6 py-4 font-[500]">{product?.price}</td>
                                    <td className="px-6 py-4 font-[500]">
                                      <img src={product?.image} alt="" width={50} />
                                    </td>
                                    <td className="px-6 py-4 font-[500]">
                                      <Button
                                        className={`!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#c2c2c2] !min-w-[35px]`}
                                        onClick={() => downloadAllProductFiles(product?.productId)}
                                        title="Download all files"
                                        // disabled={!product?.files || product?.files.length === 0}
                                      >
                                        <FiDownload className="text-[rgba(255,255,255,0.7)] text-[18px]" />
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center my-4">
        <Pagination
          count={Math.ceil(totalOrdersData?.data?.length / 5)}
          page={pageOrder}
          onChange={(event, value) => setPageOrder(value)}
        />
      </div>

      {/* Enhanced File Management Modal */}
      <Dialog open={fileModalOpen} onClose={closeFileModal} fullWidth maxWidth="lg">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              File Management - Order: {selectedOrderForFiles?._id}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box mb={3}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label={`Client Files (${userFiles.length})`} />
              <Tab label={`Admin Files (${adminFiles.length})`} />
            </Tabs>
          </Box>

          {activeTab === 0 && renderFileTable(userFiles, 'user')}
          {activeTab === 1 && renderFileTable(adminFiles, 'admin')}

          <Divider sx={{ my: 3 }} />

          {/* File Upload Section */}
          <Box>
            <Typography variant="h6" mb={2}>Upload New Files</Typography>

            <Box mb={2}>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Select Folder</InputLabel>
                <Select
                  value={selectedFolder}
                  label="Select Folder"
                  onChange={(e) => setSelectedFolder(e.target.value)}
                >
                  {availableFolders.map(folder => (
                    <MenuItem key={folder} value={folder}>
                      <Box display="flex" alignItems="center">
                        <FaFolder style={{ marginRight: 8 }} />
                        {folder}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                startIcon={<FaPlus />}
                onClick={() => setShowNewFolderInput(true)}
                variant="outlined"
                size="small"
              >
                Create New Folder
              </Button>
            </Box>

            {showNewFolderInput && (
              <Box display="flex" gap={1} mb={2}>
                <TextField
                  size="small"
                  placeholder="Enter folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  fullWidth
                />
                <Button onClick={createNewFolder} variant="contained" size="small">
                  Create
                </Button>
                <Button onClick={() => setShowNewFolderInput(false)} size="small">
                  Cancel
                </Button>
              </Box>
            )}

            <input
              type="file"
              multiple
              onChange={onFilesSelected}
              style={{ marginBottom: 16 }}
            />

            {filesToUpload.length > 0 && (
              <Box>
                <Typography variant="subtitle2" mb={1}>Files to upload:</Typography>
                <Box>
                  {filesToUpload.map((file, i) => (
                    <Chip
                      key={i}
                      label={file.name}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeFileModal} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={uploadFiles}
            disabled={loading || filesToUpload.length === 0 || !selectedFolder}
            variant="contained"
            color="primary"
          >
            {loading ? "Uploading..." : "Upload Files"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Orders;