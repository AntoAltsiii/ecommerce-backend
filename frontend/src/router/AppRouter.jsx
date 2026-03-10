import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from '../components/Layout';
import PrivateRoute from '../components/PrivateRoute';

import HomePage from '../pages/HomePage';
import ProductosPage from '../pages/ProductosPage';
import NotFoundPage from '../pages/NotFoundPage';

import CarritoPage from '../pages/CarritoPage';
import CheckoutPage from '../pages/CheckoutPage';
import MisComprasPage from '../pages/MisComprasPage';
import RecomendacionPage from '../pages/RecomendacionPage';

import EnviosPage from '../pages/EnviosPage';

import AdminPage from '../pages/AdminPage';
import AdminProductosPage from '../pages/AdminProductosPage';
import AdminStockPage from '../pages/AdminStockPage';
import AdminComprasPage from '../pages/AdminComprasPage';

import AdminCategoriasPage from '../pages/AdminCategoriasPage';
import PrendaFormPage from '../pages/PrendaFormPage';

function AppRouter() {
  return (

    <BrowserRouter>
      <Routes>

<Route element={<Layout />}>

<Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductosPage />} />

<Route element={<PrivateRoute roles={['CLIENTE', 'ADMIN']} />}>
            <Route path="/carrito"       element={<CarritoPage />} />
            <Route path="/checkout"      element={<CheckoutPage />} />
            <Route path="/mis-compras"   element={<MisComprasPage />} />
            <Route path="/recomendacion" element={<RecomendacionPage />} />
          </Route>

<Route element={<PrivateRoute roles={['REPARTIDOR', 'ADMIN']} />}>
            <Route path="/envios" element={<EnviosPage />} />
          </Route>

<Route element={<PrivateRoute roles={['ADMIN']} />}>
            <Route path="/admin"                          element={<AdminPage />} />
            <Route path="/admin/productos"                element={<AdminProductosPage />} />
            <Route path="/admin/stock"                    element={<AdminStockPage />} />
            <Route path="/admin/compras"                  element={<AdminComprasPage />} />

            <Route path="/admin/productos/nueva"          element={<PrendaFormPage />} />
            <Route path="/admin/productos/editar/:id"     element={<PrendaFormPage />} />

            <Route path="/admin/categorias"               element={<AdminCategoriasPage />} />
          </Route>

<Route path="*" element={<NotFoundPage />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
