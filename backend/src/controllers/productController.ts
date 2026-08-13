import { Request, Response } from 'express';
import { store } from '../db/store';

export const getProducts = (req: Request, res: Response) => {
  try {
    const { query, maxPrice, category, tags } = req.query;
    
    const parsedMaxPrice = maxPrice ? parseFloat(maxPrice as string) : undefined;
    const parsedTags = tags ? (tags as string).split(',') : undefined;

    const products = store.searchProducts(
      query as string,
      parsedMaxPrice,
      category as string,
      parsedTags
    );

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProductById = (req: Request, res: Response) => {
  try {
    const product = store.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
