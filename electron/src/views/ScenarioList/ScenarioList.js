import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {  uploadExcelSheet } from '../../services/sidebar.service'

export default function ScenarioList(props) {

const handleFileUpload = (e) => {
    console.log('handle file upload')
    const formData = new FormData();
    formData.append('file', e.target.files[0], e.target.files[0].name);
    uploadExcelSheet(formData)
    .then(response => response.json())
    .then((data)=> {
      console.log('fileupload successful: ',data)
      props.handleNewScenario(data)
    })
    .catch(e => {
      console.log('error on file upload')
      console.log(e)
    })
  }

  const styles={
    headerCell: {
        color: "white", 
        fontSize:"18px",
        fontWeight: "bold"
    },
    bodyCell: {
        color: "#0083b5", 
        fontSize:"16px",
        fontWeight: "bold"
    },
    newButton: {
        backgroundColor: '#0884b4',
        borderRadius: '8px', 
        '&:hover': {
            backgroundColor: '#0884b4',
            opacity: 0.9
        },
    },
}

  return (
    <Box sx={{m: 4}}>
    <Grid container>
        <Grid item xs={1}></Grid>
        <Grid item xs={5}>
            <Box sx={{display: 'flex', justifyContent: 'flex-start'}}>
                <h2 style={{color:"#003b60"}}>Scenarios</h2>
            </Box>
        </Grid>
        <Grid item xs={5}>
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <h2><Button variant="contained" sx={styles.newButton} component="label" >
                    Create New Scenario
                    <input
                        type="file"
                        hidden
                        onChange={handleFileUpload}
                    />
                    </Button>
                </h2>
            </Box>
        </Grid>
        <Grid item xs={1}></Grid>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{backgroundColor: "#6094bc", color: "white"}}>
            <TableRow>
                <TableCell sx={styles.headerCell}>Scenario Name</TableCell>
                <TableCell sx={styles.headerCell}>Date Created</TableCell>
                <TableCell sx={styles.headerCell}>Status</TableCell>
                <TableCell sx={styles.headerCell}>Actions</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {props.scenarios.map((row, index) => (
                <TableRow
                hover
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } , cursor:"pointer"}}
                >
                <TableCell sx={styles.bodyCell} component="th" scope="row" onClick={() => props.handleSelection(index)}>
                    {row.name}
                </TableCell>
                <TableCell onClick={() => props.handleSelection(index)} sx={styles.bodyCell}>{row.date}</TableCell>
                <TableCell onClick={() => props.handleSelection(index)} sx={styles.bodyCell}>{Object.keys(row.results).length !== 0 ? "Optimized" : "Draft"}</TableCell>
                <TableCell sx={styles.bodyCell}><IconButton onClick={() => props.deleteScenario(index)}><DeleteIcon fontSize="small"/></IconButton><IconButton><ContentCopyIcon fontSize="small"/></IconButton></TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    </Grid>
    </Box>
  );
}
