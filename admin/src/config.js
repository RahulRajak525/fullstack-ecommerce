// Shared config. These used to be exported from App.jsx, which broke React
// Fast Refresh - a component file must export only components.
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "$";
