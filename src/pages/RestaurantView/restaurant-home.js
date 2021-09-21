import React, { useEffect, useState } from "react";
import "./Restaurant.css";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import styled from "styled-components";
import Header from "../Header";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

function RestaurentHome() {
  const [menus, setMenu] = useState([]);
  const [restName, setRestName] = useState(1);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const resId = localStorage.getItem("userId");
  useEffect(() => {
    fetch(`https://node-be-i4o2eck5za-uc.a.run.app/menulist/${resId}`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setMenu(result.body);
      });
  }, [restName, menus]);

  const removeHandler = (id) => {
    console.log(id);
    axios
      .put(`https://node-be-i4o2eck5za-uc.a.run.app/delete/${id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addHandler = () => {
    setOpen(true);
  };
  const closeHandler = () => {
    setOpen(false);
  };
  const handleChange = (e) => {
    console.log(e.target.value);
    setRestName(e.target.value);
  };

  const changeHandler = (event) => {
    if (event.target.id == "name") {
      setName(event.target.value);
      console.log(name);
    }
    if (event.target.id == "description") {
      setDescription(event.target.value);
      console.log(description);
    }
    if (event.target.id == "price") {
      setPrice(event.target.value);
      console.log(price);
    }
  };

  const submitHandler = () => {
    axios
      .post(`https://node-be-i4o2eck5za-uc.a.run.app/add/${resId}`, {
        name: name,
        description: description,
        price: price,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setOpen(false);
  };

  return (
    <div>
      <Header />
      <div>
        <table style={{ marginTop: "50px" }}>
          <thead>
            <tr>
              <th scope="col">
                Item{" "}
                <IconButton onClick={() => addHandler()}>
                  <AddIcon />
                </IconButton>
              </th>
              <th scope="col">Price</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menus?.map((menu) => (
              <tr>
                <td>
                  <span>
                    {" "}
                    <strong className="item-name">{menu.name}</strong>{" "}
                  </span>{" "}
                  <br />
                  <span className="description"> {menu.description}</span>
                </td>

                <td className="item-price">{menu.price}</td>
                <td className="item-price">
                  <IconButton onClick={() => removeHandler(menu.food_id)}>
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Items</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            onChange={changeHandler}
            id="name"
            label="Name"
            type="text"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            onChange={changeHandler}
            id="description"
            label="Description"
            type="text"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            onChange={changeHandler}
            id="price"
            label="Price"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={submitHandler} color="primary">
            Add
          </Button>
          <Button onClick={closeHandler} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RestaurentHome;

const Dropdown = styled.div`
  text-align: center;
  margin-top: 40px;
`;
