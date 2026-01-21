import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import CreateOrderPage from "../pages/CreateOrderPage";
import OrdersListPage from "../pages/OrdersListPage";
import OrderDetailsPage from "../pages/OrderDetailsPage";
import AnalyticsPage from "../pages/AnalyticsPage";

const AppRoutes = () => {
    return (
       <BrowserRouter>
       <Navbar/>
        <Routes>
            <Route path="/orders/new" element={<CreateOrderPage />} />
            <Route path="/orders" element={<OrdersListPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/analytics/stats" element={<AnalyticsPage />} />
        </Routes>
       </BrowserRouter>
       
    )
}
export default AppRoutes;
