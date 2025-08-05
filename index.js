const menu = document.getElementById("menu");
const ballot = document.getElementById("ballot");
const login = document.getElementById("adminLogin");

const items = document.querySelectorAll(".candidate");
const candidates = Array.from(items).map((item) => item.innerHTML);
const candidate_names = Array.from(items).map((item) => (item.children.length == 0)
    ? item.textContent
    : item.querySelector('.candidate-name').textContent);

const no_candidates = candidates.length;
const no_seats = document.getElementById("seats").textContent;
let votes = `${no_candidates} ${no_seats}\n`;
let blank_ballots = 0;

function openBallot() {
    menu.style.display = "none";
    ballot.style.display = "block";

    let scrambled = Array.from(candidates);
    scrambled.sort((a, b) => Math.random() - Math.random());
    for (let i = 0; i < scrambled.length; i++) {
        items[i].innerHTML = scrambled[i];
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

    const ranked = Array.from(items).map((item) => item.innerHTML);
    const vote = `1 ${ranked
        .map((c) => candidates.indexOf(c) + 1)
        .join(" ")} 0\n`;
    votes += vote;

    returnToMenu();
}

function submitBlank() {
    if (!confirm(confirmation_message)) {
        return;
    }

    blank_ballots += 1;
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