import { useEffect, useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import axios from "axios";
import PaymentButtonRuno from "./PaymentButtonRuno";
import GoogleLogin from "./GoogleLogin";

const RunoFresh = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("http://localhost:3001/items", {
        withCredentials: true,
      });
      console.log(response.data);
      setProducts(response.data.items);
    };

    const fetchCategories = async () => {
      const response = await axios.get("http://localhost:3001/categories", {
        withCredentials: true,
      });

      console.log(response.data);
      setCategories(response.data.categories);
    };

    fetchProducts();
    fetchCategories();
  }, []);
  // console.log(products);

  useEffect(() => {
    const fetchItemsByCategory = async () => {
      const response = await axios.get(
        `http://localhost:3001/items/category/${selectedCategory}`,
        { withCredentials: true }
      );
      setProducts(response.data.items);
    };
    fetchItemsByCategory();
  }, [selectedCategory]);

  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-green-600">RunoFresh</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* <div className="relative">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div> */}

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100 relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            <button
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="User account"
            >
              <GoogleLogin />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}

      <section className="relative bg-green-500">
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row items-center justify-between">
          <div className="text-center lg:text-left lg:max-w-lg">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              Fresh & Organic Foods
            </h1>
            <p className="text-lg mb-6">
              Discover the best selection of fresh, organic, and premium-quality
              products delivered to your doorstep.
            </p>
            <button
              className="bg-white text-green-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100"
              aria-label="Shop now"
            >
              Shop Now
            </button>
          </div>
          <img
            src="Images\RunoHero.png"
            alt="Fresh produce"
            className="w-full lg:w-1/2 mt-8 lg:mt-0 rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-md ${
                  selectedCategory === category.name
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
                aria-label={`Filter by ${category.name}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              role="article"
              aria-label={product.name}
            >
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">${product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="Close cart"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {cart.length === 0 && (
                <p className="text-center text-gray-500">Your cart is empty</p>
              )}
              {cart.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-xl font-semibold">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>

                  <PaymentButtonRuno />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunoFresh;
