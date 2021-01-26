import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography, TableCell, TablePagination, Table, TableHead, TableRow, TableBody, TableContainer, Divider, Button, AppBar, Tab, Tabs, Box } from '@material-ui/core';
import { connect } from 'react-redux';
import { AlarmOn, AlarmOff, LocalHospitalOutlined, Restaurant, LaptopMac, LocalCafe, Call, NaturePeople, Today, RecentActors } from '@material-ui/icons';
import dateFormat from 'dateformat';
import { punchIn, punchOut, getEmployeeDayRecord, updateActivityStatus, getEmployeeAllRecord, onLeave } from '../apiCalls';
import { changeActivityStatus } from '../actions/employeeActions'
import { format } from '../utils'


const moment = require('moment');

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: '2em',
        marginRight: '1em',
        marginLeft: '1em',

    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
        backgroundColor: '#F8F9F9'
    },
    punchContainer: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
        display: 'flex',
        justifyContent: 'space-evenly',
        backgroundColor: '#F8F9F9',
        marginTop: '1em'
    },
    employeeInfoSubHeadingContainer: {
        display: 'flex',
    },
    employeeInfoSubHeading: {
        color: "#353535",
        marginRight: '0.5em'
    },
    divider: {
        marginBottom: '1em'
    },
    punchInButton: {
        backgroundColor: '#7DCEA0',
        '&:hover': {
            backgroundColor: "#52BE80",
        },
    },
    punchOutButton: {
        backgroundColor: '#EC7063',
        '&:hover': {
            backgroundColor: "#E74C3C",
        },
    },
    onleaveButton: {
        backgroundColor: '#F8C471',
        '&:hover': {
            backgroundColor: "#F5B041",
        },
    },
    timer: {
        color: '#353535'
    },
    activityButton: {
        height: '7em',
        width: '7em',
        display: 'grid',
        color: 'gray',
        justifyContent: 'center',
        alignContent: 'center'
    },
    activityButtonIcons: {
        height: '1.5em',
        width: '1.5em',
        justifySelf: 'center',
        marginBottom: '0.5em'
    },
    activityStatus: {
        marginLeft: '1em'
    },
    tabs: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        marginTop: '1em'
    },
    tableCell: {
        color: 'gray'
    }


}));


