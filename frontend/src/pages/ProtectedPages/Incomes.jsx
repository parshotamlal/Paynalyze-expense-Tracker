import React, { useState, useEffect } from "react";
import { object, string, number, date } from "yup";
import { toast } from "react-toastify";
import moment from "moment";
import { parseDate } from "@internationalized/date";
import { NumericFormat } from "react-number-format";
import * as XLSX from "xlsx";

import { useDispatch, useSelector } from "react-redux";
import {
  useGetIncomeQuery,
  useAddIncomeMutation,
} from "../../features/api/apiSlices/incomeApiSlice";
import { updateLoader } from "../../features/loader/loaderSlice";

import { TransactionForm } from "../../components/Forms";
import validateForm from "../../utils/validateForm";
import TransactionTable from "../../components/Tables/TransactionTable";

const Incomes = () => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: parseDate(moment().format("YYYY-MM-DD")),
  });
  const [errors, setErrors] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isRefetchDeleteModal = useSelector(
    (state) => state.deleteTransactionModal.refetch
  );
  const isRefetchViewAndUpdateModal = useSelector(
    (state) => state.transactionViewAndUpdateModal.refetch
  );

  const incomeCategories = [
    { label: "Salary", value: "salary" },
    { label: "Freelance", value: "freelance" },
    { label: "Investments", value: "investments" },
    { label: "Rent", value: "rent" },
    { label: "Youtube", value: "youtube" },
    { label: "Bitcoin", value: "bitcoin" },
    { label: "Other", value: "other" },
  ];

  const validationSchema = object({
    title: string()
      .required("Title is required.")
      .min(5, "Title must be atleast 5 characters long.")
      .max(15, "Title should not be more than 15 characters."),
    amount: number("Amount must be a number")
      .required("Amount is required.")
      .positive("Amount must be positive."),
    description: string()
      .required("Description is required.")
      .min(5, "Description must be atleast 5 characters long.")
      .max(80, "Description should not be more than 80 characters."),
    date: date().required("Date is required."),
    category: string()
      .required("Category is required.")
      .oneOf(
        [
          "salary",
          "freelance",
          "investments",
          "rent",
          "youtube",
          "bitcoin",
          "other",
        ],
        "Invalid category selected."
      ),
  });

  const chipColorMap = {
    salary: "success",
    freelance: "default",
    investments: "success",
    rent: "warning",
    youtube: "danger",
    bitcoin: "warning",
    other: "default",
  };

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    validateForm(e.target.name, e.target.value, validationSchema, setErrors);
  };
  const handleDateChange = (newDate) => {
    setFormData({ ...formData, date: newDate });
  };

  const [addIncome, { isLoading: addIncomeLoading }] = useAddIncomeMutation();
  const {
    data,
    isLoading: getIncomeLoading,
    refetch,
  } = useGetIncomeQuery({
    page: currentPage,
    pageSize: 10,
  });
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      await refetch();
      if (data?.incomes) {
        setTotalIncome(data.totalIncome || 0);
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.error || "Unexpected Internal Server Error!");
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      dispatch(updateLoader(40));

      const formattedDate = moment({
        year: formData.date.year,
        month: formData.date.month - 1,
        day: formData.date.day,
      }).format("YYYY-MM-DD");
      const updatedFormData = {
        ...formData,
        date: formattedDate,
      };

      const res = await addIncome(updatedFormData).unwrap();

      dispatch(updateLoader(60));
      toast.success(res.message || "Income added successfully!");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.error || "Unexpected Internal Server Error!");
    } finally {
      await refetch();
      dispatch(updateLoader(100));
    }
  };

  useEffect(() => {
    fetchData();
    if (isRefetchDeleteModal || isRefetchViewAndUpdateModal) fetchData();
  }, [data, isRefetchDeleteModal, isRefetchViewAndUpdateModal]);

  const hasErrors = Object.values(errors).some((error) => !!error);

    const handleDownloadExcel = () => {
    if (!data?.incomes?.length) {
      toast.info("No income records available to download.");
      return;
    }

    const worksheetData = data.incomes.map((income) => ({
      Title: income.title,
      Amount: income.amount,
      Description: income.description,
      Category: income.category,
      Date: moment(income.date).format("YYYY-MM-DD"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Incomes");
    XLSX.writeFile(
      workbook,
      `incomes-${moment().format("YYYYMMDD-HHmmss")}.xlsx`
    );
  };

  return (
    <>

    {/* <div className=" flex justify-center ml-40">

    <div className=" justify-center flex gap-40" >
    
      <h3 className="text-3xl lg:text-5xl mt-4 text-center">
        Total Income -{" "}
        <span className="text-emerald-400">
          $
          <NumericFormat
            className="ml-1 text-2xl lg:text-4xl"
            value={totalIncome}
            displayType={"text"}
            thousandSeparator={true}
          />
        </span>
      </h3>
      
      <div className="flex justify-end ">
        <button
          type="button"
          onClick={handleDownloadExcel}
          disabled={getIncomeLoading}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded px-4 py-2"
        >
          Download Excel
        </button>
      </div>
      </div>
      </div> */}
      <section className="w-full h-full flex flex-col lg:flex-row px-6 md:px-8 lg:px-12 pt-6 space-y-8 lg:space-y-0 lg:space-x-8">
        
        <TransactionForm
          button="Add Income"
          categories={incomeCategories}
          btnColor="success"
          formData={formData}
          errors={errors}
          hasErrors={hasErrors}
          isLoading={addIncomeLoading}
          handleOnChange={handleOnChange}
          handleDateChange={handleDateChange}
          handleSubmit={handleSubmit}
        />
        
<div className="flex flex-col max-w-[600px] mx-auto w-full">

  {/* Header Section */}
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">

    <h3 className="text-2xl sm:text-3xl lg:text-5xl text-center sm:text-left">
      Total Income -{" "}
      <span className="text-emerald-400 inline-flex items-center">
        $
        <NumericFormat
          className="ml-1 text-xl sm:text-2xl lg:text-4xl"
          value={totalIncome}
          displayType={"text"}
          thousandSeparator={true}
        />
      </span>
    </h3>

    <button
      type="button"
      onClick={handleDownloadExcel}
      disabled={getIncomeLoading}
      className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded px-4 py-2 w-full sm:w-auto"
    >
      Download Excel
    </button>

  </div>

  {/* Table */}
  <div className="mt-6 min-h-[560px] overflow-auto">
    <TransactionTable
      data={data?.incomes}
      name="income"
      chipColorMap={chipColorMap}
      rowsPerPage={10}
      isLoading={getIncomeLoading}
      totalPages={totalPages}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  </div>

</div>
      </section>
    </>
  );
};

export default Incomes;
