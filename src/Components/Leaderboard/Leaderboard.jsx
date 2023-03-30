import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function sortByKey(array, key) {
  return array.sort(function (a, b) {
    var x = a[key];
    var y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

export default function Leaderboard({ userDetails }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();
  //   const [userDetails, setUserDetails] = React.useState(null);

  function getLeaderboard() {
    const token = JSON.parse(localStorage.getItem("token"));
    fetch("/leaderboard/getLeaderboard/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.code === 401 || res.code == 403) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        if (res.status === 200) {
          const sortedData = sortByKey(res.data, "moves");
          setLeaderboard(sortedData);
        }
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    getLeaderboard();
    const timer = setInterval(() => {
      getLeaderboard();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 2 }}>
        Leaderboard
      </Typography>
      <Typography variant="text" color="textSecondary">
        (Sorted by moves taken)
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell width={30}>S.No.</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="center">Moves Taken</StyledTableCell>
              <StyledTableCell align="center">Time(sec)</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard ? (
              leaderboard.map((row, index) => (
                <StyledTableRow
                  key={row._id}
                  style={
                    userDetails._id === row.user
                      ? { backgroundColor: "#FFFDD0" }
                      : {}
                  }
                >
                  <StyledTableCell align="left">{index + 1}.</StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {userDetails._id === row.user ? "You" : row.name}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.moves}</StyledTableCell>
                  <StyledTableCell align="center">{row.time}</StyledTableCell>
                  <StyledTableCell align="center">
                    {new Date(row.date).toDateString()}
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <Typography>Loading...</Typography>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
