const { Response } = require("./../middlewares");
const { Menus, Transactions, ItemOrders } = require("./../models");

const err = (message, status) => {
  const error = new Error(`${message}`);
  error.status = status || 200;
  return error;
};

exports.Favorite = async (req, res, next) => {
  try {
    const {} = req.body;
    const transactions = await Transactions.find();
    if (!transactions) return resError(res, "Transactions not found", 400);

    const menus = await Menus.find();
    if (!menus) return next(err("load menus failed"));

    const data_menus = menus.map((e) => {
      if (!`${e["image"]}`.includes("http")) {
        e["image"] = e["image"]
          ? `${process.env.CLIENT_URL}/${process.env.PATH_UPLOADS}/${e["image"]}`
          : null;
      }
      return e;
    });
    if (!data_menus) return next(err("load data_menus failed"));

    const itemOrders = await ItemOrders.find();
    if (!itemOrders) return next(err("load item orders failed"));

    let menus_transactions = [];

    transactions.forEach((e) => {
      const id_order = itemOrders.filter(
        (x) => x["id_order"].toString() === e["id_order"].toString()
      );

      id_order.forEach((j) => {
        const id_menu = data_menus.find(
          (x) => x["_id"].toString() === j["id_menu"].toString()
        );
        if (j["quality"] > 0) {
          for (let i = 0; i < j["quality"]; i++) {
            menus_transactions.push(id_menu);
          }
        }
      });
    });

    let menus_count_transactions = [];
    let no = 0;
    data_menus.forEach((e) => {
      const menus_filter = menus_transactions.filter(
        (x) => x["_id"].toString() === e["_id"].toString()
      );

      if (menus_filter.length > 0) {
        no++;
        menus_count_transactions.push({
          _id: e["id"],
          no: no,
          name: e["name"],
          desc: e["desc"],
          image: e["image"],
          price: e["price"],
          id_category: e["id_category"],
          createdAt: e["createdAt"],
          updatedAt: e["updatedAt"],
          __v: e["__v"],
          promo: e["promo"],
          isAvailable: e["isAvailable"],
          duration: e["duration"],
          total_transactions: menus_filter.length,
        });
      }
    });

    let DataSet = menus_count_transactions.map((e) => {
      return {
        no: e.no,
        name_menu: e.name,
        x: e.total_transactions,
        y: e.price,
      };
    });

    const getMax = async (array) => {
      let get = await array.find((e) => {
        let max_x = Math.max.apply(
          Math,
          array.map((e) => {
            return e.x;
          })
        );
        const check_dup = array.filter((x) => x.x === max_x);
        if (check_dup.length === 1) {
          return e.x === max_x;
        } else {
          let max_y = Math.max.apply(
            Math,
            check_dup.map((e) => {
              return e.y;
            })
          );
          return e.x === max_x && e.y === max_y;
        }
      });
      return get;
    };

    const getMiddle = async (array) => {
      let get = await menus_count_transactions.find(
        (e) => e._id.toString() === "6008e355385199132c6cd468"
      );
      return {
        no: get.no,
        name_menu: get.name,
        x: get.total_transactions,
        y: get.price,
      };
    };

    const getMin = async (array) => {
      let get = await array.find((e) => {
        let min_x = Math.min.apply(
          Math,
          array.map((e) => {
            return e.x;
          })
        );
        const check_dup = array.filter((x) => x.x === min_x);
        if (check_dup.length === 1) {
          return e.x === min_x;
        } else {
          let min_y = Math.min.apply(
            Math,
            check_dup.map((e) => {
              return e.y;
            })
          );
          return e.x === min_x && e.y === min_y;
        }
      });
      return get;
    };

    let c1 = await getMax(DataSet);
    let c2 = await getMiddle(DataSet);
    let c3 = await getMin(DataSet);
    let centroid = [c1, c2, c3];
    var data_kmeans = [];
    var iterasi = 0;

    const euclidean_distance = (e, c) => {
      let data_dimensi_1 = e.x;
      let data_dimensi_2 = e.y;
      let c_dimensi_1 = c.x;
      let c_dimensi_2 = c.y;
      let dimensi_1 = Math.pow(data_dimensi_1 - c_dimensi_1, 2);
      let dimensi_2 = Math.pow(data_dimensi_2 - c_dimensi_2, 2);
      return Math.sqrt(dimensi_1 + dimensi_2);
    };

    const add_cluster = async (obj) => {
      const { c1, c2, c3 } = obj;
      let arr = Object.values({ c1, c2, c3 });
      let min = Math.min(...arr);

      const getKeyByValue = (object, value) => {
        let key = Object.keys(object).find((key) => object[key] === value);
        let str_split = key.replace("c", "");
        return Number(str_split);
      };
      return getKeyByValue(obj, min);
    };

    const validate_centroid = (_data, _iterasi) => {
      console.log("iterasi : ", iterasi);
      let validate = false;
      if (_iterasi > 1) {
        const previous = _data.find((e) => e.iterasi === _iterasi - 1);
        const current = _data.find((e) => e.iterasi === _iterasi);

        previous.data.forEach((e, i) => {
          const previous_cluster = e.cluster;
          const current_cluster = current.data[i].cluster;
          if (previous_cluster !== current_cluster) {
            console.log({ previous: e, current: current.data[i] });
            validate = true;
          }
        });
      } else {
        validate = true;
      }
      return validate;
    };

    let run = true;

    // K-MEANS
    while (run) {
      var data = [];

      for (let i = 0; i < DataSet.length; i++) {
        var temp = {};
        for (let j = 0; j < centroid.length; j++) {
          if (j === centroid.length - 1) {
            temp[`c${j + 1}`] = euclidean_distance(DataSet[i], centroid[j]);
            temp["no"] = DataSet[i]["no"];
            temp["cluster"] = await add_cluster(temp);
            data.push(temp);
          } else {
            temp[`c${j + 1}`] = euclidean_distance(DataSet[i], centroid[j]);
          }
        }
      }

      var new_data = [];
      for (let i = 0; i < data.length; i++) {
        const { cluster, no } = data[i];
        let temp = { no };
        for (let j = 0; j < 3; j++) {
          if (cluster === j + 1) {
            let data_set = DataSet.find((e) => e.no === no);
            temp[`c${j + 1}`] = { x: data_set.x, y: data_set.y };
          } else {
            temp[`c${j + 1}`] = { x: 0, y: 0 };
          }
          if (j === 2) {
            new_data.push(temp);
          }
        }
      }

      let new_data_detail = {};
      // sum
      const sum = new_data.reduce((previous, current) => {
        return {
          c1: {
            x: previous.c1.x + current.c1.x,
            y: previous.c1.y + current.c1.y,
          },
          c2: {
            x: previous.c2.x + current.c2.x,
            y: previous.c2.y + current.c2.y,
          },
          c3: {
            x: previous.c3.x + current.c3.x,
            y: previous.c3.y + current.c3.y,
          },
        };
      });
      new_data_detail["sum"] = sum;
      // count
      const count = {
        c1: {
          x: new_data.reduce(
            (previous, current) => (current.c1.x > 0 ? ++previous : previous),
            0
          ),
          y: new_data.reduce(
            (previous, current) => (current.c1.y > 0 ? ++previous : previous),
            0
          ),
        },
        c2: {
          x: new_data.reduce(
            (previous, current) => (current.c2.x > 0 ? ++previous : previous),
            0
          ),
          y: new_data.reduce(
            (previous, current) => (current.c2.y > 0 ? ++previous : previous),
            0
          ),
        },
        c3: {
          x: new_data.reduce(
            (previous, current) => (current.c3.x > 0 ? ++previous : previous),
            0
          ),
          y: new_data.reduce(
            (previous, current) => (current.c3.y > 0 ? ++previous : previous),
            0
          ),
        },
      };
      new_data_detail["count"] = count;
      // avg
      const avg = {
        c1: {
          x: new_data_detail.sum.c1.x / new_data_detail.count.c1.x,
          y: new_data_detail.sum.c1.y / new_data_detail.count.c1.y,
        },
        c2: {
          x: new_data_detail.sum.c2.x / new_data_detail.count.c2.x,
          y: new_data_detail.sum.c2.y / new_data_detail.count.c2.y,
        },
        c3: {
          x: new_data_detail.sum.c3.x / new_data_detail.count.c3.x,
          y: new_data_detail.sum.c3.y / new_data_detail.count.c3.y,
        },
      };
      new_data_detail["avg"] = avg;

      // new centroid
      centroid = [avg.c1, avg.c2, avg.c3];

      iterasi++;
      const model = {
        iterasi: iterasi,
        data,
        new_data: { data: new_data, detail: new_data_detail },
      };

      data_kmeans.push(model);

      run = validate_centroid(data_kmeans, iterasi);
    }

    // get last value
    let last_kmeans = data_kmeans[data_kmeans.length - 1];

    let result_kmeans = {
      c1: last_kmeans.data
        .filter((e) => e.cluster === 1)
        .map((x) => {
          // get menu
          const menu = menus_count_transactions.find((z) => z.no === x.no);
          return menu;
        })
        .sort((a, b) => b.total_transactions - a.total_transactions),
      c2: last_kmeans.data
        .filter((e) => e.cluster === 2)
        .map((x) => {
          // get menu
          const menu = menus_count_transactions.find((z) => z.no === x.no);
          return menu;
        })
        .sort((a, b) => b.total_transactions - a.total_transactions),
      c3: last_kmeans.data
        .filter((e) => e.cluster === 3)
        .map((x) => {
          // get menu
          const menu = menus_count_transactions.find((z) => z.no === x.no);
          return menu;
        })
        .sort((a, b) => b.total_transactions - a.total_transactions),
    };

    let c1_favorit = result_kmeans.c1.slice(0, 2);
    let c2_favorit = result_kmeans.c2.slice(0, 2);
    let c3_favorit = result_kmeans.c3.slice(0, 2);

    let menu_favorit = c1_favorit.concat(c2_favorit, c3_favorit);
    //
    c1["c"] = "c1";
    c2["c"] = "c2";
    c3["c"] = "c3";
    const output = {
      c_awal: [c1, c2, c3],
      DataSet,
      data_kmeans,
      menu_cluster_akhir: result_kmeans,
      menu_favorit: menu_favorit,
    };

    return Response.Success(res, "Menu Favorite", 0, 200, output);
  } catch (error) {
    return next(err(error, 200));
  }
};

