<template>
    <nav
        class="navbar navbar-expand text-white shadow-sm px-4 d-flex justify-content-between align-items-center w-100">
        <!-- Nút Admin nằm sát góc phải -->
        <div class="dropdown ms-auto">
            <button class="btn btn-outline-light dropdown-toggle d-flex align-items-center" type="button"
                data-bs-toggle="dropdown">
                <i class="bi bi-person-circle me-2"></i> Admin
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li>
                    <button class="dropdown-item" @click="logout">
                        <i class="bi bi-box-arrow-right me-2"></i> Đăng xuất
                    </button>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const logout = () => {
    store.dispatch('logout');
    router.push('/login');
};
</script>