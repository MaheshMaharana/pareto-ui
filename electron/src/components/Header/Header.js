import './Header.css';
import React from 'react';
import {useEffect, useState} from 'react';   
// import logo from "../../assets/pareto-logo-3.png";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

 

export default function Header(props) {  

    const handleScenarioSelection = (event) => {
      props.handleSelection(event.target.value)
    }
    return (
      <div id="Header">
        
        <div className="titlebar">
          <a style={{cursor:"pointer"}} onClick={props.navigateHome}>
            <div id="pareto_logo">
              <img src="pareto-logo.png" alt="Pareto Logo"/>
            </div>
          </a>
        {props.scenarioData ? 
          <>
            <p style={{color:'#565656', fontSize: '20px', marginLeft:'75px'}}>Scenario</p>
            <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
            <Select
              value={props.index === null ? "" : props.index}
              onChange={handleScenarioSelection}
              sx={{color:'#0b89b9', fontWeight: "bold"}}
            >
                {props.scenarios.map((scenario, index) => 
                (
                    <MenuItem key={index} value={index}>{scenario.name}</MenuItem>
                ))}
            </Select>
            </FormControl>
            
            <Button id='user-name' sx={{color: "#0b89b9"}} onClick={props.navigateHome}>View Scenario List</Button>
          </>
        : 
        null}
        </div>
      </div>
    );
  
}
