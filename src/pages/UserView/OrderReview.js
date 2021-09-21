import React from "react";
import axios from "axios";
import {withRouter} from "react-router-dom";
import "../RestaurantView/Restaurant.css";
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import Button from "@material-ui/core/Button";

class OrderReview extends React.Component {

    constructor(props) {
        super(props);
        this.handleResponse = this.handleResponse.bind(this);
        this.handleError = this.handleError.bind(this);
        this.postReview = this.postReview.bind(this);
        this.handleReviewResponse = this.handleReviewResponse.bind(this);
        this.state = {
            order: {},
            review: "",
            error: ""
        }
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get('https://node-be-i4o2eck5za-uc.a.run.app/order/'+id)
            .then(response => this.handleResponse(response)).catch(error => this.handleError(error));
    }

    handleResponse(response) {
        console.log(response);
        if (response.status == 200 && response.data.success == true) {
            if (response.data.body.length == 0) {
                this.setState({error:"No such order ID."});
            } else {
                this.setState({order:response.data.body[0]});
                this.setState({review:response.data.body[0].review});
            }
        }
        this.forceUpdate();
    }

    handleError(error) {
        console.log(error);
    }

    setReviewState(e) {
        this.setState({review: e});
    }

    postReview() {
        const id = this.props.match.params.id;
        const review = this.state.review;
        const req = {
            'orderId':id,
            'review':review
        }
        axios.post('https://node-be-i4o2eck5za-uc.a.run.app/postReview', req)
            .then(response => this.handleReviewResponse(response));
    }

    handleReviewResponse(response) {
        console.log(response);
        if (response.status == 200 && response.data.message == "Review updated successfully") {
            alert('Your review has been posted! Thank you for your feedback!');
        }
    }

    render() {
        const order = this.state.order;
        const review = this.state.review;
        const error = this.state.error;
        console.log(this.state);
        if (!error) {
            return(
                <div>
                    <div style={{textAlign:"center"}}>
                        <h4>Order details: {order.orderId}</h4>
                        <br/><br/>
                        <span className="item-name">Order status: {order.orderStatus}</span>
                        <br/>
                        <span className="item-name">Order placed on: {order.order_placed_on}</span>
                        <br/>
                        <span className="item-name">Order cost: {order.total_price}</span>
                        <br/><br/>
                        <span>Review your order:</span>
                        <br/><br/>
                        <div align="center">
                        <ReactQuill
                            theme="snow"
                            value={review}
                            onChange={this.setReviewState.bind(this)}
                            style={{minHeight:'300px', maxWidth:'30%'}}
                        />
                        <Button type="button" color="primary" onClick={this.postReview}>Review</Button>
                        </div>
                    </div>
                </div>
            )          
        } else {
            return(
                <div>
                    <div style={{textAlign:"center"}}>
                        <h4 style={{color:"red"}}>{error}</h4>
                    </div>
                </div>
            )
        }
    }
}

export default withRouter(OrderReview);