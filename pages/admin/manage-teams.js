import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../utils/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";

const ManageTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "teams"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTeams(data);
    setLoading(false);
  };

  const handleAddTeam = async () => {
    if (teamName) {
      await addDoc(collection(db, "teams"), { name: teamName });
      fetchTeams();
      setTeamName("");
    }
  };

  const handleUpdateTeam = async () => {
    if (editId && teamName) {
      const teamRef = doc(db, "teams", editId);
      await updateDoc(teamRef, { name: teamName });
      fetchTeams();
      setTeamName("");
      setEditId(null);
    }
  };

  const handleDeleteTeam = async (id) => {
    const teamRef = doc(db, "teams", id);
    await deleteDoc(teamRef);
    fetchTeams();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Manage Teams
      </Typography>
      <TextField
        label="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button
        onClick={editId ? handleUpdateTeam : handleAddTeam}
        variant="contained"
        color="primary"
      >
        {editId ? "Update Team" : "Add Team"}
      </Button>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <List>
          {teams.map((team) => (
            <ListItem key={team.id}>
              <ListItemText primary={team.name} />
              <Button
                onClick={() => {
                  setEditId(team.id);
                  setTeamName(team.name);
                }}
              >
                Edit
              </Button>
              <Button onClick={() => handleDeleteTeam(team.id)}>Delete</Button>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default ManageTeams;
