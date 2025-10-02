import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  List,
  Image,
  InputNumber,
  Button,
  Divider,
  Typography,
  Row,
  Col,
  Space,
  Result,
  notification,
} from "antd";
import { useCart } from "../context/CartContext";

const { Title } = Typography;

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const navigate = useNavigate();

  if (!cart || cart.length === 0) {
    return (
      <Result
        status="info"
        title="Your cart is empty"
        extra={[
          <Button type="primary" key="browse" onClick={() => navigate("/")}>
            Browse Products
          </Button>,
        ]}
      />
    );
  }

  return (
    <div>
      <Title level={3}>Your Cart</Title>

      <List
        itemLayout="horizontal"
        dataSource={cart}
        renderItem={(item) => (
          <List.Item
            actions={[
              <InputNumber
                min={1}
                value={item.quantity}
                onChange={(v) => {
                  updateQuantity(item.id, v);
                }}
              />,
              <Button
                danger
                onClick={() => {
                  removeFromCart(item.id);
                  notification.info({ message: "Removed from cart" });
                }}
              >
                Remove
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Image
                  width={80}
                  src={item.image}
                  preview={false}
                  style={{ objectFit: "contain" }}
                />
              }
              title={<div style={{ maxWidth: 420 }}>{item.title}</div>}
              description={`$${item.price.toFixed(2)} x ${item.quantity} = $${(
                item.price * item.quantity
              ).toFixed(2)}`}
            />
          </List.Item>
        )}
      />

      <Divider />

      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4}>Total: ${total.toFixed(2)}</Title>
        </Col>
        <Col>
          <Space>
            <Button
              onClick={() => {
                clearCart();
                notification.success({ message: "Cart cleared" });
              }}
            >
              Clear Cart
            </Button>

            <Link to="/checkout">
              <Button type="primary">Checkout</Button>
            </Link>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
