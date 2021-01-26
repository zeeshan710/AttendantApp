import React, { Fragment, useState, useCallback } from 'react';
import lock from '../assets/safetylock.png';
import { makeStyles, Paper, Grid, TextField, Button, Link, Collapse, IconButton, Typography } from '@material-ui/core';
import { LockOpen, Close } from '@material-ui/icons';
import { connect } from 'react-redux';
import EmployeeHomePage from './EmployeeHomePage';
import AdminHomePage from './AdminHomePage';
import Alert from '@material-ui/lab/Alert';
import { updatePincode } from '../apiCalls';
import { updatePin } from '../actions/employeeActions'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(10),
        backgroundColor: '#ECECEC',
        height: '37.1em',

    },
    headerContainer: {
        height: '15em',
        backgroundColor: '#353535',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        display: 'grid',
        justifyItems: 'center',
        textAlign: 'center'
    },
    formContainer: {
        height: '12em',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        display: 'grid',
        alignItems: 'center',


    },
    image: {
        width: '11em',
        height: '10em',
    },
    title: {
        fontFamily: 'Roboto',
        color: '#ECECEC'
    },
    buttonStyle: {

        backgroundColor: 'black'
    },
    icon: {
        color: 'gray'
    }

}));

function FirstLoginPage(props) {

    const { firstLogin, updatePin, usertype } = props
    const classes = useStyles();
    const [pincode, setPincode] = useState('');
    const [pincodeError, setPincodeError] = useState(true);
    const [errorText, setErrorText] = useState('');
    const [isError, setIsError] = useState(false);

    const validatePincode = (event) => {
        setPincodeError(false);
        let pincodePattern = new RegExp(`([0-9]{4})`);
        let pincode = event.target.value.toString();
        let isMatched = pincodePattern.test(pincode);

        if (!isMatched || pincode.toString().length < 5) {
            setPincodeError(isMatched)
        }
        setPincode(pincode);

    }

    const handleUpdateClick = useCallback(async () => {
        if (!pincode || !pincodeError) {
            setErrorText('Please fill all the Fields correctly', setIsError(true))
        }
        else {

            updatePin(pincode);

        }
    }, [pincode]);

    return (
        <Fragment>
            {firstLogin ?
                <div className={classes.root}>
                    <Grid container spacing={3} justify='center'>
                        <Grid item lg={4} sm={12}>
                            <Paper className={classes.headerContainer}>
                                <img alt='attendant' src={lock} className={classes.image} />
                                <Typography variant="h5" className={classes.title}>
                                    Update Pincode
                        </Typography>
                                <Typography variant="caption" className={classes.title}>
                                    This is your First Login, Please change your Pincode
                        </Typography>
                            </Paper>

                            <Paper className={classes.formContainer}>

                                <Grid container spacing={1} alignItems="flex-end" justify='center' className={classes.textFieldGrid}>
                                    <Grid item>
                                        <LockOpen className={classes.icon} />
                                    </Grid>
                                    <Grid item lg={7}>
                                        <TextField
                                            error={!pincodeError}
                                            helperText={!pincodeError && "Pincode contain only Four digits"}
                                            id="pin"
                                            label="Pincode"
                                            fullWidth
                                            onChange={validatePincode}
                                            type="password"

                                        />
                                    </Grid>

                                    <Button variant="contained" size="medium" color="primary" className={classes.buttonStyle} onClick={handleUpdateClick} >
                                        Update
                            </Button>
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

                            </Paper>
                        </Grid>
                    </Grid>
                </div>
                :
                usertype === "staff" ? <EmployeeHomePage /> : <AdminHomePage />
            }
        </Fragment>
    );
}

const mapStateToProps = state => {
    return {
        firstLogin: state.employee.firstLogin,
        usertype: state.employee.usertype

    }
}

const mapDispatchToProps = dispatch => {
    return {
        updatePin: (data) => dispatch(updatePin(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FirstLoginPage);