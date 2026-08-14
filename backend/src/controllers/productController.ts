import { Request, Response } from 'express';
import { db } from '../db/database';
import { ProductQueryParams } from '../db/models';

// =============================================================================
// CATEGORIES CONTROLLER
// =============================================================================
export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await db.getAllCategories();
    return res.json({ categories });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createCategory(req: Request, res: Response) {
  try {
    const { name, slug, icon, description, imageUrl } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required for category.' });
    }

    const category = await db.createCategory({
      name,
      slug: slug.toLowerCase().trim(),
      icon: icon || '⚡',
      description: description || '',
      imageUrl: imageUrl || ''
    });

    return res.status(201).json({ message: 'Category created', category });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const category = await db.updateCategory(id, req.body);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json({ message: 'Category updated', category });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const success = await db.deleteCategory(id);
    if (!success) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json({ message: 'Category deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// =============================================================================
// PRODUCTS CONTROLLER
// =============================================================================
export async function getProducts(req: Request, res: Response) {
  try {
    const params: ProductQueryParams = {
      search: req.query.query as string || req.query.search as string,
      category: req.query.category as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
      inStock: req.query.inStock === 'true' || req.query.inStock === '1',
      sort: req.query.sort as any,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50
    };

    const result = await db.getProducts(params);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await db.findProductById(id);
    if (!product) {
      return res.status(404).json({ error: `Product with ID ${id} not found.` });
    }

    const inventoryLogs = await db.getInventoryLogs(id, 10);

    return res.json({ product, inventoryLogs });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const {
      name,
      slug,
      categoryId,
      price,
      rating = 5.0,
      reviewsCount = 0,
      stock = 0,
      minStockThreshold = 5,
      tag = 'New',
      badge = 'Fresh',
      image,
      description,
      specs = {},
      aiInsight = ''
    } = req.body;

    if (!name || !categoryId || price === undefined || !image || !description) {
      return res.status(400).json({ error: 'Name, categoryId, price, image, and description are required.' });
    }

    const newProduct = await db.createProduct({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId,
      price: Number(price),
      rating: Number(rating),
      reviewsCount: Number(reviewsCount),
      stock: Number(stock),
      minStockThreshold: Number(minStockThreshold),
      tag,
      badge,
      image,
      description,
      specs,
      aiInsight,
      isActive: true
    });

    return res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updated = await db.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: `Product with ID ${id} not found.` });
    }
    return res.json({ message: 'Product updated successfully', product: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const success = await db.deleteProduct(id);
    if (!success) {
      return res.status(404).json({ error: `Product with ID ${id} not found.` });
    }
    return res.json({ message: 'Product deleted/deactivated successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
