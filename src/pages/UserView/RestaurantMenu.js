import React from "react";
import axios from "axios";
import {withRouter} from "react-router-dom";
import Button from "@material-ui/core/Button";
import "../RestaurantView/Restaurant.css";

class RestaurantMenu extends React.Component {
    constructor(props) {
        super(props);
        this.handleResponse = this.handleResponse.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handlePlacedOrder = this.handlePlacedOrder.bind(this);
        this.handleUserId = this.handleUserId.bind(this);
        this.state = {
            menuItems : [],
            totalPrice: 0,
            order:[],
            userId:""
        }
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get('https://node-be-i4o2eck5za-uc.a.run.app/menulist/'+id)
            .then(response => this.handleResponse(response)).catch(error => this.handleError(error));
    }

    handleResponse(response) {
        console.log(response);
        if (response.status == 200 && response.data.success == true) {
            this.setState({menuItems:response.data.body});
            const email = localStorage.getItem('mfaAuthenticate');
            axios.get('https://node-be-i4o2eck5za-uc.a.run.app/getUser/'+email).then(response => this.handleUserId(response));
        }
    }

    handleUserId(response) {
        if (response.status == 200 && response.data.success == true) {
            this.setState({userId:response.data.body[0].id});
        }
    }

    handleError(error) {
        console.log(error);
    }

    placeOrder = (e) => {
        e.preventDefault();
        console.log(this.state.order);
        const order = this.state.order;
        const totalPrice = this.state.totalPrice;
        const id = this.props.match.params.id;
        const userId = this.state.userId;
        if (this.state.order && this.state.order.length > 0 && totalPrice > 0) {
            var orderedItems = "";
            const length = order.length;
            order.map((item, i) => {
                if (length == i+1) {
                    orderedItems = orderedItems+item;
                } else {
                orderedItems = orderedItems+item+",";
                }
            });
            console.log(orderedItems);
            const body = {
                'items':orderedItems,
                'restaurant_id': parseInt(id),
                'user_id':userId,
                'total_price':totalPrice
            }
            axios.post('https://node-be-i4o2eck5za-uc.a.run.app/placeOrder',body)
                .then(response => this.handlePlacedOrder(response));
        } else {
            alert('Please select items before placing order!');
        }
    }

    handlePlacedOrder(response) {
        if (response.data.message == "Added successfully") {
            alert('Order placed successfully');
            this.props.history.push('/allRestaurants');
        } else {
            alert('Error in placing order! Please try again later')
        }
    }

    render() {
        const menuItems = this.state.menuItems;
        return(
            <div>
                <div style={{textAlign:"center"}}>
                    <form onSubmit={this.placeOrder.bind(this)}>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Food</th>
                                <th scope="col">Description</th>
                                <th scope="col">Price</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                            <tbody>
                                {menuItems.map((menu, index) => (
                                    <tr>
                                        <td>
                                        <span>
                                            {" "}
                                            <strong className="item-name">{menu.name}</strong>{" "}
                                        </span>{" "}
                                        </td>
                                        <td>
                                            <span className="description"> {menu.description}</span>
                                        </td>
                                        <td className="item-price">{menu.price}</td>
                                        <td>
                                            <button type="button" onClick={() => {
                                                document.getElementById('amount'+index).stepUp();
                                                let itemPrice = menu.price.substring(1); 
                                                let price=this.state.totalPrice+parseInt(itemPrice);
                                                var order = this.state.order;
                                                if (!(order.indexOf(menu.food_id) > -1)) {
                                                    order.push(menu.food_id);
                                                    this.setState({order:order});
                                                }
                                               this.setState({totalPrice:price})}}>+</button>
                                            <input type="number" className="amount" min="0" id={"amount"+index}></input>
                                            <button type="button" onClick={() => {
                                                let amount = document.getElementById('amount'+index).value;
                                                document.getElementById('amount'+index).stepDown();
                                                let steppedDownAmt = document.getElementById('amount'+index).value;
                                                if (steppedDownAmt == 0) {
                                                    var order = this.state.order;
                                                    var itemIndex = order.indexOf(menu.food_id);
                                                    order.splice(itemIndex, 1);
                                                    this.setState({order:order});
                                                }
                                                if (amount > 0) { 
                                                    let itemPrice = menu.price.substring(1); 
                                                    let price=this.state.totalPrice-parseInt(itemPrice); 
                                                    this.setState({totalPrice:price});
                                                }
                                                }}>-</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                    </table>
                    <span className="item-name">Total Price: ${this.state.totalPrice}</span>
                    <Button type="submit" color="primary" style={{marginLeft:"5%"}}>Place Order</Button>
                    </form>                  
                </div>
            </div>
        );
    }
}

export default withRouter(RestaurantMenu);