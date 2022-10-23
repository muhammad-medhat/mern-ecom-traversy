import React, { useEffect, useState } from "react";
import { Card, Col, Form, Image, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../../actions/orderActions";
import OrderSummery from "../com/order/orderSummery";
import Message from "../message";
import CheckoutSteps from "../partials/checkoutSteps";

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  const cart = useSelector((s) => s.cart);
  const nav = useNavigate();

  const { shippingAddress, paymentMethod, cartItems } = cart;

  useEffect(() => {
    // debugger;
    calculateSummery()
    if (order && !(Object.keys(order).length === 0)) {
      nav(`/order/${order._id}`);
      // eslint-disable-next-line
    }
  }, [dispatch, success, orderCreate]);

  const [itemsSum, setItemsSum] = useState(0);
  const [taxSum, setTaxSum] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [totalSum, setTotalSum] = useState(0);
  const [summery, setSummery] = useState({});
  const calculateSummery = () => {
    const tax = 0.15;
    setItemsSum(
      Number(cartItems.reduce((acc, i) => i.price * i.qty + acc, 0).toFixed(2))
    );
    setTaxSum(
      Number(cartItems.reduce((acc, i) => i.price * tax + acc, 0).toFixed(2))
    );
    setShipping(Number((itemsSum >= 100 ? 20 : 50).toFixed(2)));
    setTotalSum(Number((itemsSum + taxSum + shipping).toFixed(2)));
    setSummery = { shipping, totalSum, taxSum, itemsSum };
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    debugger;
    const orderObject = {
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      ...summery,
    };

    /**
     *  itemsPrice: itemsSum,
        // taxPrice: taxSum,
        // shippingPrice: shipping,
        // totalPrice: totalSum,        
        ...summery,
     */

    dispatch(
      createOrder({
        ...orderObject,
      })
    );

  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <h2>place order </h2>
      <Row>
        <Col md={8}>
          <ListGroup>
            <ListGroup.Item>
              <h3>shipping address</h3>
              <ListGroup>
                <span>
                  {shippingAddress.address}, {shippingAddress.city},{" "}
                  {shippingAddress.postalCode}, {shippingAddress.country},{" "}
                </span>
              </ListGroup>
            </ListGroup.Item>
            <ListGroup.Item>
              <h3>payment method</h3>
              <ListGroup.Item>{paymentMethod}</ListGroup.Item>
              {/* {order.isPaid? <Message variant='success'>Paid</Message>:
              <Message variant='danger'>not Paid yet</Message>} */}
            </ListGroup.Item>

            <ListGroup.Item>
              <h3> order items</h3>

              {cartItems.map((item) => {
                return (
                  <Row key={item.product} className="cart-product">
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col className="p-title">
                      <Link to={`/products/${item.product}`} title={item.name}>
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} X {item.price}
                    </Col>
                    <Col md={2}>$ {item.qty * item.price}</Col>
                  </Row>
                );
              })}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <OrderSummery {...summery} />
          <ListGroup.Item>
            <Form.Control
              type="submit"
              value="create order"
              className="btn-block"
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0}
              title="proceed to payment"
            />
          </ListGroup.Item>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
