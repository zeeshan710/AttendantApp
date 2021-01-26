import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { employeesHistory } from '../apiCalls';

function MonthsChart(props) {


    const [onLeave, setOnLeave] = useState([]);

    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: `Monthly Leave History `
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
                text: 'Number of Employees'
            }
        },
        series: [

            {
                name: 'On Leave',
                data: onLeave
            },

        ]
    }

    const fetchEmployeeHistory = async () => {
        const data = await employeesHistory()

        let onLeave = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        if (!data.error) {
            const { response } = data;
            response.map((record) => {
                let date = new Date(record.date);
                let month = date.getMonth()
                if (record.onleave) {
                    onLeave[month] = onLeave[month] + 1
                }

            })
            setOnLeave(onLeave);
        }

    }

    useEffect(() => {
        fetchEmployeeHistory();
    }, [])
    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
}

export default MonthsChart;