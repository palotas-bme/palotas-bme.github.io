class Item {
    name: string;
    price: number;

    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
    }
}

function calc() {
    checkNameAndPrices();
    const items = Array.from(document.getElementById('items').children).map((row) => {
        const name = (row.children[0].children[0] as HTMLInputElement).value;
        const price = Number((row.children[1].children[0] as HTMLInputElement).value);
        return new Item(name, price);
    });
    if (items.length === 0) {
        return;
    }
    const prices = items.map((x) => x.price);
    const avg = prices.reduce((x, y) => x + y) / prices.length;
    document.getElementById('avg').textContent = avg.toFixed(2);

    const stdDev = Math.sqrt(prices.map((x) => Math.pow(x - avg, 2)).reduce((x, y) => x + y) / prices.length);
    document.getElementById('stdDev').textContent = stdDev.toFixed(2);

    // Three is an arbitrary small number. It cound be anything else.
    // The requirements are not clear this need some clarification.
    const NUMBER_OF_CHEAPEST = 3
    if (items.length > NUMBER_OF_CHEAPEST) {
        const oneOfTheCheapest = items.sort((x, y) => x.price - y.price)[Math.floor(Math.random() * NUMBER_OF_CHEAPEST)];
        document.getElementById('cheap').textContent = oneOfTheCheapest.name;
    } else {
        document.getElementById('cheap').textContent = 'Must be more than three items';
    }
}

function addItem() {
    const name = (document.getElementById('item-name') as HTMLInputElement).value;
    const price = Number((document.getElementById('item-price') as HTMLInputElement).value);

    if (name.length < 3) {
        document.getElementById('item-name-error').textContent = 'Item name must be a least 3 characters';
        return;
    }
    if (name.length >= 15) {
        document.getElementById('item-name-error').textContent = 'Item name must be maxumm 15 characters';
        return;
    }
    if (price < 0) {
        document.getElementById('item-price-error').textContent = 'Item price cannot be negative';
        return;
    }
    document.getElementById('item-name-error').textContent = '\u00a0';
    document.getElementById('item-price-error').textContent = '\u00a0';

    calc();
}

function addRow() {
    const tr = document.createElement('tr');

    const nameCell = document.createElement('td');
    const nameInput = document.createElement('input');
    nameInput.setAttribute('placeholder', 'Item name');
    nameInput.classList.add('list-item-name');
    nameInput.addEventListener('change', checkNameAndPrices);
    nameCell.appendChild(nameInput);

    const priceCell = document.createElement('td');
    const priceInput = document.createElement('input');
    priceInput.setAttribute('placeholder', 'Price');
    priceInput.setAttribute('type', 'number');
    priceInput.setAttribute('min', '0');
    priceInput.classList.add('list-item-price');
    priceInput.addEventListener('change', calc);
    priceCell.appendChild(priceInput);

    const removeButtonCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.classList.add('delete-button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', remove);
    removeButtonCell.appendChild(removeButton);

    const errorCell = document.createElement('td');
    errorCell.classList.add('item-error');

    tr.appendChild(nameCell);
    tr.appendChild(priceCell);
    tr.appendChild(removeButtonCell);
    tr.appendChild(errorCell);

    document.getElementById('items').appendChild(tr);
}

function remove(e) {
    e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
    calc();
}

function checkNameAndPrices() {
    const rows = Array.from(document.getElementById('items').children);

    rows.forEach((row) => {
        let priceString = (row.querySelector('.list-item-price') as HTMLInputElement).value;
        let price: number;
        const name = (row.querySelector('.list-item-name') as HTMLInputElement).value;
        let errors = '';
        if (priceString === '') {
            errors = 'Invalid price ';
        } else {
            price = Number(priceString);
            if (price < 0 || isNaN(price)) {
                errors = 'Invalid price ';
            }
        }
        
        if (name.length < 3) {
            errors += 'Name is too short (min 3)';
        } else if (name.length > 15) {
            errors += 'Name is too long (max 15)';
        }

        row.querySelector('.item-error').textContent = errors;
    });
}

Array.from(document.getElementsByClassName('delete-button')).forEach((x) => {
    x.addEventListener('click', remove);
});
calc();

document.addEventListener('mousemove', evt => {
    let x = evt.clientX / innerWidth;
    let y = evt.clientY / innerHeight;
 
    document.documentElement.style.setProperty('--mouse-x', x.toString());
    document.documentElement.style.setProperty('--mouse-y', y.toString());
});