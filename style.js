const tg = window.Telegram
    ? window.Telegram.WebApp
    : null;


// =========================
// TELEGRAM
// =========================

if (tg) {

    tg.ready();

    tg.expand();

    try {

        tg.setBackgroundColor("#0b0d11");

        tg.setHeaderColor("#0b0d11");

    } catch (e) {}

}


// =========================
// ДАННЫЕ
// =========================

const LETTERS =
    "АВЕКМНОРСТУХ";


const REGIONS = [
    "01","02","03","04","05","06","07","08","09",
    "10","11","12","13","14","15","16","17","18","19",
    "20","21","22","23","24","25","26","27","28","29",
    "30","31","32","33","34","35","36","37","38","39",
    "40","41","42","43","44","45","46","47","48","49",
    "50","51","52","53","54","55","56","57","58","59",
    "60","61","62","63","64","65","66","67","68","69",
    "70","71","72","73","74","75","76","77","78","79",
    "80","81","82","83","84","85","86","87","88","89",
    "90","91","92","93","94","95","96","97","98","99",
    "102","116","121","122","123","124","125","126",
    "134","136","138","142","147","150","152","154",
    "156","159","161","163","164","165","166","167",
    "169","173","174","176","177","178","180","181",
    "183","184","185","186","190","193","196","197",
    "198","199"
];


const RARITIES = [

    {
        name: "Обычный",
        weight: 85,
        min: 200,
        max: 1700,
        className: "common"
    },

    {
        name: "Редкий",
        weight: 61,
        min: 1999,
        max: 7999,
        className: "rare"
    },

    {
        name: "Эпический",
        weight: 32,
        min: 7999,
        max: 14999,
        className: "epic"
    },

    {
        name: "Легендарный",
        weight: 10,
        min: 69999,
        max: 149999,
        className: "legendary"
    },

    {
        name: "Секретный",
        weight: 0.6,
        min: 200999,
        max: 899999,
        className: "secret"
    }

];


const PROMOCODES = {

    START: 25000,

    NOMERA: 50000,

    "777": 77777,

    SECRET: 150000

};


const ROLL_PRICE = 9999;


// =========================
// СОХРАНЕНИЕ
// =========================

let balance =
    Number(
        localStorage.getItem(
            "nomera_balance"
        )
    ) || 49999;


let rolls =
    Number(
        localStorage.getItem(
            "nomera_rolls"
        )
    ) || 0;


let storage =
    JSON.parse(
        localStorage.getItem(
            "nomera_storage"
        ) || "[]"
    );


let usedPromo =
    JSON.parse(
        localStorage.getItem(
            "nomera_promos"
        ) || "[]"
    );


let lastNumber =
    JSON.parse(
        localStorage.getItem(
            "nomera_last"
        ) || "null"
    );


// =========================
// DOM
// =========================

const content =
    document.getElementById(
        "content"
    );


const balanceElement =
    document.getElementById(
        "balance"
    );


const toast =
    document.getElementById(
        "toast"
    );


const promoModal =
    document.getElementById(
        "promoModal"
    );


const promoInput =
    document.getElementById(
        "promoInput"
    );


// =========================
// ФУНКЦИИ
// =========================

function save() {

    localStorage.setItem(
        "nomera_balance",
        balance
    );

    localStorage.setItem(
        "nomera_rolls",
        rolls
    );

    localStorage.setItem(
        "nomera_storage",
        JSON.stringify(storage)
    );

    localStorage.setItem(
        "nomera_promos",
        JSON.stringify(usedPromo)
    );

    localStorage.setItem(
        "nomera_last",
        JSON.stringify(lastNumber)
    );

}


function formatMoney(number) {

    return (
        Math.round(number)
        .toLocaleString("ru-RU")
        + " ₽"
    );

}


function updateBalance() {

    balanceElement.textContent =
        formatMoney(balance);

}


function randomLetter() {

    return LETTERS[
        Math.floor(
            Math.random() *
            LETTERS.length
        )
    ];

}


function randomLetters(count) {

    let result = "";

    for (
        let i = 0;
        i < count;
        i++
    ) {

        result += randomLetter();

    }

    return result;

}


function randomDigit() {

    return String(
        Math.floor(
            Math.random() * 10
        )
    );

}


function randomDigits(count) {

    let result = "";

    for (
        let i = 0;
        i < count;
        i++
    ) {

        result += randomDigit();

    }

    return result;

}


