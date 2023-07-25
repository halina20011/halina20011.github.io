import func from "./Tools/func.js";

const columnMiddle = document.getElementById("columnMiddle");

const introduction = "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-U4MAESF7TU.png";
const compTIAPentest = "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-VZBYD4UFJ2.png";
const completeBeginner = "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-HYSODEFJAZ.png";
const jrPenetrationTester = "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-DHTOM6WK7V.png";
const preSecurity = "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-A8NWQ7XEHZ.png";
const webFundamentals = "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-BXW9ERSI0F.png";

const adventOfCyber2022 = "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-XNAEZTSFUA.png";

const images = [introduction, completeBeginner, webFundamentals, preSecurity, compTIAPentest, jrPenetrationTester, adventOfCyber2022];

const links = {
    "github": "https://github.com/halina20011",
    "leetcode": "https://leetcode.com/halina20011/",
    "YouTube": "https://www.youtube.com/channel/UCG0h6r6T1joRASO29JV9qMQ",
    // "khanacademy" : "https://www.khanacademy.org/profile/Halina20011",
    // "thingiverse" : "https://www.thingiverse.com/halina20011/designs",
    "tryhackme" : "https://tryhackme.com/p/Halina20011",
}

function main(){
    // console.log("I live :3");

    const url = new URL(window.location.href);
    
    const linkParam = url.searchParams.get("links");
    const imgParam = url.searchParams.get("images");

    if(linkParam){
        Object.keys(links).forEach(name => {
            const linkElement = func.createElement(`<div>${name}: <a href="${links[name]}">${links[name]}</a></div>`);
            columnMiddle.appendChild(linkElement);
        });
    }

    if(imgParam){
        for(let i = 0; i < images.length; i++){
            const img = new Image();
            img.src = images[i];
            img.style.width = "100%";
            columnMiddle.appendChild(img);
        }
    }
}

main();
