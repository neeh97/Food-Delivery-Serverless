import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../RestaurantView/Restaurant.css";
import Lex from "../Lex/lex";

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.handleResponse = this.handleResponse.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleUserId = this.handleUserId.bind(this);
    this.state = {
      restaurants: [],
      userId: ""
    };
  }

  componentDidMount() {
    axios
      .get("https://node-be-i4o2eck5za-uc.a.run.app/allRestaurants")
      .then((response) => this.handleResponse(response))
      .catch((error) => this.handleError(error));
  }

  handleResponse(response) {
    console.log(response);
    if (response.status == 200 && response.data.success == true) {
      this.setState({ restaurants: response.data.body });
      let email = localStorage.getItem("mfaAuthenticate")
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

  render() {
    const restaurants = this.state.restaurants;
    const userId = this.state.userId;
    return (
      <div>
        <div style={{ textAlign: "right"}}>
          <Link to={`/orderHistory/${userId}`}>
            <span>Order History</span>
          </Link>
        </div>
        <div style={{ textAlign: "center" }}>
          <h3>All Restaurants</h3>
          <table>
            <thead>
              <tr>
                <th scope="col">Restaurant</th>
                <th scope="col">Location</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr>
                  <td>
                    <Link to={`/restaurant/${restaurant.restaurant_id}`}>
                      <span>
                        {" "}
                        <strong className="item-name">
                          {restaurant.restaurant_name}
                        </strong>{" "}
                      </span>{" "}
                    </Link>
                  </td>
                  <td>
                    <span className="description"> {restaurant.location}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Lex />
      </div>
    );
  }
}

export default Homepage;
