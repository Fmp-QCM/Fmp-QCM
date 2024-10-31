//const { decode, encode } = require('./cryptor');

async function decode(key, iv,  file) {
    console.log('decoding...')
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const enc_str = await response.text();
        let dec_str = enc_str;
        if (key != '') {
            dec_str = atob(enc_str); //.replace(/\s+/g, '')
        }
        json_data = JSON.parse(dec_str);
    } catch (error) {
        console.error('Error decoding or parsing JSON:', error);
    }
}

// Function to generate forms
function createForms(max) {
    const container = document.getElementById('forms-container');
    document.getElementById('disp').innerText = json_data[0];
    container.innerHTML = "";

    for (let i = min; i <= max; i++) {
        // Create form element
        const form = document.createElement('form');
        form.setAttribute('action', '');
        form.setAttribute('id', 'f' + i);
        form.setAttribute('name', 'f' + i);
        form.setAttribute('class', 'form');
        form.style.display = 'none';

        // Create heading
        const heading = document.createElement('h2');
        heading.id = 'f' + i + 'h2'
        heading.style.margin = '10px';
        heading.innerText = 'Q' + i + '.' + json_data[i][0];
        form.appendChild(heading);

        // Create checkbox
        for (let j = 1; j <= 5; j++) {
            const label = document.createElement('label');
            label.classList.add('check');
            label.id = 'f' + i + 'l' + j;
            label.setAttribute('for', 'f' + i + 'q' + j);

            const input = document.createElement('input');
            input.classList.add('check__input', 'btns');
            input.type = 'checkbox';
            if (answer[i - 1].includes(j)) {
                input.checked = true;
            }
            input.id = 'f' + i + 'q' + j;

            const div = document.createElement('div');
            div.classList.add('check__box');

            label.appendChild(input);
            label.appendChild(div);
            label.append(json_data[i][1][j - 1]);
            form.appendChild(label);
            form.appendChild(document.createElement('br'));
        }

        // Add correct and reset buttons
        const correctLabel = document.createElement('label');
        correctLabel.classList.add('btns__style', 'float_right', 'click');
        correctLabel.setAttribute('for', 'f' + i + 'crct');

        const correctInput = document.createElement('button');
        correctInput.classList.add('btns');
        correctInput.id = 'f' + i + 'crct'
        correctInput.addEventListener('click', async () => {
            await get_answer(i, i + 1);
            crct(i);
        })
        correctLabel.appendChild(correctInput);
        correctLabel.append('Correct');

        const resetLabel = document.createElement('label');
        resetLabel.classList.add('btns__style', 'float_right', 'click');
        resetLabel.setAttribute('for', 'f' + i + 'rst');

        const resetInput = document.createElement('input');
        resetInput.classList.add('btns');
        resetInput.type = 'reset';
        resetInput.id = 'f' + i + 'rst';
        resetInput.addEventListener('click', () => rst(i));
        resetLabel.appendChild(resetInput);
        resetLabel.append('Reset');

        form.appendChild(resetLabel);
        form.appendChild(correctLabel);

        // Append form to container
        container.appendChild(form);
    }
}



function crct(form) {
    event.preventDefault();
    if (answer[form - 1].length !== 0) {
        document.getElementById('f' + form + 'h2').innerText = 'Corrected';
        if (JSON.stringify(json_data[form][2].slice().sort()) === JSON.stringify(answer[form - 1].slice().sort())) {
            correct[form - 1] = 1;
        }
        else correct[form - 1] = 0;

        for (let i = 1; i <= 5; i++) {
            const label = document.getElementById('f' + form + 'l' + i);
            console.log(json_data[form][2], answer[form - 1]);
            if (json_data[form][2].includes(i) && answer[form - 1].includes(i)) {
                label.style.color = 'rgb(88, 255, 88)';
            }
            else if (json_data[form][2].includes(i) && !answer[form - 1].includes(i)) {
                label.style.color = 'rgb(255, 238, 0)';
            }
            else if (!json_data[form][2].includes(i) && answer[form - 1].includes(i)) {
                label.style.color = 'rgb(255, 50, 50)';
            }
        }
    }

}

function rst(form) {
    document.getElementById('f' + form + 'h2').innerText = 'Q' + form + '.' + json_data[form][0];
    for (let i = 1; i <= 5; i++) {
        document.getElementById('f' + form + 'l' + i).removeAttribute('style');
    }
}

async function get_answer(start, end) {
    console.log(start, end);

    for (let i = start; i < end; i++) {
        let tmp_answer = Array();
        for (let j = 1; j <= 5; j++) {
            if (document.getElementById('f' + i + 'q' + j).checked) {
                tmp_answer.push(j)
                console.log(tmp_answer);

            }
        }
        answer[i - 1] = tmp_answer;
    }
}

