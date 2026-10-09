import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../config/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/api`,
  credentials: "include",
});

const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const url = typeof args === "string" ? args : args.url;

  if (result.error?.status === 401 && !url.startsWith("auth/")) {
    api.dispatch(apiSlice.util.resetApiState());
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Category", "Product", "Bill"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "auth/me",
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(apiSlice.util.upsertQueryData("getMe", undefined, data));
        } catch {
          // The login form reports the failure.
        }
      },
    }),
    register: builder.mutation({
      query: (values) => ({ url: "auth/register", method: "POST", body: values }),
    }),
    logout: builder.mutation({
      query: () => ({ url: "auth/logout", method: "POST" }),
    }),

    getCategories: builder.query({
      query: () => "categories",
      providesTags: ["Category"],
    }),
    addCategory: builder.mutation({
      query: (values) => ({ url: "categories", method: "POST", body: values }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...values }) => ({
        url: `categories/${id}`,
        method: "PUT",
        body: values,
      }),
      invalidatesTags: ["Category", "Product"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({ url: `categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["Category"],
    }),

    getProducts: builder.query({
      query: () => "products",
      providesTags: ["Product"],
    }),
    addProduct: builder.mutation({
      query: (values) => ({ url: "products", method: "POST", body: values }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...values }) => ({
        url: `products/${id}`,
        method: "PUT",
        body: values,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Product"],
    }),

    getBills: builder.query({
      query: () => "bills",
      providesTags: ["Bill"],
    }),
    addBill: builder.mutation({
      query: (values) => ({ url: "bills", method: "POST", body: values }),
      invalidatesTags: ["Bill"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetBillsQuery,
  useAddBillMutation,
} = apiSlice;
