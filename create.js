/* =========================================================
   AXIS Collect
   Create — Construtor de formulários
   ========================================================= */


/* =========================================================
   1. CONFIGURAÇÃO
   ========================================================= */

const STORAGE_KEY = "axis-collect-forms";


/* =========================================================
   2. ELEMENTOS DO DOM
   ========================================================= */

const formTitleInput =
    document.querySelector("#form-title");

const formDescriptionInput =
    document.querySelector("#form-description");

const fieldsList =
    document.querySelector("#fields-list");

const emptyFields =
    document.querySelector("#empty-fields");

const addFieldButton =
    document.querySelector("#add-field-button");

const saveFormButton =
    document.querySelector("#save-form-button");

const previewButton =
    document.querySelector("#preview-button");

const previewArea =
    document.querySelector("#preview-area");

const formActive =
    document.querySelector("#form-active");

const allowMultipleResponses =
    document.querySelector("#allow-multiple-responses");

const showProgress =
    document.querySelector("#show-progress");


/* =========================================================
   3. IDENTIFICAÇÃO DO FORMULÁRIO
   ========================================================= */

const urlParams =
    new URLSearchParams(window.location.search);

const formId =
    urlParams.get("id");


/* =========================================================
   4. ESTADO
   ========================================================= */

let forms = loadForms();

let currentForm = null;


/* =========================================================
   5. LOCAL STORAGE
   ========================================================= */

function loadForms() {

    const storedForms =
        localStorage.getItem(STORAGE_KEY);


    if (!storedForms) {
        return [];
    }


    try {

        return JSON.parse(storedForms);

    } catch (error) {

        console.error(
            "Erro ao carregar formulários:",
            error
        );

        return [];
    }
}


function saveForms() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(forms)
    );
}


/* =========================================================
   6. GERAR ID
   ========================================================= */

function generateId() {

    return (
        Date.now().toString() +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );
}


/* =========================================================
   7. CRIAR E CARREGAR FORMULÁRIO
   ========================================================= */

function initializeForm() {

    /*
        Se existir ?id=...
        significa que estamos editando
        um formulário existente.
    */

    if (formId) {

        const existingForm =
            forms.find(
                (form) =>
                    form.id === formId
            );


        if (!existingForm) {

            alert(
                "O formulário solicitado não foi encontrado."
            );

            window.location.href =
                "index.html";

            return;
        }


        currentForm =
            existingForm;

    }

    /*
        Caso não exista ID,
        estamos criando um formulário novo.
    */

    else {

        currentForm = {

            id: generateId(),

            title: "Novo formulário",

            description: "",

            fields: [],

            settings: {

                active: true,

                allowMultipleResponses: false,

                showProgress: false

            },

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()

        };


        forms.push(currentForm);

        saveForms();

    }


    loadFormIntoInterface();

}


/* =========================================================
   8. CARREGAR FORMULÁRIO NA INTERFACE
   ========================================================= */

function loadFormIntoInterface() {

    formTitleInput.value =
        currentForm.title || "";


    formDescriptionInput.value =
        currentForm.description || "";


    /*
        Garantir que formulários antigos
        também tenham configurações.
    */

    if (!currentForm.settings) {

        currentForm.settings = {

            active: true,

            allowMultipleResponses: false,

            showProgress: false

        };

    }


    formActive.checked =
        currentForm.settings.active;


    allowMultipleResponses.checked =
        currentForm.settings
            .allowMultipleResponses;


    showProgress.checked =
        currentForm.settings
            .showProgress;


    renderFields();

    renderPreview();

}


/* =========================================================
   9. ADICIONAR CAMPO
   ========================================================= */

function addField() {

    const field = {

        id: generateId(),

        type: "text",

        label: "Novo campo",

        placeholder: "",

        required: false,

        options: []

    };


    currentForm.fields.push(field);

    currentForm.updatedAt =
        new Date().toISOString();


    renderFields();

    renderPreview();

}


/* =========================================================
   10. RENDERIZAR CAMPOS
   ========================================================= */

function renderFields() {

    fieldsList.innerHTML = "";


    if (
        !currentForm.fields ||
        currentForm.fields.length === 0
    ) {

        fieldsList.appendChild(
            createEmptyFieldsState()
        );

        return;
    }


    currentForm.fields.forEach(
        (field, index) => {

            const fieldElement =
                createFieldElement(
                    field,
                    index
                );


            fieldsList.appendChild(
                fieldElement
            );

        }
    );

}


/* =========================================================
   11. ESTADO VAZIO DOS CAMPOS
   ========================================================= */

function createEmptyFieldsState() {

    const element =
        document.createElement("div");

    element.className =
        "empty-state";


    element.innerHTML = `

        <h3>
            Nenhum campo adicionado
        </h3>

        <p>
            Clique em "Adicionar campo"
            para começar a construir seu formulário.
        </p>

    `;


    return element;
}


/* =========================================================
   12. CRIAR ELEMENTO DE CAMPO
   ========================================================= */

