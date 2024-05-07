import React, { useEffect, useState } from "react";
import { db } from "@/utils/firebaseConfig"; // Adjust the import path as needed
import { collection, getDocs } from "firebase/firestore";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  Menu,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useRouter } from "next/router";

export default function TeamPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "teams"));
      const teamsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(teamsData);
      setLoading(false);
    };

    fetchTeams();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAdminLogin = () => {
    router.push("/admin/login"); // Update this path to your actual admin login route
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <img
              src="https://media.formula1.com/image/upload/f_auto,c_limit,w_195,q_auto/etc/designs/fom-website/images/f1_logo"
              alt="Logo"
              style={{ height: 50, marginRight: 10 }}
            />
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
          ></Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Link href="/about">About</Link>
            </MenuItem>
          </Menu>
          <Button color="inherit" onClick={handleAdminLogin}>
            Admin Login
          </Button>
        </Toolbar>
      </AppBar>
      <Typography variant="h4" gutterBottom component="div" sx={{ mt: 2 }}>
        Formula 1 Teams
      </Typography>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {teams.map((team) => (
          <Card
            key={team.id}
            sx={{
              margin: "12px",
              minWidth: 300,
              maxWidth: 300,
              minHeight: 300,
              borderRadius: 0,
              position: "relative",
              overflow: "hidden",
              bgcolor: "background.paper",
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image={team.image_url || "/default-team.jpg"}
              alt={team.name}
              sx={{
                width: "100%",
                height: 140,
                objectFit: "cover",
              }}
            />
            <CardContent
              sx={{
                position: "relative",
                zIndex: 2,
                textAlign: "center",
                bgcolor: "rgba(0,0,0,0.7)",
                color: "#fff",
              }}
            >
              <Typography variant="h5" component="div">
                {team.name}
              </Typography>
              <Typography variant="body2">
                Principal: {team.team_principal}
              </Typography>
              <Typography variant="body2">Base: {team.base}</Typography>
              <Button variant="contained" sx={{ mt: 2 }}>
                <Link href={`/teams/${team.id}`}>See Dri</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