function randomRegion() {

    return REGIONS[
        Math.floor(
            Math.random() *
            REGIONS.length
        )
    ];

}


// =========================
// РЕДКОСТЬ
// =========================

function getRarity() {

    const total =
        RARITIES.reduce(
            (sum, rarity) =>
                sum + rarity.weight,
            0
        );


    let value =
        Math.random() *
        total;


    for (
        const rarity of RARITIES
    ) {

        value -= rarity.weight;


        if (value <= 0) {

            return rarity;

        }

    }


    return RARITIES[0];

}


// =========================
// НОМЕР
// =========================

function generateNumber(rarity) {

    let first =
        randomLetter();


    let digits =
        randomDigits(3);


    let last =
        randomLetters(2);


    let region =
        randomRegion();


    // РЕДКИЙ

    if (
        rarity.name === "Редкий"
    ) {

        if (
            Math.random() < 0.5
        ) {

            const d =
                randomDigit();

            digits =
                d +
                d +
                randomDigit();

        } else {

            const l =
                randomLetter();

            last =
                l +
                l;

        }

    }


    // ЭПИЧЕСКИЙ

    if (
        rarity.name === "Эпический"
    ) {

        const d =
            randomDigit();

        digits =
            d.repeat(3);

    }


    // ЛЕГЕНДАРНЫЙ

    if (
        rarity.name === "Легендарный"
    ) {

        const combinations = [
            "АМР",
            "ЕКХ",
            "ММР",
            "ХРХ",
            "ХАХ",
            "МРР"
        ];


        const combo =
            combinations[
                Math.floor(
                    Math.random() *
                    combinations.length
                )
            ];


        const d =
            randomDigit();


        return {

            main:
                combo[0] +
                d.repeat(3) +
                combo.slice(1),

            region:
                region

        };

    }


    // СЕКРЕТНЫЙ

    if (
        rarity.name === "Секретный"
    ) {

        const l =
            randomLetter();


        const d =
            randomDigit();


        const repeatRegions =
            REGIONS.filter(
                r =>

                    (
                        r.length === 2 &&
                        r[0] === r[1]
                    )

                    ||

                    (
                        r.length === 3 &&
                        (
                            r[0] === r[1] ||
                            r[1] === r[2] ||
                            r[0] === r[2]
                        )
                    )
            );


        region =
            repeatRegions.length
                ? repeatRegions[
                    Math.floor(
                        Math.random() *
                        repeatRegions.length
                    )
                ]
                : "77";


        return {

            main:
                l +
                d.repeat(3) +
                l +
                l,

            region:
                region

        };

    }


    return {

        main:
            first +
            digits +
            last,

        region:
            region

    };

}


// =========================
// ЦЕНА
// =========================

function calculatePrice(
    number,
    rarity
) {

    let price =
        Math.floor(
            Math.random() *
            (
                rarity.max -
                rarity.min +
                1
            )
        ) +
        rarity.min;


    const main =
        number.main;


    const letters =
        main[0] +
        main.slice(4,6);


    const digits =
        main.slice(1,4);


    if (
        new Set(letters).size === 1
    ) {

        price += 10000;

    }


    if (
        new Set(digits).size === 1
    ) {

        price += 10000;

    }


    if (
        [
            "123",
            "234",
            "345",
            "456",
            "567",
            "678",
            "789",
            "012"
        ].includes(digits)
    ) {

        price += 5000;

    }


    if (
        digits[0] === digits[2]
    ) {

        price += 5000;

    }


    return price;

}


// =========================
// УВЕДОМЛЕНИЕ
// =========================

function showToast(text) {

    toast.textContent =
        text;

    toast.classList.add(
        "show"
    );


    clearTimeout(
        showToast.timer
    );


    showToast.timer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );


    if (
        tg &&
        tg.HapticFeedback
    ) {

        try {

            tg.HapticFeedback
                .notificationOccurred(
                    "success"
                );

        } catch (e) {}

    }

}


// =========================
// НОМЕР НА ЭКРАНЕ
// =========================

function plateHTML(number) {

    return `

        <div class="plate">

            <div class="plate-main">
                ${number.main}
            </div>

            <div class="plate-region">
                ${number.region}
            </div>

            <div class="plate-rus">

                <div class="flag"></div>

                RUS

            </div>

        </div>

    `;

}


