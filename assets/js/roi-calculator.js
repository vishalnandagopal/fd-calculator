function getValuesAndCalculate() {
    const principle = parseFloat(document.getElementById("principle").value.replace(",", ""));
    const interest_rate = parseFloat(document.getElementById("interest_rate").value.replace(",", "").replace("%", ""));
    const time = parseFloat(document.getElementById("time").value.replace(",", ""));
    const time_unit = document.getElementById("time-units").value;
    const compounding = parseInt(document.getElementById("compounding").value);
    const maturity_values_at_end_of_each_period = calculate(principle, interest_rate, time, time_unit, compounding);

    maturity_amount = maturity_values_at_end_of_each_period.pop();
    if (isNaN(maturity_amount) || maturity_amount == principle) {
        document.getElementById("error").innerHTML = 'Please enter the valid values in the form. If issue persists, open a bug report by clicking the "Source" link below';
    } else {
        document.getElementById("error").innerHTML = "";
        document.getElementById("answer-section").style.display = "flex";
        rounded_maturity_amount = Math.round(maturity_amount * 100) / 100;

        document.getElementById("invested-amount").innerText = (Math.round(maturity_values_at_end_of_each_period[0] * 100) / 100).toLocaleString();
        document.getElementById("returns").innerText = (Math.round((rounded_maturity_amount - maturity_values_at_end_of_each_period[0]) * 100) / 100).toLocaleString();
        document.getElementById("total").innerText = rounded_maturity_amount.toLocaleString();

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
    // Chart.register(ChartDataLabels);
    createPieChart(maturity_values_at_end_of_each_period);
}

function createPieChart(maturity_values_at_end_of_each_period) {
    // Creating pie chart
    const returns = maturity_values_at_end_of_each_period.pop() - maturity_values_at_end_of_each_period[0];
    ((dataset) => {
        // checking if it already exists
        show_animation = true;
        Chart.getChart("canvas-for-pie-chart") ? Chart.getChart("canvas-for-pie-chart").destroy() : (show_animation = false);

        let canvas = document.getElementById("canvas-for-pie-chart");

        chart = new Chart(canvas, {
            type: "doughnut",
            data: {
                labels: ["Principle", "Returns"],
                datasets: [
                    {
                        data: dataset,
                        backgroundColor: ["#4b77a9", "#5f255f"],
                        hoverOffset: 2,
                    },
                ],
            },
            options: {
                plugins: {
                    tooltips: {
                        enabled: false,
                    },
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

        // chart.canvas.parentNode.style.height = "60vh";
    })([maturity_values_at_end_of_each_period[0], returns]);
}
