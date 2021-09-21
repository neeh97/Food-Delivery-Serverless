import React from "react";
import axios from "axios";
import {withRouter} from "react-router-dom";
import { Link } from "react-router-dom";
import "../RestaurantView/Restaurant.css";

class OrderHistory extends React.Component {

    constructor(props) {
        super(props);
        this.handleResponse = this.handleResponse.bind(this);
        this.state = {
            orders : []
        }
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get('https://node-be-i4o2eck5za-uc.a.run.app/orderHistory/'+id)
            .then(response => this.handleResponse(response));
    }

    handleResponse(response) {
        console.log(response);
        if (response.data.success == true) {
            this.setState({orders:response.data.body});
        }
    }

    render() {
        const orders = this.state.orders;
        return(
            <div>
                <div style={{textAlign:"center"}}>
                    <h4>Order history</h4>
                    <br/>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Order ID</th>
                                <th scope="col">Restaurant ID</th>
                                <th scope="col">Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr>
                                    <td>
                                    <Link to={`/order/${order.orderId}`}>
                                        <span className="item-name"> {order.orderId}</span>
                                    </Link>
                                    </td>
                                    <td>
                                        <span className="item-name"> {order.restaurantId}</span>
                                    </td>
                                    <td>
                                        <span className="item-name"> {order.price}</span>
                                    </td>
                                </tr>
                                
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

}

export default withRouter(OrderHistory);