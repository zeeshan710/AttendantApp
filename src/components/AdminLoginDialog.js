import React, { useState, useCallback } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, Grid, TextField, Button, Collapse, IconButton } from '@material-ui/core';
import { AccountCircle, LockOpen, Close } from '@material-ui/icons';
import { login } from '../apiCalls';
import Alert from '@material-ui/lab/Alert';
import { saveEmployeeData } from '../actions/employeeActions';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({

    textFieldGrid: {
        marginBottom: '1em'
    }
}))

function AdminLoginDialog(props) {

    const { open, handleClose, saveEmployeeData } = props

    const classes = useStyles();
    const [employeeId, setEmployeeId] = useState('');
    const [pincode, setPincode] = useState('');
    const [employeeIdError, setEmployeeIdError] = useState(true);
    const [pincodeError, setPincodeError] = useState(true);
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState('');


    const validateEmployeeId = (event) => {
        setEmployeeIdError(false);
        let idPattern = new RegExp(`(([A-Z]{2})-[0-9]{3})`);
        let employeeId = event.target.value.trim();
        let isMatched = idPattern.test(employeeId);
        setEmployeeIdError(isMatched);
        isMatched && setEmployeeId(employeeId)
    }

    const validatePincode = (event) => {
        setPincodeError(false);
        let pincodePattern = new RegExp(`([0-9]{4})`);
        let pincode = event.target.value.trim();
        let isMatched = pincodePattern.test(pincode);
        setPincodeError(isMatched)
        isMatched && setPincode(pincode);

    }

    const handleLoginClick = useCallback(async () => {

        if (!employeeId || !pincode) {
            setErrorText('Please fill all the Fields', setIsError(true))
        }
        else {
            const data = await login(employeeId, pincode, "admin");
            const { response, error } = data
            if (error) {
                setErrorText('Invalid Credentials', setIsError(true));
            } else {
                saveEmployeeData(response);
                sessionStorage.setItem('accessToken', response.token);
                handleClose();
            }

        }
    }, [pincode, employeeId])

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Admin Login</DialogTitle>
                <DialogContent>

                    <Grid container spacing={1} alignItems="flex-end" className={classes.textFieldGrid}>
                        <Grid item>
                            <AccountCircle />
                        </Grid>
                        <Grid item xs={10}>
                            <TextField
                                error={!employeeIdError}
                                helperText={!employeeIdError && "Invalid Employee Id."}
                                id="adminid"
                                label="Employee ID"
                                fullWidth
                                onChange={validateEmployeeId}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={1} alignItems="flex-end" className={classes.textFieldGrid}>
                        <Grid item >
                            <LockOpen />
                        </Grid>
                        <Grid item xs={10}>
                            <TextField
                                error={!pincodeError}
                                helperText={!pincodeError && "Pincode contain only Four digits"}
                                id="adminpincod"
                                label="Pincode"
                                type="password"
                                fullWidth
                                onChange={validatePincode} />
                        </Grid>
                    </Grid>
                    <Collapse in={isError}>
                        <Alert
                            severity="error"
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setIsError(false);
                                    }}
                                >
                                    <Close fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            {errorText}
                        </Alert>
                    </Collapse>

                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleLoginClick} color="primary">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        saveEmployeeData: (data) => dispatch(saveEmployeeData(data))
    }
}

export default connect(null, mapDispatchToProps)(AdminLoginDialog);