import AdminLayout from "@/admin/AdminLayout.vue";

export default [
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      { path: "", component: () => import("@/admin/views/AdminWelcome.vue") },
      { path: "dashboard", component: () => import("@/admin/views/Dashboard.vue") },
      { path: "products", component: () => import("@/admin/views/Products.vue") },
      { path: "orders", component: () => import("@/admin/views/Orders.vue") },
      { path: "users", component: () => import("@/admin/views/Users.vue") }
    ],
    meta: { requiresAdmin: true }
  }
];

