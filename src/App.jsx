import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: ""
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Lấy toàn bộ sản phẩm
  const fetchProducts = () => {
    axios
      .get("http://localhost:8080/api/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.error("Lỗi lấy dữ liệu:", err));
  };

  // Tìm kiếm sản phẩm theo tên từ backend
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      fetchProducts(); // Nếu ô search trống thì load lại toàn bộ
      return;
    }

    axios
      .get(`http://localhost:8080/api/products/search?name=${searchTerm}`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.error("Lỗi tìm kiếm:", err));
  };

  // Xóa sản phẩm
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/products/${id}`)
      .then(() => {
        setProducts((prev) => prev.filter((product) => product.id !== id));
      })
      .catch((err) => console.error("Lỗi xóa sản phẩm:", err));
  };

  // Lưu thông tin nhập liệu
  const handleInputChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value
    });
  };

  // Thêm hoặc cập nhật sản phẩm
  const handleAddProduct = (e) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.price) {
      alert("Vui lòng nhập tên và giá sản phẩm!");
      return;
    }

    if (editId === null) {
      // Thêm mới
      axios
        .post("http://localhost:8080/api/products", newProduct)
        .then((res) => {
          setProducts((prev) => [...prev, res.data]);
          resetForm();
        })
        .catch((err) => console.error("Lỗi thêm sản phẩm:", err));
    } else {
      // Cập nhật
      axios
        .put(`http://localhost:8080/api/products/${editId}`, newProduct)
        .then((res) => {
          setProducts((prev) =>
            prev.map((p) => (p.id === editId ? res.data : p))
          );
          resetForm();
        })
        .catch((err) => console.error("Lỗi cập nhật sản phẩm:", err));
    }
  };

  // Chỉnh sửa sản phẩm
  const handleEdit = (product) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price
    });
    setEditId(product.id);
  };

  // Reset form
  const resetForm = () => {
    setNewProduct({ name: "", description: "", price: "" });
    setEditId(null);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f0f4f8, #d9e4ec)",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          maxWidth: "1000px",
          width: "100%"
        }}
      >
        <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
          🛒 Quản lý sản phẩm
        </h1>

        {/* Form thêm / sửa sản phẩm */}
        <form
          onSubmit={handleAddProduct}
          style={{
            background: "#f8f8f8",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}
        >
          <h3 style={{ marginBottom: "10px", color: "#555" }}>
            {editId ? "✏ Sửa sản phẩm" : "➕ Thêm sản phẩm mới"}
          </h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              name="name"
              placeholder="Tên sản phẩm"
              value={newProduct.name}
              onChange={handleInputChange}
              style={{
                flex: "1",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc"
              }}
            />
            <input
              type="text"
              name="description"
              placeholder="Mô tả"
              value={newProduct.description}
              onChange={handleInputChange}
              style={{
                flex: "2",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc"
              }}
            />
            <input
              type="number"
              name="price"
              placeholder="Giá (k)"
              value={newProduct.price}
              onChange={handleInputChange}
              style={{
                width: "100px",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc"
              }}
            />
            <button
              type="submit"
              style={{
                background: editId ? "#ffc107" : "#28a745",
                color: "white",
                padding: "8px 15px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              {editId ? "💾 Cập nhật" : "➕ Thêm"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  background: "#6c757d",
                  color: "white",
                  padding: "8px 15px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Hủy
              </button>
            )}
          </div>
        </form>

        {/* Ô tìm kiếm */}
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <input
            type="text"
            placeholder="🔍 Nhập tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px",
              width: "300px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginRight: "5px"
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              background: "#007bff",
              color: "white",
              padding: "8px 15px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Tìm kiếm
          </button>
        </div>

        {/* Bảng sản phẩm */}
        {products.length === 0 ? (
          <p style={{ textAlign: "center", color: "gray" }}>
            Không tìm thấy sản phẩm.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >
            <thead>
              <tr style={{ background: "#007bff", color: "white" }}>
                <th style={{ padding: "10px" }}>ID</th>
                <th style={{ padding: "10px" }}>Tên</th>
                <th style={{ padding: "10px" }}>Mô tả</th>
                <th style={{ padding: "10px" }}>Giá (k)</th>
                <th style={{ padding: "10px" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "center"
                  }}
                >
                  <td style={{ padding: "8px" }}>{product.id}</td>
                  <td style={{ padding: "8px" }}>{product.name}</td>
                  <td style={{ padding: "8px" }}>{product.description}</td>
                  <td style={{ padding: "8px" }}>{product.price}</td>
                  <td style={{ padding: "8px" }}>
                    <button
                      onClick={() => handleEdit(product)}
                      style={{
                        background: "#ffc107",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "5px"
                      }}
                    >
                      ✏ Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      🗑 Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default App;
