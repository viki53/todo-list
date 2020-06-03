import { CustomElement } from '../tools/custom-element.js';
import { html } from '../tools/custom-html.js';
import { STYLE_COMMON, STYLE_FORM } from '../tools/styles.js';

import { TodoList } from '../models/todolist.js';

/**
 * @event newListName — Le nom de la liste à créer
 */
export class NewTodoListElement extends CustomElement {
	get styles() {
		return `
			${STYLE_COMMON}
			${STYLE_FORM}
			:host {
				display: flex;
				flex-direction: column;
				justify-self: stretch;
				align-self: stretch;
			}
			h1 {
				margin: 0;
				padding: .5rem 1rem;
				font-size: 1.5rem;
				text-align: center;
				border-bottom: 1px solid #f1f1f1;
			}
			h1 label {
				display: block;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			form {
				flex: 1 0 auto;
				display: flex;
				flex-direction: column;
				padding: 0;
				text-align: center;
				font-weight: bold;
				align-items: center;
				justify-content: space-between;
			}
			form::before {
				content: '';
				height: 0;
				flex: 0 0 auto;
			}
			input {
				justify-self: center;
				flex: 0 0 auto;
				width: 75%;
				border-bottom: 1px solid #f1f1f1;
			}
			input:hover,
			input:focus {
				border-color: #c4c4c4;
			}
			::-moz-placeholder {
				color: #444;
				font-style: italic;
				text-align: center;
			}
			::-webkit-input-placeholder {
				color: #444;
				font-style: italic;
				text-align: center;
			}
			button {
				flex: 0 0 auto;
				width: 100%;
				border-top: 1px solid #f1f1f1;
			}
		`;
	};

	constructor() {
		super();

		this.classList.add('todolist');
		this.classList.add('add');
	}

	connectedCallback() {
		super.connectedCallback();

		setTimeout(() => {
			const form = this.renderRoot.getElementById('formulaire-creation-liste');

			this.renderRoot.addEventListener('submit', this.creerListe.bind(this));

			this.renderRoot.addEventListener('input', () => {
				const input = this.renderRoot.querySelector('form input[type="text"]');
				const btn = this.renderRoot.querySelector('form button[type="submit"]');

				btn.disabled = !(input.value && input.value.length);
			})
		}, 0);
	}

	creerListe(event) {
		event.preventDefault();

		const input = this.renderRoot.getElementById('input-ajout-liste');

		const task = new TodoList(input.value);

		const newListEvent = new CustomEvent('new-list', {
			bubbles: true,
			composed: true,
			detail: task
		});

		input.value = '';

		this.dispatchEvent(newListEvent);
	}

	render() {
		return html`
		<h1>
			<label for="input-ajout-liste">Créer une liste</label>
		</h1>

		<form id="formulaire-creation-liste">
			<input type="text" id="input-ajout-liste" aria-invalid="true" aria-label="Créez une nouvelle liste de tâches à faire" placeholder="Ex. : Liste de courses">
			<button type="submit" disabled>Créer</button>
		</form>`;
	}
}
window.customElements.define('new-todo-list', NewTodoListElement, { extends: 'section' });
