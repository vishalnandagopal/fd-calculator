function getValuesAndCalculate() {
    const principle = parseFloat(document.getElementById("principle").value.replace(",", ""));
    const interest_rate = parseFloat(document.getElementById("interest_rate").value.replace(",", ""));
    const time = parseFloat(document.getElementById("time").value.replace(",", ""));
    const time_unit = document.getElementById("time-units").value;
    const compounding = parseInt(document.getElementById("compounding").value);
    const maturity_values_at_end_of_each_period = calculate(principle, interest_rate, time, time_unit, compounding);

    maturity_amount = maturity_values_at_end_of_each_period.pop();

    document.getElementById("answer-section").style.display = "initial";

    if (isNaN(maturity_amount) && maturity_amount != principle) {
        document.getElementById("answer").innerHTML = 'Please enter the valid values in the form. If issue persists, open a bug report by clicking the "Source" link below';
    } else {
        rounded_maturity_amount = Math.round(maturity_amount * 100) / 100;

        document.getElementById("invested-amount").innerText = maturity_values_at_end_of_each_period[0];
        document.getElementById("interest").innerText = rounded_maturity_amount - maturity_values_at_end_of_each_period[0];
        document.getElementById("total").innerText = rounded_maturity_amount;

        maturity_values_at_end_of_each_period.push(rounded_maturity_amount);

        createCharts(maturity_values_at_end_of_each_period);
    }
}

function calculate(principle, interest_rate, time, time_unit, compounding) {
    let days = 0;
    let maturity_amount = principle;
    let maturity_values_at_end_of_each_period = [principle];

    if (time_unit == "y") {
        days = time * 365 + Math.floor(time / 4);
    } else if (time_unit == "m") {
        days = time * 30 + Math.floor(time / 2);
    } else if (time_unit == "d") {
        days = time;
    }

    console.log(`₹${principle} invested at ${interest_rate}% for ${days} days / ${time} ${time_unit}. Compouding every ${compounding} day(s)`);

    for (i = 1; i <= days / compounding; i++) {
        maturity_amount = calculate_interest(maturity_amount, interest_rate, compounding);
        maturity_values_at_end_of_each_period.push(maturity_amount);
    }

    maturity_amount = calculate_interest(maturity_amount, interest_rate, days % compounding);
    return maturity_values_at_end_of_each_period;
}

function calculate_interest(principle, interest_rate, days) {
    // This uses simple interest, not compound.
    // The compounding formula must be used separately. For example, if for a year, it compounds quarterly, you must call it 4 times by adding the interest after each calculation manually.
    const interest_amount = principle * (interest_rate / 100);
    const interest_per_day = interest_amount / 365;
    return principle + interest_per_day * days;
}

function createCharts(maturity_values_at_end_of_each_period) {
    Chart.register(ChartDataLabels);

    createLineChart(maturity_values_at_end_of_each_period);
    createPieChart(maturity_values_at_end_of_each_period);

    let chart_canvases = document.querySelectorAll(".chart-div");

    for (i = 0; i < chart_canvases.length; i++) {
        chart_canvases[i].style.height = "40vh";
    }
}

function createLineChart(maturity_values_at_end_of_each_period) {
    let labels_for_line_chart = [];
    const length = maturity_values_at_end_of_each_period.length;
    for (var i = 1; i <= length; i++) {
        labels_for_line_chart.push(i.toString());
    }

    // Creating line chart
    ((maturity_values_at_end_of_each_period) => {
        // checking if it already exists

        Chart.getChart("canvas-for-line-chart") ? Chart.getChart("canvas-for-line-chart").destroy() : (show_animation = false);

        let canvas = document.getElementById("canvas-for-line-chart");
        chart = new Chart(canvas, {
            type: "line",
            data: {
                labels: labels_for_line_chart,
                datasets: [
                    {
                        data: maturity_values_at_end_of_each_period,
                        borderColor: "rgb(75, 192, 192)",
                        tension: 0.1,
                    },
                ],
            },
            options: { animation: show_animation },
        });
        chart.canvas.parentNode.style.height = "30vh";
        chart.canvas.parentNode.style.width = "60vw";
    })(maturity_values_at_end_of_each_period.map((x) => Math.round(x * 100) / 10));
}

function createPieChart(maturity_values_at_end_of_each_period) {
    // Creating pie chart
    ((dataset) => {
        // checking if it already exists
        show_animation = true;
        Chart.getChart("canvas-for-pie-chart") ? Chart.getChart("canvas-for-pie-chart").destroy() : (show_animation = false);

        let canvas = document.getElementById("canvas-for-pie-chart");

        chart = new Chart(canvas, {
            type: "doughnut",
            data: {
                labels: ["Principle", "Interest"],
                datasets: [
                    {
                        data: dataset,
                        backgroundColor: ["#4b77a9", "#5f255f"],
                        hoverOffset: 2,
                    },
                ],
            },
            options: {
                tooltips: {
                    enabled: false,
                },
                plugins: {
                    datalabels: {
                        formatter: (value) => {
                            let sum = 0;
                            let dataArr = dataset;
                            dataArr.map((data) => {
                                sum += data;
                            });
                            let percentage = ((value * 100) / sum).toFixed(2) + "%";
                            return percentage;
                        },
                        color: "#fff",
                    },
                },
                animation: show_animation,
            },
        });

        chart.canvas.parentNode.style.height = "60vh";
    })([maturity_values_at_end_of_each_period[0], maturity_values_at_end_of_each_period.pop()]);
}
