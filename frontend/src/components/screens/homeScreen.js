import React from 'react';
import { Row, Col } from 'react-bootstrap';
import products from '../../products';
import Product from '../product/product';
const HomeScreen = () => {
    return ( 
        <>   
        <Row>
            {products.map(product => (
             
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    {/* <Product key={product._id} {...product} /> */}
                    <Product product={product} />
               </Col>
            ))}
        </Row>

        </>
     );
}
 
export default HomeScreen;