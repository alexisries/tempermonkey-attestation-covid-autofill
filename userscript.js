// ==UserScript==
// @name         AttestationCovid Autofiller
// @version      0.1
// @description  Auto fill out the Covid 19 travel certificate from URL
// @author       Alexis Ries
// @match        https://media.interieur.gouv.fr/*
// @grant        none
// ==/UserScript==


const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const getCurrentTime = () => {
  const date = new Date();
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function extractQueryString() {
  var params = {};
  var url = new URL(window.location);
  for(var hashParam of url.hash.substr(1).split(/&/)) {
    var kv = decodeURIComponent(hashParam).split(/=/);
    if (kv[0] == "reason") {
      if (!("reasons" in params)) {
        params["reasons"] = [];
      }
      params["reasons"].push(kv[1]);
    } else {
      params[kv[0]] = kv[1];
    }
  }
  return params;
}

function autofill (formInputs, reasonInputs) {
  var urlParams = extractQueryString();

  var formInputTypes = ["text", "number", "time"];
  formInputs.forEach((input) => {
    if (formInputTypes.indexOf(input.type) > -1) {
      console.log(input.name);
      if (input.name in urlParams) {
        input.value = urlParams[input.name];
      } else if (input.name == "heuresortie") {
        input.value = getCurrentTime();
      }
    }

  });

  reasonInputs.forEach((input) => {
    if (input.type == "checkbox" && input.name == "field-reason") {
      if ("reasons" in urlParams) {
        urlParams["reasons"].forEach(function(paramValue) {
            if (input.value == paramValue) {
              input.checked = true;
              return;
            }
          }
        );
      }
    }
  });
}

function autogen(formInputs) {
  $("#generate-btn").click();
}

function gofill() {
	const formInputs = $$('#form-profile input')
	const reasonInputs = [...$$('input[name="field-reason"]')]
	autofill(formInputs, reasonInputs)
	autogen();
}

(function() { 
	gofill() 
})();

