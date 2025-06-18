import django_filters
from .models import Product, Category


class ProductFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    category = django_filters.ModelChoiceFilter(
        queryset=Category.objects.all())
    min_price = django_filters.NumberFilter(
        field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(
        field_name='price', lookup_expr='lte')
    is_featured = django_filters.BooleanFilter()
    in_stock = django_filters.BooleanFilter(method='filter_in_stock')

    class Meta:
        model = Product
        fields = ['name', 'category', 'min_price',
                  'max_price', 'is_featured', 'in_stock']

    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(quantity__gt=0)
        return queryset.filter(quantity=0)