// const DataSet = [
//   {
//     no: 1,
//     menu: {
//       _id: "5fd97b79e723661e20ce76ce",
//       name: "Fried Chicken BBQ",
//       desc: "desc",
//       image:
//         "http://139.180.154.222:5000/public/uploads/image-87044298-1608088441509.jpg",
//       price: 15000,
//       id_category: "5fd33ffe62bd1e16780e2b35",
//       createdAt: "2020-12-16T03:14:01.624Z",
//       updatedAt: "2021-01-14T12:21:35.597Z",
//       __v: 0,
//       promo: 0,
//       isAvailable: true,
//       duration: 5,
//     },
//     total_transactions: 639,
//     price: 24999,
//   },
//   {
//     no: 2,
//     name_menu: "Fried Chicken Hot BBQ",
//     total_transactions: 449,
//     price: 25499,
//   },
//   {
//     no: 3,
//     name_menu: "Fried Chicken Cheese",
//     total_transactions: 138,
//     price: 26499,
//   },
//   {
//     no: 4,
//     name_menu: "Burger BBQ",
//     total_transactions: 438,
//     price: 25999,
//   },
//   {
//     no: 5,
//     name_menu: "Burger Hot BBQ",
//     total_transactions: 277,
//     price: 26499,
//   },
//   {
//     no: 6,
//     name_menu: "Burger Cheese",
//     total_transactions: 466,
//     price: 27499,
//   },
//   {
//     no: 7,
//     name_menu: "Combo A BBQ",
//     total_transactions: 521,
//     price: 25999,
//   },
//   {
//     no: 8,
//     name_menu: "Combo A Hot BBQ",
//     total_transactions: 382,
//     price: 25999,
//   },
//   {
//     no: 9,
//     name_menu: "Combo B BBQ",
//     total_transactions: 265,
//     price: 27499,
//   },
//   {
//     no: 10,
//     name_menu: "Combo B Hot BBQ",
//     total_transactions: 218,
//     price: 27499,
//   },
//   {
//     no: 11,
//     name_menu: "French Fries Original",
//     total_transactions: 1060,
//     price: 15499,
//   },
//   {
//     no: 12,
//     name_menu: "French Fries Hot BBQ",
//     total_transactions: 1116,
//     price: 16499,
//   },
//   {
//     no: 13,
//     name_menu: "French Fries Cheese",
//     total_transactions: 659,
//     price: 16999,
//   },
//   {
//     no: 14,
//     name_menu: "noodle Delight Original",
//     total_transactions: 674,
//     price: 15999,
//   },
//   {
//     no: 15,
//     name_menu: "noodle Delight Spicy",
//     total_transactions: 837,
//     price: 16999,
//   },
//   {
//     no: 16,
//     name_menu: "noodle Delight Hot",
//     total_transactions: 273,
//     price: 17999,
//   },
//   {
//     no: 17,
//     name_menu: "noodle Delight Original BBQ",
//     total_transactions: 245,
//     price: 16999,
//   },
//   {
//     no: 18,
//     name_menu: "noodle Delight Spicy Volcano",
//     total_transactions: 176,
//     price: 17999,
//   },
//   {
//     no: 19,
//     name_menu: "noodle Delight Hitam Manis",
//     total_transactions: 1,
//     price: 16499,
//   },
//   {
//     no: 20,
//     name_menu: "noodle Delight Hitam Manis Spicy",
//     total_transactions: 2,
//     price: 17499,
//   },
//   {
//     no: 21,
//     name_menu: "noodle Delight Hitam Manis Hot",
//     total_transactions: 1,
//     price: 18499,
//   },
//   {
//     no: 22,
//     name_menu: "Mie Ayam Delight",
//     total_transactions: 578,
//     price: 17499,
//   },
//   {
//     no: 23,
//     name_menu: "Banana Delight Vanilla",
//     total_transactions: 77,
//     price: 15999,
//   },
//   {
//     no: 24,
//     name_menu: "Banana Delight Tiramisu",
//     total_transactions: 281,
//     price: 15999,
//   },
//   {
//     no: 25,
//     name_menu: "Banana Delight Choco",
//     total_transactions: 192,
//     price: 15999,
//   },
//   {
//     no: 26,
//     name_menu: "Banana Delight Cheese",
//     total_transactions: 76,
//     price: 16999,
//   },
//   {
//     no: 27,
//     name_menu: "Banana Delight Choco Cheese",
//     total_transactions: 198,
//     price: 17999,
//   },
//   {
//     no: 28,
//     name_menu: "Banana Delight Vanilla Cheese",
//     total_transactions: 38,
//     price: 17999,
//   },
//   {
//     no: 29,
//     name_menu: "Roti Bakar Delight Vanilla",
//     total_transactions: 92,
//     price: 15499,
//   },
//   {
//     no: 30,
//     name_menu: "Roti Bakar Delight Tiramisu",
//     total_transactions: 298,
//     price: 15499,
//   },
//   {
//     no: 31,
//     name_menu: "Roti Bakar Delight Choco",
//     total_transactions: 323,
//     price: 15499,
//   },
//   {
//     no: 32,
//     name_menu: "Roti Bakar Delight Cheese",
//     total_transactions: 127,
//     price: 15499,
//   },
//   {
//     no: 33,
//     name_menu: "Roti Bakar Delight Choco Cheese",
//     total_transactions: 489,
//     price: 17499,
//   },
//   {
//     no: 34,
//     name_menu: "Roti Bakar Delight Vanilla Cheese",
//     total_transactions: 87,
//     price: 17499,
//   },
//   {
//     no: 35,
//     name_menu: "Pancake Delight Original",
//     total_transactions: 417,
//     price: 15399,
//   },
//   {
//     no: 36,
//     name_menu: "Pancake Delight Ice Cream",
//     total_transactions: 479,
//     price: 18499,
//   },
//   {
//     no: 37,
//     name_menu: "Cireng Delight",
//     total_transactions: 1313,
//     price: 15499,
//   },
//   {
//     no: 38,
//     name_menu: "Siomay Basah",
//     total_transactions: 1033,
//     price: 14999,
//   },
//   {
//     no: 39,
//     name_menu: "Es Kopi Delight Original Cofee",
//     total_transactions: 872,
//     price: 14999,
//   },
//   {
//     no: 40,
//     name_menu: "Es Kopi Delight Strong Cofee",
//     total_transactions: 498,
//     price: 15499,
//   },
//   {
//     no: 41,
//     name_menu: "Es Kopi Delight Coconut Milk",
//     total_transactions: 680,
//     price: 15499,
//   },
//   {
//     no: 42,
//     name_menu: "Chocolate Flavour Ice Chocolate",
//     total_transactions: 799,
//     price: 17499,
//   },
//   {
//     no: 43,
//     name_menu: "Chocolate Flavour Ice Milo Bomb",
//     total_transactions: 881,
//     price: 17999,
//   },
//   {
//     no: 44,
//     name_menu: "Milkshake Vanilla",
//     total_transactions: 1076,
//     price: 15999,
//   },
//   {
//     no: 45,
//     name_menu: "Milkshake Strawberry",
//     total_transactions: 1012,
//     price: 15999,
//   },
//   {
//     no: 46,
//     name_menu: "Milkshake Tiramisu",
//     total_transactions: 596,
//     price: 17499,
//   },
//   {
//     no: 47,
//     name_menu: "Milkshake Oreo",
//     total_transactions: 1292,
//     price: 17499,
//   },
//   {
//     no: 48,
//     name_menu: "Milkshake GreenTea",
//     total_transactions: 546,
//     price: 17499,
//   },
//   {
//     no: 49,
//     name_menu: "Milkshake Taro",
//     total_transactions: 412,
//     price: 17499,
//   },
//   {
//     no: 50,
//     name_menu: "Milkshake Banana",
//     total_transactions: 309,
//     price: 17499,
//   },
//   {
//     no: 51,
//     name_menu: "Ice Tea Original",
//     total_transactions: 290,
//     price: 8499,
//   },
//   {
//     no: 52,
//     name_menu: "Ice Tea Lemon",
//     total_transactions: 373,
//     price: 10499,
//   },
//   {
//     no: 53,
//     name_menu: "Ice Tea Peach",
//     total_transactions: 114,
//     price: 11499,
//   },
//   {
//     no: 54,
//     name_menu: "Ice Tea Lychee",
//     total_transactions: 533,
//     price: 10999,
//   },
//   {
//     no: 55,
//     name_menu: "Hot Beverages Cocolate",
//     total_transactions: 970,
//     price: 18999,
//   },
//   {
//     no: 56,
//     name_menu: "Hot Beverages Milo",
//     total_transactions: 500,
//     price: 15999,
//   },
//   {
//     no: 57,
//     name_menu: "Hot Beverages Coffe",
//     total_transactions: 747,
//     price: 9999,
//   },
//   {
//     no: 58,
//     name_menu: "Hot Beverages Coffe + Milk",
//     total_transactions: 1220,
//     price: 11999,
//   },
//   {
//     no: 59,
//     name_menu: "Hot Beverages Tea",
//     total_transactions: "632",
//     price: "7499",
//   },
//   {
//     no: 60,
//     name_menu: "Hot Beverages Tea - Lemon",
//     total_transactions: 628,
//     price: 8999,
//   },
//   {
//     no: 61,
//     name_menu: "Hot Beverages Tea - Peach",
//     total_transactions: 112,
//     price: 10499,
//   },
//   {
//     no: 62,
//     name_menu: "Hot Beverages Tea - Lychee",
//     total_transactions: 396,
//     price: 9499,
//   },
//   {
//     no: 63,
//     name_menu: "Hot Beverages Tea - Tarik",
//     total_transactions: 281,
//     price: 12999,
//   },
//   {
//     no: 64,
//     name_menu: "Hot Beverages Ginger",
//     total_transactions: 178,
//     price: 15499,
//   },
//   {
//     no: "65",
//     name_menu: "Hot Beverages Rempah Nusantara",
//     total_transactions: 320,
//     price: 17999,
//   },
//   {
//     no: 66,
//     name_menu: "Hot Beverages The Biru Bunga Telang",
//     total_transactions: 127,
//     price: 14999,
//   },
//   {
//     no: 67,
//     name_menu: "Rootbeer Float",
//     total_transactions: 135,
//     price: 20499,
//   },
//   {
//     no: 68,
//     name_menu: "Lime Squash",
//     total_transactions: 145,
//     price: 14499,
//   },
//   {
//     no: 69,
//     name_menu: "Majito Breeze",
//     total_transactions: 188,
//     price: 16999,
//   },
//   {
//     no: 70,
//     name_menu: "Mineral Watter",
//     total_transactions: 389,
//     price: 5499,
//   },
// ];

//
