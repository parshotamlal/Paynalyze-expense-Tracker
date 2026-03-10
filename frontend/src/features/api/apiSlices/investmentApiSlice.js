import { apiSlice } from "../apiSlice";
import { INCOMES_URL } from "../endpoints";

export const investmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllInvestment: builder.query({
      query: () => ({
        url: `${INCOMES_URL}/all`,
        method: "GET",
      }),
    }),
    addInvestment: builder.mutation({
      query: (data) => ({
        url: `${INCOMES_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateInvestment: builder.mutation({
      query: ({ _id, data }) => ({
        url: `${INCOMES_URL}/${_id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteInvestment: builder.mutation({
      query: (_id) => ({
        url: `${INCOMES_URL}/${_id}`,
        method: "DELETE",
      }),
    }),
    getInvestment: builder.query({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: `${INCOMES_URL}?page=${page}&pageSize=${pageSize}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllInvestmentQuery,
  useUpdateInvestmentMutation,
  useDeleteInvestmentMutation,
  useGetInvestmentQuery,
  useAddInvestmentMutation,
} = investmentApiSlice;
