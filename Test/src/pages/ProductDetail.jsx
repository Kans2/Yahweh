import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Row,
    Col,
    Image,
    Typography,
    Spin,
    Button,
    Space,
    Divider,
    notification,
} from "antd";
import { useCart } from "../context/CartContext";

const { Title, Paragraph } = Typography;

async function fetchProductById(id) {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!res.ok) throw new Error("Failed to fetch product");
    return res.json();
}

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchProductById(id)
            .then((data) => {
                if (!mounted) return;
                setProduct(data);
                setError(null);
            })
            .catch((err) => {
                if (!mounted) return;
                setError(err.message || "Product not found");
                notification.error({ message: err.message || "Product not found" });
            })
            .finally(() => mounted && setLoading(false));
        return () => (mounted = false);
    }, [id]);

    if (loading)
        return (
            <div style={{ textAlign: "center", padding: 40 }}>
                <Spin size="large" />
            </div>
        );

    if (error)
        return (
            <div style={{ textAlign: "center", padding: 40 }}>
                <Title level={4}>Something went wrong</Title>
                <Paragraph type="danger">{error}</Paragraph>
                <Button type="primary" onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </div>
        );

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} md={10}>
                <Image
                    src={product.image}
                    alt={product.title}
                    style={{ width: "100%", maxHeight: 500, objectFit: "contain" }}
                    preview={false}
                />
            </Col>

            <Col xs={24} md={14}>
                <Title level={3} style={{ marginBottom: 8 }}>
                    {product.title}
                </Title>

                <Paragraph>
                    <strong>Category: </strong>
                    {product.category}
                </Paragraph>

                <Paragraph style={{ marginTop: 8 }}>{product.description}</Paragraph>

                <Title level={4} style={{ marginTop: 12 }}>
                    ${product.price.toFixed(2)}
                </Title>

                <Space style={{ marginTop: 16 }}>
                    <Button
                        type="primary"
                        onClick={() => {
                            addToCart(
                                { id: product.id, title: product.title, price: product.price, image: product.image },
                                1
                            );
                           
                        }}
                    >
                        Add to Cart
                    </Button>

                    <Link to="/cart">
                        <Button>Go to Cart</Button>
                    </Link>
                </Space>

                <Divider />

                <Button type="link" onClick={() => window.history.back()}>
                    ← Back
                </Button>
            </Col>
        </Row>
    );
}
