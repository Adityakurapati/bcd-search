import { VoterResult } from "./voterService";


/* ================= GET IMAGE URL SAFE ================= */

function getImageURL() {

if (typeof window === "undefined") return "";

return `${window.location.origin}/vibhav_jain.jpeg`;

}



/* ================= HTML TEMPLATE ================= */

function generateSlipHTML(voter: VoterResult) {

const IMAGE_URL = getImageURL();

return `

<html>

<head>

<title>Voting Slip</title>

<style>

body {

font-family: Arial;

padding: 20px;

}

.card {

border: 2px solid #1e3a8a;

padding: 20px;

border-radius: 10px;

}

.header {

display: flex;

align-items: center;

gap: 15px;

}

.header img {

width: 100px;

height: 120px;

border-radius: 8px;

border: 3px solid gold;

}

.name {

font-size: 22px;

font-weight: bold;

}

</style>

</head>

<body>

<div class="card">


<div class="header">

<img src="${IMAGE_URL}" />

<div>

<div class="name">

VAIBHAV JAIN

</div>

<div>

Ballot No: 136

</div>

</div>

</div>


<hr>


<h3>Voter Details</h3>


<p>Name: ${voter.name}</p>

<p>Voter ID: ${voter.voter_id}</p>

<p>Mobile: ${voter.mobile}</p>

<p>Address: ${voter.address}</p>


</div>


</body>

</html>

`;

}



/* ================= PRINT ================= */

export function printVoterSlip(voter: VoterResult) {

const win = window.open("", "_blank");

if (!win) return;

win.document.write(generateSlipHTML(voter));

win.document.close();

win.print();

}



/* ================= DOWNLOAD ================= */

export function downloadVoterSlip(voter: VoterResult) {

const element = document.createElement("a");

const file = new Blob(

[generateSlipHTML(voter)],

{ type: "text/html" }

);

element.href = URL.createObjectURL(file);

element.download = `${voter.name}_VotingSlip.html`;

document.body.appendChild(element);

element.click();

}



/* ================= WHATSAPP ================= */

export function shareViaWhatsApp(voter: VoterResult) {

const origin = typeof window !== "undefined"

? window.location.origin

: "";

const message =

`🗳️ Voting Slip

Name: ${voter.name}

Ballot No: 136

Candidate: VAIBHAV JAIN

View Slip:

${origin}

`;

window.open(

`https://wa.me/?text=${encodeURIComponent(message)}`,

"_blank"

);

}



/* ================= CONTACT ================= */

export function shareViaContact(voter: VoterResult) {

const vcard =

`BEGIN:VCARD

VERSION:3.0

FN:${voter.name}

TEL:${voter.mobile}

END:VCARD`;

const blob = new Blob(

[vcard],

{ type: "text/vcard" }

);

const url = URL.createObjectURL(blob);

const a = document.createElement("a");

a.href = url;

a.download = `${voter.name}.vcf`;

a.click();

}
