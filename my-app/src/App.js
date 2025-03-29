import logo from './logo.svg';
import './App.css';

import { useState } from 'react';

const App = () => {
  // Product data
  const products = [
    { id: 'halfkg', name: 'Premium Halwa (1/2 kg)', price: 325, description: 'Perfect for small gatherings or personal indulgence. Our halwa is prepared with pure ghee and premium quality ingredients.' },
    { id: 'onekg', name: 'Premium Halwa (1 kg)', price: 650, description: 'Ideal for family celebrations and special occasions. Double the joy with our signature halwa made from traditional recipes.' }
  ];

  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: ''
  });

  // State for quantities
  const [quantities, setQuantities] = useState({
    halfkg: 0,
    onekg: 0
  });

  // State for order confirmation
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle quantity changes
  const incrementQuantity = (productId) => {
    setQuantities({
      ...quantities,
      [productId]: quantities[productId] + 1
    });
  };

  const decrementQuantity = (productId) => {
    if (quantities[productId] > 0) {
      setQuantities({
        ...quantities,
        [productId]: quantities[productId] - 1
      });
    }
  };

  // Calculate totals
  const calculateSubtotal = (productId) => {
    const product = products.find(p => p.id === productId);
    return product.price * quantities[productId];
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      return total + (product.price * quantities[product.id]);
    }, 0);
  };

  // Generate order items text
  const getOrderItemsText = () => {
    return products
      .filter(product => quantities[product.id] > 0)
      .map(product => `${quantities[product.id]} x ${product.name}`)
      .join(', ');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (calculateTotal() === 0) {
        alert('Please select at least one item to place an order.');
        return;
    }

    const generatedOrderId = 'AH' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedOrderId);

    const orderDetails = {
        orderId: generatedOrderId,
        ...formData,
        itemsText: getOrderItemsText(),
        total: calculateTotal()
    };

    // Send data to backend
    try {
        const response = await fetch('http://localhost:5000/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderDetails)
        });

        const result = await response.json();
        if (result.success) {
            alert('Order placed successfully! Email sent.');
            setOrderPlaced(true);
        } else {
            alert('Failed to send email.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred.');
    }
};

  return (
    <div className="bg-amber-50 min-h-screen flex flex-col text-brown-800">
      {/* Header */}
      <header className="bg-amber-500 text-white text-center py-8 shadow-md">
        <h1 className="text-4xl font-bold mb-2">Archie's Halwa</h1>
        <p className="text-lg italic">Traditional Flavors, Crafted with Love</p>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="flex flex-col items-center mb-12 text-center">
          <div className="w-full max-w-2xl h-64 bg-amber-200 rounded-lg mb-6 flex items-center justify-center text-amber-800 shadow-md">
            Premium Halwa Image
          </div>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Welcome to Archie's Halwa</h2>
            <p className="text-lg">Experience the rich taste of our authentic homemade halwa, prepared with the finest ingredients and traditional recipes handed down through generations.</p>
          </div>
        </section>
        
        {/* Products Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-1 after:bg-amber-500">
            Our Premium Halwa
          </h2>
          
          <div className="flex justify-center gap-8 flex-wrap">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg p-6 w-72 shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1">
                <div className="h-48 bg-amber-200 rounded mb-4 flex items-center justify-center text-amber-800">
                  Halwa - {product.id === 'halfkg' ? '1/2 kg' : '1 kg'} Package
                </div>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-xl font-bold text-amber-500 mb-4">₹{product.price}</p>
                <p className="text-gray-600">{product.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        {!orderPlaced ? (
          // Order Form Section
          <section id="order" className="bg-white rounded-lg p-8 shadow-md max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-1 after:bg-amber-500">
              Place Your Order
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="font-semibold">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="font-semibold">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="font-semibold">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="address" className="font-semibold">Delivery Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-semibold">Select Quantity</label>
                <div className="flex flex-wrap gap-4">
                  {products.map(product => (
                    <div key={product.id} className="border border-gray-300 rounded-md p-4 flex-1 min-w-64 flex flex-col space-y-2">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-amber-500 font-bold">₹{product.price}</p>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => decrementQuantity(product.id)}
                          className="w-8 h-8 bg-gray-100 border border-gray-300 rounded flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 border border-gray-300 rounded min-w-10 text-center">
                          {quantities[product.id]}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementQuantity(product.id)}
                          className="w-8 h-8 bg-gray-100 border border-gray-300 rounded flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-100 rounded-md p-4 mt-4">
                  <div>Order Summary:</div>
                  {products.map(product => (
                    <div key={product.id}>
                      {product.name}: {quantities[product.id]} x ₹{product.price} = ₹{calculateSubtotal(product.id)}
                    </div>
                  ))}
                  <div className="text-xl font-bold text-amber-500 mt-2">
                    Total: ₹{calculateTotal()}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="paymentMethod" className="font-semibold">Payment Method</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="">Select Payment Method</option>
                  <option value="cod">Cash on Delivery</option>
                  <option value="upi">UPI Payment</option>
                  <option value="card">Card Payment</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full bg-amber-500 text-white font-bold py-4 px-4 rounded-md hover:bg-amber-600 transition-colors"
              >
                Place Order
              </button>
            </form>
          </section>
        ) : (
          // Order Success Section
          <section className="bg-green-50 border border-green-200 rounded-lg p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-green-800 text-center">Order Placed Successfully!</h2>
            <p className="text-center mb-6">Thank you for your order. Your delicious halwa will be on its way soon!</p>
            
            <div className="bg-white p-4 rounded-md mb-6">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span>Order ID:</span>
                <span className="font-semibold">{orderId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span>Customer Name:</span>
                <span>{formData.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span>Delivery Address:</span>
                <span>{formData.address}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span>Order Items:</span>
                <span>{getOrderItemsText()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span>Total Amount:</span>
                <span className="font-semibold">₹{calculateTotal()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Payment Method:</span>
                <span>
                  {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                   formData.paymentMethod === 'upi' ? 'UPI Payment' : 
                   formData.paymentMethod === 'card' ? 'Card Payment' : 
                   formData.paymentMethod}
                </span>
              </div>
            </div>
            
            <p className="text-center">
              An email with your order details has been sent to your email address and to <strong>shrikm68@gmail.com</strong>.
            </p>
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-brown-800 text-white text-center py-8 mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Archie's Halwa</h2>
          
          <div className="flex justify-center gap-8 mb-6">
            <a href="#" className="hover:underline">Home</a>
            <a href="#order" className="hover:underline">Order Now</a>
            <a href="#" className="hover:underline">About Us</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
          
          <div className="mb-6">
            <p>Email: contact@archieshalwa.com</p>
            <p>Phone: +91 9876543210</p>
          </div>
          
          <p className="text-gray-300 text-sm">© 2025 Archie's Halwa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
