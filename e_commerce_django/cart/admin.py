from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ['total_price']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_items', 'total_price', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    inlines = [CartItemInline]
    readonly_fields = ['total_items', 'total_price']


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['cart', 'product', 'quantity', 'total_price', 'created_at']
    list_filter = ['created_at']
    search_fields = ['cart__user__email', 'product__name']
    readonly_fields = ['total_price']
