import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { makeStyles } from '@material-ui/core/styles';
import { Fab, Grid, Paper, Table, TableCell, TableContainer, TableRow, TableHead, TableBody, TablePagination, TextField, FormControl, InputLabel, Select, Button, Popper, Fade, Typography, Divider } from '@material-ui/core';
import { Search, Add } from '@material-ui/icons';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { allEmployeesData } from '../apiCalls';
import UpdateDialog from '../components/UpdateDialog';
import DeleteDialog from '../components/DeleteDialog';
import AddEmployeeDialog from '../components/AddEmployeeDialog';
import MonthChart from '../components/MonthsChart';
import EmployeeHistoryDialog from '../components/EmployeeHistoryDialog';


const useStyles = makeStyles((theme) => ({
    settingButton: {
        backgroundColor: '#353535',
        position: 'relative',
        '&:hover': {
            backgroundColor: "#454545",
        },

        marginTop: '1em',
        marginRight: '2.3em'
    },
    settingIcon: {
        color: 'white'
    },
    root: {
        flexGrow: 1,

    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',

        color: theme.palette.text.secondary,
    },
    gridContainer: {
        margin: '2em'
    },
    tableCell: {
        color: "gray",
        fontSize: 13.5,
        cursor: 'pointer'
    },
    tableUpdateButton: {
        backgroundColor: '#F5B041',
        color: '#FDFEFE',
        '&:hover': {
            backgroundColor: "#F8C471",
        },

    },
    tableDeleteButton: {
        backgroundColor: '#C0392B',
        color: '#FDFEFE',
        marginLeft: '1.5em',
        '&:hover': {
            backgroundColor: "#E74C3C",
        },
    },
    tableHeader: {
        backgroundColor: '#707B7C',
        color: '#F8F9F9',
        fontSize: 13.5
    },
    searchField: {
        width: '100%',

    },
    iconButton: {
        backgroundColor: 'white',
        color: 'gray',
        width: '100%',
        height: '100%'
    },
    headings: {
        color: 'gray',
        marginTop: '1em'
    }
}));


