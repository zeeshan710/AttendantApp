import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles, Typography, Paper, Grid } from '@material-ui/core';
import titleImage from '../assets/loginpage.png'
import { LocalHospitalOutlined, ExitToAppOutlined, AssignmentIndOutlined, } from '@material-ui/icons';
import LoginForm from '../components/LoginForm';
import FirstLoginPage from './FirstLoginPage';
import { connect } from 'react-redux';
import { authenticateAccessToken } from '../utils';
import { saveEmployeeData } from '../actions/employeeActions';
import { fetchEmployeeData } from '../apiCalls'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(10),
        backgroundColor: '#ECECEC',
        height: '37.1em'

    },
    infoArea: {
        padding: theme.spacing(2),
        textAlign: 'left',
        backgroundColor: '#353535',
        color: '#ECECEC',
        height: '35em',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    loginFormContainer: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: '35em',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },

    titleArea: {
        marginLeft: '2em',
        marginTop: '7em',

    },
    title: {
        fontFamily: 'Redressed',
        color: '#ECECEC'
    },
    imageContainer: {

        display: 'flex',
        justifyContent: 'flex-end'
    },
    image: {
        width: '23em',
        height: '18em',
    },
    iconText: {
        display: 'flex',
        marginLeft: '2em',
        marginTop: '1em'
    },
    text: {
        marginLeft: '0.5em'
    }

}));

function LoginPage(props) {
    const { accessToken, saveEmployeeData } = props

    const classes = useStyles();
    const [loading, setLoading] = useState(true);

    const saveEmpData = async () => {
        const token = await authenticateAccessToken();
        const data = await fetchEmployeeData(token);
        let empData = {
            "token": token,
            "employee": data.response
        }
        saveEmployeeData(empData);
        setLoading(false);


    }

    useEffect(() => {

        saveEmpData()

    }, [])


    return (
        !loading &&
        <Fragment>
            {accessToken ?
                <FirstLoginPage />
                :
                <div className={classes.root}>
                    <Grid container >

                        <Grid item xs={8}>
                            <Paper className={classes.infoArea}>
                                <div className={classes.titleArea}>

                                    <Typography variant="h2" className={classes.title}>
                                        Attendant App
                            </Typography>

                                </div>

                                <div style={{
                                    display: 'inline',
                                    float: "left"
                                }}>
                                    <div className={classes.iconText} >
                                        <AssignmentIndOutlined />
                                        <Typography className={classes.text} >Monitor Employees CheckIn</Typography>
                                    </div>

                                    <div className={classes.iconText} >
                                        <ExitToAppOutlined />
                                        <Typography className={classes.text}>Monitor Employees CheckOut</Typography>
                                    </div>

                                    <div className={classes.iconText} >
                                        <LocalHospitalOutlined />
                                        <Typography className={classes.text}>Monitor Employees Leaves </Typography>
                                    </div>

                                </div>

                                <div className={classes.imageContainer} >
                                    <img alt='attendant' src={titleImage} className={classes.image} />
                                </div>

                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper className={classes.loginFormContainer}>
                                <LoginForm />

                            </Paper>
                        </Grid>

                    </Grid>


                </div>
            }
        </Fragment>
    );
}

const mapStateToProps = state => {
    return {
        accessToken: state.accessToken
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveEmployeeData: (data) => dispatch(saveEmployeeData(data)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);