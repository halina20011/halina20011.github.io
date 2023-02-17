console.log("I live :3");

const url = new URL(window.location.href);
const show = url.searchParams.get('show');
console.log(show);

let columnMiddle = document.getElementById("columnMiddle");

let introduction = "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-U4MAESF7TU.png";
let compTIAPentest = "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-VZBYD4UFJ2.png";
let completeBeginner = "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-HYSODEFJAZ.png";
let jrPenetrationTester = "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-DHTOM6WK7V.png";
let preSecurity = "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-A8NWQ7XEHZ.png";
let webFundamentals = "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-BXW9ERSI0F.png";

let adventOfCyber2022 = "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-XNAEZTSFUA.png";
let hackdays2022 = "/Images/ContentImages/hackdays2022.png";

let images = [introduction, completeBeginner, webFundamentals, preSecurity, compTIAPentest, jrPenetrationTester, adventOfCyber2022, hackdays2022];

if(show){
    for(let i = 0; i < images.length; i++){
        let img = new Image();
        img.src = images[i];
        img.style.width = "100%";
        columnMiddle.appendChild(img);
        
    }
}
