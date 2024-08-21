import React,{useState} from 'react';
import { Card, CardBody } from 'reactstrap';
import './MembersBorrowersStats.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import ReactApexChart from 'react-apexcharts';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const MembersBorrowersStats = () => {
    const visitorsData = [12, 19, 3, 5, 2, 3, 7];
    const borrowersData = [8, 11, 13, 15, 8, 9, 14];

    const [state] = useState({
        series: [
            {
                name: 'Visitors',
                data: visitorsData,
            },
            {
                name: 'Borrowers',
                data: borrowersData,
            },
        ],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                width:450,
                stacked: false, 
                toolbar: {
                    show: true, 
                },
                zoom: {
                    enabled: true, 
                },
                events: {
                    mounted: (chart) => {
                        chart.windowResizeHandler(); 
                    },
                },
            },
            grid: {
                borderColor: '#f1f1f1',
                strokeDashArray: 3,
            },
            colors: ["rgba(75, 192, 192, 0.9)", "rgba(153, 102, 255, 0.9)"],
            plotOptions: {
                bar: {
                    columnWidth: '40%',
                },
            },
            dataLabels: {
                enabled: false, 
            },
            xaxis: {
                categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'], 
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left',
            },
            fill: {
                opacity: 1, 
            },
            title: {
                text: 'Visitors and Borrowers Statistics', 
                align: 'center', 
                margin: 20,
                offsetY: 20,
                style: {
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#263238',
                },
            },
        },
    });

    return (
        <div className="MembersBorrowersStatsContainer">
            <Card className="members-borrowers-stats-card">
                <CardBody>
                    <ReactApexChart
                        options={state.options}
                        series={state.series}
                        type="bar"
                        height={350} width={450}
                    />
                </CardBody>
            </Card>
        </div>
    );
};


export default MembersBorrowersStats;
