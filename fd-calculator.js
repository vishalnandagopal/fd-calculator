function getValuesAndCalculate() {
    const principle = parseFloat(document.getElementById("principle").value.replace(",", ""));
    const interest_rate = parseFloat(document.getElementById("interest_rate").value.replace(",", ""));
    const time = parseFloat(document.getElementById("time").value.replace(",", ""));
    const time_unit = document.getElementById("time-units").value;
    const compounding = parseInt(document.getElementById("compounding").value);
    const maturity_amount = calculate(principle, interest_rate, time, time_unit, compounding);
    document.getElementById("answer-section").style.display = "block";
    if (isNaN(maturity_amount)) {
        document.getElementById("answer").innerHTML = "Please enter the correct values in the form.";
    } else {
        document.getElementById("answer").innerHTML = `Your total maturity amount is <span>${(Math.round(maturity_amount * 100) / 100).toLocaleString()}</span>.`;
    }
}

function calculate(principle, interest_rate, time, time_unit, compounding) {
    let days = 0;
    let maturity_amount = principle;

    if (time_unit == "y") {
        days = time * 365 + Math.floor(time / 4);
    } else if (time_unit == "m") {
        days = time * 30 + Math.floor(time / 2);
    } else if (time_unit == "d") {
        days = time;
    }
    console.log(`₹${principle} invested at ${interest_rate}% for ${days} days / ${time} ${time_unit}. Compouding every ${compounding} day(s)`);
    for (i = 1; i <= days / compounding; i++) {
        console.log(i);
        maturity_amount = calculate_interest(maturity_amount, interest_rate, compounding);
        console.log(maturity_amount);
    }

    maturity_amount = calculate_interest(maturity_amount, interest_rate, days % compounding);
    console.log(maturity_amount);
    return maturity_amount;
}

function calculate_interest(principle, interest_rate, days) {
    // This uses simple interest, not compound.
    // The compounding formula must be used separately. For example, if for a year, it compounds quarterly, you must call it 4 times by adding the interest after each calculation manually.
    const interest_amount = principle * (interest_rate / 100);
    const interest_per_day = interest_amount / 365;
    return principle + interest_per_day * days;
}
