import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddItems from "./pages/AddItems";
import CreateItem from "./pages/CreateItem";
import Cart from "./pages/Cart";
import { useState } from "react";

function App() {
  const [addedItems, setAddedItems] = useState([]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-item" element={<CreateItem />} />
        <Route
          path="/add-items"
          element={<AddItems addedItems={addedItems} setAddedItems={setAddedItems} />}
        />
        <Route
          path="/cart"
          element={<Cart addedItems={addedItems} setAddedItems={setAddedItems} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
