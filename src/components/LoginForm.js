import React, { useState, useCallback } from 'react';
import { makeStyles, Typography, Grid, TextField, Button, Link, Collapse, IconButton } from '@material-ui/core';
import { AccountCircle, LockOpen, Close } from '@material-ui/icons';
import AdminLoginDialog from '../components/AdminLoginDialog';
import { login } from '../apiCalls'
import Alert from '@material-ui/lab/Alert';
import { saveEmployeeData } from '../actions/employeeActions';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({

    title: {
        fontFamily: 'Redressed',
        color: '#3E3E3E',
        marginTop: '3em'
    },

    buttonStyle: {
        margin: '2em',
        backgroundColor: 'black'
    },

    textFieldGrid: {
        marginBottom: '1em'
    }

}));

function LoginForm(props) {

    const { saveEmployeeData } = props

    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const [employeeId, setEmployeeId] = useState('');
    const [pincode, setPincode] = useState('');
    const [employeeIdError, setEmployeeIdError] = useState(true);
    const [pincodeError, setPincodeError] = useState(true);
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState('');

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const validateEmployeeId = (event) => {
        setEmployeeIdError(false);
        let idPattern = new RegExp(`(([A-Z]{2})-[0-9]{3})`);
        let employeeId = event.target.value.trim();
        let isMatched = idPattern.test(employeeId);
        setEmployeeIdError(isMatched);
        setEmployeeId(employeeId)
    }

    const validatePincode = (event) => {
        setPincodeError(false);
        let pincodePattern = new RegExp(`([0-9]{4})`);
        let pincode = event.target.value.trim();
        let isMatched = pincodePattern.test(pincode);
        setPincodeError(isMatched)
        setPincode(pincode);

    }

    const handleLoginClick = useCallback(async () => {
        if (!employeeId || !pincode || !pincodeError || !employeeIdError) {
            setErrorText('Please fill all the Fields', setIsError(true))
        }
        else {
            const data = await login(employeeId, pincode, "staff");
            const { response, error } = data;
            if (error) {
                setErrorText('Invalid Credentials', setIsError(true));
            }
            else {
                saveEmployeeData(response);
                sessionStorage.setItem('accessToken', response.token);

            }

        }
    }, [pincode, employeeId]);


    return (
        <div>
            <Typography variant="h4" className={classes.title}>
                Login
            </Typography>

            <Grid container spacing={1} alignItems="flex-end" className={classes.textFieldGrid}>
                <Grid item>
                    <AccountCircle />
                </Grid>
                <Grid item xs={10}>

                    <TextField
                        error={!employeeIdError}
                        helperText={!employeeIdError && "Invalid Employee Id."}
                        id="empId"
                        label="Employee ID"
                        fullWidth
                        onChange={validateEmployeeId}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={1} alignItems="flex-end" className={classes.textFieldGrid}>
                <Grid item>
                    <LockOpen />
                </Grid>
                <Grid item xs={10}>

                    <TextField
                        error={!pincodeError}
                        helperText={!pincodeError && "Pincode contain only Four digits"}
                        id="pinId"
                        label="Pincode"
                        type="password"
                        fullWidth
                        onChange={validatePincode}
                    />
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

            <Link
                component="button"
                variant="body2"
                onClick={handleClickOpen}
            >
                Login as Admin
            </Link>

            <Button variant="contained" size="medium" color="primary" className={classes.buttonStyle} onClick={handleLoginClick}>
                Login
            </Button>

            <AdminLoginDialog open={openDialog} handleClose={handleClose} />
        </div>
    );
}


const mapDispatchToProps = dispatch => {
    return {
        saveEmployeeData: (data) => dispatch(saveEmployeeData(data))
    }
}


export default connect(null, mapDispatchToProps)(LoginForm);