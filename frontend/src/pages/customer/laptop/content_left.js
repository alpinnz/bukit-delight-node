/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Pagination } from "@material-ui/lab";
import LoadingCustom from "./../../../components/common/loading.custom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ListMenu from "./list.menu";

const ListProducts = () => {
  const { _id } = useParams();
  const Menus = useSelector((state) => state.Menus);
  const [state, setState] = useState([[]]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    convert2D();
    return () => {
      setState([[]]);
    };
  }, [Menus, _id]);

  const convert2D = async () => {
    let index = 0;
    let temp = [[]];

    const result = await Menus.data.filter((e) => e.id_category._id === _id);

    for (let i = 0; i < result.length; i++) {
      if (i % 5 === 0 && i !== 0) {
        temp[index].push(result[i]);
        if (result.length - 1 > i) {
          temp.push([]);
          index++;
        }
      } else {
        temp[index].push(result[i]);
      }
    }

    setState(temp);
  };

  const handleChange = (event, value) => {
    console.log(value);
    if (state.length > 1) {
      setPage(value);
    }
  };

  if (Menus.loading) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingCustom />
      </div>
    );
  }
  return (
    <div style={{ height: "80vh", position: "relative" }}>
      <ListMenu data={state[page - 1]} />
      <div
        style={{
          height: "5vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <Pagination
            count={state.length}
            page={page}
            onChange={handleChange}
            disabled={state.length > 1 ? false : true}
          />
        </div>
      </div>
    </div>
  );
};

const ListFavorit = () => {
  const Menus = useSelector((state) => state.Menus);
  const [state, setState] = useState([[]]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    convert2D();
    return () => {
      setState([[]]);
    };
  }, [Menus]);

  const convert2D = async () => {
    let index = 0;
    let temp = [[]];

    const result = Menus.data.filter((e) => e.promo > 0 || e.favorite);

    for (let i = 0; i < result.length; i++) {
      if (i % 5 === 0 && i !== 0) {
        temp[index].push(result[i]);
        temp.push([]);
        index++;
      } else {
        temp[index].push(result[i]);
      }
    }

    setState(temp);
  };

  const handleChange = (event, value) => {
    console.log(value);
    if (state.length > 1) {
      setPage(value);
    }
  };

  if (Menus.loading) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingCustom />
      </div>
    );
  }
  return (
    <div style={{ height: "80vh", position: "relative" }}>
      <ListMenu data={state[page - 1]} />
      <div
        style={{
          height: "5vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <Pagination
            count={state.length}
            page={page}
            onChange={handleChange}
            disabled={state.length > 1 ? false : true}
          />
        </div>
      </div>
    </div>
  );
};

const ContentLeft = () => {
  return (
    <div
      style={{
        height: "80vh",
        position: "relative",
        backgroundColor: "#FFA472",
      }}
    >
      {window.location.pathname === "/customer/home" ? (
        <ListFavorit />
      ) : (
        <ListProducts />
      )}
    </div>
  );
};

export default ContentLeft;
