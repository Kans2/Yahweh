import React, { useState, useEffect } from "react";
import { Row, Col, Input, Select, Card, Spin, Image, Typography } from "antd";
import { Link } from "react-router-dom";
import { notification } from "antd";

const { Option } = Select;
const { Paragraph } = Typography;

async function fetchProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setFiltered(data);
        setCategories([...new Set(data.map((p) => p.category))]);
      })
      .catch((err) => {
        setError(err.message);
        notification.error({ message: err.message });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = [...products];
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (search.trim())
      list = list.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    setFiltered(list);
  }, [products, search, category]);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  if (error) return <Paragraph type="danger">{error}</Paragraph>;

  return (
    <>
      {/* Search and Filter Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12}>
          <Input.Search
            placeholder="Search products"
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col xs={24} sm={12}>
          <Select
            value={category}
            onChange={(val) => setCategory(val)}
            style={{ width: "100%" }}
          >
            <Option value="All">All Categories</Option>
            {categories.map((c) => (
              <Option key={c} value={c}>
                {c}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      {/* Product Grid */}
      <Row gutter={[16, 16]}>
        {filtered.map((p) => (
          <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              bodyStyle={{ minHeight: 120 }}
              cover={
                <Image
                  preview={false}
                  src={p.image}
                  style={{
                    height: 200,
                    objectFit: "contain",
                    padding: "10px",
                  }}
                />
              }
            >
              <Card.Meta
                title={
                  <Link
                    to={`/products/${p.id}`}
                    style={{
                      display: "inline-block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100%",
                    }}
                  >
                    {p.title}
                  </Link>
                }
                description={<strong>${p.price}</strong>}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default ProductList;