const AdminHomePage = (props) => {
    const classes = useStyles();

    const [chartData, setChartData] = useState([]);
    const [page, setPage] = useState(0);
    const [allRecord, setAllRecord] = useState([]);
    const [filteredRecord, setFilteredRecord] = useState([]);
    const [searchBy, setSearchBy] = useState();
    const [searchValue, setSearchValue] = useState();
    const [openUpdateDialog, setOpenUpdateDialog] = useState();
    const [openAddEmployeeDialog, setOpenAddEmployeeDialog] = useState();
    const [openDeleteDialog, setOpenDeleteDialog] = useState();
    const [singleEmployeeData, setSingleEmployeeData] = useState({})
    const [openEmployeeHistoryDialog, setOpenEmployeeHistoryDialog] = useState(false);

    const options = {
        chart: {
            type: 'pie'
        },
        title: {
            text: `Today's Employees Status`
        },
        series: [{
            // colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
            name: 'Count',
            data: chartData
        }]
    }

    const fetchAllEmployeeRecord = async () => {

        const data = await allEmployeesData();

        if (!data.error) {

            const onLeave = data.response.filter((record) => { return record.status === "On-leave" })
            const inActive = data.response.filter((record) => { return record.status === "In-Active" });
            const active = data.response.filter((record) => { return record.status === "Active" });
            const lunch = data.response.filter((record) => { return record.status === "lunch" });
            const meeting = data.response.filter((record) => { return record.status === "Meeting" });
            const breakTime = data.response.filter((record) => { return record.status === "break" });

            let mapData = [{
                name: 'Active',
                y: active.length,
                sliced: true,
                selected: true,
                color: 'blue'
            }, {
                name: 'In-Active',
                y: inActive.length
            }, {
                name: 'On-Leave',
                y: onLeave.length
            },
            {
                name: 'Lunch',
                y: lunch.length
            }, {
                name: 'Coffee',
                y: 0
            }, {
                name: 'On-Call',
                y: 0
            }, {
                name: 'Meeting',
                y: meeting.length
            }, {
                name: 'Break',
                y: breakTime.length
            },
            ]
            setChartData(mapData);

            let allRecord = []
            await data.response.map((record) => {
                const { _id, employeeid, firstname, lastname, role, department, status } = record

                let item = {
                    "id": _id,
                    "employeeId": employeeid,
                    "firstname": firstname,
                    "lastname": lastname,
                    "role": role,
                    "department": department,
                    "status": status

                }
                allRecord.push(item)

            })
            setAllRecord(allRecord);
            setFilteredRecord(allRecord)
        }

    }

    const handleChangePage = (event, newPage) => {

        setPage(newPage);
    };

    const handleSearchBy = (event) => { setSearchBy(event.target.value) };

    const handleSearchValue = (event) => { setSearchValue(event.target.value); }

    const handleSearchClick = () => {

        const filter = allRecord.filter((record) => { return record[searchBy] === searchValue });
        setFilteredRecord(filter);
    }



    const handleDialogOpen = (data) => {
        setSingleEmployeeData(data)
        setOpenUpdateDialog(true);
    };

    const handleDeleteDialogOpen = (data) => {
        setSingleEmployeeData(data)
        setOpenDeleteDialog(true);
    };
    const handleAddEmployeeDialog = () => {
        setOpenAddEmployeeDialog(true);
    }
    const handleEmployeeHistoryDialog = (data) => {

        setSingleEmployeeData(data)
        setOpenEmployeeHistoryDialog(true)
    }


    const handleDialogClose = () => {
        setOpenUpdateDialog(false);
        setOpenDeleteDialog(false);
        setOpenAddEmployeeDialog(false);
        setOpenEmployeeHistoryDialog(false);
    };






    const renderTodayRecordTable = () => {
        return (
            <Paper >

                <TableContainer >
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead className="table-header" >
                            <TableRow >
                                <TableCell align="center" className={classes.tableHeader} >Employee ID</TableCell>
                                <TableCell align="center" className={classes.tableHeader}>First Name</TableCell>
                                <TableCell align="center" className={classes.tableHeader}>Last Name</TableCell>
                                <TableCell align="center" className={classes.tableHeader}>Role</TableCell>
                                <TableCell align="center" className={classes.tableHeader}>Department</TableCell>
                                <TableCell align="center" className={classes.tableHeader}>Status</TableCell>
                                <TableCell align="center" className={classes.tableHeader}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className={classes.tableCell}>
                            {filteredRecord.slice(page * 5, page * 5 + 5)

                                .map((row) => (
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row" align="center" className={classes.tableCell} onClick={() => handleEmployeeHistoryDialog(row)}>
                                            {row.employeeId}
                                        </TableCell>
                                        <TableCell align="center" className={classes.tableCell} onClick={() => handleEmployeeHistoryDialog(row)}>
                                            {row.firstname}
                                        </TableCell>
                                        <TableCell align="center" className={classes.tableCell} onClick={() => handleEmployeeHistoryDialog(row)}>
                                            {row.lastname}
                                        </TableCell>
                                        <TableCell align="center" className={classes.tableCell} onClick={() => handleEmployeeHistoryDialog(row)}>
                                            {row.role}
                                        </TableCell>
                                        <TableCell align="center" className={classes.tableCell} onClick={() => handleEmployeeHistoryDialog(row)}>
                                            {row.department}
                                        </TableCell>
                                        <TableCell align="center" className={classes.tableCell} onClick={() => handleEmployeeHistoryDialog(row)}>
                                            {row.status}
                                        </TableCell>
                                        <TableCell align="center" className={classes.tableCell}>
                                            <Button className={classes.tableUpdateButton} onClick={() => handleDialogOpen(row)}>Update</Button>
                                            <Button className={classes.tableDeleteButton} onClick={() => handleDeleteDialogOpen(row)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={false}
                    component="div"
                    count={filteredRecord.length}
                    rowsPerPage={5}
                    page={page}
                    onChangePage={handleChangePage}
                />
            </Paper>
        );
    }

    useEffect(() => {
        fetchAllEmployeeRecord()
    }, [])

    return (
        <div className={classes.root}>
            <Navbar adminConsole={true} />
            <Grid container justify='flex-end'>
                <Fab className={classes.settingButton} aria-label="add" onClick={handleAddEmployeeDialog}>
                    <Add className={classes.settingIcon} />
                </Fab>

            </Grid>

            <div className={classes.gridContainer}>
                <Grid container spacing={2}>



                    <Grid item xs={12}>

                        <Grid container justify="center">

                            <Grid item xs={3}>

                                <FormControl variant="outlined" className={classes.searchField}>
                                    <InputLabel htmlFor="outlined-search-native-simple">Search By</InputLabel>
                                    <Select
                                        native
                                        value={searchBy}
                                        onChange={handleSearchBy}
                                        label="Search By"
                                        inputProps={{
                                            name: "search",
                                            id: "outlined-search-native-simple"
                                        }}
                                    >
                                        <option aria-label="None" value="" />
                                        <option value={'employeeId'}>Employee Id</option>
                                        <option value={'firstname'}>First Name</option>
                                        <option value={'lastname'}>Last Name</option>
                                        <option value={'role'}>Role</option>
                                        <option value={'department'}>Department</option>
                                        <option value={'status'}>Status</option>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    value={searchValue}
                                    onChange={handleSearchValue}
                                    id="outlined-search" label="Search.." type="search" variant="outlined" className={classes.searchField} />
                            </Grid>

                            <Grid item xs={3}>
                                <Button variant="outlined" className={classes.iconButton}
                                    onClick={handleSearchClick}
                                >
                                    <Search />
                                </Button>
                            </Grid>

                        </Grid>

                        {renderTodayRecordTable()}

                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant='h4' gutterBottom className={classes.headings}>Analytics</Typography>
                        <Divider />
                    </Grid>

                    <Grid item xs={6}>
                        <Paper className={classes.paper}>
                            <HighchartsReact highcharts={Highcharts} options={options} />
                        </Paper>
                    </Grid>

                    <Grid item xs={6}>
                        <Paper className={classes.paper}>
                            <MonthChart />
                        </Paper>
                    </Grid>

                </Grid>

            </div>
            <UpdateDialog open={openUpdateDialog} handleClose={handleDialogClose} employeeInfo={singleEmployeeData} updateRecord={fetchAllEmployeeRecord} />
            <DeleteDialog open={openDeleteDialog} handleClose={handleDialogClose} employeeInfo={singleEmployeeData} updateRecord={fetchAllEmployeeRecord} />
            <AddEmployeeDialog open={openAddEmployeeDialog} handleClose={handleDialogClose} record={allRecord} updateRecord={fetchAllEmployeeRecord} />
            <EmployeeHistoryDialog open={openEmployeeHistoryDialog} handleClose={handleDialogClose} employeeInfo={singleEmployeeData} />
        </div>
    );
}

export default AdminHomePage;