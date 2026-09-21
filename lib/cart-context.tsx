"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import type { Product } from "@/lib/types";

export interface CartItem {
  id: string;
  name: string;
  brand?: string;
  price: number;
  image: string;
  size: number;
  quantity: number;
  is_by_request: boolean;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, size: number, quantity?: number) => void;
  removeItem: (id: string, size: number) => void;
  updateQuantity: (id: string, size: number, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalAmount: number;
  hasPreorder: boolean;
  depositAmount: number;
  balanceAmount: number;
  payWithTransfer: boolean;
  setPayWithTransfer: (value: boolean | ((prev: boolean) => boolean)) => void;
  transferDiscount: number;
  amountToPayNow: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "lessentiel_cart_items";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [payWithTransfer, setPayWithTransfer] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("No se pudo cargar el carrito desde localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Guardar en localStorage ante cualquier cambio
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("No se pudo guardar el carrito en localStorage", e);
    }
  }, [items, isLoaded]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  // Agregar producto al carrito
  const addItem = useCallback(
    (product: Product, size: number, quantity = 1) => {
      const isByRequest =
        product.is_by_request || product.availability === "preorder";

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) => item.id === product.id && item.size === size
        );

        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex].quantity += quantity;
          return updated;
        }

        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.image,
          size: size,
          quantity: quantity,
          is_by_request: isByRequest,
        };

        return [...prevItems, newItem];
      });

      // Abrir el drawer automáticamente al agregar
      setIsOpen(true);
    },
    []
  );

  // Remover item
  const removeItem = useCallback((id: string, size: number) => {
    setItems((prev) =>
      prev.filter((item) => !(item.id === id && item.size === size))
    );
  }, []);

  // Actualizar cantidad (+ / -)
  const updateQuantity = useCallback(
    (id: string, size: number, delta: number) => {
      setItems((prev) =>
        prev
          .map((item) => {
            if (item.id === id && item.size === size) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[]
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Cálculos reactivos
  const totalCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const totalAmount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  const hasPreorder = useMemo(() => {
    return items.some((item) => item.is_by_request);
  }, [items]);

  // Seña del 50%
  const depositAmount = useMemo(() => {
    return Math.round(totalAmount * 0.5);
  }, [totalAmount]);

  const balanceAmount = useMemo(() => {
    return totalAmount - depositAmount;
  }, [totalAmount, depositAmount]);

  // Descuento del 10% por transferencia
  const transferDiscount = useMemo(() => {
    if (!payWithTransfer) return 0;
    return Math.round(totalAmount * 0.1);
  }, [payWithTransfer, totalAmount]);

  // Monto a abonar hoy según tipo de orden y medio de pago:
  // Si es preorder, seña del 50% (con descuento proporcional si es transferencia)
  // Si es stock, total (con descuento de transferencia si aplica)
  const amountToPayNow = useMemo(() => {
    const basePay = hasPreorder ? depositAmount : totalAmount;
    if (payWithTransfer) {
      const discount = hasPreorder
        ? Math.round(depositAmount * 0.1)
        : transferDiscount;
      return basePay - discount;
    }
    return basePay;
  }, [hasPreorder, depositAmount, totalAmount, payWithTransfer, transferDiscount]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        totalAmount,
        hasPreorder,
        depositAmount,
        balanceAmount,
        payWithTransfer,
        setPayWithTransfer,
        transferDiscount,
        amountToPayNow,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser utilizado dentro de un CartProvider");
  }
  return context;
}

