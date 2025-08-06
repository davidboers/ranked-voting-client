const menu = document.getElementById("menu");
const ballot = document.getElementById("ballot");
const login = document.getElementById("adminLogin");

function candidate_name(item) {
    return (!item.querySelector('.candidate-name'))
        ? item.innerText
        : item.querySelector('.candidate-name').textContent
}

let items = document.querySelectorAll(".candidate");
const candidates = Array.from(items).map((item) => item.innerText);
const candidate_names = Array.from(items).map(candidate_name);

const no_candidates = candidates.length;
const no_seats = document.getElementById("seats").textContent;
let votes = `${no_candidates} ${no_seats}\n`;
let blank_ballots = 0;

var gong = new Audio("gong-3-232439.mp3");

function openBallot() {
    gong.pause();
    gong.currentTime = 0;

    menu.style.display = "none";
    ballot.style.display = "block";

    const unranked = document.querySelector('#unranked');
    for (let unranked_candidate of unranked.querySelectorAll('li.candidate')) {
        if (unranked_candidate.querySelector('.delete')) {
            unranked_candidate.querySelector('.delete').remove();
        }
        document.querySelector('#candidateList').innerHTML += `<li class="candidate">${unranked_candidate.innerHTML}</li>`;
        unranked.removeChild(unranked_candidate);
    }
    items = document.querySelectorAll(".candidate");

    let scrambled = Array.from(candidates);
    for (let i = 0; i < scrambled.length; i++) {
        scrambled.sort(() => Math.random() - 0.5);
    }

    for (let i = 0; i < scrambled.length; i++) {
        items[i].innerHTML = scrambled[i];

        const x_element = document.createElement('span');
        x_element.textContent = 'X';
        x_element.className = 'delete';
        x_element.addEventListener('click', function () {
            unranked.innerHTML += `<li class="candidate">${items[i].innerHTML}</li>`;
            Array.from(unranked.children).forEach(child => {
                child.addEventListener('click', function () {
                    document.querySelector('#candidateList').innerHTML += `<li class="candidate">${child.innerHTML}</li>`;
                    child.remove();
                });
            });
            items[i].remove();
        });

        items[i].appendChild(x_element);
    }

    const sortable = new Sortable(
        document.getElementById("candidateList"),
        {
            animation: 150,
        }
    );
}

function openLogin() {
    document.getElementById("adminLogin").style.display = "block";
}

function verify() {
    const key = "password"; // Insert generated password here
    const input = document.getElementById("key");
    const guess = input.value;
    let out_file = votes;
    if (key === guess) {
        out_file += "0\n";
        for (let candidate_name of candidate_names) {
            out_file += `"${candidate_name}"\n`;
        }
        const electionName =
            document.getElementById("electionName").textContent;
        out_file += `"${electionName}"\n`;
        out_file += `# Blank ballots: ${blank_ballots}`;
        downloadTextAsFile(out_file, "votes.blt");
    } else {
        login.style.display = "none";
        input.value = "";
    }
}

const confirmation_message = "Please confirm you wish to cast your ballot.";

function submitVote() {
    if (!confirm(confirmation_message)) {
        return;
    }

    const ranked = Array.from(document.querySelectorAll('#candidateList .candidate')).map(candidate_name);
    console.log(ranked);
    const vote = ranked.map((c) => candidate_names.indexOf(c) + 1);
    votes += `1 ${vote.join(" ")} 0\n`;

    completeBallot();
}

function submitBlank() {
    if (!confirm(confirmation_message)) {
        return;
    }

    blank_ballots += 1;
    completeBallot();
}

function completeBallot() {
    gong.play();
    document.querySelector('#ballots').textContent = parseInt(document.querySelector('#ballots').textContent) + 1;
    returnToMenu();
}

function returnToMenu() {
    document.getElementById("key").value = "";
    login.style.display = "none";
    menu.style.display = "block";
    ballot.style.display = "none";
}

function downloadTextAsFile(content, filename, mimeType = "text/plain") {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}