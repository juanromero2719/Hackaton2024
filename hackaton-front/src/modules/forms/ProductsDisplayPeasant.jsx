// src/components/ProductsDisplayPeasant.js

import React from "react";

const ProductsDisplayPeasant = ({ supplier, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Determinar el tipo de productos a mostrar
  const products = supplier.productsOffered || supplier.productsRequired || supplier.products;

  return (
      <div className="fixed inset-0 bg-gray-100 bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative overflow-auto max-h-[90vh]">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h3 className="text-2xl font-bold text-gray-800">
              Productos de {supplier.supplierName}
            </h3>
            <button
                onClick={onClose}
                className="text-red-500 hover:text-red-700 text-lg font-semibold"
                aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          {/* Productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products && products.length > 0 ? (
                products.map((product, index) => (
                    <div
                        key={product._id || index} // Usar índice como respaldo si no hay _id
                        className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                    >
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {product.name || "Producto sin nombre"}
                      </h4>
                      {product.price && (
                          <p className="text-gray-600">
                            <strong>Precio:</strong> ${product.price}
                          </p>
                      )}
                      {product.quantity && (
                          <p className="text-gray-600">
                            <strong>Cantidad Disponible:</strong> {product.quantity} unidades
                          </p>
                      )}
                      {product.requiredQuantity && (
                          <p className="text-gray-600">
                            <strong>Cantidad Requerida:</strong> {product.requiredQuantity} unidades
                          </p>
                      )}
                      {product.productionQuantity && (
                          <p className="text-gray-600">
                            <strong>Cantidad Producción:</strong> {product.productionQuantity} libras
                          </p>
                      )}
                      {product.categories && product.categories.length > 0 && (
                          <p className="text-gray-600">
                            <strong>Categorías:</strong> {product.categories.join(", ")}
                          </p>
                      )}
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 col-span-full">
                  Este proveedor no tiene productos registrados.
                </p>
            )}
          </div>
        </div>
      </div>
  );
};

export default ProductsDisplayPeasant;
