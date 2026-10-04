const letters = "АВЕКМНОРСТУХ";


const regions = [
    "01",
    "02",
    "50",
    "52",
    "55",
    "59",
    "61",
    "66",
    "77",
    "78",
    "90",
    "99",
    "116",
    "150",
    "177",
    "199"
];


function randomLetter() {

    return letters[
        Math.floor(
            Math.random() *
            letters.length
        )
    ];

}


function randomDigit() {

    return Math.floor(
        Math.random() * 10
    );

}


function randomRegion() {

    return regions[
        Math.floor(
            Math.random() *
            regions.length
        )
    ];

}


function generateNumber() {

    const firstLetter =
        randomLetter();

    const digits =
        randomDigit() +
        "" +
        randomDigit() +
        "" +
        randomDigit();

    const secondLetter =
        randomLetter();

    const thirdLetter =
        randomLetter();

    const region =
        randomRegion();


    return {
        number:
            firstLetter +
            digits +
            secondLetter +
            thirdLetter,

        region: region
    };

}


function rollNumber() {

    const result =
        generateNumber();


    document.querySelector(
        ".plate"
    ).innerHTML =
        result.number +
        " <span>" +
        result.region +
        "</span>";


    document.querySelector(
        ".rarity"
    ).innerText =
        "⭐ Обычный";


    document.querySelector(
        ".price"
    ).innerText =
        "1 250 ₽";

}


function showHome() {

    alert(
        "🏠 Главная"
    );

}


function showStorage() {

    alert(
        "📦 Хранилище пока пустое"
    );

}


function showProfile() {

    alert(
        "👤 Профиль"
    );

} 