function nav_visible() {
    if (disp_min - disp_max <= 1) {
        document.getElementById('label_back_1').style.visibility = 'hidden';
        document.getElementById('label_back_2').style.visibility = 'hidden';
        //document.getElementById('disp').style.display = 'inline-block';
    } else {
        document.getElementById('label_back_1').style.visibility = 'visible';
        document.getElementById('label_back_2').style.visibility = 'visible';
        //document.getElementById('disp').style.display = 'none';
    }
    if (disp_min >= 50) {
        document.getElementById('label_next_1').style.visibility = 'hidden';
        document.getElementById('label_next_2').style.display = 'none';
        document.getElementById('crct').style.display = 'inline-block';
    } else {
        document.getElementById('label_next_1').style.visibility = 'visible';
        document.getElementById('label_next_2').style.display = 'inline-block';
        document.getElementById('crct').style.display = 'none';
    }
}

let min = 1;
let max = 50;
let disp_min = 1;
let disp_max = 10;
let json_data;
let correct = Array(max);
let answer = Array.from({ length: max }, () => Array());

window.onload = async () => {
    await decode(' ', '', 'form.b64');

    const next = document.getElementById("next");
    next.addEventListener('click', async () => {
        if (next.style.visibility != 'hidden') {
            document.querySelectorAll('form').forEach(form => {
                form.style.display = 'none';
            });
            for (let i = disp_min; i < disp_min + disp_max; i++) {
                document.getElementById('f' + i).removeAttribute('style');
            }
            disp_min += disp_max;
        }
        nav_visible();
    });

    const back = document.getElementById("back");
    back.addEventListener('click', async () => {
        if (back.style.visibility != 'hidden') {
            document.querySelectorAll('form').forEach(form => {
                form.style.display = 'none';
            });
            for (let i = disp_min - 1; i >= disp_min - disp_max; i--) {
                document.getElementById('f' + (i - disp_max)).removeAttribute('style');
            }
            disp_min -= disp_max;
        }
        nav_visible();
    });

    const crct_elm = document.getElementById("crct");
    crct_elm.addEventListener('click', async () => {
        if (crct_elm.innerText != 'Correct All') {
            for (let i = min; i <= max; i++) {
                document.getElementById('f' + i + 'rst').click();
                answer = Array.from({ length: max }, () => Array());
            }
            crct_elm.innerText = 'Correct All';
        } else {
            let score = 0;
            let score_div = 0;
            await get_answer(min, max + 1);
            for (let i = min; i <= max; i++) {
                crct(i);
            }
            correct.forEach((item) => {
                if (item !== undefined) {
                    if (item === 1) {
                        score++;
                    }
                    score_div++;
                }
            });
            if (score_div != 0) {
                score = 42;
                score_div = 50;
                console.log(`score: ${score}/${score_div}`);
                document.body.style.overflow = 'hidden'
                document.body.style.marginRight = '17px';
                document.getElementById('overlay').style.display = 'block';
                document.getElementById('score_div').innerText = score_div;
                for (let i = 0; i <= score; i++) {
                    const score_elm = document.getElementById('score');
                    score_elm.innerText = i;
                    score_elm.style.color = `hsl(${i * 120 / score_div}, 100%, 50%)`;
                    console.log(`${i * 120 / score_div}`);
                    await delay(30);
                }
            }
            //crct_elm.innerText = 'Reset All';
        }
    });

    document.getElementById('overlay__okay').addEventListener('click', event => {
        event.preventDefault();
        document.body.removeAttribute('style');
        document.getElementById('overlay').removeAttribute('style');
    });

    document.getElementById('overlay').addEventListener('click', event => {
        if (!document.getElementById('score__pop').contains(event.target)) {
            document.body.removeAttribute('style');
            document.getElementById('overlay').removeAttribute('style');
        }
    });

    document.querySelectorAll('input[name="divider"]').forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.checked) {
                switch (this.id) {
                    case 'disp_radio_5':
                        disp_max = 10;
                        break;
                    case 'disp_radio_2':
                        disp_max = 25;
                        break;
                    case 'disp_radio_1':
                        disp_max = 50;
                        break;
                }
                disp_min = 1;
                document.getElementById('next').click();
            }
        });
    });

    createForms(max);
    document.getElementById('next').click();
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onbeforeunload = () => {
    console.log('unload');
    //save_answer();
}

/*
async function hashMessage(message) {
    const msgUint8 = new TextEncoder().encode(message); // Encode as (utf-8)
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // Hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Convert bytes to hex string
    console.log(hashBuffer);
    console.log(hashArray);
    
    return hashHex;
  }
  
  hashMessage("Hello, world!").then(console.log); // Logs the SHA-256 hash
  */