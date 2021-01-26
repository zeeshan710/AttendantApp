import React, { Fragment } from 'react';
import { makeStyles, AppBar, Toolbar, Typography, IconButton, Divider } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { connect } from 'react-redux';
import { employeeLogout } from '../actions/employeeActions';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    adminConsoleLabel: {
        color: '#CCD1D1'
    },
    navbarStyle: {
        backgroundColor: '#353535'
    }
}));

const Navbar = (props) => {

    const { firstName, lastName, employeeLogout, adminConsole } = props

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);


    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logOut = () => {
        employeeLogout();
        sessionStorage.removeItem("accessToken");
        handleClose();
    }

    return (
        <div className={classes.root}>

            <AppBar position="static" className={classes.navbarStyle}>
                <Toolbar>

                    <Typography variant="h6" className={classes.title}>
                        Attendant App
                    </Typography>
                    {
                        adminConsole
                        &&
                        <Fragment>
                            <Typography variant="subtitle2" className={classes.adminConsoleLabel} >
                                Admin Console
                            </Typography>
                            <Divider orientation="vertical" flexItem style={{ backgroundColor: '#ECECEC', margin: '1em' }} />
                        </Fragment>
                    }

                    <Typography variant="overline" >
                        {`${firstName} ${lastName}`}
                    </Typography>
                    <Divider orientation="vertical" flexItem style={{ backgroundColor: '#ECECEC', margin: '1em' }} />
                    <div>

                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={logOut}>Logout</MenuItem>
                        </Menu>
                    </div>

                </Toolbar>
            </AppBar>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        firstName: state.employee.firstname,
        lastName: state.employee.lastname
    }
}

const mapDispatchToProps = dispatch => {
    return {
        employeeLogout: () => dispatch(employeeLogout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);