// =========================
// ГЛАВНАЯ
// =========================

function showHome() {

    const current =
        lastNumber || {

            main: "А123ВС",

            region: "77",

            rarity:
                RARITIES[0],

            price:
                1250

        };


    content.innerHTML = `

        <div class="page">

            <div class="page-title">
                Лови свой номер 🔥
            </div>

            <div class="page-subtitle">
                Крути номера, собирай редкие
                комбинации и продавай их дороже.
            </div>


            <div
                class="number-card"
                id="numberCard"
            >

                <div class="card-label">
                    Текущий номер
                </div>


                <div
                    class="plate-area"
                    id="plateArea"
                >

                    ${plateHTML(current)}

                </div>


                <div class="info-grid">

                    <div class="info-box">

                        <div class="info-title">
                            Редкость
                        </div>

                        <div
                            class="
                                info-value
                                ${current.rarity.className}
                            "
                            id="rarityValue"
                        >

                            ⭐
                            ${current.rarity.name}

                        </div>

                    </div>


                    <div class="info-box">

                        <div class="info-title">
                            Цена
                        </div>

                        <div
                            class="
                                info-value
                                price
                            "
                            id="priceValue"
                        >

                            ${formatMoney(
                                current.price
                            )}

                        </div>

                    </div>

                </div>

            </div>


            <div class="roll-container">

                <button
                    class="main-button"
                    id="rollButton"
                >

                    🎰 КРУТИТЬ

                </button>

                <div class="roll-price">

                    Стоимость:
                    ${formatMoney(
                        ROLL_PRICE
                    )}

                </div>

            </div>


            <div class="section-title">
                Быстрые действия
            </div>


            <div class="quick-grid">

                <button
                    class="quick-card"
                    id="storageQuick"
                >

                    <div class="quick-icon">
                        📦
                    </div>

                    <div class="quick-title">
                        Хранилище
                    </div>

                    <div class="quick-text">
                        ${storage.length}
                        сохранённых номеров
                    </div>

                </button>


                <button
                    class="quick-card"
                    id="promoQuick"
                >

                    <div class="quick-icon">
                        🎟
                    </div>

                    <div class="quick-title">
                        Промокод
                    </div>

                    <div class="quick-text">
                        Получить деньги
                    </div>

                </button>

            </div>

        </div>

    `;


    document
        .getElementById("rollButton")
        .addEventListener(
            "click",
            roll
        );


    document
        .getElementById("storageQuick")
        .addEventListener(
            "click",
            () =>
                navigate("storage")
        );


    document
        .getElementById("promoQuick")
        .addEventListener(
            "click",
            openPromo
        );

}


// =========================
// КРУТКА
// =========================

function roll() {

    if (
        balance <
        ROLL_PRICE
    ) {

        showToast(
            "❌ Недостаточно денег"
        );

        return;

    }


    balance -=
        ROLL_PRICE;


    rolls += 1;


    updateBalance();

    save();


    const button =
        document.getElementById(
            "rollButton"
        );


    const area =
        document.getElementById(
            "plateArea"
        );


    if (!button || !area) {
        return;
    }


    button.disabled =
        true;


    button.textContent =
        "🎰 КРУТИМ...";


    area.classList.add(
        "spinning"
    );


    let counter = 0;


    const animation =
        setInterval(
            () => {

                const fakeRarity =
                    RARITIES[
                        Math.floor(
                            Math.random() *
                            3
                        )
                    ];


                const fake =
                    generateNumber(
                        fakeRarity
                    );


                area.innerHTML =
                    plateHTML(fake);


                counter++;


                if (
                    counter >= 12
                ) {

                    clearInterval(
                        animation
                    );


                    const rarity =
                        getRarity();


                    const number =
                        generateNumber(
                            rarity
                        );


                    const price =
                        calculatePrice(
                            number,
                            rarity
                        );


                    lastNumber = {

                        main:
                            number.main,

                        region:
                            number.region,

                        rarity:
                            rarity,

                        price:
                            price

                    };


                    area.innerHTML =
                        plateHTML(
                            lastNumber
                        );


                    area.classList.remove(
                        "spinning"
                    );


                    document
                        .getElementById(
                            "rarityValue"
                        )
                        .className =
                            `info-value ${rarity.className}`;


                    document
                        .getElementById(
                            "rarityValue"
                        )
                        .textContent =
                            `⭐ ${rarity.name}`;


                    document
                        .getElementById(
                            "priceValue"
                        )
                        .textContent =
                            formatMoney(
                                price
                            );


                    button.disabled =
                        false;


                    button.textContent =
                        "🎰 КРУТИТЬ";


                    save();


                    showToast(
                        `🔥 ${rarity.name}!`
                    );

                }

            },
            75
        );

}


