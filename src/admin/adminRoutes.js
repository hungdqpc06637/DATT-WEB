import AdminLayout from "@/admin/AdminLayout.vue";
import Dashboard from "@/admin/views/Dashboard.vue";
import Products from "@/admin/views/Products.vue";
import Orders from "@/admin/views/Orders.vue";
import Users from "@/admin/views/Users.vue";

export default [
  {
    path: "/admin",
    component: AdminLayout,  // Layout riêng cho admin
    children: [
      { path: "dashboard", component: Dashboard },
      { path: "products", component: Products },
      { path: "orders", component: Orders },
      { path: "users", component: Users }
    ],
    meta: { requiresAdmin: true }
  }
];
