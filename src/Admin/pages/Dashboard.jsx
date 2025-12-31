import { useNavigate } from "react-router-dom";

const Dashboard = () => {
   const navigate = useNavigate();
  return (
    <>
      <h3>Dashboard</h3>
      <div className="row">
        <div className="col-md-4 col-12 mb-3">
          <div className="card p-3">
         <button
                  style={{ marginLeft: 5 }}
                  onClick={() => navigate(`/products`)}
                >
                  danh sách sp
                </button>
          </div>

        </div>
        <div className="col-md-4 col-12 mb-3">
          <div className="card p-3">
         <button
                  style={{ marginLeft: 5 }}
                  onClick={() => navigate(`/productscreate`)}
                >
                  thêm sp
                </button>
          </div>

        </div>
        <div className="col-md-4 col-12 mb-3">
          <div className="card p-3">
         <button
                  style={{ marginLeft: 5 }}
                  onClick={() => navigate(`/news`)}
                >
                  trang tin tức
                </button>
          </div>

        </div>
        <div className="col-md-4 col-12 mb-3">
          <div className="card p-3">
         <button
                  style={{ marginLeft: 5 }}
                  onClick={() => navigate(`/news/create`)}
                >
                  thêm tin tức
                </button>
          </div>

        </div>
        <div className="col-md-4 col-12 mb-3">
          <div className="card p-3">Đơn hàng</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