// =========================
// ХРАНИЛИЩЕ
// =========================

function showStorage() {

    const items =
        storage
            .slice()
            .reverse();


    let html = `

        <div class="page">

            <div class="page-title">
                📦 Хранилище
            </div>

            <div class="page-subtitle">
                Здесь находятся номера,
                которые ты сохранил.
            </div>

    `;


    if (
        items.length === 0
    ) {

        html += `

            <div class="empty">

                <div class="empty-icon">
                    📦
                </div>

                Хранилище пока пусто.<br>

                Крути номера и забирай
                понравившиеся.

            </div>

        `;

    } else {

        html += `
            <div class="storage-list">
        `;


        items.forEach(
            (item,index) => {

                html += `

                    <div
                        class="storage-item"
                    >

                        <div>

                            <div
                                class="storage-number"
                            >
                                ${item.main}
                                ${item.region}
                            </div>


                            <div
                                class="
                                    storage-rarity
                                    ${item.rarity.className}
                                "
                            >

                                ⭐
                                ${item.rarity.name}

                            </div>


                            <div
                                class="storage-price"
                            >

                                ${formatMoney(
                                    item.price
                                )}

                            </div>

                        </div>


                        <button
                            class="sell-button"
                            onclick="
                                sellStored(
                                    ${index}
                                )
                            "
                        >

                            💵 Продать

                        </button>

                    </div>

                `;

            }
        );


        html += `
            </div>
        `;

    }


    html += `
        </div>
    `;


    content.innerHTML =
        html;

}


// =========================
// ПРОДАЖА ИЗ ХРАНИЛИЩА
// =========================

function sellStored(
    reversedIndex
) {

    const actualIndex =
        storage.length -
        1 -
        reversedIndex;


    const item =
        storage[
            actualIndex
        ];


    if (!item) {
        return;
    }


    balance +=
        item.price;


    storage.splice(
        actualIndex,
        1
    );


    save();

    updateBalance();


    showToast(
        `💵 +${formatMoney(item.price)}`
    );


    showStorage();

}


// =========================
// ТОП
// =========================

function showTop() {

    const players = [

        ["🥇","Dragon",1584200],

        ["🥈","Sletov",1125900],

        ["🥉","NomerKing",987500],

        ["4","Vlad",754300],

        ["5","Racer",631800],

        ["6","Maks",540200],

        ["7","Hunter",481000],

        ["8","Roma",396700],

        ["9","Alex",352500],

        ["10","777",299999]

    ];


    content.innerHTML = `

        <div class="page">

            <div class="page-title">
                🏆 Топ игроков
            </div>

            <div class="page-subtitle">
                Самые богатые игроки
                «Номера РФ».
            </div>


            <div class="top-list">

                ${players.map(
                    player => `

                    <div
                        class="top-item"
                    >

                        <div
                            class="top-left"
                        >

                            <div
                                class="top-place"
                            >
                                ${player[0]}
                            </div>

                            <div
                                class="top-name"
                            >
                                ${player[1]}
                            </div>

                        </div>


                        <div
                            class="top-money"
                        >

                            ${formatMoney(
                                player[2]
                            )}

                        </div>

                    </div>

                `
                ).join("")}

            </div>

        </div>

    `;

}


// =========================
// ПРОФИЛЬ
// =========================

