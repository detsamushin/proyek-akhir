class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
            <style>
                .loading-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                }
                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid #fff;
                    border-top: 5px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            </style>
            <div class="loading-container">
                <div class="spinner"></div>
            </div>
        `;
  }
}

if (!customElements.get("loading-indicator")) {
  customElements.define("loading-indicator", LoadingIndicator);
}
