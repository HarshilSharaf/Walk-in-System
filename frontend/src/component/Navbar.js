import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Container from "@mui/material/Container";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import isAuth, { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: "20px",
  },
  title: {
    flexGrow: 1,
    fontWeight: "bold",
    fontSize: 24,
  },
  Toolbar: {
    boxShadow: "0px 0px",
    backgroundColor: "#222",
    color: "#fff",
  },
  button: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  noBox: {
    boxShadow: "0px 0px",
    background: "#222",
  },
}));

const Navbar = (props) => {
  const classes = useStyles();
  let history = useHistory();

  const handleClick = (location) => {
    console.log(location);
    history.push(location);
  };

  return (
    <AppBar position="fixed" className={classes.noBox}>
      <Container maxWidth="xl" className={classes.noBox}>
        <Toolbar className={classes.Toolbar}>
          <Typography variant="h6" className={classes.title}>
            Job Portal
          </Typography>
          {isAuth() ? (
            userType() === "recruiter" ? (
              <>
                <Button
                  color="inherit"
                  onClick={() => handleClick("/home")}
                  className={classes.button}
                >
                  Home
                </Button>
                <Button color="inherit" onClick={() => handleClick("/addjob")}>
                  Add Jobs
                </Button>
                <Button color="inherit" onClick={() => handleClick("/myjobs")}>
                  My Jobs
                </Button>
                <Button
                  color="inherit"
                  onClick={() => handleClick("/employees")}
                >
                  Employees
                </Button>
                <Button color="inherit" onClick={() => handleClick("/profile")}>
                  Profile
                </Button>
                <Button color="inherit" onClick={() => handleClick("/logout")}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => handleClick("/home")}>
                  Home
                </Button>
                <Button
                  color="inherit"
                  onClick={() => handleClick("/applications")}
                >
                  Applications
                </Button>
                <Button color="inherit" onClick={() => handleClick("/profile")}>
                  Profile
                </Button>
                <Button color="inherit" onClick={() => handleClick("/logout")}>
                  Logout
                </Button>
              </>
            )
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => handleClick("/login")}
                className={classes.button}
              >
                Login
              </Button>
              <Button
                color="inherit"
                onClick={() => handleClick("/signup")}
                className={classes.button}
              >
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
