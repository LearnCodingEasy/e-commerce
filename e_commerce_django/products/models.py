from django.db import models
from django.core.validators import MinValueValidator
from PIL import Image
import os


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='products')
    quantity = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    sku = models.CharField(max_length=100, unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Generate SKU if not provided
        if not self.sku:
            self.sku = f"PRD-{self.id or ''}-{self.name[:10].upper().replace(' ', '')}"

        super().save(*args, **kwargs)

        # Resize image if it exists
        if self.image:
            self.resize_image()

    def resize_image(self):
        """Resize uploaded images to optimize storage"""
        if self.image:
            img_path = self.image.path
            if os.path.exists(img_path):
                with Image.open(img_path) as img:
                    # Convert to RGB if necessary
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")

                    # Resize if larger than 800x800
                    if img.height > 800 or img.width > 800:
                        img.thumbnail((800, 800), Image.Resampling.LANCZOS)
                        img.save(img_path, optimize=True, quality=85)

    @property
    def is_in_stock(self):
        return self.quantity > 0

    @property
    def stock_status(self):
        if self.quantity == 0:
            return "Out of Stock"
        elif self.quantity < 10:
            return "Low Stock"
        else:
            return "In Stock"
