import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "@/utils/firebaseConfig"; // Adjust the import path as needed
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

export default function TeamDetails() {
  const [team, setTeam] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { teamId } = router.query;

  useEffect(() => {
    const fetchTeamAndDrivers = async () => {
      if (teamId) {
        setLoading(true);
        const teamRef = doc(db, "teams", teamId);
        const teamDoc = await getDoc(teamRef);
        if (teamDoc.exists()) {
          setTeam(teamDoc.data());
          const driversCollection = collection(db, "teams", teamId, "drivers");
          const driverDocs = await getDocs(driversCollection);
          setDrivers(
            driverDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        }
        setLoading(false);
      }
    };

    fetchTeamAndDrivers();
  }, [teamId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => router.push("/")}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {team ? team.name : "Team Details"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Typography variant="h4" gutterBottom component="div" sx={{ mt: 2 }}>
        Drivers of {team ? team.name : ""}
      </Typography>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {drivers.map((driver) => (
          <Card
            key={driver.id}
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
              image={driver.image_url || "/default-driver.jpg"}
              alt={driver.name}
              sx={{
                width: "100%",
                height: 140,
                objectFit: "contain", // Adjusted to 'contain' to fit the image properly within the bounds
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
                {driver.name}
              </Typography>
              <Typography variant="body2">Bio: {driver.bio}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
