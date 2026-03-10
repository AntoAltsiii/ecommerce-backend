import { createContext, useContext, useState } from 'react';

const CartContext = createContext({});

export function CartProvider({ children }) {

const [items, setItems] = useState([]);

const agregarAlCarrito = (prenda) => {
    setItems(prevItems => {

      const itemExistente = prevItems.find(item => item.id === prenda.id);

      if (itemExistente) {

        return prevItems.map(item =>
          item.id === prenda.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

return [...prevItems, {
        id:             prenda.id,
        nombre:         prenda.nombre,
        precio_Actual:  prenda.precio_Actual,
        imagenUrl:      prenda.imagenUrl || null,
        categoriaNombre: prenda.categoria?.nombreCategoria || 'Sin categoría',
        cantidad:        1,
      }];
    });
  };

const quitarDelCarrito = (prendaId) => {
    setItems(prevItems => {
      const itemExistente = prevItems.find(item => item.id === prendaId);

      if (!itemExistente) return prevItems;

      if (itemExistente.cantidad === 1) {

        return prevItems.filter(item => item.id !== prendaId);
      }

return prevItems.map(item =>
        item.id === prendaId
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      );
    });
  };

const eliminarDelCarrito = (prendaId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== prendaId));
  };

const vaciarCarrito = () => {
    setItems([]);
  };

const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0);

const subtotal = items.reduce(
    (acc, item) => acc + item.precio_Actual * item.cantidad,
    0
  );

const getCantidad = (prendaId) => {
    const item = items.find(i => i.id === prendaId);
    return item ? item.cantidad : 0;
  };

const value = {
    items,
    agregarAlCarrito,
    quitarDelCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    cantidadTotal,
    subtotal,
    getCantidad,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
