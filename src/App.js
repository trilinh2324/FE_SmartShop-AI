import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Admin/pages/Dashboard";
import ProductList from "./Admin/pages/ProductList";
import ProductCreate from "./Admin/pages/ProductCreate";
import ProductUpdate from "./Admin/pages/ProductUpdate";
import ProductDetail from "./Admin/pages/ProductDetail";
import NewsList from "./Admin/pages/News/NewsList";
import NewsForm from "./Admin/pages/News/NewsForm";
import Login from "./Admin/pages/Login";
function App() {
  return (
    <BrowserRouter>
     
        <Routes>
          <Route path="" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<ProductList />} />
           <Route path="/productscreate" element={<ProductCreate />} />  
          <Route path="/products/update/:id" element={<ProductUpdate />} />
          <Route path="/products/detail/:id" element={<ProductDetail />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/news/create" element={<NewsForm />} />
          <Route path="/news/edit/:id" element={<NewsForm />} />
        </Routes>
      
    </BrowserRouter>
  );
}

export default App;
