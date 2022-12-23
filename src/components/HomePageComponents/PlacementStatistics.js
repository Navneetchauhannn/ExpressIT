import React, { useEffect, useState } from "react";
import { CChart } from '@coreui/react-chartjs'
import Grid from '@mui/material/Grid';

function PlacementStatistics() {
    return (
        <div
            className="container-fluid testimonial pb-5 px-md-5"
            style={{ padding: "0 25px" }}
        >
            <h2 style={{ paddingTop: "80px" }}>
                Placement Data
                <div className="line"></div>
            </h2> <br/>
            <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                    <h3>Total Company Visited</h3>
                    <CChart
                        type="doughnut"
                        style={{ height: "50%", width: "60%" }}
                        options={{ maintainAspectRatio: true }}
                        data={{
                            labels: ['2019', '2020', '2021', '2022'],
                            datasets: [
                                {
                                    hoverBorderJoinStyle:"round",
                                    hoverBorderWidth:"10",
                                    backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                                    data: [110, 79, 113, 191],
                                },
                            ],
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <h3>Total Students Selected</h3>
                    <CChart
                        type="doughnut"
                        style={{ height: "50%", width: "60%" }}
                        options={{ maintainAspectRatio: true }}
                        data={{
                            labels: ['2019', '2020', '2021', '2022'],
                            datasets: [
                                {
                                    hoverBorderJoinStyle:"round",
                                    hoverBorderWidth:"10",
                                    backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                                    data: [652, 621, 629, 750],
                                },
                            ],
                        }}
                        labels="months"
                    />
                </Grid>
            </Grid>
        </div>
    )
}

export default PlacementStatistics;