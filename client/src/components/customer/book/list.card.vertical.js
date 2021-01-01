/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { Grid, useMediaQuery, useTheme, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import useWindowDimensions from "./../../hooks/useWindowDimensions";

const ListCardVertical = ({ data = [], onPress }) => {
  const [state, setState] = React.useState([]);
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.down("xs"));
  const { height, width } = useWindowDimensions();

  const margin = width * 0.025;

  React.useEffect(() => {
    if (isXS) {
      convertCols(data, 2);
    } else {
      convertCols(data, 3);
    }
    return () => {
      setState([]);
    };
  }, [data, window.innerWidth]);

  const convertCols = async (array, numSplit) => {
    let none = 0;
    if (array.length % numSplit !== 0) {
      let loop = true;
      while (loop) {
        if (array.length % numSplit !== 0) {
          array.push({ name: `none-${none++}` });
        } else {
          loop = false;
        }
      }
    }
    let temp = [];

    let j = 0;
    while (j < array.length) {
      for (let i = 0; i < numSplit; i++) {
        if (j < numSplit) {
          temp.push([array[j]]);
        } else {
          let _temp = temp[i];
          _temp.push(array[j]);
          temp[i] = _temp;
        }
        j++;
      }
      setState(temp);
    }
  };

  if (state.length === 0) {
    return <div />;
  }

  return (
    <div style={{ marginLeft: margin / 2, marginRight: margin / 2 }}>
      <Grid container>
        {state.length > 0 ? (
          state.map((parent, index) => {
            return (
              <Grid key={`parent-${index}`} item xs={6} sm={4}>
                {parent.map((e, i) => {
                  const colors = [
                    "#BCB686B8",
                    "#AA2222A3",
                    "#C8540059",
                    "#CAC43566",
                    "#7CAF4E80",
                    "#BCB686B8",
                  ];
                  const heights = [178, 188, 200, 220, 240, 270];
                  function randomNumber(min, max) {
                    const result = Math.random() * (max - min) + min;
                    return parseInt(result);
                  }

                  return (
                    <div
                      key={`parent-${index}-${i}`}
                      style={{
                        marginLeft: margin / 2,
                        marginRight: margin / 2,
                        marginBottom: margin,
                      }}
                    >
                      <Link to={`/book/${e._id}`} params={{ e }}>
                        {e.image ? (
                          <div
                            style={{
                              backgroundImage: `url(${e.image})`,
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                              backgroundRepeat: "no-repeat",
                              position: "relative",
                              width: "100%",
                              borderRadius: 9,
                              height: heights[randomNumber(0, 5)],
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                backgroundColor: colors[randomNumber(0, 5)],
                                bottom: 0,
                                right: 0,
                                left: 0,
                                borderBottomLeftRadius: 9,
                                borderBottomRightRadius: 9,
                                borderTopRightRadius: 1,
                                borderTopLeftRadius: 1,
                                height: width * 0.08,
                                justifyContent: "center",
                                alignItems: "center",
                                display: "flex",
                              }}
                            >
                              <Typography
                                style={{ color: "#FFFFFF" }}
                                align={"center"}
                              >
                                {`${e.name}`}
                              </Typography>
                            </div>
                          </div>
                        ) : (
                          <div />
                        )}
                      </Link>
                    </div>
                  );
                })}
              </Grid>
            );
          })
        ) : (
          <div />
        )}
      </Grid>
    </div>
  );
};

export default ListCardVertical;
