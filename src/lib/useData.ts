import { useState, useEffect, useCallback } from 'react';
import DataManager, { ProductCategory, DownloadItem, Documentation } from './dataManager';

export function useProducts() {
  const [products, setProducts] = useState<ProductCategory[]>(() => DataManager.getProducts());

  useEffect(() => {
    setProducts(DataManager.getProducts());
  }, []);

  const refresh = useCallback(() => {
    setProducts(DataManager.getProducts());
  }, []);

  const addProduct = useCallback((categoryId: string, product: Parameters<typeof DataManager.addProduct>[1]) => {
    const updated = DataManager.addProduct(categoryId, product);
    setProducts(updated);
  }, []);

  const updateProduct = useCallback((categoryId: string, productId: string, updates: Parameters<typeof DataManager.updateProduct>[2]) => {
    const updated = DataManager.updateProduct(categoryId, productId, updates);
    setProducts(updated);
  }, []);

  const deleteProduct = useCallback((categoryId: string, productId: string) => {
    const updated = DataManager.deleteProduct(categoryId, productId);
    setProducts(updated);
  }, []);

  const addCategory = useCallback((category: Parameters<typeof DataManager.addCategory>[0]) => {
    const updated = DataManager.addCategory(category);
    setProducts(updated);
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    const updated = DataManager.deleteCategory(categoryId);
    setProducts(updated);
  }, []);

  return {
    products,
    refresh,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
  };
}

export function useDownloads() {
  const [downloads, setDownloads] = useState<DownloadItem[]>(() => DataManager.getDownloads());

  useEffect(() => {
    setDownloads(DataManager.getDownloads());
  }, []);

  const refresh = useCallback(() => {
    setDownloads(DataManager.getDownloads());
  }, []);

  const addDownload = useCallback((download: Parameters<typeof DataManager.addDownload>[0]) => {
    const updated = DataManager.addDownload(download);
    setDownloads(updated);
  }, []);

  const updateDownload = useCallback((id: string, updates: Parameters<typeof DataManager.updateDownload>[1]) => {
    const updated = DataManager.updateDownload(id, updates);
    setDownloads(updated);
  }, []);

  const deleteDownload = useCallback((id: string) => {
    const updated = DataManager.deleteDownload(id);
    setDownloads(updated);
  }, []);

  return {
    downloads,
    refresh,
    addDownload,
    updateDownload,
    deleteDownload,
  };
}

export function useDocumentation() {
  const [documentation, setDocumentation] = useState<Documentation[]>(() => DataManager.getDocumentation());

  useEffect(() => {
    setDocumentation(DataManager.getDocumentation());
  }, []);

  const refresh = useCallback(() => {
    setDocumentation(DataManager.getDocumentation());
  }, []);

  const addDocumentation = useCallback((doc: Parameters<typeof DataManager.addDocumentation>[0]) => {
    const updated = DataManager.addDocumentation(doc);
    setDocumentation(updated);
  }, []);

  const updateDocumentation = useCallback((id: string, updates: Parameters<typeof DataManager.updateDocumentation>[1]) => {
    const updated = DataManager.updateDocumentation(id, updates);
    setDocumentation(updated);
  }, []);

  const deleteDocumentation = useCallback((id: string) => {
    const updated = DataManager.deleteDocumentation(id);
    setDocumentation(updated);
  }, []);

  return {
    documentation,
    refresh,
    addDocumentation,
    updateDocumentation,
    deleteDocumentation,
  };
}
