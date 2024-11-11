/* eslint-disable react/prop-types */
// src/App.js
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import AddItems from "./pages/AddItems";
import CreateItem from "./pages/CreateItem";
import Cart from "./pages/Cart";
import { useState, useEffect } from "react";

function App() {
  const [addedItems, setAddedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <BrowserRouter>
      <AppRoutes
        addedItems={addedItems}
        setAddedItems={setAddedItems}
        loading={loading}
        setLoading={setLoading}
      />
    </BrowserRouter>
  );
}

// Separate component for routes and loading state management
function AppRoutes({ addedItems, setAddedItems, loading, setLoading }) {
  const location = useLocation();

  // Trigger loader on route change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500); // Simulate loading time
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center w-full min-h-screen">
          <div className="animate-spin w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"></div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-item" element={<CreateItem />} />
          <Route
            path="/add-items"
            element={
              <AddItems addedItems={addedItems} setAddedItems={setAddedItems} />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart addedItems={addedItems} setAddedItems={setAddedItems} />
            }
          />
        </Routes>
      )}
    </>
  );
}

export default App;
