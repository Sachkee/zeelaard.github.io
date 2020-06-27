const weeklyWeather = [-3, 18, 29, 21, 6, 24, -1];
const tempLimit = [0, 15, 20, 25, 99];
const todayOffer = ["forró csoki", "meleg tea", "finom süti", "fagyi", "jéghideg limonádé"];

const temps = {
    minMaxAvg: function () {
        const showMin = document.querySelector("span#minTemp");
        let minTemp = temps.getMinTemp();
        showMin.innerHTML = minTemp;

        const showMax = document.querySelector("span#maxTemp");
        let maxTemp = temps.getMaxTemp();
        showMax.innerHTML = maxTemp;

        const showAvg = document.querySelector("span#avgTemp");
        let avgTemp = temps.getAvgTemp();
        showAvg.innerHTML = avgTemp;
    },
    getTemp: function (boolToday) {
        let todayDay = 0;
        if (boolToday == true) {
            todayDay = otherFunctions.checkToday();
        } else {
            todayDay = parseInt(document.querySelector("select#selWeather").value);
        }
        let todayTemp = weeklyWeather[todayDay];
        return this.getTempUnit(todayTemp);
    },
    getMinTemp: function () {
        let minTemp = weeklyWeather[0];
        for (let i = 0; i < weeklyWeather.length; i++) {
            if (weeklyWeather[i] < minTemp) {
                minTemp = weeklyWeather[i];
            }
        }
        return this.getTempUnit(minTemp);
    },
    getMaxTemp: function () {
        let maxTemp = weeklyWeather[0];
        for (let i = 0; i < weeklyWeather.length; i++) {
            if (weeklyWeather[i] > maxTemp) {
                maxTemp = weeklyWeather[i];
            }
        }
        return this.getTempUnit(maxTemp);
    },
    getAvgTemp: function () {
        let sumTemp = 0;
        for (let i = 0; i < weeklyWeather.length; i++) {
            sumTemp = sumTemp + weeklyWeather[i];
        }
        let avgTemp = sumTemp / weeklyWeather.length;
        return this.getTempUnit(avgTemp);
    },
    getTempUnit: function (tempC) {
        const radioTemp = document.querySelector(".form-check-input:checked").id;
        if (radioTemp == "tempC") {
            return tempC.toFixed(1) + " °C";
        } else {
            return this.getTempF(tempC).toFixed(1) + " °F";
        }
    },
    getTempF: function (tempC) {
        return tempC * 1.8 + 32;
    }
}

const otherFunctions = {
    autoStart: function() {
        this.dailyOffer(true);
        const selWeather = document.querySelector("select#selWeather");
        let todayDay = this.checkToday();
        selWeather.selectedIndex = todayDay;
        temps.minMaxAvg();
    },    
    dailyOffer: function(boolToday = false) {
        let d = new Date();
        const showTodayTemp = document.querySelector("span.span-weather");
        const showTodayOffer = document.querySelector("span.span-offer");
        let todayTemp = temps.getTemp(boolToday);
        let tempLimit = this.getLimit(todayTemp);
        let todayOffer = this.getOffer(tempLimit);
        showTodayTemp.innerHTML = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ", " + todayTemp;
        showTodayOffer.innerHTML = todayOffer;
    },    
    checkToday: function() {
        let d = new Date()
        let todayDay = 0;
        if (d.getDay() == 0) {
            todayDay = 6;
        } else {
            todayDay = d.getDay() - 1;
        }
        return todayDay
    },    
    getLimit: function(todayTemp) {
        let todayLimit = 0;
        for (let i = 0; i < tempLimit.length; i++) {
            if (todayTemp < tempLimit[i]) {
                todayLimit = i;
                break;
            }
        }
        return todayLimit;
    },    
    getOffer: function(tempLimit) {
        return todayOffer[tempLimit]
    }
}

otherFunctions.autoStart();

function btnClick() {
    otherFunctions.dailyOffer(false);
    temps.minMaxAvg();
}


function orderButtonClick() {
    const inputName = document.querySelector("input#name"); /* A név mező értékének beolvasása */
    const inputEmail = document.querySelector("input#email"); /* Az email mező értékének beolvasása */
    const inputAddress = document.querySelector("input#address"); /* Az cím mező értékének beolvasása */
    const inputRemarks = document.querySelector("textarea#remarks"); /* Az megjegyzés mező értékének beolvasása */
    const inputQuantity = document.querySelector("input#quantity"); /* A mennyiség értékének (szám) beolvasása */

    const validResults = checkInputValidation(inputName.value, inputEmail.value, inputAddress.value, inputRemarks.value,
        parseInt(inputQuantity.value));

    if (validResults == true) {
        let amount = calcOrderPrice(parseInt(inputQuantity.value));
        showPriceOnPage(amount);
    }
}

function checkInputValidation(name, email, address, remarks, qty) {
    let validResults = false;
    if (name.length < 6) {
        alert("A név nincs beírva vagy kevesebb, mint 6 karakter!");
    } else if (email.indexOf(".") == -1 || email.indexOf("@") == -1) {
        alert("Az email nincs beírva, vagy helytelenül van megadva!");
    } else if (address.length < 10) {
        alert("A megadott cím nincs kitöltve vagy kevesebb, mint 10 karakter!");
    } else if (remarks.indexOf("<") >= 0 || remarks.indexOf(">") >= 0) {
        alert("A megjegyzés nem tartalmazhat html elemeket!");
    } else if (isNaN(qty) || qty < 1 || qty > 10) {
        alert("A mennyiség legalább 1, legfeljebb 10db lehet!");
        inputQuantity.value = "1";
    } else {
        validResults = true;
    }
    return validResults;
}

function calcOrderPrice(qty) {
    const basePrice = 1200; //Az alap hamburger árának meghatározása
    const radioAddition = parseInt(document.querySelector(".form-check-input:checked").value); //A kiválasztott feltét értékének beolvasása
    const selectSauce = parseInt(document.querySelector("select#sauce").value); //A kiválasztott szósz értékének beolvasása
    return (basePrice + radioAddition + selectSauce) * qty; //Rendelés összegének kiszámoltatása    
}

function showPriceOnPage(amount) {
    const showTotalPrice = document.querySelector("span.show-price"); //A span elem meghatározása a végösszeg kiíratásához
    const showDeliveryCost = document.querySelector("span.delivery-cost"); //A span elem meghatározása a szállítási díj kiíratásához

    if (amount < 5000) {
        showTotalPrice.innerHTML = amount + 500; //Végösszeg megjelenítése
        showDeliveryCost.innerHTML = "(500Ft szállítási díjat tartalmaz)" //Szállítási díj megjelenítése
    } else {
        showTotalPrice.innerHTML = amount;
        showDeliveryCost.innerHTML = "(5000Ft felett nincs szállítási díj)"
    }
}

//További lehetőségek a radio button értékének beolvasásához
//const radioAddition = parseInt(document.querySelector("input.form-check-input:checked").value);
//const radioAddition = parseInt(document.querySelector("input[name='radio-additions']:checked").value);
//const radioAddition = parseInt(document.querySelector('input[name=radio-additions]:checked').value);
//Másik lehetőség a végösszeg megjelenítéséhez:
//showTotalPrice.innerHTML = '${amount}';