function createFieldElement(
    field,
    index
) {

    const element =
        document.createElement("div");


    element.className =
        "field-editor";


    element.dataset.fieldId =
        field.id;


    element.innerHTML = `

        <div class="field-editor-header">

            <span>
                Campo ${index + 1}
            </span>

            <button
                type="button"
                class="delete-field-button"
                data-field-id="${field.id}"
            >
                Excluir
            </button>

        </div>


        <div class="field-editor-body">

            <div class="field-group">

                <label>
                    Título do campo
                </label>

                <input
                    type="text"
                    class="field-label-input"
                    data-field-id="${field.id}"
                    value="${escapeHTML(field.label)}"
                    placeholder="Ex.: Nome completo"
                >

            </div>


            <div class="field-group">

                <label>
                    Tipo do campo
                </label>

                <select
                    class="field-type-select"
                    data-field-id="${field.id}"
                >

                    <option
                        value="text"
                        ${field.type === "text" ? "selected" : ""}
                    >
                        Texto
                    </option>

                    <option
                        value="textarea"
                        ${field.type === "textarea" ? "selected" : ""}
                    >
                        Texto longo
                    </option>

                    <option
                        value="number"
                        ${field.type === "number" ? "selected" : ""}
                    >
                        Número
                    </option>

                    <option
                        value="email"
                        ${field.type === "email" ? "selected" : ""}
                    >
                        E-mail
                    </option>

                    <option
                        value="date"
                        ${field.type === "date" ? "selected" : ""}
                    >
                        Data
                    </option>

                    <option
                        value="time"
                        ${field.type === "time" ? "selected" : ""}
                    >
                        Hora
                    </option>

                    <option
                        value="select"
                        ${field.type === "select" ? "selected" : ""}
                    >
                        Seleção
                    </option>

                    <option
                        value="radio"
                        ${field.type === "radio" ? "selected" : ""}
                    >
                        Múltipla escolha
                    </option>

                    <option
                        value="checkbox"
                        ${field.type === "checkbox" ? "selected" : ""}
                    >
                        Caixa de seleção
                    </option>

                </select>

            </div>


            <div class="field-group">

                <label>
                    Texto de orientação
                </label>

                <input
                    type="text"
                    class="field-placeholder-input"
                    data-field-id="${field.id}"
                    value="${escapeHTML(field.placeholder)}"
                    placeholder="Ex.: Digite seu nome"
                >

            </div>


            <label class="field-required">

                <input
                    type="checkbox"
                    class="field-required-input"
                    data-field-id="${field.id}"
                    ${field.required ? "checked" : ""}
                >

                Campo obrigatório

            </label>

        </div>

    `;


    return element;
}


/* =========================================================
   13. ALTERAR CAMPO
   ========================================================= */

function updateField(
    id,
    property,
    value
) {

    const field =
        currentForm.fields.find(
            (item) =>
                item.id === id
        );


    if (!field) {
        return;
    }


    field[property] = value;


    currentForm.updatedAt =
        new Date().toISOString();


    saveForms();

    renderPreview();

}


/* =========================================================
   14. EXCLUIR CAMPO
   ========================================================= */

function deleteField(id) {

    currentForm.fields =
        currentForm.fields.filter(
            (field) =>
                field.id !== id
        );


    currentForm.updatedAt =
        new Date().toISOString();


    saveForms();

    renderFields();

    renderPreview();

}


/* =========================================================
   15. RENDERIZAR PREVIEW
   ========================================================= */

function renderPreview() {

    previewArea.innerHTML = "";


    const preview =
        document.createElement("div");

    preview.className =
        "preview-form";


    const title =
        document.createElement("h3");

    title.textContent =
        currentForm.title ||
        "Sem título";


    const description =
        document.createElement("p");

    description.textContent =
        currentForm.description ||
        "Sem descrição.";


    preview.appendChild(title);

    preview.appendChild(description);


    /*
        Criar os campos da visualização.
    */

    currentForm.fields.forEach(
        (field) => {

            const group =
                document.createElement("div");

            group.className =
                "preview-field";


            const label =
                document.createElement("label");

            label.textContent =
                field.label;


            if (field.required) {

                label.textContent +=
                    " *";

            }


            group.appendChild(label);


            let input;


            switch (field.type) {

                case "textarea":

                    input =
                        document.createElement(
                            "textarea"
                        );

                    break;


                case "number":

                    input =
                        document.createElement(
                            "input"
                        );

                    input.type =
                        "number";

                    break;


                case "email":

                    input =
                        document.createElement(
                            "input"
                        );

                    input.type =
                        "email";

                    break;


                case "date":

                    input =
                        document.createElement(
                            "input"
                        );

                    input.type =
                        "date";

                    break;


                case "time":

                    input =
                        document.createElement(
                            "input"
                        );

                    input.type =
                        "time";

                    break;


                case "select":

                    input =
                        createSelectPreview(
                            field
                        );

                    break;


                default:

                    input =
                        document.createElement(
                            "input"
                        );

                    input.type =
                        "text";

            }


            if (
                field.type !== "select"
            ) {

                input.placeholder =
                    field.placeholder || "";

            }


            if (
                field.type !== "radio" &&
                field.type !== "checkbox"
            ) {

                input.disabled = true;

            }


            group.appendChild(input);

            preview.appendChild(group);

        }
    );


    previewArea.appendChild(preview);

}


