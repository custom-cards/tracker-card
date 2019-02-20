class TrackerCard extends HTMLElement {

  static async getConfigElement() {
    await import("./tracker-card-editor.js");
    return document.createElement("tracker-card-editor");
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    if (!config.trackers || !Array.isArray(config.trackers)) {
      config.trackers = ['sensor.custom_card_tracker','sensor.custom_component_tracker'];
    }

    const root = this.shadowRoot;
    if (root.lastChild) root.removeChild(root.lastChild);

    const cardConfig = Object.assign({}, config);
    if (!cardConfig.title) {
      cardConfig.title = '📣 Updates';
    } else {
      cardConfig.title = cardConfig.title;
    }
	if (!cardConfig.name_text || cardConfig.name_text == "") {
      cardConfig.name_text = 'Name';
    }
	if (!cardConfig.current_text || cardConfig.current_text == "") {
      cardConfig.current_text = 'Current';
    }
	if (!cardConfig.available_text || cardConfig.available_text == "") {
      cardConfig.available_text = 'Available';
    }
	if (!cardConfig.update_all_text || cardConfig.update_all_text == "") {
      cardConfig.update_all_text = 'Update All';
    }
	if (!cardConfig.check_text || cardConfig.check_text == "") {
      cardConfig.check_text = 'Check';
    }
    const card = document.createElement('ha-card');
    const content = document.createElement('div');
    const style = document.createElement('style');
    style.textContent = `
          ha-card {
            /* sample css */
          }
          table {
            width: 100%;
            padding: 0 32px 0 32px;
            border-spacing: 0px;
          }
          td {
            padding: 2px;
          }
          thead th {
            text-align: left;
          }
          tbody tr:nth-child(odd) {
            background-color: var(--paper-card-background-color);
          }
          tbody tr:nth-child(even) {
            background-color: var(--secondary-background-color);
          }
          .button {
            overflow: auto;
            padding: 16px;
            text-align: right;
          }
          mwc-button {
            margin-right: 16px;
          }
          tbody td.name a {
            color: var(--primary-text-color);
            text-decoration-line: none;
            font-weight: normal;
          }
          td a {
            color: red;
            font-weight: bold;
          }
          tbody td.separator {
            font-weight: bold;
            padding-top: 10px;
            text-transform: capitalize;
          }
          .update_pending {
            
          }
          .hidden-button {
            padding: 0px;
            border: 0px;
            background: none;
            font-weight: 700;
            color: red;
          }
        `;
    content.innerHTML = `
      <div id='content'>
      </div>
      <div class='button'>
        <mwc-button raised id='check'>` + cardConfig.check_text + `</mwc-button>
        <mwc-button raised id='update'>` + cardConfig.update_all_text + `</mwc-button>
      </div>
    `;
    card.header = cardConfig.title
    card.appendChild(content);
    card.appendChild(style);
    root.appendChild(card);
    this._config = cardConfig;
  }

  _filterCards(attributes) {
    return Object.entries(attributes).filter(elem => (elem[0] != "friendly_name" && elem[0] != "homebridge_hidden" && elem[0] != "domain" && elem[0] != "has_update" && elem[0] != "repo" && elem[0] != "hidden"));
  }

  set hass(hass) {
    const config = this._config;
    const root = this.shadowRoot;
    const card = root.lastChild;
    const pending_updates = [];
    this.myhass = hass;
    this.handlers = this.handlers || [];
    let card_content = '';
	
    card_content += `
      <table>
      <thead><tr><th>` + config.name_text + `</th><th>` + config.current_text + `</th><th>` + config.available_text + `</th></tr></thead>
      <tbody>
    `;
    config.trackers.forEach(tracker => {
      if (hass.states[tracker]) {
        const list = this._filterCards(hass.states[tracker].attributes);
        const domain = hass.states[tracker].attributes.domain;
        const repo = hass.states[tracker].attributes.repo;
        
        for (var i in list) {
          if (list[i][1].has_update) {
            pending_updates.push(list[i])
          }
        }
        
        
        card_content += `
          <tr><td colspan='3' class='separator'>${domain.replace('_', ' ')}:</td></tr>
        `;
        if (list !== undefined && list.length > 0) {
          const updated_content = `
            ${list.map(elem => `
              ${elem[1].has_update?`
                <tr class='update_pending'>
                  <td class='name'>
                    <a href="${elem[1].change_log?elem[1].change_log:'#'}" target='_blank'>
                      ${elem[0]}
                    </a>
                  </td>
                  <td class='local'>
                    ${elem[1].local?elem[1].local:'n/a'}
                  </td>
                  <td class='remote'>
                    <div>
                      <button title="Update this" class='hidden-button' id='${elem[0]}'>
                        ${elem[1].remote?elem[1].remote:'n/a'}
                      </button>
                    </div>
                  </td>
            `:`
                <tr>
                  <td class='name'>
                    <a href="${elem[1].repo?elem[1].repo:'#'}" target='_blank'>
                      ${elem[0]}
                    </a>
                  </td>
                  <td class='local'>
                    ${elem[1].local?elem[1].local:'n/a'}
                  </td>
                  <td class='remote'>
                    ${elem[1].remote?elem[1].remote:'n/a'}
                  </td>
            `}`
            ).join('')}
          `;
          card_content += updated_content;
        }
        // attach handlers only once
        if (!this.handlers['custom_updater']) {
          card.querySelector('#update').addEventListener('click', event => {
            this.myhass.callService('custom_updater', 'update_all', {});
          });
          card.querySelector('#check').addEventListener('click', event => {
            this.myhass.callService('custom_updater', 'check_all', {});
          });
          this.handlers['custom_updater'] = true;
        }
        root.lastChild.hass = hass;
      }
    });
    card_content += `</tbody></table>`;
    root.getElementById('content').innerHTML = card_content;
    for (var i in pending_updates) {
      card.querySelector('#' + pending_updates[i][0]).addEventListener('click', event => {
        this.myhass.callService('custom_updater', 'install', {'element': pending_updates[i][0]});
        this.myhass.callService('custom_updater', 'check_all', {});
      });
    }

  }
  getCardSize() {
    return 1;
  }
}
customElements.define('tracker-card', TrackerCard);
