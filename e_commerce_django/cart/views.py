from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from products.models import Product
from .serializers import CartSerializer, AddToCartSerializer, UpdateCartItemSerializer


class CartView(generics.RetrieveAPIView):
    """Get user's cart"""
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_cart(request):
    """Add item to cart"""
    serializer = AddToCartSerializer(data=request.data)
    if serializer.is_valid():
        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']

        product = get_object_or_404(Product, id=product_id, is_active=True)
        cart, created = Cart.objects.get_or_create(user=request.user)

        # Check if item already exists in cart
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            # Update quantity if item already exists
            new_quantity = cart_item.quantity + quantity
            if new_quantity > product.quantity:
                return Response(
                    {'error': f'Cannot add {quantity} more items. Only {product.quantity - cart_item.quantity} available.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.quantity = new_quantity
            cart_item.save()

        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_cart_item(request, item_id):
    """Update cart item quantity"""
    cart_item = get_object_or_404(
        CartItem, id=item_id, cart__user=request.user)
    serializer = UpdateCartItemSerializer(cart_item, data=request.data)

    if serializer.is_valid():
        quantity = serializer.validated_data['quantity']

        # Check stock availability
        if quantity > cart_item.product.quantity:
            return Response(
                {'error': f'Only {cart_item.product.quantity} items available.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save()
        cart_serializer = CartSerializer(cart_item.cart)
        return Response(cart_serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_from_cart(request, item_id):
    """Remove item from cart"""
    cart_item = get_object_or_404(
        CartItem, id=item_id, cart__user=request.user)
    cart = cart_item.cart
    cart_item.delete()

    cart_serializer = CartSerializer(cart)
    return Response(cart_serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def clear_cart(request):
    """Clear all items from cart"""
    cart = get_object_or_404(Cart, user=request.user)
    cart.items.all().delete()

    cart_serializer = CartSerializer(cart)
    return Response(cart_serializer.data, status=status.HTTP_200_OK)