/* =========================================================
   16. SELECT DO PREVIEW
   ========================================================= */

function createSelectPreview(field) {

    const select =
        document.createElement("select");


    select.disabled = true;


    const defaultOption =
        document.createElement("option");

    defaultOption.textContent =
        "Selecione uma opção";


    select.appendChild(
        defaultOption
    );


    if (field.options) {

        field.options.forEach(
            (option) => {

                const optionElement =
                    document.createElement(
                        "option"
                    );

                optionElement.textContent =
                    option;

                select.appendChild(
                    optionElement
                );

            }
        );

    }


    return select;
}


/* =========================================================
   17. SALVAR FORMULÁRIO
   ========================================================= */

function saveCurrentForm() {

    currentForm.title =
        formTitleInput.value.trim();


    currentForm.description =
        formDescriptionInput.value.trim();


    currentForm.settings = {

        active:
            formActive.checked,

        allowMultipleResponses:
            allowMultipleResponses.checked,

        showProgress:
            showProgress.checked

    };


    currentForm.updatedAt =
        new Date().toISOString();


    /*
        Procurar o formulário
        dentro da lista.
    */

    const index =
        forms.findIndex(
            (form) =>
                form.id === currentForm.id
        );


    if (index === -1) {

        forms.push(currentForm);

    } else {

        forms[index] =
            currentForm;

    }


    saveForms();


    /*
        Feedback simples para o usuário.
    */

    const originalText =
        saveFormButton.textContent;


    saveFormButton.textContent =
        "Salvo!";


    setTimeout(() => {

        saveFormButton.textContent =
            originalText;

    }, 1500);

}


/* =========================================================
   18. ESCAPAR HTML
   ========================================================= */

function escapeHTML(value) {

    const element =
        document.createElement("div");


    element.textContent =
        value ?? "";


    return element.innerHTML;
}


/* =========================================================
   19. EVENTO — ADICIONAR CAMPO
   ========================================================= */

addFieldButton.addEventListener(
    "click",
    () => {

        addField();

    }
);


/* =========================================================
   20. EVENTO — SALVAR
   ========================================================= */

saveFormButton.addEventListener(
    "click",
    () => {

        saveCurrentForm();

    }
);


/* =========================================================
   21. EVENTO — PREVIEW
   ========================================================= */

previewButton.addEventListener(
    "click",
    () => {

        /*
            Atualizar os dados antes
            de gerar a visualização.
        */

        currentForm.title =
            formTitleInput.value.trim();


        currentForm.description =
            formDescriptionInput.value.trim();


        renderPreview();

    }
);


/* =========================================================
   22. EVENTOS DOS CAMPOS
   ========================================================= */

fieldsList.addEventListener(
    "input",
    (event) => {

        const input =
            event.target;


        const id =
            input.dataset.fieldId;


        if (!id) {
            return;
        }


        if (
            input.classList.contains(
                "field-label-input"
            )
        ) {

            updateField(
                id,
                "label",
                input.value
            );

        }


        if (
            input.classList.contains(
                "field-placeholder-input"
            )
        ) {

            updateField(
                id,
                "placeholder",
                input.value
            );

        }

    }
);


/* =========================================================
   23. EVENTOS DOS CAMPOS — SELECT
   ========================================================= */

fieldsList.addEventListener(
    "change",
    (event) => {

        const input =
            event.target;


        const id =
            input.dataset.fieldId;


        if (!id) {
            return;
        }


        if (
            input.classList.contains(
                "field-type-select"
            )
        ) {

            updateField(
                id,
                "type",
                input.value
            );


            renderFields();

        }


        if (
            input.classList.contains(
                "field-required-input"
            )
        ) {

            updateField(
                id,
                "required",
                input.checked
            );

        }

    }
);


/* =========================================================
   24. EVENTO — EXCLUIR CAMPO
   ========================================================= */

fieldsList.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                ".delete-field-button"
            );


        if (!button) {
            return;
        }


        const id =
            button.dataset.fieldId;


        const confirmed =
            window.confirm(
                "Deseja excluir este campo?"
            );


        if (!confirmed) {
            return;
        }


        deleteField(id);

    }
);


/* =========================================================
   25. ALTERAÇÕES AUTOMÁTICAS
   ========================================================= */

formTitleInput.addEventListener(
    "input",
    () => {

        currentForm.title =
            formTitleInput.value;

        renderPreview();

    }
);


formDescriptionInput.addEventListener(
    "input",
    () => {

        currentForm.description =
            formDescriptionInput.value;

        renderPreview();

    }
);


/* =========================================================
   26. INICIALIZAÇÃO
   ========================================================= */

initializeForm();


console.log(
    "AXIS Collect — Create iniciado."
);
