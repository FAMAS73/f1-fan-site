// File: pages/teams.js
import { useEffect, useState } from "react";
import { db } from "../utils/firebaseConfig"; // Firebase config file path
import { collection, getDocs, query } from "firebase/firestore";
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import Link from "next/link";

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "teams"));
        const querySnapshot = await getDocs(q);
        const teamsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
      setLoading(false);
    };

    fetchTeams();
  }, []);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Formula 1 Teams
      </Typography>
      {loading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : (
        teams.map((team) => (
          <Card key={team.id} sx={{ mb: 4 }}>
            <CardMedia
              component="img"
              height="140"
              image={team.image_url || "default_image.jpg"} // Provide a default image if none is available
              alt={team.name}
            />
            <CardContent>
              <Typography variant="h5" component="div">
                {team.name}
              </Typography>
              <Button variant="contained" color="primary">
                <Link href={`/teams/${team.id}`}>View Drivers</Link>
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default TeamsPage;
