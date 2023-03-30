import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CentralBody from "./Central/CentralBody";
import { Button } from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";

const drawerWidth = 240;

const listItems = [
  {
    text: "My Game",
    // icon: <SubjectOutlined color="secondary" />,
    path: "/",
  },
  {
    text: "Leaderboard",
    // icon: <AddCircleOutlineOutlined color="secondary" />,
    path: "/leaderboard",
  }
];


const useStyles = makeStyles((theme) => {
  return {
    active: {
      backgroundColor: "#f4f4f4",
    }
  };
});

function Layout(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userDetails, setUserDetails] = React.useState(null);
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  console.log(props, "HIHIHIHIIHIHI");

  React.useEffect(() => {
    const flag = localStorage.getItem("token") ? true : false;
    if (!flag) {
      navigate('/login', { replace: true });
    } else {
      const token = JSON.parse(localStorage.getItem("token"));
      fetch("/auth/getUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.code == "token_not_valid") {
            handleLogout();
          } else {
            setUserDetails(data);
            console.log(data);
          }
          return data;
        });
    }
  }, []);

  function handleLogout() {
    localStorage.clear();
    navigate('/login', { replace: true });
    return;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      {/* List / Links */}
      <List>
            {listItems.map((item) => (
              <ListItem
                key={item.text}
                button
                onClick={() => navigate(item.path, { replace: true })}
                className={
                  location.pathname == item.path ? classes.active : null
                }
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <React.Fragment>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* Navigation Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" style={{flexGrow: 1}}>
              Memory Game
            </Typography>
            <Typography>
              Hi, {userDetails ? userDetails.name : "Login first"}
            </Typography>
            <Button
              variant="outlined"
              style={{
                backgroundColor: "#ff1744",
                color: "white",
                marginLeft: "7px",
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          {/*Here the central component come.  */}
          {/* <CentralBody /> */}
          { props.children }
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default Layout;
