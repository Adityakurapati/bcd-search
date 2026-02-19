import { VoterResult } from "./voterService";


/* ================= SHARE COMPLETE SLIP ================= */

export async function shareSlip(voter: VoterResult) {

try {

if (typeof window === "undefined") return;


// image url

const imageUrl = `${window.location.origin}/vibhav_jain.jpeg`;


// message

const message =

`🗳️ BCD Election 2026 Voting Slip

👤 Name: ${voter.name}
🔢 Serial No: ${voter.sr_no}
🆔 Voter ID: ${voter.voter_id}
📱 Mobile: ${voter.mobile}

━━━━━━━━━━━━━━

🙏 Kindly vote for:

⭐ VAIBHAV JAIN
📌 Ballot No: 136

🗓️ 21–23 Feb 2026

Thank you.`;



// fetch image

const response = await fetch(imageUrl);

const blob = await response.blob();



// create file

const file = new File(

[blob],

"VotingSlip.jpg",

{ type: blob.type }

);



// share

if (navigator.share && navigator.canShare({ files: [file] })) {

await navigator.share({

title: "Voting Slip",

text: message,

files: [file],

});

}

else {

// fallback whatsapp

const whatsappURL =

`https://wa.me/?text=${encodeURIComponent(message)}`;

window.open(whatsappURL, "_blank");

}

}

catch (error) {

console.error("Share failed:", error);

}

}



/* ================= PRINT ================= */

export function printVoterSlip(voter: VoterResult) {

if (typeof window === "undefined") return;


const imageUrl = `${window.location.origin}/vibhav_jain.jpeg`;


const html = `

<html>

<body style="font-family:Arial;padding:20px;">

<img src="${imageUrl}" width="120"/>

<h2>VAIBHAV JAIN</h2>

<h3>Ballot No: 136</h3>

<hr/>

<p>Name: ${voter.name}</p>

<p>Voter ID: ${voter.voter_id}</p>

<p>Mobile: ${voter.mobile}</p>

<p>Address: ${voter.address}</p>

</body>

</html>

`;

const win = window.open("", "_blank");

if (!win) return;

win.document.write(html);

win.print();

}



/* ================= DOWNLOAD ================= */

export function downloadVoterSlip(voter: VoterResult) {

if (typeof window === "undefined") return;


const imageUrl = `${window.location.origin}/vibhav_jain.jpeg`;


const html = `

<html>

<body style="font-family:Arial;padding:20px;">

<img src="${imageUrl}" width="120"/>

<h2>VAIBHAV JAIN</h2>

<h3>Ballot No: 136</h3>

<hr/>

<p>Name: ${voter.name}</p>

<p>Voter ID: ${voter.voter_id}</p>

<p>Mobile: ${voter.mobile}</p>

<p>Address: ${voter.address}</p>

</body>

</html>

`;

const blob = new Blob([html], { type: "text/html" });

const a = document.createElement("a");

a.href = URL.createObjectURL(blob);

a.download = "VotingSlip.html";

a.click();

}
