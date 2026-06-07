import { useState, useEffect, useCallback } from 'react';
import { DataManager, ProductCategory, Product, DownloadItem, Documentation, Platform } from './dataManager';

export function useProducts() {
  const [products, setProducts] = useState<ProductCategory[]>([]);

  useEffect(() => {
    setProducts(DataManager.getProducts());
  }, []);

  const addCategory = useCallback((categoryName: string) => {
    const newCategory: ProductCategory = {
      id: DataManager.generateId(),
      category: categoryName,
      items: [],
    };
    const updated = [...products, newCategory];
    setProducts(updated);
    DataManager.saveProducts(updated);
  }, [products]);

  const updateCategory = useCallback((categoryId: string, newName: string) => {
    const updated = products.map(cat =>
      cat.id === categoryId ? { ...cat, category: newName } : cat
    );
    setProducts(updated);
    DataManager.saveProducts(updated);
  }, [products]);

  const deleteCategory = useCallback((categoryId: string) => {
    const updated = products.filter(cat => cat.id !== categoryId);
    setProducts(updated);
    DataManager.saveProducts(updated);
  }, [products]);

  const addProduct = useCallback((categoryId: string, product: Omit<Product, 'id'>) => {
    const updated = products.map(cat =>
      cat.id === categoryId
        ? { ...cat, items: [...cat.items, { ...product, id: DataManager.generateId() }] }
        : cat
    );
    setProducts(updated);
    DataManager.saveProducts(updated);
  }, [products]);

  const updateProduct = useCallback((categoryId: string, productId: string, updates: Partial<Product>) => {
    const updated = products.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            items: cat.items.map(p => (p.id === productId ? { ...p, ...updates } : p)),
          }
        : cat
    );
    setProducts(updated);
    DataManager.saveProducts(updated);
  }, [products]);

  const deleteProduct = useCallback((categoryId: string, productId: string) => {
    const updated = products.map(cat =>
      cat.id === categoryId
        ? { ...cat, items: cat.items.filter(p => p.id !== productId) }
        : cat
    );
    setProducts(updated);
    DataManager.saveProducts(updated);
  }, [products]);

  return {
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}

export function useDownloads() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  useEffect(() => {
    setDownloads(DataManager.getDownloads());
  }, []);

  const addDownload = useCallback((download: Omit<DownloadItem, 'id'>) => {
    const newDownload: DownloadItem = { ...download, id: DataManager.generateId() };
    const updated = [...downloads, newDownload];
    setDownloads(updated);
    DataManager.saveDownloads(updated);
  }, [downloads]);

  const updateDownload = useCallback((id: string, updates: Partial<DownloadItem>) => {
    const updated = downloads.map(d => (d.id === id ? { ...d, ...updates } : d));
    setDownloads(updated);
    DataManager.saveDownloads(updated);
  }, [downloads]);

  const deleteDownload = useCallback((id: string) => {
    const updated = downloads.filter(d => d.id !== id);
    setDownloads(updated);
    DataManager.saveDownloads(updated);
  }, [downloads]);

  return {
    downloads,
    addDownload,
    updateDownload,
    deleteDownload,
  };
}

export function useDocumentation() {
  const [documentation, setDocumentation] = useState<Documentation[]>([]);

  useEffect(() => {
    setDocumentation(DataManager.getDocumentation());
  }, []);

  const addDoc = useCallback((doc: Omit<Documentation, 'id'>) => {
    const newDoc: Documentation = { ...doc, id: DataManager.generateId() };
    const updated = [...documentation, newDoc];
    setDocumentation(updated);
    DataManager.saveDocumentation(updated);
  }, [documentation]);

  const updateDoc = useCallback((id: string, updates: Partial<Documentation>) => {
    const updated = documentation.map(d => (d.id === id ? { ...d, ...updates } : d));
    setDocumentation(updated);
    DataManager.saveDocumentation(updated);
  }, [documentation]);

  const deleteDoc = useCallback((id: string) => {
    const updated = documentation.filter(d => d.id !== id);
    setDocumentation(updated);
    DataManager.saveDocumentation(updated);
  }, [documentation]);

  return {
    documentation,
    addDoc,
    updateDoc,
    deleteDoc,
  };
}

export function usePlatforms() {
  const platforms: Platform[] = [
    { name: 'Windows', icon: 'Monitor', link: '#' },
    { name: 'macOS', icon: 'Apple', link: '#' },
    { name: 'Linux', icon: 'Server', link: '#' },
    { name: 'Python 3.9+', icon: 'Terminal', link: '#' },
    { name: 'GitHub', icon: 'Code', link: 'https://github.com' },
  ];

  return { platforms };
}

export function useSettings() {
  const resetData = useCallback(() => {
    DataManager.resetToDefault();
  }, []);

  const clearStorage = useCallback(() => {
    DataManager.clearAll();
  }, []);

  return { resetData, clearStorage };
}
