export const backendUrl = (path: string) => {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "";
  return `${base}${path}`;
};
