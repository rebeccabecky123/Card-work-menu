import React, { useEffect, useState } from "react";
import { Plus, Minus, X } from "lucide-react";

export default function Product({ image, name, category, price }) {
  const [cart, setCart] = useState([]);
  const [Desserts, setDesserts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    const fetchDesserts = async () => {
      try {
        const response = await fetch("data.json");
        const data = await response.json();
        if (!data) {
          console.log("can not find the data");
        }
        setDesserts(data);
      } catch (error) {
        console.error("error ");
      } finally {
        setLoading(false);
      }
    };
    fetchDesserts();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const isPhone = /iPhone|Android|iPad|iPod/i.test(navigator.userAgent);
      setIsMobile(isPhone);
    };
    checkMobile();
  }, []);

  const addToCart = (item) => {
    setMessage(`🛒 You added ${item.name} to your cart!`);
    setTimeout(() => setMessage(""), 2000);
    setCart((prev) => {
      const exists = prev.find((p) => p.name === item.name);
      if (exists) {
        return prev.map((p) =>
          p.name === item.name ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (name) => {
    setCart((prev) => prev.filter((item) => item.name !== name));
  };

  const updateQuantity = (name, amount) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleConfirmOrder = () => {
    if (cart.length === 0) {
      setMessage("Your cart is empty.");
    } else {
      setShowModal(true); 
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); 
    setCart([]); 
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  if (loading) return <p>loading ....</p>;

  return (
    <div className="p-4 bg-[#fefbf7] min-h-screen">
    
      <div className="flex flex-col lg:flex-row gap-6">
     
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-brown-900 mb-4">Desserts</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Desserts.map((item, idx) => {
              const cartItem = cart.find((c) => c.name === item.name);
              return (
                <div key={idx} className="bg-white p-3 rounded-lg shadow">
                  <img
                    src={item.image.desktop}
                    alt={item.name}
                    className="rounded mb-2 w-full h-32 object-cover"
                  />
                  <div className="text-sm">{item.category}</div>
                  <div className="mt-2 text-sm font-semibold">{item.name}</div>
                  <div className="text-blue-600 font-bold">
                    ${item.price.toFixed(2)}
                  </div>
                  <div className="mt-2">
                    {cartItem ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.name, -1)}
                          className="px-2 py-1 bg-orange-100 text-orange-700 rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span>{cartItem.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.name, 1)}
                          className="px-2 py-1 bg-orange-100 text-orange-700 rounded"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="mt-2 px-4 py-1 bg-orange-600 text-white rounded"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

    
        <div className="w-full lg:w-1/3 bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Your Cart ({totalItems})</h2>
          <ul className="space-y-2">
            {cart.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    {item.quantity} x ${item.price.toFixed(2)} = $
                    {(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.name)}>
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t pt-2 font-bold text-lg">
            Order Total: ${totalPrice}
          </div>
          <div className="mt-2 text-green-700 text-sm">
            This is a carbon-neutral delivery
          </div>
          <button
            onClick={handleConfirmOrder}
            className="mt-4 w-full bg-orange-600 text-white py-2 rounded"
          >
            Confirm Order
          </button>

          {message && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded shadow">
              {message}
            </div>
          )}

          {isMobile && (
            <div className="mt-4">
              <img
                src="https://via.placeholder.com/300x200?text=Thank+You+Mobile+User"
                alt="Mobile Thank You"
                className="rounded-lg shadow"
              />
            </div>
          )}
        </div>
      </div>

    
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-2">🎉 Order Confirmed!</h2>
            <p className="mb-4">Thank you for your order.</p>
            <p className="font-semibold text-lg mb-4">
              Total Price: ${totalPrice}
            </p>
            <button
              onClick={handleCloseModal}
              className="w-full bg-orange-600 text-white py-2 rounded"
            >
              Start new order 
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
