import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, FormControl, InputLabel, Select, Button, Popper, Fade, Typography, Divider } from '@material-ui/core';
import { addEmployee } from '../apiCalls';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    Fields: {
        width: '100%',

    },
    statusField: {
        width: '100%',
        marginTop: '0.5em'
    }
}))


function AddEmployeeDialog(props) {

    const classes = useStyles();

    const { open, handleClose, record, updateRecord } = props;

    const [employeeid, setEmployeeid] = useState('')
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [department, setDepartment] = useState('');
    const [role, setRole] = useState('');
    const [alert, setAlert] = useState(false);



    const close = () => {
        handleClose();
        setAlert(false)
    }
    const handleFirstNameChange = (event) => { setFirstname(event.target.value) };

    const handleLastNameChange = (event) => { setLastname(event.target.value) };

    const handleDepartmentChange = async (event) => {
        setDepartment(event.target.value)
        let id = await employeeId(event.target.value);
        setEmployeeid(id);

    };

    const handleRoleChange = (event) => { setRole(event.target.value) };

    const employeeId = async (name) => {
        const count = await record.filter((record) => { return record.department === name }).length + 1;
        switch (name) {
            case "Human Resource": return `HR-${count.toString().padStart(3, "0")}`
            case "Software Engineering": return `SE-${count.toString().padStart(3, "0")}`
            default: return ''
        }
    }

    const handleAddClick = async () => {

        if (!employeeid || !firstname.trim() || !lastname.trim() || !department || !role) {
            setAlert(true)
        }
        else {
            const data = await addEmployee(employeeid, firstname, lastname, role, department);
            console.log("ADD", data);
            setEmployeeid('');
            setFirstname('');
            setLastname('');
            setDepartment('');
            setRole('');
            close();
            updateRecord();
            setAlert(false)
        }
    }
    return (
        <div>
            <Dialog open={open} onClose={close} aria-labelledby="form-dialog-title" maxWidth='sm' fullWidth>
                <DialogTitle id="form-dialog-title">ADD</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Employee Information
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="empid"

                        fullWidth
                        variant='outlined'
                        disabled={true}
                        value={employeeid}
                    />

                    <Grid container spacing={1} >
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="firstname"
                                label="First Name"
                                fullWidth
                                variant='outlined'
                                value={firstname}
                                onChange={handleFirstNameChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField

                                margin="dense"
                                id="lastname"
                                label="Last Name"
                                fullWidth
                                variant='outlined'
                                value={lastname}
                                onChange={handleLastNameChange}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={1} >
                        <Grid item xs={6}>
                            <FormControl variant="outlined" className={classes.Fields}>
                                <InputLabel htmlFor="departmentOptions">Department</InputLabel>
                                <Select
                                    native
                                    value={department}
                                    onChange={handleDepartmentChange}
                                    label="depatment"
                                    inputProps={{
                                        name: "department",
                                        id: "departmentOptions"
                                    }}
                                >
                                    <option value={''}></option>
                                    <option value={'Software Engineering'}>Software Engineering</option>
                                    <option value={'Human Resource'}>Human Resource</option>

                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl variant="outlined" className={classes.Fields}>
                                <InputLabel htmlFor="roleOptions">Role</InputLabel>
                                <Select
                                    native
                                    value={role}
                                    onChange={handleRoleChange}
                                    label="Role"
                                    inputProps={{
                                        name: "Role",
                                        id: "roleOptions"
                                    }}
                                >
                                    <option value={''}></option>
                                    <option value={'Software Engineer'}>Software Engineer</option>
                                    <option value={'Product Manager'}>Product Manager</option>
                                    <option value={'SQA'}>SQA</option>
                                    <option value={'HR Manager'}>HR Manager</option>

                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>


                    {alert && <Alert severity="error">Please Fill All The Fields</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={close} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddClick}
                        color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default AddEmployeeDialog;