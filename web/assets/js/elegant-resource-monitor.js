class ElegantResourceMonitor extends HTMLElement {
  constructor() {
    super()
    this.connected = false
  }

  render() {
    this.innerHTML = `
      <div id="chart-button-container" draggable="true">
        <div id="chart-button">
          <div class="chart-row">
            <div class="left-col">
              <i class="material-icons" id="popupTrigger">settings</i>
              <div id="settingsMenu" class="settings-menu">
                <div class="settings-row"><div class="settings-col">Settings</div></div>
                <hr id="settings-hr" class="settings-hr" />
                <div class="settings-row">
                <div class="settings-row">
                  <div class="settings-col">Layout:</div>
                  <div class="settings-col">
                    <a href="#" onclick="barChart()">1</a> |
                    <a href="#" onclick="lineChart()">2</a>
                  </div>
                </div>
                <div class="settings-row">
                  <div class="settings-col">Size:</div>
                  <div class="settings-col">
                    <a href="#" onclick="smallChart()">S</a> |
                    <a href="#" onclick="mediumChart()">M</a>
                  </div>
                </div>
                </div>
                <div class="settings-row">
                  <div class="settings-col">Position</div>
                  <div id="positionMenu" class="position-menu">
                    <button class="position-btn position-clickable" id="top-left"><i class="material-icons">north_west</i></button>
                    <button class="position-btn position-clickable" id="top-center"><i class="material-icons">north</i></button>
                    <button class="position-btn position-clickable" id="top-right"><i class="material-icons">north_east</i></button>
                    <button class="position-btn position-clickable" id="left-center"><i class="material-icons">west</i></button>
                    <button class="position-btn position-clickable" id="center" onclick="largeChart()"><i class="material-icons">radio_button_checked</i></button>
                    <button class="position-btn position-clickable" id="right-center"><i class="material-icons">east</i></button>
                    <button class="position-btn position-clickable" id="bottom-left"><i class="material-icons">south_west</i></button>
                    <button class="position-btn position-clickable" id="bottom-center"><i class="material-icons">south</i></button>
                    <button class="position-btn position-clickable" id="bottom-right"><i class="material-icons">south_east</i></button>
                  </div>
                </div>
              </div>
            </div>
            <div class="chart-col">
              <i class="material-icons" id="close-button">close</i>
            </div>
          </div>
          <div id="chart-wrapper">
           <div id="progress-bar-container">
              <div id="progress-bar"></div>
            </div>
            <div id="chart-container">
              <canvas id="usage-chart" style="width: 100%; height: 100%"></canvas>
            </div>
            <div id="custom-legend"></div>
            <div id="table-view">
            <table id="item-table">
                <tbody id="item-body">
                <!-- Table rows will be dynamically added here -->
                </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    `
  }

  addEventListeners() {
    this.querySelector('#popupTrigger').addEventListener('click', () => {
      const settingsMenu = this.querySelector('#settingsMenu')
      settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block'
    })

    this.querySelector('#close-button').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
    })
  }

  onProgressUpdate(e) {}

  connectedCallback() {
    if (!this.connected) {
      this.render()
      this.addEventListeners()

      this.connected = true
    }
  }

  disconnectedCallback() {
    this.connected = false
  }
}

// Register the custom element
customElements.define('elegant-resource-monitor', ElegantResourceMonitor)