function EmployeeHomePage(props) {


    const { employeeDetail, accessToken, changeActivityStatus } = props;
    const { firstname, lastname, role, department, employeeid, status: activityStatus } = employeeDetail;



    const [TimerInterval, setTimerInterval] = useState(null);
    const [status, setStatus] = useState("Punch-In");
    const [time, setTime] = useState(0);
    const [value, setValue] = useState(0);
    const [page, setPage] = useState(0);
    const [todayRecordPage, setTodayRecordPage] = useState(0);
    const [todayRecord, setTodayRecord] = useState([])
    const [allRecords, setAllRecords] = useState([]);
    const [disable, setDisable] = useState(false);
    const [loading, setLoading] = useState(true)


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const classes = useStyles();
    const todayDate = dateFormat(Date.now(), "dddd, mmmm dS, yyyy");

    const Timer = async () => {
        const response = await punchIn(accessToken);
        console.log("PUNCHIN,", response.status)
        setStatus("Punch-Out");
        setTimerInterval(setInterval(() => {
            setTime(time => time + 1);

        }, 1000));
        handleActivityStatus('Active');

    }

    const pauseTimer = async () => {
        const response = await punchOut(time, accessToken);
        console.log("PUNCHOUT,", response.status)
        setStatus("Punch-In");
        clearInterval(TimerInterval);
        handleActivityStatus('In-Active');
        fetchDayRecord();
        fetchAllRecord();
    }


    const handlePunchIn_Punchout = () => {

        status === "Punch-In" ? Timer() : pauseTimer();
    }

    const handleOnLeave = async () => {
        setDisable(true)
        const response = await onLeave(accessToken);

        if (response.status === 200) {
            setDisable(true)
            handleActivityStatus('On-leave')
        }
        else setDisable(false)
    }

    const handleActivityStatus = async (status) => {
        const data = await updateActivityStatus(status, accessToken);
        data.status === 200 && changeActivityStatus(status);
    }

    const fetchAllRecord = async () => {
        const data = await getEmployeeAllRecord(accessToken);

        let allRecord = []

        if (!data.error) {

            await data.response.map((record) => {

                let workingHourFormatted = format(record.totalworkinghours[record.totalworkinghours.length - 1]);
                let date = record.date
                let item = {
                    "date": date,
                    "totalworkinghours": workingHourFormatted
                }
                allRecord.push(item)

            })
            setAllRecords(allRecord);
        }


    }

    const fetchDayRecord = async () => {
        const data = await getEmployeeDayRecord(accessToken);
        console.log("TODAY RECORD", data);

        if (!data.error) {

            const { response } = data;
            const { totalworkinghours, punchin, punchout, onleave } = response
            const timeIndex = totalworkinghours.length
            timeIndex > 0 && setTime(totalworkinghours[timeIndex - 1])

            if (onleave) {
                setDisable(true)
                handleActivityStatus('On-leave');
            }

            let record = [];

            for (let i = 0; i < timeIndex; i++) {

                let punchinTime = new Date(punchin[i]);
                let punchinTimeformatted = moment(punchinTime, "HH:mm").format("hh:mm:ss A")

                let punchoutTime = new Date(punchout[i]);
                let punchoutTimeformatted = moment(punchoutTime, "HH:mm").format("hh:mm:ss A")

                let workingHourFormatted = format(totalworkinghours[i])

                let item = {
                    "punchin": punchinTimeformatted,
                    "punchout": punchoutTimeformatted,
                    "totalworkinghours": workingHourFormatted
                }

                record.push(item)
            }
            setTodayRecord(record);
            console.log(record);
            setLoading(false)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchDayRecord();
        fetchAllRecord();
    }, [])


    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`scrollable-force-tabpanel-${index}`}
                aria-labelledby={`scrollable-force-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    const renderDayRecordTab = () => {
        return (
            <div className={classes.tabs}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={handleChange}

                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                        centered={true}
                    >
                        <Tab label="today" icon={<Today />} />
                        <Tab label="All Records" icon={<RecentActors />} />

                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    {todayRecord.length > 0 ? renderTodayRecordTable() : null}
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {allRecords.length > 0 ? renderAllRecordTable() : null}
                </TabPanel>

            </div>
        );
    }

    const renderActivityButtons = () => {
        return (
            <Paper className={classes.punchContainer}>


                <Button variant="outlined" className={classes.activityButton} onClick={() => handleActivityStatus('Lunch')} disabled={disable}>
                    <Restaurant className={classes.activityButtonIcons} />
                    <Typography align='center' variant="subtitle2">
                        Lunch
                                </Typography>
                </Button>

                <Button variant="outlined" className={classes.activityButton} onClick={() => handleActivityStatus('Meeting')} disabled={disable}>
                    <LaptopMac className={classes.activityButtonIcons} />
                    <Typography align='center' variant="subtitle2">
                        Meeting
                                </Typography>
                </Button>

                <Button variant="outlined" className={classes.activityButton} onClick={() => handleActivityStatus('Coffee')} disabled={disable}>
                    <LocalCafe className={classes.activityButtonIcons} />
                    <Typography align='center' variant="subtitle2">
                        Coffee
                                </Typography>
                </Button>

                <Button variant="outlined" className={classes.activityButton} onClick={() => handleActivityStatus('Call')} disabled={disable}>
                    <Call className={classes.activityButtonIcons} />
                    <Typography align='center' variant="subtitle2">
                        Call
                                </Typography>
                </Button>

                <Button variant="outlined" className={classes.activityButton} onClick={() => handleActivityStatus('Break')} disabled={disable}>
                    <NaturePeople className={classes.activityButtonIcons} />
                    <Typography align='center' variant="subtitle2">
                        Break
                                </Typography>
                </Button>

            </Paper>
        )
    }
    const handleTodayRecordChangePage = (event, newPage) => {

        setTodayRecordPage(newPage);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const renderTodayRecordTable = useCallback(() => {
        return (
            <Paper >
                <TableContainer >
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead className="table-header">
                            <TableRow >
                                <TableCell align="center">PunchIn</TableCell>
                                <TableCell align="center">PunchOut</TableCell>
                                <TableCell align="center">Working Hours</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className={classes.tableCell}>
                            {todayRecord.slice(todayRecordPage * 4, todayRecordPage * 4 + 4)

                                .map((row) => (
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row" align="center">

                                            {row.punchin}


                                        </TableCell>
                                        <TableCell align="center">
                                            {row.punchout}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.totalworkinghours}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={false}
                    component="div"
                    count={todayRecord.length}
                    rowsPerPage={4}
                    page={todayRecordPage}
                    onChangePage={handleTodayRecordChangePage}
                />
            </Paper>
        );
    }, [todayRecord, todayRecordPage])


    const renderAllRecordTable = useCallback(() => {
        return (
            <Paper >
                <TableContainer >
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead className="table-header">
                            <TableRow >
                                <TableCell align="center">Date</TableCell>
                                <TableCell align="center">Working Hours</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allRecords.slice(page * 4, page * 4 + 4)
                                .map((row) => (
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row" align="center">
                                            {row.date}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.totalworkinghours}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={false}
                    component="div"
                    count={allRecords.length}
                    rowsPerPage={4}
                    page={page}
                    onChangePage={handleChangePage}
                />
            </Paper>
        );
    }, [allRecords, page])


    return (
        <div >
            <Navbar />
            {loading ? null :
                <div className={classes.root}>
                    <Grid container spacing={3}>

                        <Grid item xs={6}>
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>

                                    <Typography variant="h5" gutterBottom display="inline" >
                                        {`${firstname} ${lastname}`}
                                    </Typography>

                                    <Typography variant="overline" gutterBottom align="right" className={classes.activityStatus}>
                                        {activityStatus}
                                    </Typography>



                                    <Divider className={classes.divider} />

                                    <div className={classes.employeeInfoSubHeadingContainer}>
                                        <Typography variant="subtitle2" gutterBottom className={classes.employeeInfoSubHeading}>
                                            {`Employee Id :`}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {`${employeeid} `}
                                        </Typography>
                                    </div>

                                    <div className={classes.employeeInfoSubHeadingContainer}>
                                        <Typography variant="subtitle2" gutterBottom className={classes.employeeInfoSubHeading}>
                                            {`Role :`}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {`${role} `}
                                        </Typography>
                                    </div>

                                    <div className={classes.employeeInfoSubHeadingContainer}>
                                        <Typography variant="subtitle2" gutterBottom className={classes.employeeInfoSubHeading}>
                                            {`Department :`}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {`${department} `}
                                        </Typography>
                                    </div>

                                </Paper>
                            </Grid>

                        </Grid>
                        <Grid item xs={6}>
                            <Paper className={classes.paper}>
                                <Typography variant="subtitle2" gutterBottom>
                                    {todayDate}
                                </Typography>

                                <Typography align='center' variant="h3" gutterBottom className={classes.timer} >
                                    {`${Math.floor(time / 3600).toString().padStart(2, "0")}:${Math.floor((time / 60) % 60).toString().padStart(2, "0")}:${Math.floor(time % 60).toString().padStart(2, "0")}`}
                                </Typography>

                                <Typography align='center' variant="h5">
                                    Total Working Hours
                            </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} >
                            <Paper className={classes.punchContainer}>

                                <Button
                                    size="large"
                                    variant="contained"
                                    color="secondary"
                                    className={status === "Punch-In" ? classes.punchInButton : classes.punchOutButton}
                                    startIcon={status === "Punch-In" ? <AlarmOn /> : <AlarmOff />}
                                    onClick={handlePunchIn_Punchout}
                                    disabled={disable}
                                >
                                    {status}
                                </Button>

                                <Button
                                    size="large"
                                    variant="contained"
                                    color="secondary"
                                    className={classes.onleaveButton}
                                    startIcon={<LocalHospitalOutlined />}
                                    onClick={handleOnLeave}
                                    disabled={disable}
                                >
                                    On-Leave
                            </Button>
                            </Paper>

                            <Grid item xs={12} >
                                {renderActivityButtons()}
                            </Grid>
                        </Grid>

                        <Grid item xs={6} >


                            {renderDayRecordTab()}

                        </Grid>



                    </Grid>
                </div>
            }
        </div>
    );
}

const mapStateToProps = state => {
    return {
        employeeDetail: state.employee,
        accessToken: state.accessToken,
        status: state.status
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeActivityStatus: (val) => dispatch(changeActivityStatus(val))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeHomePage);