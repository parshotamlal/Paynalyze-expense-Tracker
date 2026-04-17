// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { BASE_URL } from "./endpoints";

// const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" });

// export const apiSlice = createApi({
//   baseQuery,
//   endpoints: () => ({}),
// });


// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { BASE_URL } from "./endpoints";

// const baseQuery = fetchBaseQuery({
//   baseUrl: BASE_URL,
//   credentials: "include",

//   prepareHeaders: (headers) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       headers.set("Authorization", `Bearer ${token}`);
//     }

//     return headers;
//   },
// });

// export const apiSlice = createApi({
//   baseQuery,
//   endpoints: () => ({}),
// });

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./endpoints";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include", // ✅ only this needed
});

export const apiSlice = createApi({
  baseQuery,
  endpoints: () => ({}),
});