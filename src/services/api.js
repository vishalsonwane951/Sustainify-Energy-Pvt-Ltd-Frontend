import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.NEXT_PUBLIC_API_URL ||
    import.meta.env?.VITE_API_URL ||
    "http://localhost:5000",
  // headers: { "Content-Type": "application/json" },
});

function normaliseBlog(raw) {
  return {
    ...raw,
    id:        raw._id        || raw.id,
    published: raw.published  ?? true,
    featured:  raw.featured   ?? false,
    tags:      Array.isArray(raw.tags) ? raw.tags : [],
    date:      raw.dateFormatted || raw.date || "",
  };
}


// GET /api/blogs
export async function fetchPublishedBlogs() {
  const { data } = await api.get("/api/blogs");
  return (data.blogs || data.data || data || []).map(normaliseBlog);
}

// GET /api/blogs/:slug
export async function fetchBlogBySlug(slug) {
  const { data } = await api.get(`/api/blogs/${slug}`);
  return normaliseBlog(data.blog || data);
}


// GET /api/admin/blogs?limit=200
export async function fetchAllBlogs(limit = 200) {
  const { data } = await api.get(`/api/admin/blogs?limit=${limit}`);
  return (data.blogs || data.data || data || []).map(normaliseBlog);
}

// GET /api/admin/blogs/:id
export async function fetchBlogById(id) {
  const { data } = await api.get(`/api/admin/blogs/${id}`);
  return normaliseBlog(data.blog || data);
}

// POST /api/admin/blogs
export async function createBlog(payload) {
  const { data } = await api.post("/api/admin/blogs", payload);
  return normaliseBlog(data.blog || data);
}



export async function updateBlog(id, payload) {
  const { data } = await api.put(`/api/admin/blogs/${id}`, payload);
  return normaliseBlog(data.blog || data);
}


/** PATCH /api/admin/blogs/:id/status */
// export async function togglePublish(blog) {
//   const id = blog.id ?? blog.blogId;

//   if (!id) {
//     throw new Error("Blog ID is missing");
//   }

//   const { data } = await api.patch(`/api/admin/blogs/${id}/status`);

//   return normaliseBlog(data.blog || data);
// }

// PATCH /api/admin/blogs/:id/featured
export async function toggleFeatured(blogId) {
  const { data } = await api.patch(`/api/admin/blogs/${blogId}/featured`);
  return normaliseBlog(data.blog || data);
}

// DELETE /api/admin/blogs/:id
export async function deleteBlog(id) {
  await api.delete(`/api/admin/blogs/${id}`);
}

// PATCH /api/admin/blogs/:id/status
export async function togglePublish(blog) {
  const { data } = await api.patch(`/api/admin/blogs/${blog.id}/status`);
  return normaliseBlog(data.blog || data);
}

export default api;