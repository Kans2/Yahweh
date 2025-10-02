import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Space,
  Typography,
  notification,
} from "antd";
import { useCart } from "../context/CartContext";

const { Title } = Typography;

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    if (!cart || cart.length === 0) {
      notification.error({ message: "Cart is empty" });
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...values, cart, total };
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submission failed");

      await res.json();
      notification.success({ message: "Order placed successfully" });
      clearCart();
      navigate("/");
    } catch (err) {
      notification.error({ message: err.message || "Failed to place order" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Row justify="center">
      <Col xs={24} sm={18} md={12}>
        <Card title="Checkout">
          <Title level={5}>Total: ${total.toFixed(2)}</Title>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="name"
              label="Full name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button onClick={() => window.history.back()}>Back</Button>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  Place Order
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
