import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import RestaurentHome from "./pages/RestaurantView/restaurant-home";
import Homepage from "./pages/UserView/Homepage";
import OrderHistory from "./pages/UserView/OrderHistory";
import OrderReview from "./pages/UserView/OrderReview";
import RestaurantMenu from "./pages/UserView/RestaurantMenu";
import Registration from "./pages/Authentication/Registration";
import Visualization from "./pages/RestaurantView/Visualization";
import Login from "./pages/Authentication/Login";
import Mfa from "./pages/Authentication/Mfa";
import PrivateRoute from "./components/routes/PrivateRoute";
import RestrictedRoute from "./components/routes/RestrictedRoute";
import WordCloud from "./pages/DataProcessing/WordCloud";
import UploadFile from "./pages/DataProcessing/UploadFile";
import RecipeForm from "./pages/RecipeForm";

function App() {
  return (
    <Router>
      <Switch>
        {/* Add new routes here at top, and not from bottom. */}
        <PrivateRoute path="/allRestaurants"><Homepage/></PrivateRoute>
        <PrivateRoute path="/restaurant/:id"><RestaurantMenu/></PrivateRoute>
        <PrivateRoute path="/orderHistory/:id"><OrderHistory/></PrivateRoute>
        <PrivateRoute path="/order/:id"><OrderReview/></PrivateRoute>
        <PrivateRoute exact path="/mfa" component={Mfa} />
        <PrivateRoute path="/visualization"><Visualization/></PrivateRoute>
        <RestrictedRoute exact path="/registration" component={Registration} />
        <RestrictedRoute exact path="/login" component={Login} />
        <Route path="/wordCloud" component={WordCloud} />
        <Route path="/chat" component={Chat} />
        <Route path="/recipe" component={RecipeForm} />
        <PrivateRoute path="/uploadMenu" component={UploadFile} />
        <PrivateRoute path="/restaurent">
          <RestaurentHome />
        </PrivateRoute>
        <PrivateRoute path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
