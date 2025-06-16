<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Manage your e-commerce platform</p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card class="text-center">
        <template #content>
          <div class="space-y-2">
            <i class="pi pi-shopping-cart text-3xl text-primary-600"></i>
            <h3 class="text-2xl font-bold">{{ stats.totalOrders }}</h3>
            <p class="text-gray-600 dark:text-gray-400">Total Orders</p>
          </div>
        </template>
      </Card>

      <Card class="text-center">
        <template #content>
          <div class="space-y-2">
            <i class="pi pi-box text-3xl text-green-600"></i>
            <h3 class="text-2xl font-bold">{{ stats.totalProducts }}</h3>
            <p class="text-gray-600 dark:text-gray-400">Products</p>
          </div>
        </template>
      </Card>

      <Card class="text-center">
        <template #content>
          <div class="space-y-2">
            <i class="pi pi-users text-3xl text-blue-600"></i>
            <h3 class="text-2xl font-bold">{{ stats.totalUsers }}</h3>
            <p class="text-gray-600 dark:text-gray-400">Customers</p>
          </div>
        </template>
      </Card>

      <Card class="text-center">
        <template #content>
          <div class="space-y-2">
            <i class="pi pi-dollar text-3xl text-yellow-600"></i>
            <h3 class="text-2xl font-bold">${{ stats.totalRevenue.toFixed(2) }}</h3>
            <p class="text-gray-600 dark:text-gray-400">Revenue</p>
          </div>
        </template>
      </Card>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <router-link to="/admin/products">
        <Button label="Manage Products" icon="pi pi-box" class="w-full" />
      </router-link>
      <router-link to="/admin/orders">
        <Button label="View Orders" icon="pi pi-shopping-cart" class="w-full" outlined />
      </router-link>
      <router-link to="/admin/categories">
        <Button label="Categories" icon="pi pi-tags" class="w-full" outlined />
      </router-link>
      <Button label="Reports" icon="pi pi-chart-bar" class="w-full" outlined disabled />
    </div>

    <!-- Recent Orders -->
    <Card>
      <template #title>
        <h3 class="text-xl font-semibold">Recent Orders</h3>
      </template>

      <template #content>
        <DataTable :value="recentOrders" :loading="loading" responsiveLayout="scroll">
          <Column field="_id" header="Order ID" class="min-w-32">
            <template #body="{ data }">
              <span class="font-mono text-sm">{{ data._id.slice(-8) }}</span>
            </template>
          </Column>
          <Column field="user.name" header="Customer" />
          <Column field="totalAmount" header="Amount">
            <template #body="{ data }"> ${{ data.totalAmount.toFixed(2) }} </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <Badge :value="data.status" :severity="getStatusSeverity(data.status)" />
            </template>
          </Column>
          <Column field="createdAt" header="Date">
            <template #body="{ data }">
              {{ formatDate(data.createdAt) }}
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import orderService from '../../services/orderService'

const stats = ref({
  totalOrders: 0,
  totalProducts: 0,
  totalUsers: 0,
  totalRevenue: 0,
})

const recentOrders = ref([])
const loading = ref(true)

const fetchDashboardData = async () => {
  try {
    // Fetch recent orders
    const ordersResponse = await orderService.getAllOrders()
    const orders = ordersResponse.orders || ordersResponse

    recentOrders.value = orders.slice(0, 10)

    // Calculate stats
    stats.value.totalOrders = orders.length
    stats.value.totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)

    // Mock data for products and users (you would fetch these from actual endpoints)
    stats.value.totalProducts = 150
    stats.value.totalUsers = 1250
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const getStatusSeverity = (status) => {
  const severityMap = {
    pending: 'warning',
    processing: 'info',
    shipped: 'success',
    delivered: 'success',
    cancelled: 'danger',
  }
  return severityMap[status] || 'info'
}

onMounted(() => {
  fetchDashboardData()
})
</script>
