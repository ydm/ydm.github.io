function range(n) {
    const keys = new Array(n);
    return Array.from(keys.keys());
}

function checkMonth(year, month) {
    const isSpecialMonth = 41 <= month && month <= 52;
    const isStandardMonth = 1 <= month && month <= 12;

    if (!isStandardMonth && !isSpecialMonth) {
        // console.log("checkMonth: invalid month");
        return false;
    }

    if (isSpecialMonth && year > 5) {
        // console.log("checkMonth: invalid year or month");
        return false;
    }

    return true;
}

function checkLength(egn) {
    // Check if the input is a string with exactly 10 digits.
    return /^\d{10}$/.test(egn);
}

function checkDate(egn) {
    // Extract year, month, day.
    const year = parseInt(egn.slice(0, 2));
    const month = parseInt(egn.slice(2, 4));
    const day = parseInt(egn.slice(4, 6));

    // Check month first.
    if (!checkMonth(year, month)) {
        return false;
    }

    // Check the days in a month.
    const m = (
        (41 <= month && month <= 52)
        ? (month - 40)
        : month
    );
    const bounds = [0, 31, 29, 31, 30, 31, 31, 30, 31, 30, 31, 30, 31];
    const bound = bounds[m];
    if (day < 1 || bound < day) {
        // console.log(`isValidEGN: invalid day, expected [1;${bound}]`);
        return false;
    }

    return true;
}

function checkChecksum(egn) {
    // Check if the EGN passes the checksum test
    const weights = [2, 4, 8, 5, 10, 9, 7, 3, 6];
    let checksum = 0;
    range(9).forEach(function (i) {
        checksum += parseInt(egn.charAt(i)) * weights[i];
    });
    checksum = (checksum % 11) % 10;
    if (checksum !== parseInt(egn.charAt(9))) {
        return false;
    }

    // If all checks pass, the EGN is valid
    return true;
}

function isValidEGN(egn) {
    if (!checkLength(egn)) {
        return false;
    }

    if (!checkDate(egn)) {
        return false;
    }

    return checkChecksum(egn);
}

function replaceRandomDigit(str) {
    // Generate a random index between 0 and the length of the string
    const index = Math.floor(Math.random() * str.length);

    // Generate a random digit between 0 and 9
    const newDigit = Math.floor(Math.random() * 10);

    // Replace the digit at the random index with the new digit
    const newStr = str.substring(0, index) + newDigit + str.substring(index + 1);

    return newStr;
}

window.addEventListener("load", function (ignore) {
    const cls = "d-none";
    
    const inp = document.getElementById("input-egn");
    const form = document.getElementById("form-main");

    const valid = document.getElementById("feedback-egn-valid");
    const fixed = document.getElementById("feedback-egn-fixed");
    const length = document.getElementById("feedback-egn-invalid-length");
    const failure = document.getElementById("feedback-egn-failure");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        event.stopPropagation();

        valid.classList.add(cls);
        fixed.classList.add(cls);
        length.classList.add(cls);
        failure.classList.add(cls);

        fixed.innerText = "";

        const egn = inp.value.trim();

        if (isValidEGN(egn)) {
            valid.classList.remove(cls);
            return;
        }

        if (!checkLength(inp.value)) {
            length.classList.remove(cls);
            return;
        }

        // Try to fix it.
        for (let i = 0; i < 2048; i++) {
            const replaced = replaceRandomDigit(egn);
            if (isValidEGN(replaced)) {
                fixed.innerText = replaced;
                fixed.classList.remove(cls);
                return;
            }
        }

        failure.classList.remove(cls);
    });
});
