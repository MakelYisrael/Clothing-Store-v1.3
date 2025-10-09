import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { ProductWithInventory, ProductVariant } from "../contexts/seller-context";
import { toast } from "sonner";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<ProductWithInventory, 'id' | 'totalStock'>) => void;
  product?: ProductWithInventory;
  mode: 'add' | 'edit';
}

const categories = ["Men's Clothing", "Women's Clothing", "Denim", "Footwear", "Accessories"];
const sizes = {
  "Men's Clothing": ["XS", "S", "M", "L", "XL", "XXL"],
  "Women's Clothing": ["XS", "S", "M", "L", "XL"],
  "Denim": ["28", "30", "32", "34", "36", "38"],
  "Footwear": ["6", "7", "8", "9", "10", "11", "12"],
  "Accessories": ["One Size"]
};

export function ProductForm({ isOpen, onClose, onSubmit, product, mode }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    image: '',
    images: ['', '', '', '', ''], // Up to 5 images
    category: '',
    description: '',
    isOnSale: false,
    isNew: false
  });

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [newVariant, setNewVariant] = useState({
    color: '',
    size: '',
    stock: '',
    sku: '',
    images: ['', '', '', '', ''] // Up to 5 images per color variant
  });

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        image: product.image,
        images: product.images 
          ? [...product.images, ...Array(5 - product.images.length).fill('')].slice(0, 5)
          : ['', '', '', '', ''],
        category: product.category,
        description: product.description || '',
        isOnSale: product.isOnSale || false,
        isNew: product.isNew || false
      });
      setVariants(product.variants);
    } else {
      resetForm();
    }
  }, [product, mode, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      image: '',
      images: ['', '', '', '', ''],
      category: '',
      description: '',
      isOnSale: false,
      isNew: false
    });
    setVariants([]);
    setNewVariant({ color: '', size: '', stock: '', sku: '', images: ['', '', '', '', ''] });
  };

  const handleAddVariant = () => {
    if (!newVariant.color || !newVariant.size || !newVariant.stock) {
      toast.error('Please fill in all variant fields');
      return;
    }

    const variantExists = variants.some(
      v => v.color === newVariant.color && v.size === newVariant.size
    );

    if (variantExists) {
      toast.error('Variant with this color and size already exists');
      return;
    }

    // Filter out empty image URLs for this variant
    const variantImages = newVariant.images.filter(img => img.trim() !== '');
    
    const variant: ProductVariant = {
      id: `v-${Date.now()}-${Math.random()}`,
      color: newVariant.color,
      size: newVariant.size,
      stock: parseInt(newVariant.stock),
      sku: newVariant.sku || undefined,
      images: variantImages.length > 0 ? variantImages : undefined
    };

    setVariants([...variants, variant]);
    setNewVariant({ color: '', size: '', stock: '', sku: '', images: ['', '', '', '', ''] });
    toast.success('Variant added');
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
    toast.success('Variant removed');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category || !formData.image) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (variants.length === 0) {
      toast.error('Please add at least one variant');
      return;
    }

    const colors = Array.from(new Set(variants.map(v => v.color)));
    const sizes = Array.from(new Set(variants.map(v => v.size)));

    // Filter out empty image URLs
    const productImages = formData.images.filter(img => img.trim() !== '');

    const productData: Omit<ProductWithInventory, 'id' | 'totalStock'> = {
      name: formData.name,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      image: formData.image,
      images: productImages.length > 0 ? productImages : undefined,
      category: formData.category,
      description: formData.description,
      isOnSale: formData.isOnSale,
      isNew: formData.isNew,
      variants,
      availableColors: colors,
      availableSizes: sizes
    };

    onSubmit(productData);
    toast.success(`Product ${mode === 'add' ? 'added' : 'updated'} successfully`);
    onClose();
    resetForm();
  };

  const availableSizes = formData.category ? sizes[formData.category as keyof typeof sizes] : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Product' : 'Edit Product'}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Create a new product with inventory details' : 'Update product information and inventory'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Classic White T-Shirt"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="29.99"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="39.99"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Main Image URL *</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Additional Images (Optional - up to 5 total)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Add up to 4 more product images for the slideshow
                </p>
                {formData.images.map((img, index) => (
                  <Input
                    key={index}
                    value={img}
                    onChange={(e) => {
                      const newImages = [...formData.images];
                      newImages[index] = e.target.value;
                      setFormData({ ...formData, images: newImages });
                    }}
                    placeholder={`Image ${index + 2} URL (optional)`}
                    className="mb-2"
                  />
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description..."
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isOnSale}
                    onChange={(e) => setFormData({ ...formData, isOnSale: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>On Sale</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>New Arrival</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Inventory & Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory & Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Variant Form */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="font-medium mb-3">Add Variant</h4>
                <div className="grid grid-cols-5 gap-3 mb-4">
                  <div className="space-y-2">
                    <Label>Color *</Label>
                    <Input
                      value={newVariant.color}
                      onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                      placeholder="e.g., Blue"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Size *</Label>
                    <Select value={newVariant.size} onValueChange={(value) => setNewVariant({ ...newVariant, size: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSizes.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Stock *</Label>
                    <Input
                      type="number"
                      value={newVariant.stock}
                      onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                      placeholder="50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>SKU (Optional)</Label>
                    <Input
                      value={newVariant.sku}
                      onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                      placeholder="CWT-S-W"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button type="button" onClick={handleAddVariant} className="w-full">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
                
                {/* Color-Specific Images */}
                <div className="space-y-2 pt-3 border-t">
                  <Label className="text-sm">Color-Specific Images (Optional)</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Add up to 5 images that will show when this color is selected. If not provided, default product images will be used.
                  </p>
                  {newVariant.images.map((img, index) => (
                    <Input
                      key={index}
                      value={img}
                      onChange={(e) => {
                        const newImages = [...newVariant.images];
                        newImages[index] = e.target.value;
                        setNewVariant({ ...newVariant, images: newImages });
                      }}
                      placeholder={`${newVariant.color || 'Color'} - Image ${index + 1} URL (optional)`}
                      className="text-sm"
                    />
                  ))}
                </div>
              </div>

              {/* Variants List */}
              {variants.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Current Variants ({variants.length})</h4>
                  <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                    {variants.map((variant) => (
                      <div key={variant.id} className="p-3 flex items-center justify-between hover:bg-muted/50">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge variant="secondary">{variant.color}</Badge>
                          <Badge variant="outline">{variant.size}</Badge>
                          <span className="text-sm">Stock: {variant.stock}</span>
                          {variant.sku && <span className="text-sm text-muted-foreground">SKU: {variant.sku}</span>}
                          {variant.images && variant.images.length > 0 && (
                            <Badge variant="default" className="text-xs">
                              {variant.images.length} image{variant.images.length > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveVariant(variant.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Stock: {variants.reduce((sum, v) => sum + v.stock, 0)} units
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Add Product' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}