function showProfile() {

    const user =
        tg &&
        tg.initDataUnsafe
            ? tg.initDataUnsafe.user
            : null;


    const name =
        user &&
        user.first_name
            ? user.first_name
            : "Игрок";


    const username =
        user &&
        user.username
            ? "@" + user.username
            : "Telegram";


    const avatar =
        name.charAt(0)
            .toUpperCase();


    content.innerHTML = `

        <div class="page">

            <div class="page-title">
                👤 Профиль
            </div>

            <div class="page-subtitle">
                Твоя статистика.
            </div>


            <div class="profile">

                <div
                    class="profile-head"
                >

                    <div
                        class="avatar"
                    >
                        ${avatar}
                    </div>


                    <div>

                        <div
                            class="profile-name"
                        >
                            ${name}
                        </div>


                        <div
                            class="profile-username"
                        >
                            ${username}
                        </div>

                    </div>

                </div>


                <div
                    class="stats"
                >

                    <div
                        class="stat"
                    >

                        <div
                            class="stat-value"
                        >
                            ${rolls}
                        </div>

                        <div
                            class="stat-name"
                        >
                            Круток
                        </div>

                    </div>


                    <div
                        class="stat"
                    >

                        <div
                            class="stat-value"
                        >
                            ${storage.length}
                        </div>

                        <div
                            class="stat-name"
                        >
                            Номеров
                        </div>

                    </div>


                    <div
                        class="stat"
                    >

                        <div
                            class="stat-value"
                        >
                            ${formatMoney(balance)}
                        </div>

                        <div
                            class="stat-name"
                        >
                            Баланс
                        </div>

                    </div>

                </div>

            </div>


            <div
                class="section-title"
            >
                Дополнительно
            </div>


            <div
                class="quick-grid"
            >

                <button
                    class="quick-card"
                    id="profilePromo"
                >

                    <div
                        class="quick-icon"
                    >
                        🎟
                    </div>

                    <div
                        class="quick-title"
                    >
                        Промокод
                    </div>

                    <div
                        class="quick-text"
                    >
                        Активировать код
                    </div>

                </button>


                <button
                    class="quick-card"
                    id="closeApp"
                >

                    <div
                        class="quick-icon"
                    >
                        ❌
                    </div>

                    <div
                        class="quick-title"
                    >
                        Закрыть
                    </div>

                    <div
                        class="quick-text"
                    >
                        Закрыть приложение
                    </div>

                </button>

            </div>

        </div>

    `;


    document
        .getElementById(
            "profilePromo"
        )
        .addEventListener(
            "click",
            openPromo
        );


    document
        .getElementById(
            "closeApp"
        )
        .addEventListener(
            "click",
            () => {

                if (tg) {

                    tg.close();

                } else {

                    showToast(
                        "Открой игру через Telegram"
                    );

                }

            }
        );

}


// =========================
// ПРОМОКОД
// =========================

function openPromo() {

    promoInput.value =
        "";

    promoModal.classList.remove(
        "hidden"
    );

}


function closePromo() {

    promoModal.classList.add(
        "hidden"
    );

}


function applyPromo() {

    const code =
        promoInput.value
            .trim()
            .toUpperCase();


    if (!code) {

        showToast(
            "Введи промокод"
        );

        return;

    }


    if (
        !(code in PROMOCODES)
    ) {

        showToast(
            "❌ Неверный промокод"
        );

        return;

    }


    if (
        usedPromo.includes(code)
    ) {

        showToast(
            "❌ Этот код уже использован"
        );

        return;

    }


    const bonus =
        PROMOCODES[code];


    balance +=
        bonus;


    usedPromo.push(
        code
    );


    save();

    updateBalance();

    closePromo();


    showToast(
        `🎉 +${formatMoney(bonus)}`
    );

}


// =========================
// НАВИГАЦИЯ
// =========================

function navigate(
    page
) {

    document
        .querySelectorAll(
            ".nav"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.page === page
                );

            }
        );


    if (
        page === "home"
    ) {

        showHome();

    }


    if (
        page === "storage"
    ) {

        showStorage();

    }


    if (
        page === "top"
    ) {

        showTop();

    }


    if (
        page === "profile"
    ) {

        showProfile();

    }

}


// =========================
// КНОПКИ МЕНЮ
// =========================

document
    .querySelectorAll(
        ".nav"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    navigate(
                        button.dataset.page
                    );

                }
            );

        }
    );


document
    .getElementById(
        "balanceBtn"
    )
    .addEventListener(
        "click",
        () => {

            showToast(
                `💰 ${formatMoney(balance)}`
            );

        }
    );


document
    .getElementById(
        "promoButton"
    )
    .addEventListener(
        "click",
        applyPromo
    );


document
    .getElementById(
        "closePromo1"
    )
    .addEventListener(
        "click",
        closePromo
    );


document
    .getElementById(
        "closePromo2"
    )
    .addEventListener(
        "click",
        closePromo
    );


promoInput
    .addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                applyPromo();

            }

        }
    );


// =========================
// СТАРТ
// =========================

updateBalance();

navigate("home");
