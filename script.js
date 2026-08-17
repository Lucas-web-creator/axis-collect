/* =========================================================
   AXIS Collect
   Hub — JavaScript
   ========================================================= */


/* =========================================================
   1. CONFIGURAÇÃO
   ========================================================= */

const STORAGE_KEY = "axis-collect-forms";


/* =========================================================
   2. ELEMENTOS DO DOM
   ========================================================= */

const formsList = document.querySelector("#forms-list");
const emptyForms = document.querySelector("#empty-forms");


/* =========================================================
   3. ESTADO
   ========================================================= */

let forms = loadForms();


/* =========================================================
   4. LOCAL STORAGE
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
            "Não foi possível carregar os formulários:",
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
   5. ID
   ========================================================= */

function generateId() {

    return Date.now().toString();
}


/* =========================================================
   6. CRIAR FORMULÁRIO
   ========================================================= */

function createForm() {

    const form = {

        id: generateId(),

        title: "Novo formulário",

        description: "",

        fields: [],

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString()

    };


    forms.push(form);

    saveForms();

    openForm(form.id);
}


/* =========================================================
   7. RENDERIZAR FORMULÁRIOS
   ========================================================= */

function renderForms() {

    formsList.innerHTML = "";


    if (forms.length === 0) {

        formsList.appendChild(
            createEmptyState()
        );

        return;
    }


    forms.forEach((form) => {

        const card =
            createFormCard(form);

        formsList.appendChild(card);

    });
}


/* =========================================================
   8. ESTADO VAZIO
   ========================================================= */

function createEmptyState() {

    const container =
        document.createElement("div");

    container.className =
        "empty-state";


    container.innerHTML = `

        <div class="empty-state-content">

            <h3>
                Nenhum formulário criado
            </h3>

            <p>
                Crie seu primeiro formulário
                para começar a organizar suas informações.
            </p>

            <a
                href="#create"
                class="button button-primary"
                id="empty-create-button"
            >
                Criar formulário
            </a>

        </div>

    `;


    return container;
}


/* =========================================================
   9. CARD DO FORMULÁRIO
   ========================================================= */

function createFormCard(form) {

    const card =
        document.createElement("article");


    card.className =
        "form-card";


    card.dataset.formId =
        form.id;


    card.innerHTML = `

        <div class="form-card-content">

            <span class="form-card-label">
                Formulário
            </span>

            <h3>
                ${escapeHTML(form.title)}
            </h3>

            <p>
                ${
                    form.description
                        ? escapeHTML(form.description)
                        : "Sem descrição."
                }
            </p>

        </div>


        <div class="form-card-actions">

            <button
                type="button"
                class="button button-primary open-form-button"
                data-form-id="${form.id}"
            >
                Abrir
            </button>

            <button
                type="button"
                class="delete-form-button"
                data-form-id="${form.id}"
            >
                Excluir
            </button>

        </div>

    `;


    return card;
}


/* =========================================================
   10. ABRIR FORMULÁRIO
   ========================================================= */

function openForm(id) {

    const form =
        forms.find(
            (item) => item.id === id
        );


    if (!form) {

        console.error(
            "Formulário não encontrado:",
            id
        );

        return;
    }


    /*
        A página de criação será responsável
        por carregar esse formulário.

        Por enquanto utilizamos a URL
        para identificar qual formulário
        deverá ser aberto.
    */

    window.location.href =
        `create.html?id=${encodeURIComponent(form.id)}`;
}


/* =========================================================
   11. EXCLUIR FORMULÁRIO
   ========================================================= */

function deleteForm(id) {

    const form =
        forms.find(
            (item) => item.id === id
        );


    if (!form) {
        return;
    }


    const confirmed =
        window.confirm(
            `Deseja realmente excluir "${form.title}"?`
        );


    if (!confirmed) {
        return;
    }


    forms =
        forms.filter(
            (item) => item.id !== id
        );


    saveForms();

    renderForms();
}


/* =========================================================
   12. ESCAPAR HTML
   ========================================================= */

function escapeHTML(value) {

    const element =
        document.createElement("div");

    element.textContent =
        value ?? "";

    return element.innerHTML;
}


/* =========================================================
   13. EVENTOS
   ========================================================= */


/*
    Botões "Criar formulário"
*/

document.addEventListener(
    "click",
    (event) => {

        const createButton =
            event.target.closest(
                'a[href="#create"]'
            );


        if (!createButton) {
            return;
        }


        /*
            O botão da seção de criação
            possui seu próprio link para
            create.html.

            O botão do estado vazio também
            será tratado aqui.
        */

        if (
            createButton.id ===
            "empty-create-button"
        ) {

            event.preventDefault();

            createForm();

        }

    }
);


/*
    Ações dos cards
*/

formsList.addEventListener(
    "click",
    (event) => {

        const openButton =
            event.target.closest(
                ".open-form-button"
            );


        const deleteButton =
            event.target.closest(
                ".delete-form-button"
            );


        /* ==============================
           Abrir
           ============================== */

        if (openButton) {

            const id =
                openButton.dataset.formId;

            openForm(id);

            return;
        }


        /* ==============================
           Excluir
           ============================== */

        if (deleteButton) {

            const id =
                deleteButton.dataset.formId;

            deleteForm(id);

        }

    }
);


/* =========================================================
   14. BOTÃO PRINCIPAL — NOVO FORMULÁRIO
   ========================================================= */

const createLinks =
    document.querySelectorAll(
        'a[href="create.html"]'
    );


createLinks.forEach((link) => {

    link.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            createForm();

        }
    );

});


/* =========================================================
   15. INICIALIZAÇÃO
   ========================================================= */

renderForms();


console.log(
    "AXIS Collect — Hub iniciado."
);
