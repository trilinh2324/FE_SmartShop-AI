import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Admin/pages/Dashboard";
import ProductList from "./Admin/pages/Products/ProductList";
import ProductCreate from "./Admin/pages/Products/ProductCreate";
import ProductUpdate from "./Admin/pages/Products/ProductUpdate";
import ProductDetail from "./Admin/pages/Products/ProductDetail";
import NewsList from "./Admin/pages/News/NewsList";
import NewsForm from "./Admin/pages/News/NewsCreates";
import Login from "./Admin/pages/Login";
import CategoryList from "./Admin/pages/Category/CategoryList";
import CategoryCreate from "./Admin/pages/Category/CategoryCreate";
import CategoryUpdate from "./Admin/pages/Category/CategoryUpdate"
import AdminUserPage from "./Admin/pages/AdminUser/AdminUserPage";
import AdminOrderPage from "./Admin/pages/oders/AdminOrderPage";

import UserProfilePage from "./Users1/pages/UserProfilePage";
import AdminOrderDetailPage from "./Admin/pages/oders/AdminOrderDetailPage";
import NewsDetail from "./Admin/pages/News/NewsDetail";
// import UsersLogin from "./Users1/components/Auth/Auth";
import HomeUser from "./Users1/pages/HomePage";
// import OAuth2Redirect from "./Users/Auth/OAuth2Redirect";
import CartPage from "./Users1/pages/CartPage";
import Payments from "./Users1/Paymen/PaymentPage";





import HomePage from "./Users/pages/HomePage";
import LoginForm from "./Users/components/LoginForm";
import RegisterForm from "./Users/components/RegisterForm";
import ProductSection from "./Users/components/ProductSection";



function App() {
  return (
    <BrowserRouter>
     
        <Routes>
          <Route path="admin/login" element={<Login />} />
          <Route path="/admin/home" element={<Dashboard />} /> 
          <Route path="/admin/products" element={<ProductList />} />
           <Route path="/admin/productscreate" element={<ProductCreate />} />  
          <Route path="/admin/products/update/:id" element={<ProductUpdate />} />
          <Route path="/admin/products/detail/:id" element={<ProductDetail />} />
          <Route path="/admin/categorys" element={<CategoryList />} />
          <Route path="/admin/categorys/creates" element={< CategoryCreate/>}/>
          <Route path="/admin/categorys/updates/:id" element={<CategoryUpdate />} />
          <Route path="/admin/newslist" element={<NewsList />} />
          <Route path="/admin/news/create" element={<NewsForm />} />
          <Route path="/admin/news/edit/:id" element={<NewsForm />} />
          <Route path="/admin/news/detail/:id" element={<NewsDetail />} />
          <Route path="/admin/orders"element={<AdminOrderPage />}/>
          <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />

          <Route path="/admin/users" element={<AdminUserPage/>}/>

          {/* <Route path="/users/login" element={<UsersLogin/>}/>  */}
          <Route path="/users/home" element={<HomeUser/>}/> 
          {/* <Route path="/oauth2/redirect" element={<OAuth2Redirect />} /> */}
          <Route path="/users/carts" element={<CartPage/>}/> 
          <Route path="/users/payments" element={<Payments/>}/> 
          <Route path="/users/profile" element={<UserProfilePage/>}/>
          {/* <Route path="/users/news" element={<UserNews/>}/> trang tin tức người dùng
          <Route path="/users/product/:id" element={<ProductDetail />} /> trang chi tiết sản phẩm người dùng
          <Route path="/users/category" element={<ProductDetail />} /> trang danh mục sản phẩm người dùng
          <Route path="/users/category/:id" element={<ProductDetail />}/> trang sản phẩm theo danh mục người dùng */}

        <Route path="/users/homepage" element={<HomePage />} />
        <Route path="/users/login" element={<LoginForm />} />
        <Route path="/users/register" element={<RegisterForm />} />
        <Route path="/products" element={<ProductSection />} />


        </Routes>
      
    </BrowserRouter>
  );
}

export default App;
