import { TemplateInstance } from "@github/template-parts";


const template = document.getElementById("editor-template");
const instance = new TemplateInstance(template, {
  lang: "javascript",
});
const buttons = instance.querySelectorAll(".button");

const code = document.querySelector("#editor-code");

buttons.forEach(button => {
    button.addEventListener("click", e => {
        instance.update({
            lang: e.target.dataset.lang,
        });
        code.appendChild(instance);
    });
})

code.appendChild(instance);

