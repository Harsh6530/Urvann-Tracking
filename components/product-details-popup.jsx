"use client"
import Image from "next/image"
import { X } from "lucide-react"
import "./productDetail.css"
import { useState } from "react"

const ProductDetailsPopup = ({ products, onClose }) => {
  const [selectedProduct, setSelectedProduct] = useState(products[0]) // Default to first product

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-auto flex">
        {/* Sidebar for product list */}
        <div className="w-1/3 bg-gray-100 p-4 overflow-auto">
          <h3 className="text-lg font-bold mb-3">Products in Order</h3>
          <ul className="space-y-3">
            {products.map((product, index) => (
              <li
                key={index}
                className={`p-3 rounded-md cursor-pointer flex items-center space-x-3 ${
                  selectedProduct === product ? "bg-blue-100" : "hover:bg-gray-200"
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <Image
                  src={product.imgURL || "/placeholder.svg"}
                  alt={product.product}
                  width={40}
                  height={40}
                  className="rounded-md"
                />
                <span className="text-sm font-medium">{product.product}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="w-2/3 p-6">
          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Product Image */}
            <div className="md:w-1/2 p-4 flex items-center justify-center">
              <div className="relative w-full h-[300px] md:h-[400px]">
                <Image
                  src={selectedProduct.imgURL || "/placeholder.svg"}
                  alt={selectedProduct.product}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-md"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 p-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedProduct.product}</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="border-b pb-2">
                    <p className="text-sm text-gray-500">SKU</p>
                    <p className="font-medium">{selectedProduct.sku}</p>
                  </div>

                  <div className="border-b pb-2">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">#{selectedProduct.order_id}</p>
                  </div>

                  <div className="border-b pb-2">
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="font-medium">{selectedProduct.txn_id}</p>
                  </div>

                  <div className="border-b pb-2">
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{selectedProduct.customer}</p>
                  </div>

                  <div className="border-b pb-2">
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formatDate(selectedProduct.date)}</p>
                  </div>

                  <div className="border-b pb-2">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          selectedProduct.status === "Close"
                            ? "bg-red-100 text-red-800"
                            : selectedProduct.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {selectedProduct.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  )
}

export default ProductDetailsPopup