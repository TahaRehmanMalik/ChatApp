import React from 'react'
import { Line,Doughnut } from 'react-chartjs-2';
import {
Chart as ChartJS,
Tooltip,
Filler,
CategoryScale,
LinearScale,
PointElement,
LineElement,
ArcElement,
Legend,
plugins,
scales
} from 'chart.js';
import { purple, purpleLight,orange, orangeLight } from '../constants/color';
import { getLast7Days } from '../../lib/features';
ChartJS.register( 
    Tooltip,
    Filler,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Legend

);
const labels=getLast7Days();

const lineChartOptions={
responsive:true,
plugins:{
    legend:{
      display:false,
    },
    title:{
        display:false
    },
},
scales:{
    x:{
        grid:{
            display:false,
        },
        // display:false,
    },
    y:{
        grid:{
            beginAtZero:true,
            display:false,
        }
        // display:false
    }
}
}
const LineChart = ({value=[]}) => {
    const data={
        labels,
        datasets:[
            {
                data:value,
                label:"Messages",
                fill:true,
                backgroundColor:purpleLight,
                borderColor:purple
            },
        ]
    };
  return <Line data={data} options={lineChartOptions}/>
}


const doughnutChartOptions={
    responsive:true,
    plugins:{
        legend:{
          display:false,
        },
        cutout:120,
    },
    }

const DoughnutChart = ({value=[],labels=[]}) => {
    const data={
        labels,
        datasets:[
            {
                data:value,
                fill:true,
                backgroundColor:[purpleLight,orangeLight],
                hoverBackgroundColor:[purple,orange],
                borderColor:[purple,orange],
                offset:40
            },
        ]
    };
    return (
        <Doughnut style={{zIndex:10}} data={data} options={doughnutChartOptions}/>
    )
  }

export {LineChart,DoughnutChart}