import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Dialog, Paper, Divider, IconButton, Toolbar, AppBar, Typography, Slide } from '@material-ui/core';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Close } from '@material-ui/icons';
import { singleEmployeeHistory } from '../apiCalls';
import drilldown from 'highcharts/modules/drilldown';

drilldown(Highcharts);

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
        backgroundColor: '#353535'
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
        backgroundColor: '#F8F9F9'
    },
    activityStatus: {
        marginLeft: '1em'
    },
    employeeInfoSubHeadingContainer: {
        display: 'flex',
    },
    employeeInfoSubHeading: {
        color: "#353535",
        marginRight: '0.5em'
    },
    infoCard: {
        margin: '1em'
    },
    chart: {
        marginLeft: '0.5em',
        marginTop: '1.5em'
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const EmployeeHistoryDialog = (props) => {

    const classes = useStyles();
    const [onLeave, setOnLeave] = useState([]);
    const [active, setActive] = useState([]);

    const { open, handleClose, employeeInfo } = props;
    const { firstname, lastname, status, employeeId, role, department, id } = employeeInfo;

    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: `Employee Record `
        },
        xAxis: {
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Days'
            }
        },
        series: [

            {
                name: 'Active',
                data: active
            },

            {
                name: 'On Leave',
                data: onLeave
            },

        ]
        ,
        drilldown: {
            series: {
                id: 'Jan',
                data: [[]]
            }
        }
    }

    const fetchEmployeeHistory = async () => {

        let onLeave = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let active = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        const data = await singleEmployeeHistory(id);

        if (!data.error) {
            const { response } = data;
            response.map((record) => {
                let date = new Date(record.date);
                let month = date.getMonth()
                if (record.onleave) {
                    onLeave[month] = onLeave[month] + 1
                }
                else {
                    active[month] = active[month] + 1
                }

            })
            setOnLeave(onLeave);
            setActive(active);
        }


    }

    useEffect(() => {
        fetchEmployeeHistory()
    }, [employeeId])

    return (
        <div>

            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <Close />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Employee History
                        </Typography>

                    </Toolbar>
                </AppBar>

                <div className={classes.infoCard}>
                    <Grid container spacing={2}>
                        <Grid item xs={5}>

                            <Paper className={classes.paper}>

                                <Typography variant="h5" gutterBottom display="inline" >
                                    {`${firstname} ${lastname}`}
                                </Typography>

                                <Typography variant="overline" gutterBottom align="right" className={classes.activityStatus}>
                                    {status}
                                </Typography>



                                <Divider className={classes.divider} />

                                <div className={classes.employeeInfoSubHeadingContainer}>
                                    <Typography variant="subtitle2" gutterBottom className={classes.employeeInfoSubHeading}>
                                        {`Employee Id :`}
                                    </Typography>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {`${employeeId} `}
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

                        <Grid xs={12} >
                            <Paper className={classes.chart}>
                                <HighchartsReact highcharts={Highcharts} options={options} />
                            </Paper>
                        </Grid>

                    </Grid>
                </div>

            </Dialog>

        </div>
    );
}

export default EmployeeHistoryDialog;