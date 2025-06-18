from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.ProductListCreateView.as_view(),
         name='product-list-create'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(),
         name='product-detail'),
    path('products/featured/', views.featured_products, name='featured-products'),
    path('products/search/', views.product_search, name='product-search'),
    path('categories/', views.CategoryListCreateView.as_view(),
         name='category-list-create'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(),
         name='category-detail'),
]
