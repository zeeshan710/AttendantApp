import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, FormControl, InputLabel, Select, Button, Popper, Fade, Typography, Divider } from '@material-ui/core';
import { updateEmployeeInfo } from '../apiCalls'

const useStyles = makeStyles((theme) => ({
    Fields: {
        width: '100%',

    },
    statusField: {
        width: '100%',
        marginTop: '0.5em'
    }
}))
function UpdateDialog(props) {

    const classes = useStyles();
    const { open, handleClose, employeeInfo, updateRecord } = props;
    const { employeeId, firstname, lastname, department, role, status } = employeeInfo;

    const [updateFirstname, setUpdateFirstname] = useState(firstname);
    const [updateLastname, setUpdateLastname] = useState(lastname);
    const [updateDepartment, setUpdateDepartment] = useState(department);
    const [updateRole, setUpdateRole] = useState(role);
    const [updateStatus, setUpdateStatus] = useState(status);

    const handleFirstNameChange = (event) => { setUpdateFirstname(event.target.value) };

    const handleLastNameChange = (event) => { setUpdateLastname(event.target.value) };

    const handleDepartmentChange = (event) => { setUpdateDepartment(event.target.value) };

    const handleRoleChange = (event) => { setUpdateRole(event.target.value) };

    const handleStatusChange = (event) => { setUpdateStatus(event.target.value) };

    const handleUpdateClick = async () => {
        await updateEmployeeInfo(employeeId, updateFirstname, updateLastname, updateDepartment, updateRole, updateStatus);
        updateRecord();
        handleClose()
    };
    useEffect(() => {
        setUpdateFirstname(firstname);
        setUpdateLastname(lastname);
        setUpdateDepartment(department);
        setUpdateRole(role);
        setUpdateStatus(status);
    }, [firstname, lastname, department, role, status])

    return (
        <div>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth='sm' fullWidth>
                <DialogTitle id="form-dialog-title">Update</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Employee Information
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="empid"
                        label="Employee ID"
                        fullWidth
                        variant='outlined'
                        disabled={true}
                        value={employeeId}
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
                                value={updateFirstname}
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
                                value={updateLastname}
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
                                    value={updateDepartment}
                                    onChange={handleDepartmentChange}
                                    label="depatment"
                                    inputProps={{
                                        name: "department",
                                        id: "departmentOptions"
                                    }}
                                >
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
                                    value={updateRole}
                                    onChange={handleRoleChange}
                                    label="Role"
                                    inputProps={{
                                        name: "Role",
                                        id: "roleOptions"
                                    }}
                                >

                                    <option value={'Software Engineer'}>Software Engineer</option>
                                    <option value={'Product Manager'}>Product Manager</option>
                                    <option value={'SQA'}>SQA</option>
                                    <option value={'HR Manager'}>HR Manager</option>

                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <FormControl variant="outlined" className={classes.statusField}>
                        <InputLabel htmlFor="status">Status</InputLabel>
                        <Select
                            native
                            value={updateStatus}
                            onChange={handleStatusChange}
                            label="Status"
                            inputProps={{
                                name: "status",
                                id: "roleOptions"
                            }}
                        >
                            <option value={'On-leave'}>On-leave</option>
                            <option value={'In-Active'}>In-Active</option>


                        </Select>
                    </FormControl>



                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateClick} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default UpdateDialog;