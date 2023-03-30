import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CentralBody from "./Central/CentralBody";
import { Button } from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { SubjectOutlined } from "@material-ui/icons";
import Leaderboard from "./Leaderboard/Leaderboard";

const drawerWidth = 240;

const listItems = [
  {
    text: "My Game",
    icon: <SubjectOutlined color="secondary" />,
    path: "/",
  },
];

const useStyles = makeStyles((theme) => {
  return {
    active: {
      backgroundColor: "#f4f4f4",
    },
  };
});

function Layout(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userDetails, setUserDetails] = React.useState(null);
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  // console.log(children, "HIHIHIHIIHIHI");

  React.useEffect(() => {
    const flag = localStorage.getItem("token") ? true : false;
    if (!flag) {
      navigate("/login", { replace: true });
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
        .then((res) => {
          console.log(res);
          if (res.code === 401 || res.code == 403) {
            localStorage.clear();
            navigate("/login");
            return;
          }
          setUserDetails(res);
          console.log(res);
          return true;
        });
    }
  }, []);

  function handleLogout() {
    localStorage.clear();
    navigate("/login", { replace: true });
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
          <ListItemButton
            className={location.pathname === item.path ? classes.active : null}
            key={item.path}
          >
            <ListItem
              key={item.text}
              // button
              onClick={() => navigate(item.path, { replace: true })}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </ListItemButton>
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
            <Typography
              variant="h6"
              noWrap
              component="div"
              style={{ flexGrow: 1 }}
            >
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
          <CentralBody />
          {userDetails && <Leaderboard userDetails={userDetails} />}

          {/* { props.children } */}
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default Layout;
