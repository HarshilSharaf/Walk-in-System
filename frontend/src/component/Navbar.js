import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import Container from "@mui/material/Container";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { makeStyles } from "@mui/styles";
import isAuth, { userType } from "../lib/isAuth";
import MenuIcon from "@mui/icons-material/Menu";
import { applicant, recruiter } from "../data/Navbar";
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

  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleClick = (location) => {
    console.log(location);
    history.push(location);
    setAnchorElNav(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="fixed" className={classes.noBox}>
      <Container maxWidth="xl" className={classes.noBox}>
        <Toolbar className={classes.Toolbar}>
          <Typography
            variant="h6"
            className={classes.title}
            sx={{ flexGrow: 1, display: "flex" }}
          >
            Job Portal
          </Typography>
          {isAuth() ? (
            userType() === "recruiter" ? (
              <>
                <Box
                  sx={{ flexGrow: 0, display: { xs: "inline", md: "none" } }}
                >
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: "block", md: "none" },
                    }}
                  >
                    {recruiter.map((page) => (
                      <MenuItem
                        key={page.key}
                        onClick={() => handleClick(page.pageLocation)}
                      >
                        <Typography textAlign="center">
                          {page.pageName}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
                <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
                  {recruiter.map((page) => (
                    <Button
                      key={page.key}
                      onClick={() => handleClick(page.pageLocation)}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {page.pageName}
                    </Button>
                  ))}
                </Box>
              </>
            ) : (
              <>
                <Box
                  sx={{ flexGrow: 0, display: { xs: "inline", md: "none" } }}
                >
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: "block", md: "none" },
                    }}
                  >
                    {applicant.map((page) => (
                      <MenuItem
                        key={page.key}
                        onClick={() => handleClick(page.pageLocation)}
                      >
                        <Typography textAlign="center">
                          {page.pageName}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
                <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
                  {applicant.map((page) => (
                    <Button
                      key={page.key}
                      onClick={() => handleClick(page.pageLocation)}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {page.pageName}
                    </Button>
                  ))}
                </Box>
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
